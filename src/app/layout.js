
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Doomsday Ready",
  description: "Your MCU rewatch planner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen">
        <Sidebar />

        <main className="min-h-screen lg:ml-64 pt-16 lg:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
