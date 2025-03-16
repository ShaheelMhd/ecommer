"use client";

import React, { useState } from "react";
import { IoStar, IoStarHalfOutline, IoStarOutline } from "react-icons/io5";

interface Props {
  rating?: number;
  className?: string;
  selector?: boolean;
  onChange?: (newRating: number) => void;
}

const StarRating = ({ rating, className, selector, onChange }: Props) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(rating || 0);

  const fullStars = Math.floor(currentRating);
  const halfStars = currentRating % 1 !== 0 ? 1 : 0;

  const handleStarClick = (index: number) => {
    const newRating = index + 1;
    setCurrentRating(newRating);
    if (onChange) onChange(newRating);
  };

  const handleMouseEnter = (index: number) => {
    if (selector) setHoveredRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    const renderedStars = [];

    for (let i = 0; i < 5; i++) {
      if (hoveredRating > 0 && i < hoveredRating) {
        renderedStars.push(<IoStar key={i} className="text-orange-300" />);
      } else if (i < fullStars) {
        renderedStars.push(<IoStar key={i} className="text-orange-300" />);
      } else if (i === fullStars && halfStars) {
        renderedStars.push(
          <IoStarHalfOutline key={i} className="text-orange-300" />
        );
      } else {
        renderedStars.push(<IoStarOutline key={i} className="text-gray-300" />);
      }
    }

    return renderedStars;
  };

  return (
    <div
      className={`flex ${selector && "cursor-pointer"} ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {renderStars().map((star, index) => (
        <div
          key={index}
          className="mx-1"
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
        >
          {star}
        </div>
      ))}
    </div>
  );
};

export default StarRating;
