import { useEffect, useState } from "react";
import { X, MoveLeft, Check, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createHighlight, getUserStories } from "../utils/config";

function HighlightDialog({
  openHighlightDialog,
  setOpenHighlightDialog,
  userId,
}) {
  // steps
  const [activeStep, setActiveStep] = useState(0);
  const next = () => setActiveStep((prev) => prev + 1);
  const back = () => setActiveStep((prev) => prev - 1);

  const [isLoading, setIsLoading] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [selectedStories, setSelectedStories] = useState([]);
  const [highlightCover, setHighlightCover] = useState(null);

  console.log("User stories", userStories);

  const fetchStories = async function () {
    try {
      const response = await getUserStories(userId);
      setUserStories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

    async function handleSubmit() {
        setIsLoading(true);
    // Submit the new highlight data to the server
    const highlightData = {
        title: highlightTitle,
        cover: highlightCover,
        stories: selectedStories.map(story => story._id),
    };

    console.log("Submitting highlight:", highlightData);
    try {
        const response = await createHighlight(highlightData);
        console.log("Highlight created successfully:", response.data);
    } catch (error) {
        console.error("Error creating highlight:", error);
    } finally {
        setIsLoading(false);
        setOpenHighlightDialog(false);
        setActiveStep(0);
        setHighlightTitle("");
        setSelectedStories([]);
        setHighlightCover(null);
    }
  }


  useEffect(() => {
    fetchStories();
  }, []);

  console.log("selected",selectedStories);
  
  return (
    <Dialog
      open={openHighlightDialog}
      onOpenChange={setOpenHighlightDialog}
      modal={true}
    >
      <DialogContent
        className={
          "p-0 bg-neutral-900 outline-none border-none rounded-3xl overflow-hidden w-fit"
        }
      >
        <DialogHeader className={"sr-only"}>
          <DialogTitle className={"sr-only"}></DialogTitle>
          <DialogDescription className={"sr-only"}></DialogDescription>
        </DialogHeader>
        <>
          {activeStep === 0 && (
            <div className="w-md">
              <div className="pt-4">
                <div className="relative p-2">
                  <h3 className="text-center font-bold dark:text-white text-md">
                    New Highlight
                  </h3>
                  <button
                    onClick={() => setOpenHighlightDialog(false)}
                    className="absolute right-0 top-0 pr-3 pt-2 cursor-pointer active:scale-95 outline-none"
                  >
                    <X className="size-7" />
                  </button>
                </div>
              </div>

              <p className="w-full h-[0.1px] bg-neutral-800"></p>

              <div className="px-5 py-6">
                <input
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                  className="w-full px-2 py-2.5 text-sm dark:text-white placeholder:text-sm placeholder:text-neutral-400 bg-neutral-800 rounded-md focus-within:outline-1 outline-neutral-600"
                  type="text"
                  placeholder="Highlight Name"
                />
              </div>
              <p className="w-full h-[0.1px] bg-neutral-800"></p>
              <button
                disabled={highlightTitle.trim() === ""}
                onClick={next}
                className="w-full text-sky-500 font-bold text-sm py-3.5 cursor-pointer dark:active:bg-black/15 disabled:cursor-none disabled:text-neutral-500"
              >
                Next
              </button>
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <div className="pt-4 px-4">
                <div className="relative p-2 flex flex-row justify-between items-center">
                  <button
                    onClick={back}
                    className=" cursor-pointer active:scale-95 outline-none"
                  >
                    <MoveLeft className="size-7" />
                  </button>
                  <h3 className="text-center font-bold dark:text-white text-md">
                    Stories
                  </h3>
                  <button
                    onClick={() => setOpenHighlightDialog(false)}
                    className=" cursor-pointer active:scale-95 outline-none"
                  >
                    <X className="size-7" />
                  </button>
                </div>
              </div>
              <p className="w-full max-h-[0.1px] bg-neutral-800"></p>

              <div className="max-w-fit h-[500px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-0.5">
                  {userStories?.map((item, index) => {
                    const formattedDate = new Date(item.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                    const [day, month, year] = formattedDate.split(" ");

                    return (
                    <div
                      key={index}
                      onClick={() => {
                        if (selectedStories.includes(item)) {
                          setSelectedStories(
                            selectedStories.filter((story) => story._id !== item._id)
                          );
                        } else {
                          setSelectedStories([...selectedStories, item]);
                        }
                      }}
                      className="w-full relative group cursor-pointer"
                    >
                      <div className="rounded-md w-32 h-55">
                        <img
                          className="w-full h-full object-cover"
                          src={item.cover ? item.cover : null}
                        />
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="bg-white rounded-md w-fit text-neutral-900 text-xs leading-4 text-center px-1 py-0.5 ml-1 mt-1">
                          <p className="font-bold">{day}</p>
                          <p>{month}</p>
                          <p>{year}</p>
                        </div>
                        <div className="flex justify-end">
                          <div className="border-1 border-white rounded-full size-6 mr-1.5 mb-1.5 flex items-center justify-center">
                            { selectedStories.includes(item) && 
                            <Check className="size-4.5 bg-blue-500 rounded-full" />
                            }
                          </div>
                        </div>
                      </div>
                      <div className="inset-0 hidden group-hover:block bg-white/30 absolute "></div>
                    </div>
                  )
                  })
                }
                </div>
              </div>

              <p className="w-full h-[0.1px] bg-neutral-800"></p>
              <button
                disabled={false}
                onClick={() => {
                  setHighlightCover(selectedStories?.[0]?.cover || null);
                  next();
                }}
                className="w-full text-sky-500 font-bold text-sm py-3.5 cursor-pointer dark:active:bg-black/15 disabled:cursor-none disabled:text-neutral-500"
              >
                Next
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <>
              <div className="">
                <div className="pt-4 px-4">
                  <div className="relative p-2 flex flex-row justify-between items-center">
                    <button
                      onClick={back}
                      className=" cursor-pointer active:scale-95 outline-none"
                    >
                      <MoveLeft className="size-7" />
                    </button>
                    <h3 className="text-center font-bold dark:text-white text-md">
                      Stories
                    </h3>
                    <button
                      onClick={() => setOpenHighlightDialog(false)}
                      className=" cursor-pointer active:scale-95 outline-none"
                    >
                      <X className="size-7" />
                    </button>
                  </div>
                </div>
                <p className="w-full h-[0.1px] bg-neutral-800 "></p>

                <div className="">
                  <div className="w-full flex justify-center items-center bg-neutral-800 py-1">
                    <div className="size-80 border border-neutral-500 rounded-full">
                      <img
                        className="size-full object-cover rounded-full"
                        src={highlightCover ? highlightCover : null}
                      />
                    </div>
                  </div>
                </div>

                <p className="w-full max-h-[0.1px] bg-neutral-800"></p>

                <div className=" h-52 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-0.5">
                    {selectedStories?.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (highlightCover != item.cover) {
                              setHighlightCover(item.cover)
                          }
                        }}
                        className="w-full relative group cursor-pointer"
                      >
                        <div className="rounded-md w-32 h-55">
                          <img
                            className="w-full h-full object-cover"
                            src={item.cover ? item.cover : null}
                          />
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-end">
                          <div className="flex justify-end">
                            <div className="border-1 border-white rounded-full size-6 mr-1.5 mb-1.5 flex items-center justify-center">
                                { highlightCover === item.cover &&
                              <Check className="size-4.5 bg-blue-500 rounded-full" />
                                }
                            </div>
                          </div>
                        </div>
                        <div className="inset-0 hidden group-hover:block bg-white/30 absolute "></div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={false}
                  onClick={handleSubmit}
                  className="w-full text-sky-500 font-bold text-sm py-3.5 cursor-pointer dark:active:bg-black/15 disabled:cursor-none disabled:text-neutral-500 flex items-center justify-center"
                >
                    {isLoading ? <Loader className="animate-spin dark:text-white" /> : "Next"}
                </button>
              </div>
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
}

export default HighlightDialog;
