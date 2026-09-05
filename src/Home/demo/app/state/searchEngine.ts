export type MockSample = {
  name: string;
  key?: string;
};

type RawQueryToken = {
  value: string;
  quoted: boolean;
};

type NormalizedKey = {
  pitchClass: number;
  mode: "any" | "major" | "minor";
};

type SearchTerm =
  | {
      kind: "text";
      exact: boolean;
      patterns: string[][];
    }
  | {
      kind: "range";
      min: number;
      max: number;
    }
  | {
      kind: "key";
      key: NormalizedKey;
    }
  | {
      kind: "invalid";
    };

type ParsedQuery = {
  required: SearchTerm[][];
  excluded: SearchTerm[];
};

type SearchDocument = {
  tokens: string[];
  numbers: number[];
  key: NormalizedKey | null;
};

const WORD_SEPARATOR = /[\s_./-]+/u;
const NUMBER_RANGE = /^(\d+)-(\d+)$/u;
const KEY_PATTERN = /^key:(.+)$/iu;

const SMART_ALIASES: Record<string, string[]> = {
  hihat: ["hihat", "hats", "hi-hat", "hh"],
};

const PITCH_CLASSES: Record<string, number> = {
  c: 0,
  "b#": 0,
  "c#": 1,
  db: 1,
  d: 2,
  "d#": 3,
  eb: 3,
  e: 4,
  fb: 4,
  f: 5,
  "e#": 5,
  "f#": 6,
  gb: 6,
  g: 7,
  "g#": 8,
  ab: 8,
  a: 9,
  "a#": 10,
  bb: 10,
  b: 11,
  cb: 11,
};

export function searchMockSamples(
  samples: readonly MockSample[],
  query: string,
): MockSample[] {
  const parsedQuery = parseQuery(query);

  if (!parsedQuery) {
    return [];
  }

  return samples.filter((sample) => {
    const document = createSearchDocument(sample);
    const hasRequiredTerms = parsedQuery.required.every((group) =>
      group.some((term) => matchesTerm(term, document)),
    );
    const hasExcludedTerm = parsedQuery.excluded.some((term) =>
      matchesTerm(term, document),
    );

    return hasRequiredTerms && !hasExcludedTerm;
  });
}

function parseQuery(query: string): ParsedQuery | null {
  const tokens = tokenizeQuery(query);

  if (tokens.length === 0) {
    return null;
  }

  const required: SearchTerm[][] = [];
  const excluded: SearchTerm[] = [];
  let currentOrGroup: SearchTerm[] = [];
  let joinsWithOr = false;
  let excludesNext = false;

  const flushOrGroup = () => {
    if (currentOrGroup.length > 0) {
      required.push(currentOrGroup);
      currentOrGroup = [];
    }
  };

  for (const token of tokens) {
    const operator = token.quoted ? null : token.value.toLowerCase();

    if (operator === "or") {
      joinsWithOr = true;
      continue;
    }

    if (operator === "not") {
      joinsWithOr = false;
      excludesNext = true;
      continue;
    }

    const { value, excluded: hasPrefixExclusion } = removeExclusionPrefix(
      token,
    );
    const terms = createTerms({ value, quoted: token.quoted });

    if (terms.length === 0) {
      joinsWithOr = false;
      excludesNext = false;
      continue;
    }

    if (excludesNext || hasPrefixExclusion) {
      excluded.push(...terms);
      joinsWithOr = false;
      excludesNext = false;
      continue;
    }

    for (const [index, term] of terms.entries()) {
      if (index === 0 && joinsWithOr && currentOrGroup.length > 0) {
        currentOrGroup.push(term);
      } else {
        flushOrGroup();
        currentOrGroup.push(term);
      }

      joinsWithOr = false;
    }
  }

  flushOrGroup();

  if (required.length === 0 && excluded.length === 0) {
    return null;
  }

  return { required, excluded };
}

function tokenizeQuery(query: string): RawQueryToken[] {
  const normalizedQuery = query.replace(/[“”]/gu, '"');
  const tokens: RawQueryToken[] = [];
  let value = "";
  let quoted = false;
  let containedQuote = false;

  const pushToken = () => {
    if (value.length > 0) {
      tokens.push({ value, quoted: containedQuote });
    }

    value = "";
    containedQuote = false;
  };

  for (const character of normalizedQuery) {
    if (character === '"') {
      quoted = !quoted;
      containedQuote = true;
      continue;
    }

    if (!quoted && /\s/u.test(character)) {
      pushToken();
      continue;
    }

    value += character;
  }

  pushToken();

  return tokens;
}

