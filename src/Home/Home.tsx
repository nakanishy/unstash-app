import { CreatorNote } from "./CreatorNote";
import { Details } from "./Details";
import { Footer } from "./Footer";
import { GetEarlyAccess } from "./GetEarlyAccess";
import { Hero } from "./Hero";
import { NotManager } from "./NotManager";
import { Steps } from "./Steps";

export function Home() {
  return (
    <div className="w-full min-h-full h-auto text-fg1 bg-black">
      <Hero />
      <Details />
      <Steps className="mt-0" />
      <GetEarlyAccess className="mt-8" />
      <NotManager />
      <CreatorNote className="mt-18" />
      <Footer className="mt-20" />
    </div>
  );
}
