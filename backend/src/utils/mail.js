import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const forgotPasswordMailgenContent = function (username, verificationUrl) {
   return {
      body: {
         name: username,
         intro: "Hi, We received a request to reset the password for your account.",
         action: {
            instructions:
               "To reset your password, please click the button below:",
            button: {
               color: "#da1b5aff", // Optional action button color
               text: "Reset Password",
               link: verificationUrl,
            },
         },
         outro: "If you did not request a password reset, please ignore this email. This link will expire in 20 minutes for your security.\nThanks",
      },
   };
};

const emailVerificationMailgenContent = function (username, verificationUrl) {
   return {
      body: {
         name: username,
         intro: "Hi, Welcome to Social Media App We're excited to have you.",
         action: {
            instructions:
               "To complete your registration, please click the button below to verify your email address:",
            button: {
               color: "#da1b5aff", // Optional action button color
               text: "Verify Email",
               link: verificationUrl,
            },
         },
         outro: "If you did not request a email verification, please ignore this email. This link will expire in 20 minutes for your security.\nThanks",
      },
   };
};

const sendEmail = async function (options) {
   let mailGenerator = new Mailgen({
      theme: "default",
      product: {
         // Appears in header & footer of e-mails
         name: "Social Media App",
         link: "https://instagram.com/theanuragkumawat",
         // Optional product logo
         logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG9nb3xlbnwwfHwwfHx8MA%3D%3D",
      },
   });

   const emailHTML = mailGenerator.generate(options.mailgenContent);
   const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

   const transporter = nodemailer.createTransport({
      host: process.env.Mailtrap_SMTP_HOST,
      port: process.env.Mailtrap_SMTP_PORT,
      auth: {
         user: process.env.Mailtrap_SMTP_USER,
         pass: process.env.Mailtrap_SMTP_PASS,
      },
   });

   const mail = {
      from: "mail.socialmediaapp2025@example.com",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHTML,
   };

   try {
      await transporter.sendMail(mail);
   } catch (error) {
      console.error("Email sending service failed!");
      console.error(error);
   }
};

export {
   emailVerificationMailgenContent,
   forgotPasswordMailgenContent,
   sendEmail,
};
// dry
