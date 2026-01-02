import { Args } from "@oclif/core";
import { requestJson } from "../lib/api.js";
import { BaseCommand } from "../lib/command.js";
import { buildContentsOptions } from "../lib/contents.js";
import { contentsFlags, findSimilarFlags, globalFlags } from "../lib/flags.js";

export default class FindSimilar extends BaseCommand {
  static description = "Find similar links to a URL (agent-first, JSON by default)";

  static examples = [
    "exa find-similar https://arxiv.org/abs/2307.06435 --num-results 5 --text",
    "exa find-similar https://example.com --exclude-domain example.com --summary",
    "exa find-similar https://openai.com --num-results 3 --plain",
    "exa find-similar https://openai.com --num-results 1 --dry-run",
  ];

  static args = {
    url: Args.string({
      description: "URL to find similar links for",
      required: false,
    }),
  };

  static flags = {
    ...globalFlags,
    ...findSimilarFlags,
    ...contentsFlags,
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FindSimilar);
    this.ensureOutputFlags(flags);

    if (!args.url) {
      this.fail("url is required", 2, flags);
    }

    const apiKey = this.getApiKey(flags);

    const body: Record<string, unknown> = {
      url: args.url,
    };

    if (typeof flags["num-results"] === "number") {
      body.numResults = flags["num-results"];
    }
    if (flags["include-domain"] && flags["include-domain"].length > 0) {
      body.includeDomains = flags["include-domain"];
    }
    if (flags["exclude-domain"] && flags["exclude-domain"].length > 0) {
      body.excludeDomains = flags["exclude-domain"];
    }
    if (flags["include-text"] && flags["include-text"].length > 0) {
      body.includeText = flags["include-text"];
    }
    if (flags["exclude-text"] && flags["exclude-text"].length > 0) {
      body.excludeText = flags["exclude-text"];
    }
    if (flags["start-crawl-date"]) {
      body.startCrawlDate = flags["start-crawl-date"];
    }
    if (flags["end-crawl-date"]) {
      body.endCrawlDate = flags["end-crawl-date"];
    }
    if (flags["start-published-date"]) {
      body.startPublishedDate = flags["start-published-date"];
    }
    if (flags["end-published-date"]) {
      body.endPublishedDate = flags["end-published-date"];
    }
    if (flags.moderation) {
      body.moderation = true;
    }

    const contents = await buildContentsOptions(flags);
    if (Object.keys(contents).length > 0) {
      body.contents = contents;
    }

    if (flags["dry-run"]) {
      this.printJson(body);
      return;
    }

    try {
      const data = await requestJson("/findSimilar", apiKey, body);
      const mode = this.outputMode(flags);
      if (mode === "plain") {
        writeFindSimilarPlain(data);
        return;
      }
      this.printJson(data);
    } catch (error) {
      this.handleApiError(error, flags);
    }
  }
}

function writeFindSimilarPlain(data: unknown): void {
  const results =
    typeof data === "object" && data !== null ? (data as { results?: unknown }).results : undefined;
  if (!Array.isArray(results)) {
    return;
  }

  for (const [index, result] of results.entries()) {
    const record = result as { url?: string; id?: string; title?: string };
    const url = record.url ?? record.id ?? "";
    const title = record.title ?? "";
    process.stdout.write(`${index + 1}\t${url}\t${title}\n`);
  }
}
