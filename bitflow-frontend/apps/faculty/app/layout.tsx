import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./providers";

export const metadata: Metadata = {
  title: "Faculty Portal - BitFlow LMS",
  description: "Faculty portal for managing classes, assessments, and students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
