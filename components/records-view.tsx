"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "./bottom-nav";
import { readRecords, type ScoreRecord } from "@/lib/records";

function shortHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export function RecordsView() {
  const [records, setRecords] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    setRecords(readRecords());
  }, []);

  return (
    <div className="app">
      <main className="shell">
        <section className="listHero">
          <span className="chip">Records</span>
          <div className="listCount">{records.length}</div>
        </section>
        <section className="recordsCard full">
          <div className="recordList">
            {records.map((record) => (
              <div key={record.hash} className="recordRow wide">
                <div>
                  <div className="recordAmount">+{record.amount}</div>
                  <div className="recordHash">{shortHash(record.hash)}</div>
                </div>
                <div className="recordMeta">
                  <span className={`miniBadge ${record.status}`}>{record.status}</span>
                  <span className="recordTime">{new Date(record.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {records.length === 0 ? <div className="emptyState" /> : null}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
