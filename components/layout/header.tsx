import GithubIcon from "@/components/icons/github-icon";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, KeyRound } from "lucide-react";

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
          <a
            href="https://togetherai.link/?utm_source=hive-painter&utm_medium=referral&utm_campaign=example-app"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-gray-100/10 bg-gray-500/70 px-3 py-2 text-sm text-gray-200 transition hover:border-moss-300/40 hover:text-moss-300 md:inline-flex"
          >
            Powered by Together.ai
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
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
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-gray-100/10 bg-gray-500/80 text-gray-200 shadow-none hover:border-moss-300/40 hover:bg-gray-400 hover:text-moss-300 md:inline-flex"
            >
              <a
                href="https://github.com/CPJ-N/hive-painter"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 size-3.5" aria-hidden="true" />
                Open source
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gray-100/10 bg-gray-500/80 text-gray-100 shadow-none hover:border-honey-300/40 hover:bg-gray-400 hover:text-honey-300"
            >
              <a
                href="https://github.com/CPJ-N/hive-painter"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="mr-2 size-4" />
                GitHub
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
