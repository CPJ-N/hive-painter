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

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {!hasResults && <GalleryBackdrop />}

      <Header
        floating={!hasResults}
        userAPIKey={userAPIKey}
        onAPIKeyChange={setUserAPIKey}
      />

      <main
        className={`relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8 ${
          hasResults
            ? "gap-5 py-5"
            : "min-h-screen justify-center pb-10 pt-28 sm:pb-14"
        }`}
      >
        {!hasResults && (
          <section className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
            <h1 className="text-balance font-serif text-5xl font-normal leading-[0.95] text-gray-100 sm:text-7xl lg:text-8xl">
              Describe an image, then run it across models.
            </h1>
          </section>
        )}

        <div className="mx-auto w-full max-w-3xl">
          <Composer
            userAPIKey={userAPIKey}
            isRunning={isRunning}
            onRun={(params) => {
              run({ ...params, userAPIKey: userAPIKey.trim() || undefined });
            }}
          />
        </div>

        <ResultGrid tiles={tiles} prompt={lastPrompt} onRetry={retryTile} />
      </main>
    </div>
  );
}

function GalleryBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-gray-600">
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
