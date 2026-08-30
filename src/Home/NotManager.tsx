import clsx from "clsx";
import { Centering } from "../components/Centering";

export function NotManager() {
  return (
    <div>
      <Centering>
        <section className={clsx("px-8")}>
          <h1 className="text-8 leading-[1] text-fg1 font-bold text-center uppercase">
            Not another{" "}
            <span className="px-4 text-black bg-fg1">sample manager</span>
          </h1>
          <p className="mt-3 text-center text-5 text-fg2">
            A sample finder, built for the moment you need a sound.
          </p>
        </section>
      </Centering>
    </div>
  );
}
