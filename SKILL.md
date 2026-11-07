---
name: pixelguard
description: AST Figma-to-Code Design Token Linter & WCAG Contrast Guard for Tailwind CSS and React.
version: 1.0.0
tags:
  - design-system
  - tailwind
  - contrast
  - wcag
  - a11y
  - figma
  - css
---

# PixelGuard: Design Token Linter & WCAG Visual Guard

PixelGuard enforces design system fidelity and WCAG 2.2 AA accessibility standards on agent-generated frontend code, eliminating arbitrary CSS magic numbers and illegible low-contrast text.

## The Problem

Agents converting Figma designs into frontend components routinely produce dirty styling:
1. **Arbitrary Magic Numbers**: Instead of using theme tokens (`text-sm`, `p-4`), agents spam arbitrary brackets (`text-[13px]`, `p-[17px]`, `bg-[#24292e]`).
2. **WCAG Contrast Violations**: Agents combine light gray text on white backgrounds (`text-gray-300 bg-white`), failing legal accessibility standards.
3. **Micro Touch Targets**: Buttons and interactive controls lack $44 \times 44$ px minimum click surfaces on mobile viewports.

## Core Capabilities

1. **Arbitrary Value Linter**:
   - Parses JSX, TSX, and Vue class attributes to flag unapproved arbitrary values and suggest canonical design tokens.
2. **WCAG 2.2 Contrast Verifier**:
   - Computes mathematical relative luminance and contrast ratios between foreground and background colors.
3. **Touch Target Dimension Checker**:
   - Verifies that interactive tags (`<button>`, `<a>`, `<input>`) satisfy the minimum 44px tap target rule (`min-h-11 min-w-11`).
4. **Pre-Save Quality Gate**:
   - Intercepts file writes to alert agents before dirty CSS is committed to the repository.

## Available MCP Tools

- `lint_design_tokens`: Scans code for arbitrary Tailwind classes and suggests canonical alternatives.
- `calculate_contrast_ratio`: Computes relative luminance and contrast ratio according to WCAG 2.2 formulas.
- `enforce_touch_targets`: Audits interactive components for minimum accessible touch target dimensions.

## Hook Integration

PixelGuard registers a `PreToolUse` hook in `hooks/hooks.json` to evaluate frontend files before saving changes.
