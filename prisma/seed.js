const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const restaurantsData = [
  // Delhi NCR
  {
    name: 'Indian Accent',
    cuisine: 'Modern Indian • Fine Dining',
    location: 'The Lodhi, Lodhi Road, New Delhi',
    city: 'New Delhi',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: 'Lunch,Dinner',
    discounts: [
      { time: '12:30', percentage: 15 },
      { time: '16:00', percentage: 25 },
      { time: '18:30', percentage: 10 }
    ]
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
    discounts: [
      { time: '19:00', percentage: 10 },
      { time: '22:30', percentage: 20 }
    ]
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
    discounts: [
      { time: '15:00', percentage: 30 },
      { time: '16:30', percentage: 20 }
    ]
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
    discounts: [
      { time: '16:00', percentage: 20 },
      { time: '17:00', percentage: 15 }
    ]
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
    discounts: [
      { time: '12:00', percentage: 15 },
      { time: '16:00', percentage: 25 },
      { time: '21:00', percentage: 10 }
    ]
  },

  // Mumbai
  {
    name: 'The Bombay Canteen',
    cuisine: 'Contemporary Indian',
    location: 'Kamala Mills, Lower Parel, Mumbai',
    city: 'Mumbai',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: 'Lunch,Dinner',
    discounts: [
      { time: '13:00', percentage: 15 },
      { time: '17:30', percentage: 20 }
    ]
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
    discounts: [
      { time: '15:30', percentage: 20 },
      { time: '22:00', percentage: 15 }
    ]
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
    discounts: [
      { time: '21:30', percentage: 10 },
      { time: '22:00', percentage: 15 }
    ]
  },

  // Bangalore
  {
    name: 'Toit Beer Co.',
    cuisine: 'Brewpub • Pizza • Finger Food',
    location: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1538488881038-e252a119aac7?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: 'Lunch,Dinner',
    discounts: [
      { time: '12:00', percentage: 15 },
      { time: '16:00', percentage: 20 }
    ]
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
    discounts: [
      { time: '07:30', percentage: 10 },
      { time: '15:00', percentage: 15 }
    ]
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
    discounts: [
      { time: '15:00', percentage: 25 }
    ]
  },

  // Hyderabad
  {
    name: 'Paradise Biryani',
    cuisine: 'Hyderabadi Biryani • Kebabs',
    location: 'Secunderabad, Hyderabad',
    city: 'Hyderabad',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: 'Lunch,Dinner,Buffet',
    discounts: [
      { time: '16:00', percentage: 20 },
      { time: '22:30', percentage: 15 }
    ]
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
    discounts: [
      { time: '11:30', percentage: 10 },
      { time: '15:30', percentage: 15 }
    ]
  },

  // Chennai
  {
    name: 'Dakshin',
    cuisine: 'Traditional South Indian',
    location: 'Crowne Plaza, Alwarpet, Chennai',
    city: 'Chennai',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: 'Lunch,Dinner',
    discounts: [
      { time: '13:00', percentage: 10 },
      { time: '21:00', percentage: 15 }
    ]
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
    discounts: [
      { time: '08:00', percentage: 10 },
      { time: '15:00', percentage: 20 }
    ]
  },

  // Pune
  {
    name: 'Bella Italia',
    cuisine: 'Italian • Pasta • Woodfired Pizza',
    location: 'Koregaon Park, Pune',
    city: 'Pune',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: 'Lunch,Dinner',
    discounts: [
      { time: '11:00', percentage: 15 }
    ]
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
    discounts: [
      { time: '16:00', percentage: 20 },
      { time: '17:00', percentage: 15 }
    ]
  }
];

async function main() {
  console.log('Cleaning up existing restaurants and discounts...');
  await prisma.discount.deleteMany({});
  await prisma.restaurant.deleteMany({});

  console.log('Seeding top-tier Indian restaurants...');
  for (const item of restaurantsData) {
    const { discounts, ...restaurantDetails } = item;
    
    await prisma.restaurant.create({
      data: {
        ...restaurantDetails,
        discounts: {
          create: discounts
        }
      }
    });
  }

  console.log('Seeding complete! Database successfully populated.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