function removeExclusionPrefix(token: RawQueryToken) {
  if (token.quoted || !token.value.startsWith("-") || token.value === "-") {
    return { value: token.value, excluded: false };
  }

  return { value: token.value.slice(1), excluded: true };
}

function createTerms(token: RawQueryToken): SearchTerm[] {
  const value = normalizeText(token.value);

  if (value.length === 0) {
    return [];
  }

  if (!token.quoted) {
    const keyMatch = value.match(KEY_PATTERN);

    if (keyMatch) {
      const key = normalizeKey(keyMatch[1]);

      return key ? [{ kind: "key", key }] : [{ kind: "invalid" }];
    }

    const rangeMatch = value.match(NUMBER_RANGE);

    if (rangeMatch) {
      const first = Number(rangeMatch[1]);
      const second = Number(rangeMatch[2]);

      if (Number.isSafeInteger(first) && Number.isSafeInteger(second)) {
        return [
          {
            kind: "range",
            min: Math.min(first, second),
            max: Math.max(first, second),
          },
        ];
      }
    }
  }

  const words = tokenizeText(value);

  if (words.length === 0) {
    return [];
  }

  if (token.quoted) {
    return [{ kind: "text", exact: true, patterns: [words] }];
  }

  return words.map((word) => createTextTerm(word));
}

function createTextTerm(word: string): SearchTerm {
  const patterns = [tokenizeText(word)];
  const aliases = SMART_ALIASES[word];

  if (aliases) {
    for (const alias of aliases) {
      const pattern = tokenizeText(alias);

      if (pattern.length > 0 && !patterns.some((item) => sameWords(item, pattern))) {
        patterns.push(pattern);
      }
    }
  }

  return { kind: "text", exact: false, patterns };
}

function createSearchDocument(sample: MockSample): SearchDocument {
  const normalizedName = normalizeText(sample.name);
  const numberMatches = normalizedName.match(/\d+/gu) || [];

  return {
    tokens: tokenizeText(normalizedName),
    numbers: numberMatches.map(Number),
    key: normalizeKey(sample.key || ""),
  };
}

function matchesTerm(term: SearchTerm, document: SearchDocument): boolean {
  if (term.kind === "invalid") {
    return false;
  }

  if (term.kind === "range") {
    return document.numbers.some(
      (number) => number >= term.min && number <= term.max,
    );
  }

  if (term.kind === "key") {
    return (
      document.key !== null &&
      document.key.pitchClass === term.key.pitchClass &&
      (term.key.mode === "any" || document.key.mode === term.key.mode)
    );
  }

  return term.patterns.some((pattern) =>
    term.exact
      ? containsExactSequence(document.tokens, pattern)
      : containsPrefixSequence(document.tokens, pattern),
  );
}

function containsExactSequence(tokens: string[], pattern: string[]): boolean {
  return tokens.some((_, index) =>
    pattern.every((word, offset) => tokens[index + offset] === word),
  );
}

function containsPrefixSequence(tokens: string[], pattern: string[]): boolean {
  return tokens.some((_, index) =>
    pattern.every((word, offset) =>
      tokens[index + offset]?.startsWith(word),
    ),
  );
}

function tokenizeText(value: string): string[] {
  return value.split(WORD_SEPARATOR).filter(Boolean);
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").toLowerCase();
}

function sameWords(first: string[], second: string[]): boolean {
  return (
    first.length === second.length &&
    first.every((word, index) => word === second[index])
  );
}

function normalizeKey(value: string): NormalizedKey | null {
  const normalizedValue = normalizeText(value)
    .replace(/[♯]/gu, "#")
    .replace(/[♭]/gu, "b")
    .replace(/\s+/gu, "");
  const match = normalizedValue.match(
    /^([a-g](?:#|b)?)(m|maj|major|min|minor)?$/u,
  );

  if (!match) {
    return null;
  }

  const pitchClass = PITCH_CLASSES[match[1]];

  if (pitchClass === undefined) {
    return null;
  }

  const modeValue = match[2];
  const mode =
    modeValue === undefined
      ? "any"
      : modeValue === "m" || modeValue === "min" || modeValue === "minor"
        ? "minor"
        : "major";

  return { pitchClass, mode };
}
