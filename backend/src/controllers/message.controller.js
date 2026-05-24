import mongoose from 'mongoose';
import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { io, userSocketMap } from "../app.js"

const getUsersForSidebar = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    const chats = await Message.aggregate([
        {
            $match: {
                $or: [ { sender: userId }, { recipient: userId } ]
            }
        },
        {
            $addFields: {
                chatUser: {
                    $cond: {
                        if: { $eq: [ "$sender", userId ] },
                        then: "$recipient",
                        else: "$sender"
                    }
                }
            }

        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: "$chatUser",
                lastMessage: { $first: "$text" },
                lastMessageTime: { $first: "$createdAt" },
                sender  : { $first: "$sender" },
                recipient: { $first: "$recipient" },
                unreadCount: {
                    $sum: {
                        $cond: [ 
                            {
                                $and: [
                                { $eq: [ "$recipient", userId ] },
                                { $eq: [ "$seen", false ] }
                            ]
                        }, 
                        1,
                        0
                        ]
                        }
                    }
                }

            },
        
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                lastMessage: 1,
                lastMessageTime: 1,
                sender: 1,
                recipient: 1,
                unreadCount: 1,
                user: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    bio: 1,
                    _id:1
                }
            }
        },
        {$sort: { lastMessageTime: -1 }}
    ])

    res.json(new ApiResponse(200,chats, "Chats fetched successfully"));

})

const getMessages = asyncHandler(async (req, res) => {
    // console.log("Fetching messages for user", { userId: req.user?._id, selectedUserId: req.params.userId, query: req.query });
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const selectedUserId = new mongoose.Types.ObjectId(req.params.userId);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;    

    if (!mongoose.Types.ObjectId.isValid(selectedUserId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    let messages = await Message.find({
        $or: [
            { sender: userId, recipient: selectedUserId },
            { sender: selectedUserId, recipient: userId }
        ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(30)
    .lean();

    messages = messages.reverse();

    // Mark messages as seen
    await Message.updateMany(
        { sender: selectedUserId, recipient: userId, seen: false },
        { $set: { seen: true } }
    );

    res.json(new ApiResponse(200,messages, "Messages fetched successfully" ));
})

// mark message as seen with messageId
const markMessageAsSeen = asyncHandler(async (req,res) => {
    const messageId = req.params.messageId
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new ApiError(400, "Invalid message ID");
    }
    const message = await findByIdAndUpdate(messageId, { seen: true })

    if (!message) {
        throw new ApiError(404, "Message not found"); 
    }
    res.json(new ApiResponse(200,message, "Message marked as seen", ));
})

const sendMessage = asyncHandler(async (req, res) => {
    const senderId = new mongoose.Types.ObjectId(req.user?._id);
    const recipientId = req.params.userId
    const text = req.body.text;
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        throw new ApiError(400, "Invalid recipient ID");
    }
    
    if (!text || text.trim() === "") {
        throw new ApiError(400, "Message text cannot be empty");
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
        throw new ApiError(404, "Recipient user not found");
    }

    if (recipient.isBlocked) {
        throw new ApiError(403, "You cannot send messages to this user");
    }

    const message = await Message.create({
        sender: senderId,
        recipient: recipientId,
        text
    })

    if (!message) {
        throw new ApiError(500, "Failed to send message");
    }

    //Emit message to recipient if online
    console.log("User socket map:", userSocketMap);
    const recipientSocketId = userSocketMap[recipientId.toString()];
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessage", message);
    }   

    res.json(new ApiResponse(201,message, "Message sent successfully", ));
})

const deleteMessage = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const messageId = req.params.messageId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new ApiError(400, "Invalid message ID");
    }

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own messages");
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    //Emit message deletion to recipient if online
    const recipientSocketId = userSocketMap[message.recipient.toString()];
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("messageDeleted", {
            messageId: message._id,
        });
    }


    res.json(new ApiResponse(200,message, "Message deleted successfully", ));

})

export { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage,deleteMessage }