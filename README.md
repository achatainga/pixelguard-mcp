# PixelGuard MCP

> AST Figma-to-Code Design Token Linter & WCAG Contrast Guard for Tailwind CSS and React.

[![MCP 2026-07-28](https://img.shields.io/badge/MCP-2026--07--28-blue.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## The Problem
When autonomous agents convert designs into Tailwind CSS or edit React components:
1. **Magic Number Pollution**: Agents litter codebases with arbitrary brackets (`p-[17px]`, `text-[13px]`, `bg-[#24292e]`) instead of adhering to theme tokens.
2. **WCAG Contrast Failures**: Low-contrast gray text on white cards renders UI unreadable and legally non-compliant.
3. **Micro-Touch Targets**: Interactive buttons lack sufficient tap areas (< 44px), breaking mobile accessibility.

## The Solution
PixelGuard MCP ensures design system discipline and accessibility compliance:
- **Design Token Linter**: Intercepts arbitrary Tailwind values and proposes canonical design tokens (`p-4`, `text-sm`).
- **WCAG 2.2 Contrast Calculator**: Mathematically verifies foreground/background relative luminance against AA thresholds (4.5:1 / 3:1).
- **Touch Target Enforcer**: Audits `<button>` and `<a>` elements to ensure compliance with the 44px tap target standard.

## Available MCP Tools

### `lint_design_tokens`
Scans component JSX/TSX files for arbitrary bracket values and suggests theme replacements.

### `calculate_contrast_ratio`
Computes relative luminance and contrast ratio for color pairings according to WCAG 2.2.

### `enforce_touch_targets`
Audits clickable UI elements to ensure minimum accessible tap dimensions.

## Live Verification
```bash
node tests/run_live_test.mjs
```

## License
MIT © 2026 PixelGuard Systems
