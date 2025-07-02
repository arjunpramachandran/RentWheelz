
import React from 'react';
import CouponCard from '../../components/user/CoupenCard';
import toast from 'react-hot-toast';

const coupons = [
  {
    title: '💸 20% Off',
    code: 'SAVE20',
    description: 'Use this coupon to get 20% off your next booking. Valid till July 31.',
  },
  {
    title: '🚗 ₹500 Off',
    code: 'DRIVE500',
    description: 'Flat ₹500 off on rides above ₹3000. Applicable to premium vehicles only.',
  },
  {
    title: '🎉 First Ride Free',
    code: 'FREERIDE',
    description: 'New users only. Up to ₹1000 off on your first booking.',
  },
];

const UserCoupons = () => {
  const handleJoin = (code) => {
    // Optional: await api.post('/subscribe-coupon', { code });
    toast.success(`Coupon "${code}" activated!`);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Available Coupons</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.code}
            title={coupon.title}
            code={coupon.code}
            description={coupon.description}
            onJoin={() => handleJoin(coupon.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserCoupons;
