export default function Logo() {
  return (
    <a
      href="/"
      className="inline-flex min-w-0 items-center gap-3 text-gray-100"
      aria-label="Hive Painter"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-md border border-honey-300/40 bg-gray-500 shadow-tile">
        <span className="absolute inset-[7px] bg-honey-300 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]" />
        <span className="relative size-2 rounded-full bg-gray-600" />
      </span>
      <span className="truncate text-lg font-semibold tracking-normal">
        Hive Painter
      </span>
    </a>
  );
}
