import React, { ReactNode } from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";

interface Props {
  children: ReactNode;
}

const StoreLayout = ({ children }: Props) => {
  return (
    <div className="min-h-dvh">
      <NavBar />
      <div className="p-10">{children}</div>
      <Footer />
    </div>
  );
};

export default StoreLayout;
