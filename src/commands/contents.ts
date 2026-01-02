import { Args } from "@oclif/core";
import { requestJson } from "../lib/api.js";
import { BaseCommand } from "../lib/command.js";
import { buildContentsOptions } from "../lib/contents.js";
import { contentsFlags, globalFlags } from "../lib/flags.js";

export default class Contents extends BaseCommand {
  static description = "Fetch content for URLs (agent-first, JSON by default)";

  static examples = [
    'exa contents https://arxiv.org/abs/2307.06435 --text --summary --summary-query "key findings"',
    "exa contents https://example.com --highlights --highlights-per-url 2 --highlights-num-sentences 2",
    "exa contents https://openai.com --plain",
    "exa contents https://openai.com --text --dry-run",
  ];

  static args = {
    urls: Args.string({
      description: "URL(s) to fetch",
      required: false,
      multiple: true,
    }),
  };

  static flags = {
    ...globalFlags,
    ...contentsFlags,
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Contents);
    this.ensureOutputFlags(flags);

    if (!args.urls || args.urls.length === 0) {
      this.fail("at least one url is required", 2, flags);
    }

    const apiKey = this.getApiKey(flags);

    const body: Record<string, unknown> = {
      urls: args.urls,
    };

    const contents = await buildContentsOptions(flags);
    if (Object.keys(contents).length > 0) {
      body.contents = contents;
    }

    if (flags["dry-run"]) {
      this.printJson(body);
      return;
    }

    try {
      const data = await requestJson("/contents", apiKey, body);
      const mode = this.outputMode(flags);
      if (mode === "plain") {
        writeContentsPlain(data);
        return;
      }
      this.printJson(data);
    } catch (error) {
      this.handleApiError(error, flags);
    }
  }
}

function writeContentsPlain(data: unknown): void {
  const record = data as { results?: unknown; statuses?: unknown };
  const results = Array.isArray(record?.results) ? record.results : [];
  const statuses = Array.isArray(record?.statuses) ? record.statuses : [];

  const statusMap = new Map<string, string>();
  for (const status of statuses) {
    const entry = status as { id?: string; status?: string };
    if (entry.id && entry.status) {
      statusMap.set(entry.id, entry.status);
    }
  }

  for (const result of results) {
    const item = result as { url?: string; id?: string; title?: string };
    const url = item.url ?? item.id ?? "";
    const status = statusMap.get(url) ?? "";
    const title = item.title ?? "";
    process.stdout.write(`${url}\t${status}\t${title}\n`);
  }
}
