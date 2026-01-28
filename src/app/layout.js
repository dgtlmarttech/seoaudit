import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../component/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Free SEO Audit Report - DGTLmart",
  description: "Get a comprehensive SEO audit report for your website. Identify issues and improve your site's performance with our free tool.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       {/* The Navbar component is placed here to be present on all pages */}
        <Navbar />
        {/* The children prop will render the content of the current page */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
