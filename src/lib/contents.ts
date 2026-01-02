import { readFile } from "node:fs/promises";

type Flags = {
  text?: boolean;
  "text-max-characters"?: number;
  "text-include-html-tags"?: boolean;
  highlights?: boolean;
  "highlights-num-sentences"?: number;
  "highlights-per-url"?: number;
  "highlights-query"?: string;
  summary?: boolean;
  "summary-query"?: string;
  "summary-schema"?: string;
  context?: boolean;
  "context-max-characters"?: number;
  livecrawl?: string;
  "livecrawl-timeout"?: number;
  subpages?: number;
  "subpage-target"?: string[];
  "extras-links"?: number;
  "extras-image-links"?: number;
};

export type ContentsOptions = Record<string, unknown>;

export async function buildContentsOptions(flags: Flags): Promise<ContentsOptions> {
  const contents: ContentsOptions = {};

  const textOptions = buildTextOptions(flags);
  if (textOptions !== undefined) {
    contents.text = textOptions;
  }

  const highlightsOptions = buildHighlightsOptions(flags);
  if (highlightsOptions !== undefined) {
    contents.highlights = highlightsOptions;
  }

  const summaryOptions = await buildSummaryOptions(flags);
  if (summaryOptions !== undefined) {
    contents.summary = summaryOptions;
  }

  const contextOptions = buildContextOptions(flags);
  if (contextOptions !== undefined) {
    contents.context = contextOptions;
  }

  if (flags.livecrawl) {
    contents.livecrawl = flags.livecrawl;
  }
  if (typeof flags["livecrawl-timeout"] === "number") {
    contents.livecrawlTimeout = flags["livecrawl-timeout"];
  }
  if (typeof flags.subpages === "number") {
    contents.subpages = flags.subpages;
  }
  if (flags["subpage-target"] && flags["subpage-target"].length > 0) {
    contents.subpageTarget = flags["subpage-target"];
  }

  const extras = buildExtrasOptions(flags);
  if (extras !== undefined) {
    contents.extras = extras;
  }

  return contents;
}

function buildTextOptions(flags: Flags): boolean | Record<string, unknown> | undefined {
  if (flags["text-max-characters"] !== undefined || flags["text-include-html-tags"] === true) {
    const options: Record<string, unknown> = {};
    if (flags["text-max-characters"] !== undefined) {
      options.maxCharacters = flags["text-max-characters"];
    }
    if (flags["text-include-html-tags"] === true) {
      options.includeHtmlTags = flags["text-include-html-tags"];
    }
    return options;
  }

  if (flags.text) {
    return true;
  }

  return undefined;
}

function buildHighlightsOptions(flags: Flags): Record<string, unknown> | undefined {
  const hasHighlights =
    flags.highlights ||
    flags["highlights-num-sentences"] !== undefined ||
    flags["highlights-per-url"] !== undefined ||
    flags["highlights-query"] !== undefined;

  if (!hasHighlights) {
    return undefined;
  }

  const options: Record<string, unknown> = {};
  if (flags["highlights-num-sentences"] !== undefined) {
    options.numSentences = flags["highlights-num-sentences"];
  }
  if (flags["highlights-per-url"] !== undefined) {
    options.highlightsPerUrl = flags["highlights-per-url"];
  }
  if (flags["highlights-query"] !== undefined) {
    options.query = flags["highlights-query"];
  }

  return options;
}

async function buildSummaryOptions(flags: Flags): Promise<Record<string, unknown> | undefined> {
  const hasSummary =
    flags.summary || flags["summary-query"] !== undefined || flags["summary-schema"] !== undefined;
  if (!hasSummary) {
    return undefined;
  }

  const options: Record<string, unknown> = {};
  if (flags["summary-query"] !== undefined) {
    options.query = flags["summary-query"];
  }
  if (flags["summary-schema"] !== undefined) {
    options.schema = await parseJsonInput(flags["summary-schema"]);
  }

  return options;
}

function buildContextOptions(flags: Flags): boolean | Record<string, unknown> | undefined {
  if (flags["context-max-characters"] !== undefined) {
    return {
      maxCharacters: flags["context-max-characters"],
    };
  }

  if (flags.context === true) {
    return true;
  }

  return undefined;
}

function buildExtrasOptions(flags: Flags): Record<string, unknown> | undefined {
  const hasExtras = flags["extras-links"] !== undefined || flags["extras-image-links"] !== undefined;
  if (!hasExtras) {
    return undefined;
  }

  const extras: Record<string, unknown> = {};
  if (flags["extras-links"] !== undefined) {
    extras.links = flags["extras-links"];
  }
  if (flags["extras-image-links"] !== undefined) {
    extras.imageLinks = flags["extras-image-links"];
  }

  return extras;
}

async function parseJsonInput(input: string): Promise<unknown> {
  if (input.startsWith("@")) {
    const filePath = input.slice(1);
    const contents = await readFile(filePath, "utf-8");
    return JSON.parse(contents);
  }

  return JSON.parse(input);
}
