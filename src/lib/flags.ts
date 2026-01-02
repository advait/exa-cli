import { Flags } from "@oclif/core";

export const globalFlags = {
  json: Flags.boolean({
    description: "Output JSON (default)",
    default: false,
  }),
  plain: Flags.boolean({
    description: "Output stable, line-based text",
    default: false,
  }),
  "dry-run": Flags.boolean({
    description: "Print request JSON to stdout and exit",
    default: false,
  }),
};

export const contentsFlags = {
  text: Flags.boolean({
    description: "Include full text in the response",
    default: false,
  }),
  "text-max-characters": Flags.integer({
    description: "Limit full text length in characters",
  }),
  "text-include-html-tags": Flags.boolean({
    description: "Include HTML tags in full text",
    default: false,
  }),
  highlights: Flags.boolean({
    description: "Include highlights",
    default: false,
  }),
  "highlights-num-sentences": Flags.integer({
    description: "Number of sentences per highlight",
  }),
  "highlights-per-url": Flags.integer({
    description: "Number of highlights per URL",
  }),
  "highlights-query": Flags.string({
    description: "Custom query to guide highlights",
  }),
  summary: Flags.boolean({
    description: "Include summary",
    default: false,
  }),
  "summary-query": Flags.string({
    description: "Custom query to guide summary",
  }),
  "summary-schema": Flags.string({
    description: "JSON schema for structured summary (inline JSON or @file)",
  }),
  context: Flags.boolean({
    description: "Include combined context string",
    default: false,
  }),
  "context-max-characters": Flags.integer({
    description: "Max characters for combined context",
  }),
  livecrawl: Flags.string({
    description: "Livecrawl mode",
    options: ["never", "fallback", "preferred", "always"],
  }),
  "livecrawl-timeout": Flags.integer({
    description: "Livecrawl timeout in milliseconds",
  }),
  subpages: Flags.integer({
    description: "Number of subpages to crawl",
  }),
  "subpage-target": Flags.string({
    description: "Term to find specific subpages (repeatable)",
    multiple: true,
  }),
  "extras-links": Flags.integer({
    description: "Number of links to return per page",
  }),
  "extras-image-links": Flags.integer({
    description: "Number of image links to return per page",
  }),
};

export const searchFlags = {
  type: Flags.string({
    description: "Search type",
    options: ["auto", "neural", "fast", "deep"],
  }),
  category: Flags.string({
    description: "Search category",
    options: [
      "company",
      "research-paper",
      "news",
      "pdf",
      "github",
      "tweet",
      "personal-site",
      "financial-report",
      "people",
    ],
  }),
  "user-location": Flags.string({
    description: "Two-letter ISO country code",
  }),
  "num-results": Flags.integer({
    description: "Number of results to return",
  }),
  "additional-query": Flags.string({
    description: "Additional query for deep search (repeatable)",
    multiple: true,
  }),
  "include-domain": Flags.string({
    description: "Include domain (repeatable)",
    multiple: true,
  }),
  "exclude-domain": Flags.string({
    description: "Exclude domain (repeatable)",
    multiple: true,
  }),
  "include-text": Flags.string({
    description: "Text that must appear in results",
    multiple: true,
  }),
  "exclude-text": Flags.string({
    description: "Text that must not appear in results",
    multiple: true,
  }),
  "start-crawl-date": Flags.string({
    description: "Start crawl date (ISO 8601)",
  }),
  "end-crawl-date": Flags.string({
    description: "End crawl date (ISO 8601)",
  }),
  "start-published-date": Flags.string({
    description: "Start published date (ISO 8601)",
  }),
  "end-published-date": Flags.string({
    description: "End published date (ISO 8601)",
  }),
  moderation: Flags.boolean({
    description: "Enable content moderation",
    default: false,
  }),
};

export const findSimilarFlags = {
  "num-results": Flags.integer({
    description: "Number of results to return",
  }),
  "include-domain": Flags.string({
    description: "Include domain (repeatable)",
    multiple: true,
  }),
  "exclude-domain": Flags.string({
    description: "Exclude domain (repeatable)",
    multiple: true,
  }),
  "include-text": Flags.string({
    description: "Text that must appear in results",
    multiple: true,
  }),
  "exclude-text": Flags.string({
    description: "Text that must not appear in results",
    multiple: true,
  }),
  "start-crawl-date": Flags.string({
    description: "Start crawl date (ISO 8601)",
  }),
  "end-crawl-date": Flags.string({
    description: "End crawl date (ISO 8601)",
  }),
  "start-published-date": Flags.string({
    description: "Start published date (ISO 8601)",
  }),
  "end-published-date": Flags.string({
    description: "End published date (ISO 8601)",
  }),
  moderation: Flags.boolean({
    description: "Enable content moderation",
    default: false,
  }),
};

export const answerFlags = {
  text: Flags.boolean({
    description: "Include full text in citations",
    default: false,
  }),
  stream: Flags.boolean({
    description: "Stream responses as SSE",
    default: false,
  }),
};
