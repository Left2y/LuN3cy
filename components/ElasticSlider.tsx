import React, { useEffect, useRef, useState } from 'react';

interface ElasticSliderProps {
  defaultValue?: number;
  startingValue?: number;
  maxValue?: number;
  isStepped?: boolean;
  stepSize?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: number) => void;
  value?: number;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  isStepped = false,
  stepSize = 1,
  leftIcon,
  rightIcon,
  onChange,
  value: controlledValue,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || startingValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentValue = isControlled ? controlledValue : internalValue;
  const percentage = Math.min(100, Math.max(0, (currentValue / maxValue) * 100));

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const raw = Math.min(Math.max(0, clientX - rect.left), rect.width);
    let nextValue = (raw / rect.width) * maxValue;

    if (isStepped && stepSize) {
      nextValue = Math.round(nextValue / stepSize) * stepSize;
    }

    nextValue = Math.min(Math.max(0, nextValue), maxValue);

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) updateValue(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isDragging) updateValue(event.touches[0].clientX);
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, maxValue, stepSize, isStepped, isControlled, onChange]);

  return (
    <div className="flex w-full select-none items-center gap-3 touch-none">
      {leftIcon && <div className="shrink-0 text-[var(--ink)]">{leftIcon}</div>}

      <div
        ref={sliderRef}
        className="relative flex h-12 flex-1 cursor-pointer items-center"
        onMouseDown={(event) => {
          setIsDragging(true);
          updateValue(event.clientX);
        }}
        onTouchStart={(event) => {
          setIsDragging(true);
          updateValue(event.touches[0].clientX);
        }}
      >
        <div className="absolute h-4 w-full border border-[var(--line)] bg-[var(--surface-strong)]">
          <div
            className="h-full bg-[var(--ink)] transition-all duration-100"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div
          className="absolute h-7 w-4 border border-[var(--line)] bg-[var(--accent)] transition-transform duration-150"
          style={{
            left: `${percentage}%`,
            transform: `translate(-50%, 0) scale(${isDragging ? 1.08 : 1})`,
          }}
        />
      </div>

      {rightIcon && <div className="shrink-0 text-[var(--ink)]">{rightIcon}</div>}
    </div>
  );
};

export default ElasticSlider;
