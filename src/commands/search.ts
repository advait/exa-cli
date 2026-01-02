import { Args } from "@oclif/core";
import { requestJson } from "../lib/api.js";
import { BaseCommand } from "../lib/command.js";
import { buildContentsOptions } from "../lib/contents.js";
import { contentsFlags, globalFlags, searchFlags } from "../lib/flags.js";

const categoryMap: Record<string, string> = {
  "research-paper": "research paper",
  "personal-site": "personal site",
  "financial-report": "financial report",
};

export default class Search extends BaseCommand {
  static description = "Search the web with Exa";

  static args = {
    query: Args.string({
      description: "Search query",
      required: false,
    }),
  };

  static flags = {
    ...globalFlags,
    ...searchFlags,
    ...contentsFlags,
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Search);
    this.ensureOutputFlags(flags);

    if (!args.query) {
      this.fail("query is required", 2, flags);
    }

    if (flags["additional-query"] && (!flags.type || flags.type !== "deep")) {
      this.fail("--additional-query requires --type deep", 2, flags);
    }

    const apiKey = this.getApiKey(flags);

    const body: Record<string, unknown> = {
      query: args.query,
    };

    if (flags.type) {
      body.type = flags.type;
    }
    if (flags.category) {
      body.category = categoryMap[flags.category] ?? flags.category;
    }
    if (flags["user-location"]) {
      body.userLocation = flags["user-location"];
    }
    if (typeof flags["num-results"] === "number") {
      body.numResults = flags["num-results"];
    }
    if (flags["additional-query"] && flags["additional-query"].length > 0) {
      body.additionalQueries = flags["additional-query"];
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
      const data = await requestJson("/search", apiKey, body);
      const mode = this.outputMode(flags);
      if (mode === "plain") {
        writeSearchPlain(data);
        return;
      }
      this.printJson(data);
    } catch (error) {
      this.handleApiError(error, flags);
    }
  }
}

function writeSearchPlain(data: unknown): void {
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
