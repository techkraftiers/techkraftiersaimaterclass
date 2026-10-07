const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const data = req.body;

        console.log("Registration received:", data);

        // -------------------------------------------------------------
        // 1. STUDENT LA CONFIRMATION MAIL PATHVA
        // -------------------------------------------------------------
        await transporter.sendMail({
            from: `"Techkraftiers Academy" <${process.env.GMAIL_USER}>`,
            to: data.email, // Student cha Email
            subject: "AI Digital Marketing Masterclass – Registration Confirmed 🎉",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #ff7100;">Registration Confirmed 🎉</h2>
                    <p>Hello <b>${data.fullName}</b>,</p>

                    <p>Your registration for the <b>AI Digital Marketing Masterclass</b> has been successfully received.</p>

                    <h3>Your Registration Details:</h3>
                    <ul>
                        <li><b>Area:</b> ${data.area}</li>
                        <li><b>Category:</b> ${data.category}</li>
                        <li><b>Mobile:</b> ${data.mobile}</li>
                        <li><b>Email:</b> ${data.email}</li>
                    </ul>

                    <p>We look forward to having you in the session!</p>

                    <br>
                    <p>Best Regards,<br>
                    <b>Techkraftiers Academy</b></p>
                </div>
            `
        });

        // -------------------------------------------------------------
        // 2. ADMIN (TUMHALA) NOTIFICATION MAIL PATHVA
        // -------------------------------------------------------------
        await transporter.sendMail({
            from: `"Website Leads" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Admin Email (Tumcha Email)
            subject: `🚨 New Masterclass Registration - ${data.fullName}`,
            html: `
                <h3>New Lead Received from Website!</h3>
                <p><b>Student Details:</b></p>
                <ul>
                    <li><b>Name:</b> ${data.fullName}</li>
                    <li><b>Email:</b> ${data.email}</li>
                    <li><b>Mobile:</b> ${data.mobile}</li>
                    <li><b>Area:</b> ${data.area}</li>
                    <li><b>Category:</b> ${data.category}</li>
                </ul>
            `
        });

        res.json({
            success: true,
            message: "Registration successful! Emails sent to both student and admin."
        });

    } catch (error) {
        console.error("ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Email could not be sent."
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({ status: "Backend is running" });
});

app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});