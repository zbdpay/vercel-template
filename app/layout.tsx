import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZBD Agent Payments",
  description: "Next.js template with ZBD agent payment integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
