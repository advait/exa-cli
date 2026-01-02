import { Command } from "@oclif/core";
import { ApiError, type OutputMode, requireApiKey } from "./api.js";
import { formatApiError, resolveOutputMode, writeError, writeJson } from "./output.js";

export abstract class BaseCommand extends Command {
  protected outputMode(flags: { plain?: boolean }): OutputMode {
    return resolveOutputMode(flags);
  }

  protected ensureOutputFlags(flags: { json?: boolean; plain?: boolean }): void {
    if (flags.json && flags.plain) {
      this.fail("--json and --plain cannot be used together", 2, flags);
    }
  }

  protected getApiKey(flags: { plain?: boolean }): string {
    try {
      return requireApiKey();
    } catch (error) {
      const message = error instanceof Error ? error.message : "EXA_API_KEY is required";
      this.failWithHint(
        message,
        "Set EXA_API_KEY in your environment. Example: export EXA_API_KEY=... (see https://docs.exa.ai/reference/getting-started)",
        2,
        flags,
      );
      return "";
    }
  }

  protected printJson(data: unknown): void {
    writeJson(data);
  }

  protected fail(message: string, exitCode: number, flags: { plain?: boolean }): never {
    const mode = this.outputMode(flags);
    writeError(mode, { error: message });
    this.exit(exitCode);
  }

  protected failWithHint(
    message: string,
    hint: string,
    exitCode: number,
    flags: { plain?: boolean },
  ): never {
    const mode = this.outputMode(flags);
    writeError(mode, { error: message, hint });
    this.exit(exitCode);
  }

  protected handleApiError(error: unknown, flags: { plain?: boolean }): never {
    const mode = this.outputMode(flags);
    if (error instanceof ApiError) {
      writeError(mode, formatApiError(error));
      this.exit(1);
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    writeError(mode, { error: message });
    this.exit(1);
  }
}
