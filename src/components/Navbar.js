"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import config from "@/lib/config";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const appName = config?.appName || "Clips Studio";
  const logoLetter = appName.trim().charAt(0).toUpperCase();

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "My Clips", path: "/gallery" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-divider/50 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-extrabold text-lg shadow-md shadow-primary/30">
            {logoLetter}
          </div>
          <span className="text-lg font-black tracking-tight text-primary-text text-nowrap">
            {appName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-secondary-text hover:text-primary-text hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-primary-text"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-divider/50 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                pathname === link.path
                  ? "bg-primary/15 text-primary"
                  : "text-secondary-text"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
