import { Header } from "../components/Header";
import { Hero } from "./Hero";

export function Home() {
  return (
    <div className="size-full text-fg1 bg-black">
      <Header />
      <Hero />
    </div>
  );
}
