export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  imageUrl: string;
  type: 'veg' | 'non-veg' | 'both';
  mealOptions: string[];
  discounts: { time: string; percentage: number }[];
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Spice Symphony',
    cuisine: 'North Indian',
    location: 'Connaught Place, New Delhi',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: ['Lunch', 'Dinner'],
    discounts: [
      { time: '16:00', percentage: 20 },
      { time: '17:00', percentage: 15 },
    ]
  },
  {
    id: '2',
    name: 'Green Leaf Vegan',
    cuisine: 'Healthy • Vegan',
    location: 'Indiranagar, Bangalore',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    type: 'veg',
    mealOptions: ['Breakfast', 'Lunch'],
    discounts: [
      { time: '15:00', percentage: 25 },
    ]
  },
  {
    id: '3',
    name: 'Ocean Catch Seafood',
    cuisine: 'Seafood • Continental',
    location: 'Bandra West, Mumbai',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
    type: 'non-veg',
    mealOptions: ['Dinner', 'Buffet'],
    discounts: [
      { time: '21:30', percentage: 10 },
      { time: '22:00', percentage: 15 },
    ]
  },
  {
    id: '4',
    name: 'Bella Italia',
    cuisine: 'Italian • Pasta',
    location: 'Koregaon Park, Pune',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: ['Lunch', 'Dinner'],
    discounts: [
      { time: '11:00', percentage: 15 },
    ]
  },
  {
    id: '5',
    name: 'South Indian Delights',
    cuisine: 'South Indian',
    location: 'T Nagar, Chennai',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800',
    type: 'veg',
    mealOptions: ['Breakfast', 'Lunch', 'Dinner'],
    discounts: [
      { time: '08:00', percentage: 10 },
      { time: '15:00', percentage: 20 },
    ]
  },
  {
    id: '6',
    name: 'Haveli Restaurant',
    cuisine: 'Traditional Punjabi • North Indian Classics',
    location: 'NH-1, GT Road, Murthal, Delhi NCR',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&q=80&w=800',
    type: 'both',
    mealOptions: ['Breakfast', 'Lunch', 'Dinner'],
    discounts: [
      { time: '12:00', percentage: 15 },
      { time: '16:00', percentage: 25 },
      { time: '21:00', percentage: 10 },
    ]
  }
];
