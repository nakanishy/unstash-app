import { CreatorNote } from "./CreatorNote";
import { Details } from "./Details";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { SearchEngine } from "./SearchEngine";
import { Steps } from "./Steps";

export function Home() {
  return (
    <div className="min-h-full w-full overflow-x-hidden bg-black text-fg1">
      <Hero />
      <Steps className="mt-0" />
      <Details />
      <SearchEngine />
      <CreatorNote className="mt-20" />
      <Footer className="mt-20" />
    </div>
  );
}
