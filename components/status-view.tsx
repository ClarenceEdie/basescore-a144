"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BottomNav } from "./bottom-nav";
import { readRecords, type ScoreRecord } from "@/lib/records";

export function StatusView() {
  const [latest, setLatest] = useState<ScoreRecord | null>(null);

  useEffect(() => {
    const [first] = readRecords();
    setLatest(first ?? null);
  }, []);

  return (
    <div className="app">
      <main className="shell">
        <section className="statusHero">
          <span className={`statusBadge ${latest?.status ?? "pending"}`}>
            {(latest?.status ?? "pending").toUpperCase()}
          </span>
          <div className="statusBig">{latest ? `+${latest.amount}` : "0"}</div>
          <div className="statusMeta">{latest?.hash ?? "Pending"}</div>
        </section>
        <Link href="/" className="primaryButton centerButton">
          Score
        </Link>
      </main>
      <BottomNav />
    </div>
  );
}
