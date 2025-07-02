// src/components/user/CouponCard.jsx
import React from 'react';

const CouponCard = ({ title, code, description, onJoin }) => {
  return (
    <div className="bg-white border-2 border-dashed border-sky-400 rounded-xl p-6 w-full max-w-xs shadow-md hover:scale-[1.02] transition-transform">
      <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
      <div className="bg-sky-100 text-sky-700 font-mono px-3 py-1 rounded-md inline-block my-2">
        {code}
      </div>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <button
        onClick={onJoin}
        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Use Now
      </button>
    </div>
  );
};

export default CouponCard;
