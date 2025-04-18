import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

const Footer = ({ className }: Props) => {
  return (
    <div
      className={`${className} bg-gray-200 text-neutral-900 dark:bg-black
        dark:text-stone-200 sm:px-3 md:px-7 lg:px-10 py-6 flex justify-between`}
    >
      <p>Ecommer Inc.</p>
      <p>
        A Project by{" "}
        <Link
          href="https://github.com/ShaheelMhd"
          target="_blank"
          className="text-blue-400"
        >
          @ShaheelMhd
        </Link>
      </p>
    </div>
  );
};

export default Footer;
