import { CreatorNote } from "./CreatorNote";
import { Details } from "./Details";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { GetEarlyAccess } from "./GetEarlyAccess";
import { Steps } from "./Steps";

export function Home() {
  return (
    <div className="w-full min-h-full h-auto text-fg1 bg-black">
      <Hero />
      <Steps className="mt-0" />
      <Details />
      <GetEarlyAccess className="mt-40" />
      <CreatorNote className="mt-40" />
      <Footer className="mt-20" />
    </div>
  );
}
