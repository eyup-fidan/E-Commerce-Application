// Bu ikon, "güncelleme/düzenleme" işlemini temsil eder.
export default function PencilIcon() {
  return (
    <svg 
      className="w-4 h-4" // Boyutu küçülttük
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" 
      />
    </svg>
  );
}