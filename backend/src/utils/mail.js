import Mailgen from "mailgen";

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

export { emailVerificationMailgenContent, forgotPasswordMailgenContent };
