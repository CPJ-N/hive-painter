import GithubIcon from "@/components/icons/github-icon";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

const GITHUB_URL = "https://github.com/CPJ-N/hive-painter";
const TWITTER_SHARE_URL =
  "https://twitter.com/intent/tweet?text=Hive%20Painter%20-%20bulk%20AI%20image%20generation%20across%20models&url=https%3A%2F%2Fgithub.com%2FCPJ-N%2Fhive-painter";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.53 3h3.28l-7.16 8.18L22 21h-6.55l-5.13-6.7L4.45 21H1.17l7.66-8.75L.82 3h6.72l4.64 6.13L17.53 3Zm-1.15 16.27h1.82L6.55 4.64H4.6l11.78 14.63Z" />
    </svg>
  );
}

type HeaderProps = {
  userAPIKey: string;
  onAPIKeyChange: (key: string) => void;
  floating?: boolean;
};

export function Header({
  userAPIKey,
  onAPIKeyChange,
  floating = false,
}: HeaderProps) {
  return (
    <header
      className={
        floating
          ? "absolute inset-x-0 top-0 z-50"
          : "sticky top-0 z-50 border-b border-gray-100/10 bg-gray-600"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <Logo />
          <p className="hidden whitespace-nowrap text-sm text-gray-200/80 md:block">
            Powered by Together.ai
          </p>
        </div>

        <nav className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-100/10 bg-gray-500/90 px-3 py-2 shadow-tile sm:w-[320px] sm:flex-none">
            <KeyRound
              className="size-4 shrink-0 text-honey-300"
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="together-api-key">
              Together API Key
            </label>
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              rel="noreferrer"
              className="hidden shrink-0 text-xs font-medium text-gray-200 transition hover:text-honey-300 sm:inline"
            >
              API key
            </a>
            <Input
              id="together-api-key"
              type="password"
              value={userAPIKey}
              placeholder="Paste Together key"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => onAPIKeyChange(e.target.value)}
              className="h-7 min-w-0 border-0 bg-transparent px-0 py-0 font-mono text-xs text-gray-100 shadow-none placeholder:text-gray-300/60 focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="hidden whitespace-nowrap text-sm text-gray-200/80 lg:block">
              100% free and{" "}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 transition hover:text-honey-300"
              >
                open source
              </a>
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gray-100/10 bg-gray-500/80 text-gray-100 shadow-none hover:border-honey-300/40 hover:bg-gray-400 hover:text-honey-300"
            >
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <GithubIcon className="mr-2 size-4" />
                GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gray-100/10 bg-gray-500/80 text-gray-100 shadow-none hover:border-moss-300/40 hover:bg-gray-400 hover:text-moss-300"
            >
              <a href={TWITTER_SHARE_URL} target="_blank" rel="noreferrer">
                <XIcon className="mr-2 size-4" />
                Twitter
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
