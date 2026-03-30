export type ScoreRecord = {
  amount: number;
  hash: string;
  status: "pending" | "success" | "error";
  createdAt: string;
};

const storageKey = "basescore-records";

export function readRecords(): ScoreRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ScoreRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: ScoreRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const next = [record, ...readRecords()].slice(0, 12);
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

export function updateRecord(hash: string, status: ScoreRecord["status"]) {
  if (typeof window === "undefined") {
    return;
  }

  const next = readRecords().map((item) => (item.hash === hash ? { ...item, status } : item));
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}
