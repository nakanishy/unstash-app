import { Header } from "../components/Header";
import { Hero } from "./Hero";
import { Steps } from "./Steps";

export function Home() {
  return (
    <div className="w-full min-h-full h-auto text-fg1 bg-black">
      <Header />
      <Hero />
      <Steps />
    </div>
  );
}
