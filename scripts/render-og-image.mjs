import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = join(root, "public", "og-image.png");
const tempDir = join(tmpdir(), "hive-painter-og");
const tempHtmlPath = join(tempDir, "og-image.html");
const chromeProfilePath = join(tempDir, "chrome-profile");
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function assetUrl(path) {
  return pathToFileURL(join(root, path)).href;
}

const styleImages = [
  "public/styles/pop-art.png",
  "public/styles/minimal.png",
  "public/styles/retro.png",
  "public/styles/watercolor.png",
  "public/styles/fantasy.png",
  "public/styles/moody.png",
  "public/styles/vibrant.png",
  "public/styles/cinematic.png",
  "public/styles/cyberpunk.jpeg",
  "public/styles/surreal.jpeg",
  "public/styles/art-deco.jpeg",
  "public/styles/grafiti.jpeg",
];

const tiles = Array.from({ length: 30 }, (_, index) => {
  const src = assetUrl(styleImages[index % styleImages.length]);
  return `<div class="tile"><img src="${src}" alt=""></div>`;
}).join("");

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      @font-face {
        font-family: Geist;
        src: url("${assetUrl("app/fonts/GeistVF.woff")}") format("woff");
        font-weight: 100 900;
      }

      @font-face {
        font-family: Geist Mono;
        src: url("${assetUrl("app/fonts/GeistMonoVF.woff")}") format("woff");
        font-weight: 100 900;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        width: 2400px;
        height: 1260px;
        overflow: hidden;
        background: #070907;
        color: #f6f5ec;
        font-family: Geist, ui-sans-serif, system-ui, sans-serif;
      }

      .frame {
        position: relative;
        width: 2400px;
        height: 1260px;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 18%, rgba(52, 95, 62, 0.16), transparent 44%),
          radial-gradient(circle at 86% 68%, rgba(220, 169, 74, 0.06), transparent 32%),
          linear-gradient(180deg, #080c08 0%, #070907 100%);
      }

      .gallery {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-auto-rows: 1fr;
        gap: 14px;
        padding: 14px;
        opacity: 0.72;
      }

      .tile {
        min-height: 240px;
        overflow: hidden;
        border-radius: 12px;
        background: #111711;
      }

      .tile img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: saturate(0.72) contrast(0.95) grayscale(0.16);
      }

      .shade {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 46%, rgba(17, 23, 17, 0.1), rgba(7, 9, 7, 0.7) 74%),
          linear-gradient(180deg, rgba(7, 9, 7, 0.56) 0%, rgba(7, 9, 7, 0.18) 44%, rgba(7, 9, 7, 0.72) 100%);
      }

      .dot-grid {
        position: absolute;
        inset: 0;
        opacity: 0.28;
        background-image: radial-gradient(rgba(246, 245, 236, 0.09) 1px, transparent 1px);
        background-size: 28px 28px;
      }

      .nav {
        position: absolute;
        top: 28px;
        left: 180px;
        right: 180px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }

      .brand,
      .actions,
      .pill,
      .api-key {
        display: flex;
        align-items: center;
      }

      .brand {
        gap: 18px;
        min-width: 0;
      }

      .mark {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(245, 211, 134, 0.42);
        border-radius: 14px;
        background: rgba(17, 23, 17, 0.92);
        box-shadow:
          inset 0 0 0 1px rgba(246, 245, 236, 0.05),
          0 18px 40px -20px rgba(245, 211, 134, 0.65);
      }

      .mark svg {
        width: 50px;
        height: 50px;
        filter: drop-shadow(0 8px 18px rgba(245, 211, 134, 0.28));
      }

      .name {
        font-size: 36px;
        font-weight: 700;
        line-height: 1;
      }

      .powered {
        color: rgba(216, 222, 210, 0.82);
        font-size: 22px;
        font-weight: 600;
      }

      .actions {
        gap: 16px;
      }

      .source {
        margin-right: 8px;
        color: rgba(246, 245, 236, 0.82);
        font-family: Geist Mono, ui-monospace, monospace;
        font-size: 20px;
      }

      .source span {
        border-bottom: 1px solid rgba(246, 245, 236, 0.62);
      }

      .api-key,
      .pill {
        height: 58px;
        border: 1px solid rgba(246, 245, 236, 0.12);
        border-radius: 10px;
        background: rgba(17, 23, 17, 0.86);
        box-shadow: 0 0 0 1px rgba(246, 245, 236, 0.04), 0 14px 34px -18px rgba(0, 0, 0, 0.65);
      }

      .api-key {
        min-width: 360px;
        gap: 12px;
        padding: 0 22px;
        color: rgba(246, 245, 236, 0.86);
        font-family: Geist Mono, ui-monospace, monospace;
        font-size: 18px;
      }

      .api-key strong {
        color: #f5d386;
        font-family: Geist, ui-sans-serif, system-ui, sans-serif;
        font-size: 20px;
      }

      .pill {
        gap: 10px;
        padding: 0 24px;
        color: #f6f5ec;
        font-size: 20px;
        font-weight: 650;
      }

      .hero {
        position: absolute;
        top: 286px;
        left: 50%;
        width: 1220px;
        transform: translateX(-50%);
        text-align: center;
      }

      h1 {
        margin: 0;
        color: #f6f5ec;
        font-family: Georgia, ui-serif, serif;
        font-size: 136px;
        font-weight: 400;
        line-height: 0.94;
        letter-spacing: 0;
        text-wrap: balance;
        text-shadow: 0 24px 70px rgba(0, 0, 0, 0.62);
      }

      .composer {
        position: absolute;
        left: 50%;
        bottom: 132px;
        width: 1500px;
        min-height: 284px;
        transform: translateX(-50%);
        border: 1px solid rgba(246, 245, 236, 0.2);
        border-radius: 28px;
        background: rgba(23, 24, 23, 0.93);
        box-shadow:
          0 0 0 1px rgba(246, 245, 236, 0.04),
          0 24px 80px -24px rgba(0, 0, 0, 0.75);
      }

      .prompt {
        min-height: 150px;
        padding: 46px 48px 18px;
        color: rgba(216, 222, 210, 0.54);
        font-size: 30px;
        line-height: 1.3;
      }

      .controls {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 36px 34px;
      }

      .control {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 58px;
        border: 1px solid rgba(246, 245, 236, 0.1);
        border-radius: 999px;
        background: rgba(8, 15, 9, 0.72);
        color: rgba(246, 245, 236, 0.84);
        font-size: 25px;
        font-weight: 550;
      }

      .square {
        width: 58px;
      }

      .wide {
        min-width: 246px;
        padding: 0 28px;
        justify-content: flex-start;
      }

      .medium {
        min-width: 154px;
      }

      .stepper {
        min-width: 190px;
        gap: 26px;
        color: #f5d386;
        font-weight: 700;
      }

      .minus,
      .plus {
        color: rgba(246, 245, 236, 0.72);
        font-weight: 500;
      }

      .spacer {
        flex: 1;
      }

      .images {
        color: rgba(216, 222, 210, 0.64);
        font-size: 24px;
        font-weight: 550;
      }

      .send {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        background: #f6f5ec;
        color: #070907;
        font-size: 36px;
        line-height: 1;
      }
    </style>
  </head>
  <body>
    <main class="frame">
      <div class="gallery">${tiles}</div>
      <div class="shade"></div>
      <div class="dot-grid"></div>

      <nav class="nav">
        <div class="brand">
          <div class="mark">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M9.7 27.6C5.8 22.3 7.1 14.5 13.1 10.3c5.8-4 14.7-3.6 19 1.1 4.3 4.6 3 11.4-2.5 13.3-1.5.5-3 .3-4.4-.4-1.9-.9-4.1.2-4.8 2.2l-.5 1.5c-1 3-4.4 4.4-7.1 2.9-1.2-.7-2.2-1.8-3.1-3.3Z" fill="#F5D386" />
              <circle cx="14.8" cy="17.2" r="2.25" fill="#070907" />
              <circle cx="22.3" cy="14.8" r="2" fill="#070907" />
              <circle cx="28.3" cy="20.1" r="2.25" fill="#070907" />
              <path d="M12.1 28.2c8.1-2.2 14.4-8.4 19-18.6" stroke="#F6F5EC" stroke-linecap="round" stroke-width="3.4" />
              <path d="M29.7 8.1 34 5.8l-1.9 4.6" stroke="#F6F5EC" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6" />
            </svg>
          </div>
          <div class="name">Hive Painter</div>
          <div class="powered">Powered by Together.ai</div>
        </div>
        <div class="actions">
          <div class="api-key"><strong>key</strong> Paste Together key</div>
          <div class="source">100% free and <span>open source</span></div>
          <div class="pill">GitHub</div>
          <div class="pill">Twitter</div>
        </div>
      </nav>

      <section class="hero">
        <h1>Describe an image, then run it across models.</h1>
      </section>

      <section class="composer">
        <div class="prompt">Describe your image...</div>
        <div class="controls">
          <div class="control square">+</div>
          <div class="control wide">2 models</div>
          <div class="control medium">1:1</div>
          <div class="control stepper"><span class="minus">-</span><span>1x</span><span class="plus">+</span></div>
          <div class="spacer"></div>
          <div class="images">2 images</div>
          <div class="send">&#8593;</div>
        </div>
      </section>
    </main>
  </body>
