import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log the event in the database
    await db.analyticsEvent.create({
      data: {
        type: body.type || "PAGE_VIEW",
        path: body.path || null,
        metadata: body.metadata || null
      }
    });

    // Send email notification for page views
    if ((body.type || "PAGE_VIEW") === "PAGE_VIEW") {
      const {
        EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT,
        EMAIL_SERVER_USER,
        EMAIL_SERVER_PASSWORD,
        EMAIL_FROM
      } = process.env;

      // Only attempt to send if SMTP is configured
      if (EMAIL_SERVER_HOST && EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD && EMAIL_FROM) {
        const transporter = nodemailer.createTransport({
          host: EMAIL_SERVER_HOST,
          port: Number(EMAIL_SERVER_PORT) || 587,
          secure: Number(EMAIL_SERVER_PORT) === 465,
          auth: {
            user: EMAIL_SERVER_USER,
            pass: EMAIL_SERVER_PASSWORD,
          },
        });

        const time = new Date().toLocaleString("en-US", { timeZoneName: "short" });
        await transporter.sendMail({
          from: `"Portfolio Alerts" <${EMAIL_FROM}>`,
          to: "himelfaishal@gmail.com",
          subject: "🎉 New Visit to Your Portfolio!",
          text: `Someone just visited your portfolio page!\n\nPath: ${body.path || "/"}\nTime: ${time}\n\nKeep up the great work!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #4f46e5;">New Portfolio Visitor! 🎉</h2>
              <p>Someone just visited your portfolio website.</p>
              <ul>
                <li><strong>Path Visited:</strong> ${body.path || "/"}</li>
                <li><strong>Time:</strong> ${time}</li>
              </ul>
              <p style="color: #64748b; font-size: 14px; margin-top: 30px;">This is an automated message from your Next.js portfolio tracker.</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Tracker/Email Error:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
