import type { PropsWithChildren } from "react";
import { LP_WIDTH } from "../variables";
import clsx from "clsx";

type CenteringProps = {
  width?: number;
  className?: string;
};

export function Centering(props: PropsWithChildren<CenteringProps>) {
  return (
    <div
      className={clsx("mx-auto", props.className)}
      style={{
        maxWidth: props.width ? props.width : LP_WIDTH,
      }}
    >
      {props.children}
    </div>
  );
}
