import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "./auth/Provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecommer",
  description: "The complete online store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-neutral-800 text-slate-200`}
      >
        <AuthProvider>
          <main>{children}</main>
          <Toaster className="mr-2" duration={2000} />
        </AuthProvider>
      </body>
    </html>
  );
}
