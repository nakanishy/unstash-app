import type { PropsWithChildren, ReactNode } from "react";
import { Centering } from "../components/Centering";
import { ShimmerText } from "../components/ShimmerText";
import { Search } from "../icons/Search";
import type { PropsWithClassName } from "../types";

export function SearchEngine(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <section className="mt-12 px-5 md:mt-16 lg:mt-32 lg:px-8">
        <h1 className="text-7 leading-[1.2] text-fg1 font-bold sm:text-8">
          One box. A real{" "}
          <ShimmerText
            baseColor="#ffffff99"
            highlightColor="#fffffff0"
            duration={1.8}
          >
            Search Engine.
          </ShimmerText>
        </h1>
        <p className="mt-4 text-4 text-fg2">
          No AI gimmicks—just sharp, flexible search.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-6">
          <div>
            <Heading>Fuzzy Search</Heading>
            <Description>
              Find relevant results even when your search term is incomplete or
              slightly different.
            </Description>
            <Example query="ki" description="kick" />
          </div>
          <div>
            <Heading>OR</Heading>
            <Description>
              Search for results that match either of multiple terms.
            </Description>
            <SearchResultList
              query="snap or clap"
              items={[
                {
                  value: "eby_snap_02.wav",
                  matches: [
                    {
                      start: 4,
                      end: 8,
                    },
                  ],
                },
                {
                  value: "TINY CLAP on the HELL.wav",
                  matches: [
                    {
                      start: 5,
                      end: 9,
                    },
                  ],
                },
              ]}
            />
          </div>
          <div>
            <Heading>NOT</Heading>
            <Description>Remove unwanted results from your search.</Description>
            <SearchResultList
              query="snap or clap"
              items={[
                {
                  value: "eby_snap_02.wav",
                  matches: [
                    {
                      start: 4,
                      end: 8,
                    },
                  ],
                },
                {
                  value: "TINY CLAP on the HELL.wav",
                  matches: [
                    {
                      start: 5,
                      end: 9,
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </section>
    </Centering>
  );
}

function Heading(props: PropsWithChildren) {
  return <h2 className="font-bold text-fg1 text-5">{props.children}</h2>;
}
function Description(props: PropsWithChildren) {
  return <p className="mt-2 mb-4 text-fg2">{props.children}</p>;
}

function Example(props: { query: string; description: string }) {
  return (
    <div className="p-4 bg-white-very-subtle rounded-[12px]">
      <div className="flex items-center gap-2">
        <Search size={20} color={"#ffffff99"} />
        <span className="text-fg1">{props.query}</span>
      </div>
      <div className="text-fg2">{props.description}</div>
    </div>
  );
}

type MatchRange = {
  start: number;
  end: number;
};

type SearchItem = {
  value: string;
  matches: MatchRange[];
};

type SearchResultListProps = {
  query: string;
  items: SearchItem[];
};

function mergeRanges(value: string, matches: MatchRange[]): MatchRange[] {
  const ranges = matches
    .map(({ start, end }) => ({
      start: Math.max(0, Math.min(start, value.length)),
      end: Math.max(0, Math.min(end, value.length)),
    }))
    .filter(({ start, end }) => start < end)
    .sort((a, b) => a.start - b.start);

  return ranges.reduce<MatchRange[]>((merged, current) => {
    const previous = merged[merged.length - 1];

    if (!previous || current.start > previous.end) {
      merged.push(current);
      return merged;
    }

    previous.end = Math.max(previous.end, current.end);
    return merged;
  }, []);
}

function HighlightedText({
  value,
  matches,
}: {
  value: string;
  matches: MatchRange[];
}) {
  const ranges = mergeRanges(value, matches);
  const result: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, index) => {
    if (cursor < range.start) {
      result.push(
        <span key={`text-${index}`}>{value.slice(cursor, range.start)}</span>,
      );
    }

    result.push(
      <mark
        key={`match-${index}`}
        className="
          rounded-sm
          bg-yellow-300/25
          px-0.5
          text-yellow-100
        "
      >
        {value.slice(range.start, range.end)}
      </mark>,
    );

    cursor = range.end;
  });

  if (cursor < value.length) {
    result.push(<span key="text-last">{value.slice(cursor)}</span>);
  }

  return <>{result}</>;
}

export function SearchResultList({ query, items }: SearchResultListProps) {
  return (
    <section
      aria-label={`${query}`}
      className="
        w-full
        max-w-[475px]
        overflow-hidden
        rounded-[8px]
        bg-white-very-subtle
        px-5
        py-3
      "
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-3 text-fg1">
          <Search size={20} color="#ffffff99" className="shrink-0" />
          <span>{query}</span>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={`${item.value}-${index}`}
              className="
                text-2
                leading-6
                text-fg2
              "
            >
              <HighlightedText value={item.value} matches={item.matches} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
