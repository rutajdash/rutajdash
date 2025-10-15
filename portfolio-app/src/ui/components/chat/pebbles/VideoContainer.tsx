import styles from "./Video.module.css";

export default function PebblesVideoContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.videoContainer} p-6`}>
      <div className="rounded-4xl">{children}</div>
    </div>
  );
}
