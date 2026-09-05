import clsx from "clsx";
import type { PropsWithClassName } from "../types";

export function CreatorNote(props: PropsWithClassName) {
  return (
    <section
      className={clsx(
        "mx-5 mb-12 max-w-[700px] p-5 sm:mx-auto sm:p-8",
        "rounded-[12px] bg-white-very-subtle",
        props.className,
      )}

      style={{ fontFamily: "Cambay" }}
    >
      <div className="text-4 leading-[1.4]">
        <div className="text-6 font-bold leading-[1.2] sm:text-7">
          Crafted in Japan 🇯🇵 with love and care.
        </div>
        <div className="mt-6 text-fg2">
          <p>
            I’ve been building software for many years, and started making music
            a few years ago. While searching through hundreds of thousands of
            samples, I often wished for a more flexible way to search—and a
            little more surprise. That’s why I built Unstash.
          </p>
          <p className="mt-5">
            After countless experiments and redesigning the app from the ground
            up around eight times, it has gradually become what it is today.
          </p>
          <p className="mt-5">
            I hope Unstash can become a small but meaningful part of your
            creative process.
          </p>
        </div>
        <a
          className="block mt-6"
          href="https://nakanishy.com"
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex items-center gap-[16px]">
            <img
              className="block size-[50px] rounded-[14px]"
              src="/images/naka.jpg"
              alt="naka"
            />
            <div>
              naka
              <div className="text-fg2 text-2">
                Software Dev & Music Producer
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
