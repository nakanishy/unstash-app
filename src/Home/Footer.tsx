import clsx from "clsx";
import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";
import type { PropsWithChildren } from "react";

export function Footer(props: PropsWithClassName) {
  return (
    <Centering className={clsx("px-8", props.className)}>
      <footer
        className={clsx(
          "flex items-center h-[100px]",
          "border-t border-white/40",
        )}
      >
        <small className="text-4 text-fg2">&copy; 2026 Unstash</small>
        <div className="ml-6">
          <Link href="https://x.com/unstashapp">X/Twitter</Link>
        </div>
      </footer>
    </Centering>
  );
}

function Link(props: PropsWithChildren<{ href: string }>) {
  return (
    <a href={props.href} target="_blank" className="">
      {props.children}
    </a>
  );
}
