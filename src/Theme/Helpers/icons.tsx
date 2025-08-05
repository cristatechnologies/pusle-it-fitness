// components/payment-status/icons.tsx
"use client";

export const SuccessIcon = () => (
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
    <svg
      className="w-8 h-8 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
);

export const FailureIcon = () => (
  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
    <svg
      className="w-8 h-8 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </div>
);

export const PendingIcon = () => (
  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
    <svg
      className="w-8 h-8 text-yellow-600 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);
