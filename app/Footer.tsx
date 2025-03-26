import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

const Footer = ({ className }: Props) => {
  return (
    <div
      className={`${className} text-slate-200 bg-neutral-900 px-10 py-6 flex justify-between`}
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
