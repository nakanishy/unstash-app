import type { PropsWithClassName } from "../types";
import { Centering } from "./Centering";

export function Header(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <header className="flex items-center justify-between px-8 h-[70px]">
        <h1 className="text-5 font-bold text-white/90">Unstash</h1>
      </header>
    </Centering>
  );
}
