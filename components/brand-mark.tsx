type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M9.7 27.6C5.8 22.3 7.1 14.5 13.1 10.3c5.8-4 14.7-3.6 19 1.1 4.3 4.6 3 11.4-2.5 13.3-1.5.5-3 .3-4.4-.4-1.9-.9-4.1.2-4.8 2.2l-.5 1.5c-1 3-4.4 4.4-7.1 2.9-1.2-.7-2.2-1.8-3.1-3.3Z"
        fill="#F5D386"
      />
      <circle cx="14.8" cy="17.2" r="2.25" fill="#070907" />
      <circle cx="22.3" cy="14.8" r="2" fill="#070907" />
      <circle cx="28.3" cy="20.1" r="2.25" fill="#070907" />
      <path
        d="M12.1 28.2c8.1-2.2 14.4-8.4 19-18.6"
        stroke="#F6F5EC"
        strokeLinecap="round"
        strokeWidth="3.4"
      />
      <path
        d="M29.7 8.1 34 5.8l-1.9 4.6"
        stroke="#F6F5EC"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}
