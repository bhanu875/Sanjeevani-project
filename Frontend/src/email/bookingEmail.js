import { sendEmail } from "./emailConfig";

export const sendBookingStatusEmail = async (booking, status) => {
  const isApproved = status === "APPROVED";

  const params = {
    user_name: booking.user?.name || "User",
    user_email: booking.user?.email,   // MUST exist
    doctor_name: booking.doctor?.name || "Doctor",
    appointment_date: booking.requestedDate,
    appointment_time: booking.requestedTime,

    subject: isApproved
      ? "Your Ayurveda Consultation is Confirmed 🌿"
      : "Your Ayurveda Consultation Status ❌",

    message_body: isApproved
      ? "Your consultation has been successfully scheduled. Please be available 10 minutes before your appointment."
      : booking.adminRemarks || "The consultation could not be scheduled at this time.",
  };

  if (!params.user_email) {
    console.error("Email not sent: user_email missing");
    return;
  }

  await sendEmail(params);
};
