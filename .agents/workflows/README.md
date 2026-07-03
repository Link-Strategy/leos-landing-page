# Link Strategy Content Agent Workflows

This directory contains the strategic workflows executed by the AI Content Agent to discover ideas, brief topics, produce assets, distribute content, and mine performance signals.

## Tool Execution Model

Previously, the workflows referenced remote HTTP webhook functions. Under the localized CLI-based operation model, all tool calls map directly to shell commands executed via the `run_command` tool.

### CLI Mapping Table

Use the following CLI commands instead of the legacy tool calls described in the individual workflow files:

| Legacy Tool Call | CLI Command | Notes |
| :--- | :--- | :--- |
| `save_idea(...)` | `node .agents/tools/ls-post/cli.mjs save-idea` | Use `--payload-file` to submit JSON data |
| `save_brief(...)` | `node .agents/tools/ls-post/cli.mjs save-brief` | Use `--payload-file` to submit JSON data |
| `save_asset(...)` | `node .agents/tools/ls-post/cli.mjs save-asset` | Use `--payload-file` to submit JSON data |
| `save_signal(...)` | `node .agents/tools/ls-post/cli.mjs save-signal` | Use `--payload-file` to submit JSON data |
| `search_content_records(...)` | `node .agents/tools/ls-post/cli.mjs search-content` | Arguments: `--query`, `--types`, `--status`, `--limit` |
| `search_taxonomy(...)` | `node .agents/tools/ls-post/cli.mjs search-taxonomy` | Arguments: `--query`, `--type` |
| `get_content_detail(...)` | `node .agents/tools/ls-post/cli.mjs get-content` | Arguments: `--collection`, `--id` |
| `publish_asset(...)` | `node .agents/tools/ls-post/cli.mjs publish-asset` | Arguments: `--asset-id` |
| `fetch_publication_metrics(...)` | `node .agents/tools/ls-post/cli.mjs fetch-metrics` | Arguments: `--asset-id` |

---

## Content Lifecycle Guide

Follow the workflows in order:

1. [Workflow 01: Idea Discovery & Backlog](01-idea-discovery.md)
2. [Workflow 02: Strategic Briefing](02-strategic-briefing.md)
3. [Workflow 03: Production Master](03-production-master.md)
4. [Workflow 04: Channel Distribution](04-channel-distribution.md)
5. [Workflow 05: Signal Mining & Learning](05-signal-mining.md)
