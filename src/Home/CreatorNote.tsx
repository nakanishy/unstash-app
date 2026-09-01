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
        <div className="mt-6 max-w-[550px] text-fg2">
          <div>
            I created Unstash because I love both music and building software.
          </div>
          <div className="mt-4">
            I hope it makes your creative process a little smoother and sparks
            inspiration when you’re making something new.
          </div>
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
