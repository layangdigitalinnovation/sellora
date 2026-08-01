'use client';

import React, { useState, useEffect } from 'react';

export function CountdownTimer({ targetDate }: { targetDate: Date | string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) return <div className="text-red-500 font-bold">Penawaran telah berakhir</div>;

  return (
    <div className="flex gap-2 text-center text-sm font-semibold">
      <div className="bg-red-100 text-red-600 px-3 py-1 rounded">
        {timeLeft.days}d
      </div>
      <div className="bg-red-100 text-red-600 px-3 py-1 rounded">
        {timeLeft.hours}h
      </div>
      <div className="bg-red-100 text-red-600 px-3 py-1 rounded">
        {timeLeft.minutes}m
      </div>
      <div className="bg-red-100 text-red-600 px-3 py-1 rounded">
        {timeLeft.seconds}s
      </div>
    </div>
  );
}
