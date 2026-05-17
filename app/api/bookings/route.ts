import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Fetch all bookings for this user, ordered by creation date descending
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('[BOOKINGS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const {
      restaurantId,
      restaurantName,
      restaurantCuisine,
      restaurantImage,
      date,
      time,
      guests,
      discount
    } = body;

    if (!restaurantId || !restaurantName || !restaurantCuisine || !restaurantImage || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required booking details' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        restaurantId,
        restaurantName,
        restaurantCuisine,
        restaurantImage,
        date,
        time,
        guests: String(guests),
        discount: discount ? Number(discount) : null
      }
    });

    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error('[BOOKING_POST_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}