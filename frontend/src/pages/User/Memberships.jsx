import React from 'react';

const membershipPlans = [
  {
    id: 'silver',
    name: 'Silver',
    price: 499,
    duration: '1 Month',
    description: 'Perfect for casual users who rent occasionally.',
    benefits: [
      '5% discount on bookings',
      'Priority customer support',
      '1 free cancellation per month',
    ],
    color: 'gray-200',
    textColor: 'text-gray-800',
    buttonClass:'silver'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 999,
    duration: '3 Months',
    description: 'Ideal for frequent renters seeking savings.',
    benefits: [
      '10% discount on all bookings',
      'Priority support with live chat',
      '3 free cancellations',
      'Early access to new vehicles',
    ],
    color: 'yellow-100',
    textColor: 'text-yellow-900',
    buttonClass:'gold'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 1999,
    duration: '6 Months',
    description: 'For power users who demand premium experience.',
    benefits: [
      '15% discount on all bookings',
      '24/7 premium support',
      'Unlimited free cancellations',
      'Free upgrades when available',
      'Dedicated account manager',
    ],
    color: 'purple-100',
    textColor: 'text-purple-900',
    buttonClass:'platinum'
  },
];

const Memberships = () => {
  const handleJoinNow = (planName) => {
    alert(`You clicked to join the ${planName} membership!`);
   
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Membership Programs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {membershipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl shadow-md bg-${plan.color} p-6 transition-transform transform hover:scale-105`}
          >
            <h2 className={`text-2xl font-semibold mb-2 ${plan.textColor}`}>{plan.name} Membership</h2>
            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

            <ul className="list-disc list-inside text-gray-700 mb-6 text-sm space-y-1">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>

            <div className="text-lg font-bold mb-4">
              ₹{plan.price} <span className="text-sm font-normal text-gray-600">/ {plan.duration}</span>
            </div>

            <button
              onClick={() => handleJoinNow(plan.name)}
              className={`px-8 py-3 text-white font-semibold rounded-full shadow-lg transition duration-300  hover:brightness-110 active:scale-95 ${plan.buttonClass}`}
            >
              Join Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memberships;
