import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        discounts: true
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('[RESTAURANT_DETAIL_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  }
}
