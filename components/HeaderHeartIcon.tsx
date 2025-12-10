// Bu ikon, sadece Header'da statik olarak gösterilecektir.
export default function HeaderHeartIcon() {
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.318a4.5 4.5 0 010-6.364z" 
      />
    </svg>
  );
}