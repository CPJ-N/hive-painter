"use client";

import { Suspense, useEffect, useState } from "react";
import Composer from "@/components/composer";
import ResultGrid from "@/components/result-grid";
import { Header } from "@/components/layout/header";
import useBulkGeneration from "@/hooks/useBulkGeneration";

function HomeContent() {
  const { tiles, isRunning, lastPrompt, run, retryTile } = useBulkGeneration();
  const [userAPIKey, setUserAPIKey] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("togetherApiKey") ?? "";
  });

  useEffect(() => {
    const key = userAPIKey.trim();
    if (key) {
      localStorage.setItem("togetherApiKey", key);
    } else {
      localStorage.removeItem("togetherApiKey");
    }
  }, [userAPIKey]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <div className="relative flex min-h-screen flex-col px-5">
        <Header userAPIKey={userAPIKey} onAPIKeyChange={setUserAPIKey} />

        <ResultGrid tiles={tiles} prompt={lastPrompt} onRetry={retryTile} />

        <Composer
          userAPIKey={userAPIKey}
          isRunning={isRunning}
          onRun={(params) => {
            run({ ...params, userAPIKey: userAPIKey.trim() || undefined });
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
