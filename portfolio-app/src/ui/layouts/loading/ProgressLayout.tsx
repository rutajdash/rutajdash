import * as motion from "motion/react-client";

export default function LoadingProgressLayout({
  loadingPercentage,
}: {
  loadingPercentage: number;
}) {
  return (
    <>
      <motion.div
        key="loading-progress-layout"
        className="flex h-auto w-full flex-1 flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        <svg
          className="text-primary mb-8 w-1/6 max-w-[100px] animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          ></path>
        </svg>
        <h1 className="text-on-surface font-heading mb-2 text-center text-2xl font-bold">
          Connecting to Mr. Dash&apos;s Office
        </h1>
        <p className="text-on-surface font-subheading text-center text-base">
          Please wait a moment.
        </p>
        <div className="mt-8 w-full max-w-xs px-2">
          <div className="bg-primary/20 h-2.5 w-full rounded-full">
            <motion.div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${loadingPercentage}%` }}
            ></motion.div>
          </div>
        </div>
      </motion.div>
      <div className="h-40 w-full"></div>
    </>
  );
}
