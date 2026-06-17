import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const iconPath = join(root, "app", "icon.png");
const faviconPath = join(root, "app", "favicon.ico");
const tempDir = join(tmpdir(), "hive-painter-icons");
const tempHtmlPath = join(tempDir, "icon.html");
const chromeProfilePath = join(tempDir, "chrome-profile");
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        width: 128px;
        height: 128px;
        overflow: hidden;
        background: #070907;
      }

      .icon {
        width: 128px;
        height: 128px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 30px;
        background: #070907;
      }
    </style>
  </head>
  <body>
    <div class="icon">
      <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="128" height="128" rx="30" fill="#070907" />
        <rect x="8" y="8" width="112" height="112" rx="24" fill="#111711" stroke="#F5D386" stroke-opacity="0.42" stroke-width="3" />
        <g transform="translate(18 17) scale(2.35)">
          <path d="M9.7 27.6C5.8 22.3 7.1 14.5 13.1 10.3c5.8-4 14.7-3.6 19 1.1 4.3 4.6 3 11.4-2.5 13.3-1.5.5-3 .3-4.4-.4-1.9-.9-4.1.2-4.8 2.2l-.5 1.5c-1 3-4.4 4.4-7.1 2.9-1.2-.7-2.2-1.8-3.1-3.3Z" fill="#F5D386" />
          <circle cx="14.8" cy="17.2" r="2.25" fill="#070907" />
          <circle cx="22.3" cy="14.8" r="2" fill="#070907" />
          <circle cx="28.3" cy="20.1" r="2.25" fill="#070907" />
          <path d="M12.1 28.2c8.1-2.2 14.4-8.4 19-18.6" stroke="#F6F5EC" stroke-width="3.4" stroke-linecap="round" />
          <path d="M29.7 8.1 34 5.8l-1.9 4.6" stroke="#F6F5EC" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
    </div>
  </body>
</html>`;

function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.on("error", rejectPromise);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

async function renderPng() {
  await mkdir(tempDir, { recursive: true });
  await writeFile(tempHtmlPath, html);
  await rm(chromeProfilePath, { recursive: true, force: true }).catch(() => {});

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
    "--force-device-scale-factor=1",
    `--user-data-dir=${chromeProfilePath}`,
    "--window-size=128,128",
    `--screenshot=${iconPath}`,
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
}

await renderPng();
await run("sips", ["-s", "format", "ico", iconPath, "--out", faviconPath]);
await rm(tempDir, { recursive: true, force: true }).catch(() => {});

console.log(`Rendered ${iconPath}`);
console.log(`Rendered ${faviconPath}`);
