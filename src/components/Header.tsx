import type { PropsWithClassName } from "../types";
import { Centering } from "./Centering";

export function Header(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <header className="flex items-center justify-between px-8 h-[70px]">
        <div className="flex items-center gap-4">
          <img
            className="block size-[24px]"
            src="/images/unstash.svg"
            alt="Unstash"
          />
          <h1 className="text-5 font-bold text-white/90">Unstash</h1>
        </div>
      </header>
    </Centering>
  );
}
