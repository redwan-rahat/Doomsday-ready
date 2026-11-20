
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const mainNavigation = [
  { label: "Movies", href: "/" },
  { label: "Rewatch Plan", href: "/rewatch-plan" },
  { label: "Booking", href: "/booking" },
];

const bottomNavigation = [
  { label: "User", href: "/user" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const renderLinks = (items) =>
    items.map((item) => {
      const isActive = pathname === item.href;

      return (
        <Link
          key={item.label}
          href={item.href}
          onClick={() => setIsOpen(false)}
          className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            isActive
              ? "bg-primary text-foreground"
              : "text-text-secondary hover:text-foreground hover:bg-surface"
          }`}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      {/* Mobile and Tablet Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md hover:bg-surface cursor-pointer"
          aria-label="Open menu"
        >
          <FiMenu size={22} />
        </button>

        <h1 className="text-lg font-bold tracking-tight">
          DOOMSDAY<span className="text-primary">.</span>
        </h1>

        <div className="w-9" />
      </header>

      {/* Mobile and Tablet Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-background border-r border-border p-5 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              DOOMSDAY<span className="text-primary">.</span>
            </h1>

            <p className="text-xs text-text-muted mt-1">
              Your MCU watchlist
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-surface cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-2">
          {renderLinks(mainNavigation)}
        </nav>

        {/* Bottom Navigation */}
        <nav className="flex flex-col gap-2 mt-auto pt-8">
          {renderLinks(bottomNavigation)}
        </nav>

        {/* Footer */}
        <div className="hidden lg:block mt-8">
          <p className="text-xs text-text-muted">
            DOOMSDAY READY © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
