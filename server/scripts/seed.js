import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';
import Trip from '../models/Trip.js';

import { seedUsers, seedDestinations } from '../data/seedData.js';
import { seedPackages, seedHotels, seedActivities } from '../data/seedCatalog.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[VAYORA Seed] Clearing collections...');
    await Promise.all([
      User.deleteMany(),
      Destination.deleteMany(),
      Package.deleteMany(),
      Hotel.deleteMany(),
      Activity.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Wishlist.deleteMany(),
      Trip.deleteMany(),
    ]);

    console.log('[VAYORA Seed] Inserting users...');
    const createdUsers = [];
    for (const u of seedUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const adminUser = createdUsers.find((u) => u.role === 'ADMIN');
    const demoUser = createdUsers.find((u) => u.email === 'demo@vayora.com');
    const aanyaUser = createdUsers.find((u) => u.email === 'aanya@example.com');

    console.log('[VAYORA Seed] Inserting destinations...');
    const createdDestinations = await Destination.insertMany(seedDestinations);

    const destMap = {};
    createdDestinations.forEach((d) => {
      destMap[d.name.toLowerCase()] = d._id;
    });

    console.log('[VAYORA Seed] Inserting packages...');
    const packagesWithDest = seedPackages.map((pkg) => {
      const destId = destMap[pkg.destinationName.toLowerCase()] || createdDestinations[0]._id;
      return {
        ...pkg,
        destination: destId,
      };
    });
    const createdPackages = await Package.insertMany(packagesWithDest);

    console.log('[VAYORA Seed] Inserting hotels...');
    const hotelsWithDest = seedHotels.map((h) => {
      const destId = destMap[h.destinationName.toLowerCase()] || createdDestinations[0]._id;
      return {
        ...h,
        destination: destId,
      };
    });
    const createdHotels = await Hotel.insertMany(hotelsWithDest);

    console.log('[VAYORA Seed] Inserting activities...');
    const activitiesWithDest = seedActivities.map((act) => {
      const destId = destMap[act.destinationName.toLowerCase()] || createdDestinations[0]._id;
      return {
        ...act,
        destination: destId,
      };
    });
    const createdActivities = await Activity.insertMany(activitiesWithDest);

    console.log('[VAYORA Seed] Inserting demo reviews...');
    const demoReviews = [
      {
        user: demoUser._id,
        destination: createdDestinations[0]._id, // Goa
        rating: 5,
        comment: 'Absolutely serene experience! The beaches in South Goa were pristine and the local Portuguese cuisine was unforgettable.',
      },
      {
        user: aanyaUser._id,
        destination: createdDestinations[1]._id, // Kashmir
        rating: 5,
        comment: 'Kashmir truly is paradise on earth. Dal Lake at dawn on a Shikara will stay etched in my memory forever.',
      },
      {
        user: demoUser._id,
        package: createdPackages[0]._id, // Goa package
        rating: 5,
        comment: 'Seamless organization from airport pickup to the private sunset cruise. Outstanding hospitality!',
      },
      {
        user: aanyaUser._id,
        package: createdPackages[1]._id, // Kashmir package
        rating: 5,
        comment: 'The houseboat stay and Gulmarg gondola ride were breathtaking. Highly recommended package!',
      },
      {
        user: demoUser._id,
        hotel: createdHotels[0]._id, // Taj Exotica Goa
        rating: 5,
        comment: 'Spectacular resort with private beach access. The spa and breakfast spread were world-class.',
      },
      {
        user: aanyaUser._id,
        activity: createdActivities[0]._id, // Scuba diving
        rating: 5,
        comment: 'Grand Island dive was thrilling! Saw sea turtles and vibrant corals. Very patient instructors.',
      },
    ];
    await Review.insertMany(demoReviews);

    console.log('[VAYORA Seed] Inserting demo bookings...');
    const demoBookings = [
      {
        bookingId: 'VAY-782190',
        user: demoUser._id,
        type: 'package',
        package: createdPackages[0]._id,
        destination: 'Goa',
        itemName: createdPackages[0].name,
        itemImage: createdPackages[0].images[0],
        travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        travelers: 2,
        guests: 2,
        contactInfo: {
          name: demoUser.name,
          email: demoUser.email,
          phone: demoUser.phone,
        },
        totalAmount: createdPackages[0].price * 2,
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card (Demo)',
        paymentId: 'PAY-DEMO-GOA789',
        bookingStatus: 'Confirmed',
      },
      {
        bookingId: 'VAY-914382',
        user: demoUser._id,
        type: 'hotel',
        hotel: createdHotels[1]._id, // Khyber Kashmir
        destination: 'Kashmir',
        itemName: createdHotels[1].name,
        itemImage: createdHotels[1].images[0],
        checkIn: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        travelers: 2,
        guests: 2,
        roomType: 'Premier Pine View Room',
        contactInfo: {
          name: demoUser.name,
          email: demoUser.email,
          phone: demoUser.phone,
        },
        totalAmount: 66000,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (Demo)',
        paymentId: 'PAY-DEMO-KAS992',
        bookingStatus: 'Confirmed',
      },
      {
        bookingId: 'VAY-309182',
        user: aanyaUser._id,
        type: 'activity',
        activity: createdActivities[2]._id,
        destination: 'Kashmir',
        itemName: createdActivities[2].name,
        itemImage: createdActivities[2].images[0],
        travelDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        travelers: 2,
        guests: 2,
        contactInfo: {
          name: aanyaUser.name,
          email: aanyaUser.email,
          phone: aanyaUser.phone,
        },
        totalAmount: 2998,
        paymentStatus: 'Paid',
        paymentMethod: 'Net Banking (Demo)',
        paymentId: 'PAY-DEMO-ACT123',
        bookingStatus: 'Confirmed',
      },
    ];
    await Booking.insertMany(demoBookings);

    console.log('[VAYORA Seed] Inserting demo wishlist & trip...');
    await Wishlist.create({
      user: demoUser._id,
      itemType: 'destination',
      itemId: createdDestinations[1]._id.toString(),
      title: 'Kashmir',
      image: createdDestinations[1].images[0],
      location: 'India',
      price: createdDestinations[1].startingPrice,
      rating: createdDestinations[1].rating,
    });

    await Trip.create({
      user: demoUser._id,
      title: 'Kashmir Autumn Odyssey',
      destination: 'Kashmir',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000),
      travelers: 2,
      budget: 45000,
      interests: ['Nature', 'Photography', 'Culture'],
      itinerary: [
        {
          day: 1,
          theme: 'Arrival & Dal Lake Serenity',
          activities: [
            { time: '11:00 AM', activity: 'Houseboat Check-in & Kahwa Welcome', cost: 4500, location: 'Dal Lake' },
            { time: '04:30 PM', activity: 'Shikara sunset ride to Char Chinar', cost: 1500, location: 'Dal Lake' },
          ],
          estimatedCost: 6000,
        },
        {
          day: 2,
          theme: 'Mughal Splendor & Old Srinagar',
          activities: [
            { time: '10:00 AM', activity: 'Nishat & Shalimar Bagh Guided Stroll', cost: 1200, location: 'Srinagar' },
            { time: '02:00 PM', activity: 'Wazwan feast at Ahdoos & Lal Chowk walk', cost: 2400, location: 'Residency Road' },
          ],
          estimatedCost: 3600,
        },
        {
          day: 3,
          theme: 'Alpine Peaks of Gulmarg',
          activities: [
            { time: '09:00 AM', activity: 'Gondola Cable Car Phase 1 & 2', cost: 3500, location: 'Gulmarg' },
            { time: '01:30 PM', activity: 'Pine forest snow walk and hot chocolate', cost: 1000, location: 'Gulmarg' },
          ],
          estimatedCost: 4500,
        },
      ],
      totalEstimatedCost: 14100,
      status: 'Planned',
    });

    console.log('[VAYORA Seed] Database seeding complete! 🎉');
    console.log(`- Created ${createdUsers.length} users`);
    console.log(`- Created ${createdDestinations.length} destinations`);
    console.log(`- Created ${createdPackages.length} packages`);
    console.log(`- Created ${createdHotels.length} hotels`);
    console.log(`- Created ${createdActivities.length} activities`);
  } catch (error) {
    console.error('[VAYORA Seed Error]:', error);
    throw error;
  }
};

export const autoSeedIfEmpty = async () => {
  const count = await Destination.countDocuments();
  if (count === 0) {
    console.log('[VAYORA DB] Empty database detected. Performing automated bootstrap seed...');
    await seedDatabase();
  }
};

// If run directly via node scripts/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  import('../config/db.js').then(async ({ connectDB, closeDB }) => {
    await connectDB();
    await seedDatabase();
    await closeDB();
    process.exit(0);
  });
}
