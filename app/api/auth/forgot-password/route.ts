import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/auth/forgot-password
 * 
 * Generates a 6-digit OTP for password reset.
 * In production, this would send the OTP via email (SendGrid, Resend, etc.).
 * For this portfolio/dev version, we return the OTP in the response so it
 * can be displayed to the user (simulating an email).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Invalidate any existing unused OTPs for this email
    await prisma.passwordResetOtp.updateMany({
      where: {
        email: normalizedEmail,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10-minute expiry
    await prisma.passwordResetOtp.create({
      data: {
        email: normalizedEmail,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // In production: send OTP via email service
    // For dev/portfolio: we return it in the response
   // Send OTP email

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: normalizedEmail,
  subject: 'DineSphere Password Reset OTP',
  html: `
    <div style="font-family: Arial; padding:20px;">
      <h2>DineSphere Password Reset</h2>
      <p>Your OTP code is:</p>

      <div style="
        font-size:32px;
        font-weight:bold;
        padding:10px;
        background:#f4f4f4;
        width:150px;
        text-align:center;
        border-radius:8px;">
        ${otp}
      </div>

      <p>This code expires in 10 minutes.</p>
    </div>
  `
});

return NextResponse.json({
  message: 'OTP sent successfully. Check your email.'
});
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
