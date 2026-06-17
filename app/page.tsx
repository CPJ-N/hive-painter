"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Composer from "@/components/composer";
import ResultGrid from "@/components/result-grid";
import { Header } from "@/components/layout/header";
import useBulkGeneration from "@/hooks/useBulkGeneration";
import { IMAGE_STYLES } from "@/lib/config";

const galleryTiles = Array.from(
  { length: 36 },
  (_, index) => IMAGE_STYLES[index % IMAGE_STYLES.length],
);

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

  const hasResults = tiles.length > 0;
  const composer = (
    <Composer
      userAPIKey={userAPIKey}
      isRunning={isRunning}
      onRun={(params) => {
        run({ ...params, userAPIKey: userAPIKey.trim() || undefined });
      }}
    />
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {hasResults && <ResultsBackdrop />}
      {!hasResults && <GalleryBackdrop />}

      <Header
        floating={!hasResults}
        userAPIKey={userAPIKey}
        onAPIKeyChange={setUserAPIKey}
      />

      {hasResults ? (
        <>
          <main className="relative z-10 w-full flex-1 px-4 pb-56 pt-5 sm:px-6 lg:px-8">
            <ResultGrid tiles={tiles} prompt={lastPrompt} onRetry={retryTile} />
          </main>

          <div className="fixed inset-x-0 bottom-7 z-40 px-4 sm:bottom-9">
            <div className="mx-auto w-full max-w-3xl">{composer}</div>
          </div>
        </>
      ) : (
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-8">
          <section className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
            <h1 className="text-balance font-serif text-5xl font-normal leading-[0.95] text-gray-100 sm:text-7xl lg:text-8xl">
              Describe an image, then run it across models.
            </h1>
          </section>

          <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </main>
      )}
    </div>
  );
}

function ResultsBackdrop() {
  return (
    <div className="app-surface-bg pointer-events-none fixed inset-0 z-0">
      <div className="app-surface-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-gray-600/80 to-transparent" />
    </div>
  );
}

function GalleryBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gray-600">
      <div className="grid h-full min-h-[100svh] grid-cols-3 gap-2 p-2 opacity-60 sm:grid-cols-4 lg:grid-cols-6">
        {galleryTiles.map((style, index) => (
          <div
            key={`${style.value}-${index}`}
            className="relative min-h-[180px] overflow-hidden rounded-md bg-gray-500"
          >
            <Image
              src={style.image}
              alt=""
              fill
              sizes="(max-width: 640px) 34vw, (max-width: 1024px) 25vw, 17vw"
              className="object-cover grayscale-[0.2] saturate-[0.72]"
              priority={index < 6}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,23,17,0.16),rgba(7,9,7,0.66)_76%)]" />
      <div className="absolute inset-0 bg-gray-600/30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-600/70 to-transparent" />
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
