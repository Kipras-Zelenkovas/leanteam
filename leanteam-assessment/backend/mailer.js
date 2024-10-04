import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "hostinger",
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "info@leanteam.lt",
        pass: "Saulius121*",
    },
});
