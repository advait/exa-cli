# exa-cli

Simple CLI wrapper around the Exa Search API.

Not to be confused with the `exa` terminal replacement for `ls`.

This CLI is agent-first, non-interactive, and defaults to JSON output.

## Install / Run

If published to npm:

```bash
bunx exa-cli --help
npx exa-cli --help
```

Local dev:

```bash
bun run bin/exa --help
```

## Auth

Set your API key in the environment:

```bash
export EXA_API_KEY=...
```

## Commands

- `search` - semantic search (optionally return contents)
- `contents` - fetch page contents for URLs
- `find-similar` - find similar links to a URL
- `answer` - Q&A grounded by search results

## Examples

Search:

```bash
exa search "latest developments in quantum computing"
exa search "AI chips roadmap" --type deep --additional-query "GPU roadmap" --num-results 25
exa search "LLM hallucinations" --include-domain arxiv.org --text --text-max-characters 2000
```

Find similar:

```bash
exa find-similar https://arxiv.org/abs/2307.06435 --num-results 5 --text
exa find-similar https://example.com --exclude-domain example.com --summary
```

Contents:

```bash
exa contents https://arxiv.org/abs/2307.06435 --text --summary --summary-query "key findings"
exa contents https://example.com --highlights --highlights-per-url 2 --highlights-num-sentences 2
```

Answer:

```bash
exa answer "What is the population of New York City?"
exa answer "state of solid-state batteries" --stream
```

Plain output (stable lines for agents):

```bash
exa search "openai" --num-results 3 --plain
exa find-similar https://openai.com --num-results 3 --plain
exa contents https://openai.com --plain
exa answer "What is the capital of France?" --plain
```

Dry run (prints request JSON):

```bash
exa search "openai" --num-results 1 --dry-run
exa contents https://openai.com --text --dry-run
```

## Output modes

- Default is JSON to stdout
- `--plain` emits stable, line-based output
- Errors go to stderr (JSON when not using `--plain`)

## Development

```bash
bun install
bun run bin/exa --help
bun run lint
bun run format
```
