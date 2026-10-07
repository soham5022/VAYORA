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
import Coupon from '../models/Coupon.js';
import Faq from '../models/Faq.js';
import BlogPost from '../models/BlogPost.js';
import Setting from '../models/Setting.js';

import { seedUsers, seedDestinations } from '../data/seedData.js';
import { seedPackages, seedHotels, seedActivities } from '../data/seedCatalog.js';

dotenv.config();

let isSeeding = false;

export const seedDatabase = async () => {
  if (isSeeding) {
    console.log('[VAYORA Seed] Seeding already in progress, skipping concurrent call...');
    return;
  }
  isSeeding = true;
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
      Coupon.deleteMany(),
      Faq.deleteMany(),
      BlogPost.deleteMany(),
      Setting.deleteMany(),
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
    const destinationsWithSlug = seedDestinations.map((d, idx) => ({
      ...d,
      slug: (d.name || `dest-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    }));
    const createdDestinations = await Destination.insertMany(destinationsWithSlug);

    const destMap = {};
    createdDestinations.forEach((d) => {
      destMap[d.name.toLowerCase()] = d._id;
    });

    console.log('[VAYORA Seed] Inserting packages...');
    const packagesWithDest = seedPackages.map((pkg, idx) => {
      const destId = destMap[pkg.destinationName.toLowerCase()] || createdDestinations[0]._id;
      const baseSlug = (pkg.name || `pkg-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return {
        ...pkg,
        slug: `${baseSlug}-${idx}`,
        destination: destId,
      };
    });
    const createdPackages = await Package.insertMany(packagesWithDest);

    console.log('[VAYORA Seed] Inserting hotels...');
    const hotelsWithDest = seedHotels.map((h, idx) => {
      const destId = destMap[h.destinationName.toLowerCase()] || createdDestinations[0]._id;
      const baseSlug = (h.name || `hotel-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return {
        ...h,
        slug: `${baseSlug}-${idx}`,
        destination: destId,
      };
    });
    const createdHotels = await Hotel.insertMany(hotelsWithDest);

    console.log('[VAYORA Seed] Inserting activities...');
    const activitiesWithDest = seedActivities.map((act, idx) => {
      const destId = destMap[act.destinationName.toLowerCase()] || createdDestinations[0]._id;
      const baseSlug = (act.name || `act-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return {
        ...act,
        slug: `${baseSlug}-${idx}`,
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
        basePrice: createdPackages[0].price,
        quantity: 2,
        subtotal: createdPackages[0].price * 2,
        taxAmount: Math.round(createdPackages[0].price * 2 * 0.05),
        serviceFee: Math.round(createdPackages[0].price * 2 * 0.025),
        discountAmount: 0,
        totalAmount: Math.round(createdPackages[0].price * 2 * 1.075),
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card (Demo)',
        paymentId: 'PAY-DEMO-GOA789',
        bookingStatus: 'Confirmed',
        invoiceNumber: 'INV-2026-000101',
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
        basePrice: 30000,
        quantity: 2,
        subtotal: 60000,
        taxAmount: 3000,
        serviceFee: 1500,
        discountAmount: 0,
        totalAmount: 64500,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (Demo)',
        paymentId: 'PAY-DEMO-KAS992',
        bookingStatus: 'Confirmed',
        invoiceNumber: 'INV-2026-000102',
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
        basePrice: 1499,
        quantity: 2,
        subtotal: 2998,
        taxAmount: 150,
        serviceFee: 75,
        discountAmount: 0,
        totalAmount: 3223,
        paymentStatus: 'Paid',
        paymentMethod: 'Net Banking (Demo)',
        paymentId: 'PAY-DEMO-ACT123',
        bookingStatus: 'Confirmed',
        invoiceNumber: 'INV-2026-000103',
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

    console.log('[VAYORA Seed] Inserting active coupons...');
    await Coupon.insertMany([
      {
        code: 'VAYORA10',
        description: '10% discount on all premium packages above ₹15,000',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 15000,
        maxDiscount: 5000,
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isActive: true,
      },
      {
        code: 'EARLYBIRD',
        description: 'Flat ₹2,500 off on holiday bookings above ₹20,000',
        discountType: 'fixed',
        discountValue: 2500,
        minOrderAmount: 20000,
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 300,
        isActive: true,
      },
      {
        code: 'LUXURY2026',
        description: '15% off on ultra-luxury resorts & overwater villas',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 30000,
        maxDiscount: 10000,
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
        isActive: true,
      },
    ]);

    console.log('[VAYORA Seed] Inserting FAQs & platform settings...');
    await Setting.create({
      companyName: 'VAYORA Travel Technologies Pvt Ltd',
      tagline: 'Travel beyond the ordinary.',
      supportEmail: 'support@vayora.com',
      supportPhone: '+91 800-829-6721',
      address: 'Level 14, Prestige Blue Tower, Outer Ring Road, Bengaluru, Karnataka 560103, India',
      currency: 'INR',
      currencySymbol: '₹',
      taxRatePercent: 5.0,
      serviceFeePercent: 2.5,
    });

    console.log('[VAYORA Seed] Database seeding complete! 🎉');
    console.log(`- Created ${createdUsers.length} users`);
    console.log(`- Created ${createdDestinations.length} destinations`);
    console.log(`- Created ${createdPackages.length} packages`);
    console.log(`- Created ${createdHotels.length} hotels`);
    console.log(`- Created ${createdActivities.length} activities`);
    console.log(`- Created coupons, FAQs, and platform settings`);
  } catch (error) {
    console.error('[VAYORA Seed Error]:', error);
    throw error;
  } finally {
    isSeeding = false;
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
