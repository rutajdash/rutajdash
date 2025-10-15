import * as motion from "motion/react-client";

export default function ChatBottomBar() {
  return (
    <motion.div
      key="chat-bottom-bar"
      className="flex flex-row justify-center px-6 py-3"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{
        delay: 0.5,
        mass: 1,
        stiffness: 150,
        damping: 10,
        type: "spring",
      }}
    >
      <div className="bg-primary-container flex h-14 w-full max-w-2xs flex-row items-center justify-evenly rounded-full">
        <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-auto cursor-pointer items-center justify-center rounded-full p-1 transition-colors duration-200 ease-in-out">
          <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
            home
          </span>
        </div>
        <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-full w-auto cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out">
          <span className="material-symbols-rounded text-3xl transition-all duration-200 ease-in-out">
            mic
          </span>
        </div>
        <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-auto cursor-pointer items-center justify-center rounded-full p-1 transition-colors duration-200 ease-in-out">
          <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
            help
          </span>
        </div>
      </div>
    </motion.div>
  );
}
