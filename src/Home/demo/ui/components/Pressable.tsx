import clsx from "clsx";
import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  padding?: number;
  className?: string;
};

export function Pressable({ padding = 0, ...props }: Props) {
  return (
    <motion.div
      className={clsx("cursor-pointer", props.className)}
      onClick={props.onClick}
      style={{
        boxSizing: "content-box",
        padding,
      }}
      initial={{
        scale: 1,
      }}
      whileHover={{
        scale: 1.02,
      }}
    >
      {props.children}
    </motion.div>
  );
}
