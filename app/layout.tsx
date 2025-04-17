import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "./auth/Provider";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased dark:bg-zinc-900 dark:text-slate-200 bg-slate-100 text-neutral-900`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main>
              {children}
              <SpeedInsights />
            </main>
            <Toaster className="mr-2" duration={2000} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
