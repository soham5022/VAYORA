const API = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 STARTING VAYORA END-TO-END SYSTEM VALIDATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      throw new Error(message);
    }
  }

  try {
    // 1. Check destinations
    console.log('--- 1. Testing Destinations API ---');
    const destRes = await req(`${API}/destinations`);
    assert(destRes.status === 200, 'Destinations endpoint returns 200');
    assert(destRes.data.data.length >= 15, `Loaded ${destRes.data.data.length} destinations (Expected >= 15)`);
    
    const sampleDest = destRes.data.data[0];
    const destDetail = await req(`${API}/destinations/${sampleDest._id}`);
    assert(destDetail.data.data.destination?.name === sampleDest.name, `Fetched destination detail for "${sampleDest.name}"`);

    // 2. Check travel packages
    console.log('\n--- 2. Testing Travel Packages API ---');
    const pkgRes = await req(`${API}/packages`);
    assert(pkgRes.status === 200, 'Packages endpoint returns 200');
    assert(pkgRes.data.data.length >= 20, `Loaded ${pkgRes.data.data.length} travel packages (Expected >= 20)`);
    
    const samplePkg = pkgRes.data.data[0];
    const pkgDetail = await req(`${API}/packages/${samplePkg._id}`);
    assert(pkgDetail.data.data.package?.name === samplePkg.name, `Fetched package detail for "${samplePkg.name}"`);

    // 3. Check hotels
    console.log('\n--- 3. Testing Hotels API ---');
    const hotelRes = await req(`${API}/hotels`);
    assert(hotelRes.status === 200, 'Hotels endpoint returns 200');
    assert(hotelRes.data.data.length >= 15, `Loaded ${hotelRes.data.data.length} hotels (Expected >= 15)`);
    
    const sampleHotel = hotelRes.data.data[0];
    const hotelDetail = await req(`${API}/hotels/${sampleHotel._id}`);
    assert(hotelDetail.data.data.hotel?.name === sampleHotel.name, `Fetched hotel detail for "${sampleHotel.name}"`);

    // 4. Check activities
    console.log('\n--- 4. Testing Activities API ---');
    const actRes = await req(`${API}/activities`);
    assert(actRes.status === 200, 'Activities endpoint returns 200');
    assert(actRes.data.data.length >= 20, `Loaded ${actRes.data.data.length} activities (Expected >= 20)`);

    // 5. Test Demo User Login
    console.log('\n--- 5. Testing Demo User Authentication ---');
    const userLoginRes = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'demo@vayora.com',
        password: 'Demo@123'
      })
    });
    assert(userLoginRes.data.success === true, 'Demo user login succeeded');
    const userToken = userLoginRes.data.data.token;
    assert(!!userToken, 'Received JWT token for demo user');
    const userAuthHeaders = { Authorization: `Bearer ${userToken}` };

    const meRes = await req(`${API}/auth/me`, { headers: userAuthHeaders });
    assert(meRes.data.data?.email === 'demo@vayora.com', 'GET /auth/me returns demo traveler profile');

    // 6. Test Admin Login & Admin Dashboard
    console.log('\n--- 6. Testing Admin Authentication & Dashboard API ---');
    const adminLoginRes = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@vayora.com',
        password: 'Admin@123'
      })
    });
    assert(adminLoginRes.data.success === true, 'Admin login succeeded');
    const adminToken = adminLoginRes.data.data.token;
    assert(adminLoginRes.data.data.role === 'ADMIN', 'Admin user has role ADMIN');
    const adminAuthHeaders = { Authorization: `Bearer ${adminToken}` };

    const dashRes = await req(`${API}/admin/dashboard`, { headers: adminAuthHeaders });
    assert(dashRes.data.success === true, 'Admin dashboard metrics retrieved successfully');
    assert(dashRes.data.data.totalUsers >= 2, `Admin sees ${dashRes.data.data.totalUsers} registered users`);
    assert(dashRes.data.data.totalDestinations >= 15, `Admin sees ${dashRes.data.data.totalDestinations} destinations`);

    // 7. Test Booking Flow (Package Booking + Real DB Storage)
    console.log('\n--- 7. Testing Real Booking System & Payment Storage ---');
    const bookingPayload = {
      type: 'package',
      itemId: samplePkg._id,
      travelDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      travelers: 2,
      contactInfo: {
        name: 'Demo Traveler',
        email: 'demo@vayora.com',
        phone: '+91 98765 43210'
      },
      paymentMethod: 'UPI (Demo Simulator)'
    };
    const newBookingRes = await req(`${API}/bookings`, {
      method: 'POST',
      headers: userAuthHeaders,
      body: JSON.stringify(bookingPayload)
    });
    assert(newBookingRes.status === 201, 'Booking created with HTTP 201');
    const createdBooking = newBookingRes.data.data;
    assert(createdBooking.bookingId && (createdBooking.bookingId.startsWith('VY-') || createdBooking.bookingId.startsWith('VAY-')), `Generated unique booking ID: ${createdBooking.bookingId}`);
    assert(createdBooking.paymentStatus === 'Paid', 'Payment status marked as Paid');
    assert(createdBooking.subtotal === samplePkg.price * 2, `Subtotal dynamically verified: ₹${createdBooking.subtotal}`);
    assert(createdBooking.totalAmount === (createdBooking.subtotal + createdBooking.taxAmount + createdBooking.serviceFee), `Itemized total amount verified (Subtotal + GST + Service Fee): ₹${createdBooking.totalAmount}`);

    // Fetch user bookings
    const myBookingsRes = await req(`${API}/bookings/my`, { headers: userAuthHeaders });
    assert(myBookingsRes.data.data.some(b => b.bookingId === createdBooking.bookingId), 'Created booking is listed in user bookings');

    // 8. Test Wishlist Add & Remove
    console.log('\n--- 8. Testing Wishlist API ---');
    const addWishRes = await req(`${API}/wishlist`, {
      method: 'POST',
      headers: userAuthHeaders,
      body: JSON.stringify({
        itemType: 'destination',
        itemId: sampleDest._id,
        title: sampleDest.name,
        image: sampleDest.images?.[0] || '',
        location: `${sampleDest.state || ''}, ${sampleDest.country}`,
        price: sampleDest.startingPrice,
        rating: sampleDest.rating
      })
    });
    assert(addWishRes.data.success === true, `Added destination "${sampleDest.name}" to wishlist`);

    const getWishRes = await req(`${API}/wishlist`, { headers: userAuthHeaders });
    const wishEntry = getWishRes.data.data.find(w => w.itemId === sampleDest._id.toString());
    assert(!!wishEntry, 'Wishlist contains the added destination');

    const delWishRes = await req(`${API}/wishlist/${sampleDest._id}`, {
      method: 'DELETE',
      headers: userAuthHeaders
    });
    assert(delWishRes.data.success === true, 'Successfully removed destination from wishlist');

    // 9. Test Trip Planner Save & Retrieve
    console.log('\n--- 9. Testing Trip Planner Save & Retrieve ---');
    const tripPayload = {
      destination: sampleDest._id,
      title: 'Romantic Getaway to ' + sampleDest.name,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
      durationDays: 4,
      travelers: 2,
      budget: 65000,
      interests: ['Nature', 'Relaxation', 'Food'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Welcome Dinner',
          description: 'Check-in to resort, stroll along sunset beach',
          estimatedCost: 5000
        },
        {
          day: 2,
          title: 'Nature Excursion',
          description: 'Guided tour and local food tasting',
          estimatedCost: 12000
        }
      ]
    };
    const createTripRes = await req(`${API}/trips`, {
      method: 'POST',
      headers: userAuthHeaders,
      body: JSON.stringify(tripPayload)
    });
    assert(createTripRes.status === 201, 'Custom trip itinerary saved to database');
    const tripId = createTripRes.data.data._id;

    const myTripsRes = await req(`${API}/trips`, { headers: userAuthHeaders });
    assert(myTripsRes.data.data.some(t => t._id === tripId), 'Custom trip shows up in /trips');

    // 10. Test Review Submission
    console.log('\n--- 10. Testing Review Submission ---');
    const reviewPayload = {
      destination: sampleDest._id,
      rating: 5,
      comment: 'Absolutely breathtaking! The planning was seamless with VAYORA.'
    };
    const reviewRes = await req(`${API}/reviews`, {
      method: 'POST',
      headers: userAuthHeaders,
      body: JSON.stringify(reviewPayload)
    });
    assert(reviewRes.status === 201, 'Review submitted successfully');

    // 11. Test Booking Cancellation
    console.log('\n--- 11. Testing Booking Cancellation ---');
    const cancelRes = await req(`${API}/bookings/${createdBooking._id}/cancel`, {
      method: 'PUT',
      headers: userAuthHeaders
    });
    assert(cancelRes.data.data.bookingStatus === 'Cancelled', 'Booking status transitioned to Cancelled in DB');

    // 12. Test Coupon Validation
    console.log('\n--- 12. Testing Coupon System ---');
    const couponRes = await req(`${API}/coupons/validate`, {
      method: 'POST',
      body: JSON.stringify({ code: 'VAYORA10', amount: 20000 })
    });
    assert(couponRes.status === 200, 'Coupon validation returns 200');
    assert(couponRes.data.data.discountAmount > 0, `Coupon VAYORA10 applied: saved ₹${couponRes.data.data.discountAmount}`);

    // 13. Test Tax Invoice Retrieval
    console.log('\n--- 13. Testing Tax Invoice & Voucher ---');
    const invoiceRes = await req(`${API}/bookings/${createdBooking._id}/invoice`, { headers: userAuthHeaders });
    assert(invoiceRes.status === 200, 'Invoice endpoint returns 200');
    assert(invoiceRes.data.data.company.gstin === '29AAACV5912K1Z8', 'Invoice contains company GSTIN & registered credentials');

    // 14. Test FAQs Knowledge Base
    console.log('\n--- 14. Testing FAQs API ---');
    const faqsRes = await req(`${API}/faqs`);
    assert(faqsRes.status === 200, 'FAQs endpoint returns 200');
    assert(faqsRes.data.data.length >= 5, `Loaded ${faqsRes.data.data.length} active FAQs`);

    // 15. Test Blog & Travel Journal
    console.log('\n--- 15. Testing Blog & Journal API ---');
    const blogRes = await req(`${API}/blog`);
    assert(blogRes.status === 200, 'Blog endpoint returns 200');
    assert(blogRes.data.data.length >= 3, `Loaded ${blogRes.data.data.length} editorial travel articles`);

    // 16. Test Contact Inquiry Submission
    console.log('\n--- 16. Testing Contact System ---');
    const contactRes = await req(`${API}/contact`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Traveler',
        email: 'jane@example.com',
        phone: '+91 99887 76655',
        subject: 'Inquiry for Switzerland Honeymoon',
        message: 'Looking for a private 7-day chalets and scenic train itinerary in Bernese Oberland.'
      })
    });
    assert(contactRes.status === 201, 'Contact inquiry submitted and recorded in database');

    // 17. Test Vendor / Partner Portal
    console.log('\n--- 17. Testing Partner & Vendor Portal ---');
    const vendorLoginRes = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'vendor@vayora.com', password: 'Vendor@123' })
    });
    assert(vendorLoginRes.status === 200, 'Demo vendor login succeeded');
    const vendorHeaders = { Authorization: `Bearer ${vendorLoginRes.data.data.token}` };
    const vendorDashRes = await req(`${API}/vendors/dashboard`, { headers: vendorHeaders });
    assert(vendorDashRes.status === 200, 'Vendor dashboard retrieved metrics and partner listings');

    // 18. Test System Health Check
    console.log('\n--- 18. Testing System Health Check ---');
    const healthRes = await req(`${API}/health`);
    assert(healthRes.status === 200, 'GET /api/health returns HTTP 200');
    assert(healthRes.data.status === 'ok', 'Health status is "ok"');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passed}/${total} COMPREHENSIVE END-TO-END VALIDATION CHECKS PASSED!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test failed with error:', err.message);
    process.exit(1);
  }
}

runTests();
