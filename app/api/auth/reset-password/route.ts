import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/reset-password
 * 
 * Verifies the OTP and resets the user's password.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    // ── Validation ──────────────────────────────────────────────
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── Find a valid OTP ────────────────────────────────────────
    const otpRecord = await prisma.passwordResetOtp.findFirst({
      where: {
        email: normalizedEmail,
        otp: otp.trim(),
        used: false,
        expiresAt: {
          gt: new Date(), // not expired
        },
      },
      orderBy: {
        createdAt: 'desc', // latest OTP first
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      );
    }

    // ── Mark OTP as used ────────────────────────────────────────
    await prisma.passwordResetOtp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // ── Update user's password ──────────────────────────────────
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { hashedPassword },
    });

    return NextResponse.json({
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
