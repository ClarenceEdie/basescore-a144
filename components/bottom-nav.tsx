"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Score" },
  { href: "/records", label: "Records" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomNav">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "bottomNavLink active" : "bottomNavLink"}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
