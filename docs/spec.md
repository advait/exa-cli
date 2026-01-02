# Exa CLI Spec

Goal: design a non-interactive, agent-first CLI for Exa's Search API using bun + oclif.

## 1. Name
- Command: `exa`

## 2. One-liner
- Query Exa's search APIs and retrieve web content for agent workflows.

## 3. Usage
- `exa [global flags] <subcommand> [args]`
- `exa search [flags] <query>`
- `exa contents [flags] <url...>`
- `exa find-similar [flags] <url>`
- `exa answer [flags] <query>`

## 4. Subcommands
- `search`: semantic search; optional inline content extraction.
- `contents`: fetch content for URLs.
- `find-similar`: similar links to a URL; optional content extraction.
- `answer`: Exa Q&A over search results; optional streaming.

## 5. Global flags
- `-h, --help`: show help; ignores other args.
- `--version`: print version to stdout.
- `--json`: default output (pass-through Exa response JSON).
- `--plain`: stable line-based output (see I/O contract).
- `--dry-run`: print the request JSON to stdout and exit 0 (no network).

## 6. I/O contract
- stdout: primary result data (JSON by default).
- stderr: diagnostics/errors (JSON when `--json` is set).
- No prompts and no stdin parsing. All inputs are via args/flags.
- `--plain` formats:
  - `search`: `rank<TAB>url<TAB>title`
  - `find-similar`: `rank<TAB>url<TAB>title`
  - `contents`: `url<TAB>status<TAB>title`
  - `answer`: `answer` only (citations require `--json`)
- `answer --stream`: stdout is raw SSE stream from API; `--json` and `--plain` ignored.

## 7. Exit codes
- `0` success
- `1` API/network failure
- `2` invalid usage (missing args, invalid flag)

## 8. Auth
- Env only: `EXA_API_KEY` is required.
- No `--api-key` flag.

## 9. Shared content options
These map to the API `contents` object and are available on `search`, `contents`, and `find-similar`.

- `--text` (bool)
- `--text-max-characters <n>`
- `--text-include-html-tags`
- `--highlights` (bool)
- `--highlights-num-sentences <n>`
- `--highlights-per-url <n>`
- `--highlights-query <string>`
- `--summary` (bool)
- `--summary-query <string>`
- `--summary-schema <json|@file>`
- `--context` (bool)
- `--context-max-characters <n>`
- `--livecrawl <never|fallback|preferred|always>`
- `--livecrawl-timeout <ms>`
- `--subpages <n>`
- `--subpage-target <string>` (repeatable)
- `--extras-links <n>`
- `--extras-image-links <n>`

## 10. Command details

### `exa search`
USAGE: `exa search [flags] <query>`

Flags:
- `--type <auto|neural|fast|deep>` (default `auto`)
- `--category <company|research-paper|news|pdf|github|tweet|personal-site|financial-report|people>`
- `--user-location <ISO2>`
- `--num-results <n>`
- `--additional-query <string>` (repeatable; only for `type=deep`)
- `--include-domain <domain>` (repeatable)
- `--exclude-domain <domain>` (repeatable)
- `--include-text <string>`
- `--exclude-text <string>`
- `--start-crawl-date <ISO8601>`
- `--end-crawl-date <ISO8601>`
- `--start-published-date <ISO8601>`
- `--end-published-date <ISO8601>`
- `--moderation`

Plus shared content options.

### `exa contents`
USAGE: `exa contents [flags] <url...>`

Flags:
- Shared content options.

### `exa find-similar`
USAGE: `exa find-similar [flags] <url>`

Flags:
- `--num-results <n>`
- `--include-domain <domain>` (repeatable)
- `--exclude-domain <domain>` (repeatable)
- `--include-text <string>`
- `--exclude-text <string>`
- `--start-crawl-date <ISO8601>`
- `--end-crawl-date <ISO8601>`
- `--start-published-date <ISO8601>`
- `--end-published-date <ISO8601>`
- `--moderation`

Plus shared content options.

### `exa answer`
USAGE: `exa answer [flags] <query>`

Flags:
- `--text` (include full text in citations)
- `--stream` (stream SSE chunks)

## 11. Examples
```bash
exa search "latest developments in quantum computing"
exa search "AI chips roadmap" --type deep --additional-query "GPU roadmap" --num-results 25
exa search "LLM hallucinations" --include-domain arxiv.org --text --text-max-characters 2000

exa contents https://arxiv.org/abs/2307.06435 --text --summary --summary-query "key findings"
exa contents https://example.com --highlights --highlights-per-url 2 --highlights-num-sentences 2

exa find-similar https://arxiv.org/abs/2307.06435 --num-results 5 --text
exa find-similar https://example.com --exclude-domain example.com --summary

exa answer "What is the population of New York City?"
exa answer "state of solid-state batteries" --stream
```
