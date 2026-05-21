# Xikota — DesignTokens LLM Prompt Template

Role: system / assistant template for converting a user `formData` into a validated `DesignTokens` JSON.

Constraints:
- Output MUST be valid JSON parsable to the `design-tokens.schema.json` schema.
- Use only hex color values for color tokens (3 or 6 hex digits prefixed by `#`).
- Sizes in `type.scale` and `spacing.scale` must be numbers (px).
- `components[].props` may reference token keys (e.g., `accent`, `bg`, `text`).
- No additional commentary — response SHOULD be the JSON payload only.

Prompt Template (system message):
You are an expert design token compiler. Receive `formData` describing project type, description, vibe, selected color palette and references. Output a `DesignTokens` JSON that conforms exactly to the schema in design-tokens.schema.json. Validate and normalize values (hex formatting, numeric types). If a value is uncertain, default conservatively (e.g., neutral gray `#111111` for text, `#FFFFFF` for background).

Prompt Template (user message):
Input: {{formData}}

Produce the `DesignTokens` JSON. Fields to always include: `projectId`, `meta.source`="web", `meta.vibe`, `meta.createdAt` (UTC), `colors`, `type`, `spacing`, `components` (at least `button.primary`).

Example (brief -> output snippet):
- Brief: "Startup SaaS B2B, vibe: Minimalista, selected palette: Monocromático (#000000,#333333,#E5E5E5)"
- Output: (the tool should emit a full DesignTokens JSON — see `examples/design-tokens-sample.json` for exact format).

Failure modes and handling:
- If the LLM cannot generate valid JSON, return an explicit JSON error object with `error` and `diagnostics` keys (this will be parsed by the middleware and retried). Example: {"error":true,"diagnostics":"invalid hex value at colors.primary"}

Notes for engineers:
- Use strict JSON schema validation (AJV) after receiving the output. If invalid, re-run the prompt with `system` instruction: "Output must be strictly valid JSON conforming to the schema." Retry up to 2 times with minor prompt adjustments.
