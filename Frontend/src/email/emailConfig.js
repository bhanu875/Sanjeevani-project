import emailjs from "@emailjs/browser";

export const EMAIL_SERVICE_ID = "service_fdz1wdf";
export const EMAIL_TEMPLATE_ID = "template_654k26y";
export const EMAIL_PUBLIC_KEY = "TkJIGCg0o5L5Upkz9";

export const sendEmail = (params) => {
  return emailjs.send(
    EMAIL_SERVICE_ID,
    EMAIL_TEMPLATE_ID,
    params,
    EMAIL_PUBLIC_KEY
  );
};
