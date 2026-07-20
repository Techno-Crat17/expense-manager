import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
  value = 0,
  duration = 1200,
  prefix = '₹',
  suffix = '',
  decimals = 2,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = displayValue;
    startValueRef.current = start;
    startTimeRef.current = null;

    let animationFrame;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = startValueRef.current + (target - startValueRef.current) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formatted = displayValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`inline-block tabular-nums transition-all ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
