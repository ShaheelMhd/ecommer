import RootLayout from "../layout";

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <RootLayout showNavbar={false} contentPadding="p-0">
          <div>{children}</div>
    // </RootLayout>
  );
}
