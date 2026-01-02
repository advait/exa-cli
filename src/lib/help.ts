import { Help as OclifHelp } from "@oclif/core";

const AUTH_TEXT = "Requires EXA_API_KEY in the environment.";

export default class Help extends OclifHelp {
  formatRoot(): string {
    const base = super.formatRoot();
    const auth = this.section("AUTH", AUTH_TEXT);
    const examples = this.section(
      "EXAMPLES",
      this.renderList(
        [
          ["exa --help"],
          ["exa help search"],
          ['exa search "latest developments in quantum computing"'],
          ['exa search "openai" --num-results 3 --plain'],
          ['exa answer "What is the population of New York City?"'],
          ["exa contents https://openai.com --text --summary"],
        ],
        { indentation: 2, spacer: "\n", stripAnsi: this.opts.stripAnsi },
      ),
    );

    return `${base}\n\n${auth}\n\n${examples}`;
  }

  formatCommand(command: Parameters<OclifHelp["formatCommand"]>[0]): string {
    const base = super.formatCommand(command);
    const auth = this.section("AUTH", AUTH_TEXT);
    return `${base}\n${auth}`;
  }
}
