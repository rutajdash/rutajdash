import * as motion from "motion/react-client";

export default function LoadingErrorLayout() {
  return (
    <>
      <div className="h-40 w-full"></div>
      <motion.div
        key="loading-error-layout"
        className="flex h-auto w-full flex-1 flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        <h1 className="text-on-surface font-heading mb-2 text-center text-2xl font-bold">
          Mr. Dash&apos;s Office is on Break
        </h1>
        <p className="text-on-surface font-subheading text-center text-base">
          Pebbles is offline right now.
          <br />
          Call again later!
        </p>
      </motion.div>
      <motion.div
        key="loading-error-subtext"
        className="flex h-40 w-full flex-col items-center justify-end px-6 pb-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <p className="text-on-surface font-subheading text-center text-sm">
          There was an error connecting.
          <br />
          Please try again later.
        </p>
      </motion.div>
    </>
  );
}