</html>`;

await mkdir(tempDir, { recursive: true });
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(tempHtmlPath, html);
await rm(chromeProfilePath, { recursive: true, force: true });

const chromeArgs = [
  "--headless=new",
  "--disable-gpu",
  "--disable-background-networking",
  "--disable-component-update",
  "--disable-sync",
  "--hide-scrollbars",
  "--metrics-recording-only",
  "--no-default-browser-check",
  "--no-first-run",
  "--allow-file-access-from-files",
  `--user-data-dir=${chromeProfilePath}`,
  "--window-size=2400,1260",
  `--screenshot=${outputPath}`,
  pathToFileURL(tempHtmlPath).href,
];

await new Promise((resolvePromise, rejectPromise) => {
  let settled = false;
  const child = spawn(chromePath, chromeArgs, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  function finishAfterScreenshot() {
    if (settled) return;
    settled = true;
    setTimeout(() => {
      child.kill("SIGTERM");
      resolvePromise();
    }, 500);
  }

  function forwardOutput(chunk) {
    const text = chunk.toString();
    process.stderr.write(text);
    if (text.includes("bytes written to file")) {
      finishAfterScreenshot();
    }
  }

  child.stdout.on("data", forwardOutput);
  child.stderr.on("data", forwardOutput);
  child.on("error", rejectPromise);
  child.on("exit", (code) => {
    if (settled) return;
    if (code === 0) {
      settled = true;
      resolvePromise();
    } else {
      settled = true;
      rejectPromise(new Error(`Chrome exited with code ${code}`));
    }
  });
});

await rm(tempDir, { recursive: true, force: true }).catch(() => {});
console.log(`Rendered ${outputPath}`);
