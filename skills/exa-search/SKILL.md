---
name: exa-search
description: >
  Use the exa CLI to search the web via Exa's API. Use when the user asks to
  run Exa search, fetch contents, find similar links, or get answers using the
  exa command-line tool.
---

# Exa Search CLI

Agent-first, non-interactive CLI wrapper for Exa Search API. Default output is JSON.

## Quick start

1) Ensure `EXA_API_KEY` is set.
2) Run `exa --help` to see all commands and examples.
3) Use `exa search`, `exa contents`, `exa find-similar`, or `exa answer`.
4) Use `--plain` for stable, line-based output when needed.

## Commands

- `exa search <query>`: semantic search; supports filters and content options.
- `exa contents <url...>`: fetch contents for URLs.
- `exa find-similar <url>`: find similar links to a URL.
- `exa answer <query>`: grounded Q&A; supports `--stream`.

## Output modes

- Default: JSON to stdout.
- `--plain`: stable, line-based output.
- Errors: stderr (JSON unless `--plain`).

## Shared content options

Available on `search`, `contents`, and `find-similar`:

- `--text`, `--text-max-characters`, `--text-include-html-tags`
- `--highlights`, `--highlights-num-sentences`, `--highlights-per-url`, `--highlights-query`
- `--summary`, `--summary-query`, `--summary-schema <json|@file>`
- `--context`, `--context-max-characters`
- `--livecrawl <never|fallback|preferred|always>`, `--livecrawl-timeout <ms>`
- `--subpages`, `--subpage-target`
- `--extras-links`, `--extras-image-links`

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

Plain output:

```bash
exa search "openai" --num-results 3 --plain
exa find-similar https://openai.com --num-results 3 --plain
exa contents https://openai.com --plain
exa answer "What is the capital of France?" --plain
```

Dry run:

```bash
exa search "openai" --num-results 1 --dry-run
exa contents https://openai.com --text --dry-run
```
