import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return <div className="p-10 h-dvh flex justify-center">{children}</div>;
}
