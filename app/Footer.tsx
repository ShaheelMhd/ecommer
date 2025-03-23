import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="text-slate-200 bg-neutral-900 px-10 py-6 flex justify-between">
      <p>Ecommer Inc.</p>
      <p>
        A Project by{" "}
        <Link href="https://github.com/ShaheelMhd" className="text-blue-400">
          @ShaheelMhd
        </Link>
      </p>
    </div>
  );
};

export default Footer;
