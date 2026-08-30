import { LP_WIDTH } from "../variables";

export function Header() {
  return (
    <header
      className="flex items-center justify-between mx-auto px-8 h-[70px]"
      style={{
        width: LP_WIDTH,
      }}
    >
      <h1 className="text-5 font-bold text-white/90">Unstash</h1>
    </header>
  );
}
