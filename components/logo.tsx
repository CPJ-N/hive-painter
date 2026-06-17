export default function Logo() {
  return (
    <a
      href="/"
      className="group inline-flex min-w-0 items-center gap-3 text-gray-100"
      aria-label="Hive Painter"
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border border-honey-300/40 bg-gray-500/90 shadow-[inset_0_0_0_1px_rgba(246,245,236,0.05),0_10px_28px_-14px_rgba(245,211,134,0.65)] transition group-hover:border-honey-300/60">
        <span className="absolute inset-[8px] bg-honey-300 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]" />
        <span className="relative size-2.5 rounded-full bg-gray-600 ring-2 ring-gray-600/80" />
      </span>
      <span className="truncate text-xl font-semibold tracking-normal text-gray-100">
        Hive Painter
      </span>
    </a>
  );
}
