import { Header } from "../components/Header";
import { CreatorNote } from "./CreatorNote";
import { Details } from "./Details";
import { Hero } from "./Hero";
import { NotManager } from "./NotManager";
import { Steps } from "./Steps";

export function Home() {
  return (
    <div className="w-full min-h-full h-auto text-fg1 bg-black">
      <Header />
      <Hero />
      <NotManager />
      <Steps className="mt-8" />
      <Details />
      <CreatorNote />
    </div>
  );
}
