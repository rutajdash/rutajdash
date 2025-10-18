import GitHubLogo from "@/assets/logos/github-logo-dark.svg";
import RDLogo from "@/assets/logos/rd-logo-dark.svg";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";

export default function ChatHeader() {
  return (
    <div className="px-6 py-2">
      <div className="flex h-16 w-full flex-row items-center justify-between">
        <Image
          src={RDLogo}
          alt="Rutaj Dash Logo"
          className="h-full w-auto py-1"
          priority
        />
        <div className="flex h-full w-auto flex-row items-center justify-end">
          <motion.div
            className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-full w-auto cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{
              mass: 1,
              stiffness: 100,
              damping: 10,
              type: "spring",
            }}
          >
            <Link
              href="https://github.com/rutajdash"
              target="_blank"
              prefetch={false}
            >
              <Image
                src={GitHubLogo}
                alt="GitHub Logo"
                className="h-full w-auto p-4"
                priority
              />
            </Link>
          </motion.div>
          <motion.div
            className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-full w-auto cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{
              mass: 1,
              stiffness: 100,
              damping: 10,
              type: "spring",
            }}
          >
            <Link
              href="/help"
              prefetch={true}
              className="flex h-full items-center justify-center"
            >
              <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
                help
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
