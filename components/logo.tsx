import BrandMark from "@/components/brand-mark";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex min-w-0 items-center gap-3 text-gray-100"
      aria-label="Hive Painter"
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border border-honey-300/40 bg-gray-500/90 shadow-[inset_0_0_0_1px_rgba(246,245,236,0.05),0_10px_28px_-14px_rgba(245,211,134,0.65)] transition group-hover:border-honey-300/60">
        <BrandMark className="size-8 drop-shadow-[0_8px_18px_rgba(245,211,134,0.28)]" />
      </span>
      <span className="truncate text-xl font-semibold tracking-normal text-gray-100">
        Hive Painter
      </span>
    </Link>
  );
}
