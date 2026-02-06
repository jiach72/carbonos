---
name: aican-api
description: Access advanced AI capabilities using Aican API (Opus 4.5). Use this for complex reasoning, code generation, or when the user specifically requests "Aican" or "Opus".
allowed-tools: run_command
---

# Aican API Skill

This skill allows you to query the Aican API using the `claude-opus-4-5-20251101` model (or others if specified).

## Usage

To use this skill, run the provided python script.

### Basic Usage

```powershell
python .agent/skills/aican-api/scripts/chat.py --prompt "Your prompt here"
```

### Advanced Usage

You can specify a system message or a different model if needed.

```powershell
python .agent/skills/aican-api/scripts/chat.py --prompt "Analyze this code" --system "You are a senior code reviewer" --model "claude-3-5-sonnet-20240620"
```

## Available Models

- **Default**: `claude-opus-4-5-20251101` (Powerful, reasoning intensive)
- `gpt-4o`: Fast, versatile
- `claude-3-5-sonnet-20240620`: Balanced

## strict rules

- Always output the script response to the user if they asked for it.
- If the script fails, check network connectivity or API key validity.
