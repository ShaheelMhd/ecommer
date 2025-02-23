import React, { ReactNode } from "react";
import NavBar from "../NavBar";

interface Props {
  children: ReactNode;
}

const StoreLayout = ({ children }: Props) => {
  return (
    <>
      <NavBar />
      <div className="p-10">{children}</div>
    </>
  );
};

export default StoreLayout;
