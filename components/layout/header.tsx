import GithubIcon from "@/components/icons/github-icon";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  userAPIKey: string;
  onAPIKeyChange: (key: string) => void;
};

export function Header({ userAPIKey, onAPIKeyChange }: HeaderProps) {
  return (
    <header className="relative z-50 grid grid-cols-1 items-center gap-4 py-4 text-sm text-gray-200 md:grid-cols-[1fr_auto_1fr]">
      <p className="hidden whitespace-nowrap text-gray-200/85 md:block">
        Powered by{" "}
        <a
          href="https://togetherai.link/?utm_source=hive-painter&utm_medium=referral&utm_campaign=example-app"
          target="_blank"
          className="underline underline-offset-4 transition hover:text-emerald-300"
        >
          Together.ai
        </a>
      </p>

      <div className="justify-self-center md:col-start-2">
        <Logo />
      </div>

      <nav className="flex min-w-0 flex-wrap items-end justify-center gap-3 md:justify-end">
        <div className="w-full min-w-[220px] max-w-[300px] sm:w-[280px]">
          <label className="mb-1 block truncate text-xs text-gray-200/85">
            [Optional] Add your{" "}
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-emerald-300"
            >
              Together API Key
            </a>
          </label>
          <Input
            type="password"
            value={userAPIKey}
            placeholder="API Key"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => onAPIKeyChange(e.target.value)}
            className="h-10 border-gray-300/35 bg-gray-500 text-gray-100 placeholder:text-gray-200/45 focus-visible:ring-emerald-300/35"
          />
        </div>
        <a
          href="https://github.com/CPJ-N/hive-painter"
          target="_blank"
          className="hidden whitespace-nowrap pb-2 text-gray-200/85 underline underline-offset-4 transition hover:text-emerald-300 lg:inline"
        >
          Open source
        </a>
        <a
          href="https://github.com/CPJ-N/hive-painter"
          target="_blank"
          className="pb-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 border-gray-300/35 bg-gray-500 text-gray-100 shadow-none hover:border-emerald-300/50 hover:bg-gray-400 hover:text-emerald-300"
          >
            <GithubIcon className="size-4" />
            GitHub
          </Button>
        </a>
      </nav>
    </header>
  );
}
