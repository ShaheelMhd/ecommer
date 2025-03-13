"use client";

import { useState } from "react";

interface Props {
  text: string;
  className?: string;
}

const TextClamp = ({ text, className }: Props) => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <>
      <p className={`${!clicked ? "line-clamp-5" : ""} ${className}`}>{text}</p>
      <button
        className="mt-2 text-blue-300 hover:text-blue-400 transition duration-300"
        onClick={handleClick}
      >
        {!clicked ? "Show more" : "Show less"}
      </button>
    </>
  );
};

export default TextClamp;
