import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./auth/Provider";
import "./globals.css";
import NavBar from "./NavBar";
import { Toaster } from "sonner";

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
  showNavbar = true,
  contentPadding = "px-10 py-10",
}: Readonly<{
  children: React.ReactNode;
  showNavbar?: boolean;
  contentPadding?: string;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-neutral-800 text-slate-200`}
      >
        {showNavbar ? <NavBar /> : null}
        <AuthProvider>
          <main className={contentPadding}>
            {children}
          </main>
          <Toaster className="mr-2" duration={2000} />
        </AuthProvider>
      </body>
    </html>
  );
}
