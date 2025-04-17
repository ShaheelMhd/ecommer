import React, { ReactNode } from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";

interface Props {
  children: ReactNode;
}

const StoreLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="sm:px-3 md:px-7 p-10 flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export default StoreLayout;
