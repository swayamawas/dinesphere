import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find the booking to verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Perform cancellation
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    });

    return NextResponse.json(updatedBooking);

  } catch (error) {
    console.error('[BOOKING_PATCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
