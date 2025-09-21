import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "DucMix",
  description: "Search, preview, and queue tracks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Reserve room for fixed footer player (height ~96–110px) + safe-area */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen pb-[120px]`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
