import { Args } from "@oclif/core";
import { requestJson, requestStream } from "../lib/api";
import { BaseCommand } from "../lib/command";
import { answerFlags, globalFlags } from "../lib/flags";

export default class Answer extends BaseCommand {
  static description = "Get an answer grounded by Exa search";

  static args = {
    query: Args.string({
      description: "Question to answer",
      required: false,
    }),
  };

  static flags = {
    ...globalFlags,
    ...answerFlags,
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Answer);
    this.ensureOutputFlags(flags);

    if (!args.query) {
      this.fail("query is required", 2, flags);
    }

    const apiKey = this.getApiKey(flags);

    const body: Record<string, unknown> = {
      query: args.query,
    };

    if (flags.text) {
      body.text = true;
    }
    if (flags.stream) {
      body.stream = true;
    }

    if (flags["dry-run"]) {
      this.printJson(body);
      return;
    }

    if (flags.stream) {
      try {
        const response = await requestStream("/answer", apiKey, body);
        await pipeStream(response);
      } catch (error) {
        this.handleApiError(error, flags);
      }
      return;
    }

    try {
      const data = await requestJson("/answer", apiKey, body);
      const mode = this.outputMode(flags);
      if (mode === "plain") {
        writeAnswerPlain(data);
        return;
      }
      this.printJson(data);
    } catch (error) {
      this.handleApiError(error, flags);
    }
  }
}

function writeAnswerPlain(data: unknown): void {
  const answer =
    typeof data === "object" && data !== null && "answer" in data
      ? (data as { answer?: string }).answer
      : undefined;

  if (answer) {
    process.stdout.write(`${answer}\n`);
  }
}

async function pipeStream(response: Response): Promise<void> {
  if (!response.body) {
    return;
  }

  for await (const chunk of response.body) {
    process.stdout.write(chunk);
  }
}
