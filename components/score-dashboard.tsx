"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatUnits } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { baseScoreAbi, baseScoreAddress } from "@/lib/contracts";
import { readRecords, saveRecord, type ScoreRecord, updateRecord } from "@/lib/records";
import { BottomNav } from "./bottom-nav";

const earnValues = [10, 20, 50] as const;

function shortHash(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function levelProgress(score: bigint) {
  const numeric = Number(score);
  const currentLevel = Math.floor(numeric / 100) + 1;
  const currentStep = numeric % 100;
  return { currentLevel, currentStep };
}

export function ScoreDashboard() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [statusLabel, setStatusLabel] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [activeAmount, setActiveAmount] = useState<number | null>(null);
  const [trackedHash, setTrackedHash] = useState<`0x${string}` | undefined>();

  const scoreQuery = useReadContract({
    abi: baseScoreAbi,
    address: baseScoreAddress,
    functionName: "getScore",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const { data: hash, error, isPending: isWriting, writeContract } = useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    hash: trackedHash,
    query: {
      enabled: Boolean(trackedHash),
    },
  });

  useEffect(() => {
    setRecords(readRecords());
  }, []);

  useEffect(() => {
    if (!hash || !activeAmount) {
      return;
    }

    saveRecord({
      amount: activeAmount,
      hash,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setTrackedHash(hash);
    setStatusLabel("pending");
    setRecords(readRecords());
  }, [activeAmount, hash]);

  useEffect(() => {
    if (!receipt.data || !trackedHash) {
      return;
    }

    updateRecord(trackedHash, "success");
    setStatusLabel("success");
    setRecords(readRecords());
    void scoreQuery.refetch();
  }, [receipt.data, scoreQuery, trackedHash]);

  useEffect(() => {
    if (!error || !trackedHash) {
      return;
    }

    updateRecord(trackedHash, "error");
    setStatusLabel("error");
    setRecords(readRecords());
  }, [error, trackedHash]);

  const score = scoreQuery.data ?? 0n;
  const scoreDisplay = useMemo(() => formatUnits(score, 0), [score]);
  const progress = levelProgress(score);
  const recentRecords = records.slice(0, 3);

  return (
    <div className="app">
      <main className="shell">
        <section className="heroCard">
          <div className="heroTop">
            <span className="chip">BaseScore</span>
            {isConnected ? (
              <button className="ghostButton" onClick={() => disconnect()}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            ) : null}
          </div>
          <div className="scoreLabel">Current Score</div>
          <div className="scoreValue">{scoreDisplay}</div>
          <div className="connectRow">
            {isConnected ? (
              <>
                <span className="statusDot online" />
                <span className="walletText">{address}</span>
              </>
            ) : (
              connectors.map((connector) => (
                <button
                  key={connector.uid}
                  className="primaryButton"
                  disabled={isConnecting}
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                </button>
              ))
            )}
          </div>
        </section>

        <section className="actionCard">
          <div className="sectionTitle">Earn</div>
          <div className="earnGrid">
            {earnValues.map((amount) => (
              <button
                key={amount}
                className={activeAmount === amount && (isWriting || receipt.isLoading) ? "earnButton active" : "earnButton"}
                disabled={!isConnected || isWriting || receipt.isLoading}
                onClick={() => {
                  setActiveAmount(amount);
                  setStatusLabel("pending");
                  writeContract({
                    abi: baseScoreAbi,
                    address: baseScoreAddress,
                    functionName: "earn",
                    args: [BigInt(amount)],
                  });
                }}
              >
                +{amount}
              </button>
            ))}
          </div>
        </section>

        <section className="gridTwo">
          <div className="progressCard">
            <div className="sectionTitle">Level {progress.currentLevel}</div>
            <div className="progressBar">
              <span style={{ width: `${progress.currentStep}%` }} />
            </div>
            <div className="progressMeta">
              <span>{progress.currentStep}/100</span>
              <span>{progress.currentLevel + 1}</span>
            </div>
          </div>

          <Link href="/status" className="statusCard">
            <span className={`statusBadge ${statusLabel}`}>{statusLabel.toUpperCase()}</span>
            <span className="statusHash">
              {hash ? shortHash(hash) : isWriting || receipt.isLoading ? "Pending" : "Ready"}
            </span>
          </Link>
        </section>

        <section className="recordsCard">
          <div className="cardHeader">
            <span className="sectionTitle">Recent</span>
            <Link href="/records" className="subtleLink">
              View all
            </Link>
          </div>
          <div className="recordList">
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => (
                <div key={record.hash} className="recordRow">
                  <div>
                    <div className="recordAmount">+{record.amount}</div>
                    <div className="recordHash">{shortHash(record.hash)}</div>
                  </div>
                  <span className={`miniBadge ${record.status}`}>{record.status}</span>
                </div>
              ))
            ) : (
              <div className="emptyState" />
            )}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
