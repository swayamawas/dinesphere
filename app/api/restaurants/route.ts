import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockRestaurants } from '@/data/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const mealOption = searchParams.get('mealOption') || '';

    let restaurants: any[] = [];

    try {
      // 0. Auto-seed if database is empty to ensure flawless first-load setup
      const count = await prisma.restaurant.count();
      if (count === 0) {
        console.log('Database empty. Running fail-safe auto-seeding of premium Indian spots...');
        const initialRestaurants = [
          {
            name: 'Indian Accent',
            cuisine: 'Modern Indian • Fine Dining',
            location: 'The Lodhi, Lodhi Road, New Delhi',
            city: 'New Delhi',
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '12:30', percentage: 15 },
                { time: '16:00', percentage: 25 },
                { time: '18:30', percentage: 10 }
              ]
            }
          },
          {
            name: 'Bukhara',
            cuisine: 'North Indian • Mughlai',
            location: 'ITC Maurya, Diplomatic Enclave, New Delhi',
            city: 'New Delhi',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&q=80&w=800',
            type: 'non-veg',
            mealOptions: 'Dinner',
            discounts: {
              create: [
                { time: '19:00', percentage: 10 },
                { time: '22:30', percentage: 20 }
              ]
            }
          },
          {
            name: 'Farzi Cafe',
            cuisine: 'Modern Indian • Fusion',
            location: 'Connaught Place, New Delhi',
            city: 'New Delhi',
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner,Buffet',
            discounts: {
              create: [
                { time: '15:00', percentage: 30 },
                { time: '16:30', percentage: 20 }
              ]
            }
          },
          {
            name: 'The Spice Symphony',
            cuisine: 'North Indian • Mughlai',
            location: 'Connaught Place, New Delhi',
            city: 'New Delhi',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '16:00', percentage: 20 },
                { time: '17:00', percentage: 15 }
              ]
            }
          },
          {
            name: 'Haveli Restaurant',
            cuisine: 'Traditional Punjabi • North Indian Classics',
            location: 'NH-1, GT Road, Murthal, Delhi NCR',
            city: 'New Delhi',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Breakfast,Lunch,Dinner',
            discounts: {
              create: [
                { time: '12:00', percentage: 15 },
                { time: '16:00', percentage: 25 },
                { time: '21:00', percentage: 10 }
              ]
            }
          },
          {
            name: 'The Bombay Canteen',
            cuisine: 'Contemporary Indian',
            location: 'Kamala Mills, Lower Parel, Mumbai',
            city: 'Mumbai',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '13:00', percentage: 15 },
                { time: '17:30', percentage: 20 }
              ]
            }
          },
          {
            name: 'Trishna',
            cuisine: 'Seafood • Mangalorean',
            location: 'Kala Ghoda, Fort, Mumbai',
            city: 'Mumbai',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=800',
            type: 'non-veg',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '15:30', percentage: 20 },
                { time: '22:00', percentage: 15 }
              ]
            }
          },
          {
            name: 'Ocean Catch Seafood',
            cuisine: 'Seafood • Continental',
            location: 'Bandra West, Mumbai',
            city: 'Mumbai',
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
            type: 'non-veg',
            mealOptions: 'Dinner,Buffet',
            discounts: {
              create: [
                { time: '21:30', percentage: 10 },
                { time: '22:00', percentage: 15 }
              ]
            }
          },
          {
            name: 'Toit Beer Co.',
            cuisine: 'Brewpub • Pizza • Finger Food',
            location: 'Indiranagar, Bangalore',
            city: 'Bangalore',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1538488881038-e252a119aac7?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '12:00', percentage: 15 },
                { time: '16:00', percentage: 20 }
              ]
            }
          },
          {
            name: 'Mavalli Tiffin Room (MTR)',
            cuisine: 'Pure Veg • South Indian',
            location: 'Lalbagh Road, Bangalore',
            city: 'Bangalore',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800',
            type: 'veg',
            mealOptions: 'Breakfast,Lunch',
            discounts: {
              create: [
                { time: '07:30', percentage: 10 },
                { time: '15:00', percentage: 15 }
              ]
            }
          },
          {
            name: 'Green Leaf Vegan',
            cuisine: 'Healthy • Vegan • Organic',
            location: 'Indiranagar, Bangalore',
            city: 'Bangalore',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
            type: 'veg',
            mealOptions: 'Breakfast,Lunch',
            discounts: {
              create: [
                { time: '15:00', percentage: 25 }
              ]
            }
          },
          {
            name: 'Paradise Biryani',
            cuisine: 'Hyderabadi Biryani • Kebabs',
            location: 'Secunderabad, Hyderabad',
            city: 'Hyderabad',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner,Buffet',
            discounts: {
              create: [
                { time: '16:00', percentage: 20 },
                { time: '22:30', percentage: 15 }
              ]
            }
          },
          {
            name: 'Bawarchi',
            cuisine: 'Biryani • Mughlai',
            location: 'RTC X Roads, Hyderabad',
            city: 'Hyderabad',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '11:30', percentage: 10 },
                { time: '15:30', percentage: 15 }
              ]
            }
          },
          {
            name: 'Dakshin',
            cuisine: 'Traditional South Indian',
            location: 'Crowne Plaza, Alwarpet, Chennai',
            city: 'Chennai',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '13:00', percentage: 10 },
                { time: '21:00', percentage: 15 }
              ]
            }
          },
          {
            name: 'South Indian Delights',
            cuisine: 'South Indian Classics',
            location: 'T Nagar, Chennai',
            city: 'Chennai',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800',
            type: 'veg',
            mealOptions: 'Breakfast,Lunch,Dinner',
            discounts: {
              create: [
                { time: '08:00', percentage: 10 },
                { time: '15:00', percentage: 20 }
              ]
            }
          },
          {
            name: 'Bella Italia',
            cuisine: 'Italian • Pasta • Woodfired Pizza',
            location: 'Koregaon Park, Pune',
            city: 'Pune',
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '11:00', percentage: 15 }
              ]
            }
          },
          {
            name: 'Malaka Spice',
            cuisine: 'Southeast Asian • Fusion',
            location: 'Koregaon Park, Pune',
            city: 'Pune',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1560611580-b98b2d788173?auto=format&fit=crop&q=80&w=800',
            type: 'both',
            mealOptions: 'Lunch,Dinner',
            discounts: {
              create: [
                { time: '16:00', percentage: 20 },
                { time: '17:00', percentage: 15 }
              ]
            }
          }
        ];

        for (const r of initialRestaurants) {
          await prisma.restaurant.create({
            data: r
          });
        }
        console.log('Fail-safe auto-seeding successfully completed.');
      } else {
        // Flawless check: Ensure Haveli is present even if database was seeded prior to adding it
        const haveliExists = await prisma.restaurant.findFirst({
          where: { name: { contains: 'Haveli', mode: 'insensitive' } }
        });
        if (!haveliExists) {
          console.log('Haveli is missing from existing data. Seeding it dynamically...');
          await prisma.restaurant.create({
            data: {
              name: 'Haveli Restaurant',
              cuisine: 'Traditional Punjabi • North Indian Classics',
              location: 'NH-1, GT Road, Murthal, Delhi NCR',
              city: 'New Delhi',
              rating: 4.7,
              imageUrl: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&q=80&w=800',
              type: 'both',
              mealOptions: 'Breakfast,Lunch,Dinner',
              discounts: {
                create: [
                  { time: '12:00', percentage: 15 },
                  { time: '16:00', percentage: 25 },
                  { time: '21:00', percentage: 10 }
                ]
              }
            }
          });
        }
      }

      // Build the query where clause
      const where: any = {};

      // 1. Keyword search (Name or Cuisine)
      if (keyword) {
        where.OR = [
          { name: { contains: keyword, mode: 'insensitive' } },
          { cuisine: { contains: keyword, mode: 'insensitive' } }
        ];
      }

      // 2. Location search (micro-location or City)
      if (location) {
        where.AND = where.AND || [];
        where.AND.push({
          OR: [
            { location: { contains: location, mode: 'insensitive' } },
            { city: { contains: location, mode: 'insensitive' } }
          ]
        });
      }

      // 3. Dietary preferences
      if (type) {
        where.AND = where.AND || [];
        if (type === 'veg') {
          where.AND.push({
            type: { in: ['veg', 'both'] }
          });
        } else if (type === 'non-veg') {
          where.AND.push({
            type: { in: ['non-veg', 'both'] }
          });
        }
      }

      // 4. Meal options (Breakfast/Lunch/Dinner/Buffet)
      if (mealOption) {
        where.AND = where.AND || [];
        where.AND.push({
          mealOptions: { contains: mealOption, mode: 'insensitive' }
        });
      }

      // Fetch matching restaurants including their discounts
      restaurants = await prisma.restaurant.findMany({
        where,
        include: {
          discounts: true
        },
        orderBy: {
          rating: 'desc' // Order by top-rated
        }
      });
    } catch (dbError) {
      console.warn('Database not synced or missing tables. Dropping back gracefully to mockData fallback:', dbError);
      
      // MOCK GRACEFUL SEARCH FALLBACK
      restaurants = mockRestaurants.filter(restaurant => {
        // 1. Keyword search match
        const keywordMatch = !keyword || 
          restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || 
          restaurant.cuisine.toLowerCase().includes(keyword.toLowerCase());
          
        // 2. Location search match
        const locationMatch = !location || 
          restaurant.location.toLowerCase().includes(location.toLowerCase());
          
        // 3. Dietary Type match
        const typeMatch = !type || 
          restaurant.type === type || 
          restaurant.type === 'both';
          
        // 4. Meal Option match
        const mealMatch = !mealOption || 
          restaurant.mealOptions?.some(m => m.toLowerCase().includes(mealOption.toLowerCase()));

        return keywordMatch && locationMatch && typeMatch && mealMatch;
      });
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('[RESTAURANTS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
