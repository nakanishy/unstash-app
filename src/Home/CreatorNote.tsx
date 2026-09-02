import clsx from "clsx";
import type { PropsWithClassName } from "../types";

export function CreatorNote(props: PropsWithClassName) {
  return (
    <section
      className={clsx(
        "mb-12 max-w-[700px] mx-auto p-8",
        "bg-white-subtle rounded-[12px]",
        props.className,
      )}

      style={{ fontFamily: "Cambay" }}
    >
      <div className="text-4 leading-[1.4]">
        <div className="text-7 font-bold leading-[1.2]">
          Crafted in Japan 🇯🇵 with love and care.
        </div>
        <div className="mt-6 text-fg2">
          <p>
            I’ve been building software for many years, and began making music a
            few years ago. As I searched through thousands of samples, I often
            wished for a more flexible search — and a little more surprise.
            That’s why I built Unstash.
          </p>
          <p className="mt-5">
            After countless experiments and redesigning the app from the ground
            up about eight times, it has become what it is today. It’s still
            evolving, but I hope it helps you spend less time searching and more
            time making music, while discovering sounds that spark new ideas.
          </p>
          <p className="mt-5">
            I hope Unstash becomes a small but meaningful part of your creative
            process.
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
