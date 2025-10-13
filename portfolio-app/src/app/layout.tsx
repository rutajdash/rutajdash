import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, Roboto } from "next/font/google";
import "./globals.css";

const imbPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  preload: false,
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: false,
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pebbles | Rutaj's Office",
  description:
    "Welcome to Rutaj's Office - Your Gateway to Innovation and Excellence. I am Pebbles, the personal assistant of Mr. Rutaj Dash, here to help! Explore our portfolio, services, and get in touch to discover how we can collaborate for success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${imbPlexSans.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
