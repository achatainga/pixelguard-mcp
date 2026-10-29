/**
 * PixelGuard Engine (Stateless MCP 2026-07-28 Spec)
 * AST Figma-to-Code Design Token Linter & WCAG Contrast Guard
 */

export class PixelGuardEngine {
  constructor(config = {}) {
    this.config = config;
    this.tokenSuggestions = {
      'text-[12px]': 'text-xs',
      'text-[14px]': 'text-sm',
      'text-[16px]': 'text-base',
      'text-[18px]': 'text-lg',
      'p-[16px]': 'p-4',
      'p-[8px]': 'p-2',
      'px-[16px]': 'px-4',
      'py-[8px]': 'py-2',
      'rounded-[4px]': 'rounded-sm',
      'rounded-[8px]': 'rounded-md'
    };
  }

  /**
   * Scans component code for arbitrary Tailwind magic numbers.
   */
  lintDesignTokens(codeText, filename = 'component.tsx') {
    const issues = [];
    const lines = codeText.split('\n');
    const arbitraryPattern = /\b(?:text|bg|p|px|py|pt|pb|m|mx|my|w|h|rounded|gap)-\[[^\]]+\]/g;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;
      while ((match = arbitraryPattern.exec(line)) !== null) {
        const arbitraryToken = match[0];
        const suggestion = this.tokenSuggestions[arbitraryToken] || 'a canonical design system token';
        issues.push({
          file: filename,
          line: i + 1,
          token: arbitraryToken,
          severity: 'WARNING',
          suggestion,
          message: `Arbitrary magic value '${arbitraryToken}' detected. Replace with canonical design token (e.g. '${suggestion}').`
        });
      }
    }

    return {
      filename,
      totalIssues: issues.length,
      hasArbitraryTokens: issues.length > 0,
      issues
    };
  }

  /**
   * Converts hex color string to relative luminance according to WCAG 2.2 specifications.
   */
  getLuminance(hexColor) {
    const cleanHex = hexColor.replace('#', '').trim();
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const [R, G, B] = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  /**
   * Computes WCAG 2.2 contrast ratio between foreground and background hex colors.
   */
  calculateContrastRatio(fgHex, bgHex) {
    const lum1 = this.getLuminance(fgHex);
    const lum2 = this.getLuminance(bgHex);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));

    const passesNormalAA = ratio >= 4.5;
    const passesLargeAA = ratio >= 3.0;

    return {
      foreground: fgHex,
      background: bgHex,
      contrastRatio: ratio,
      passesNormalAA,
      passesLargeAA,
      compliance: passesNormalAA ? 'PASS_AA_NORMAL' : (passesLargeAA ? 'PASS_AA_LARGE_ONLY' : 'FAIL')
    };
  }

  /**
   * Audits interactive elements (<button>, <a>) for accessible touch target dimensions.
   */
  enforceTouchTargets(codeText) {
    const issues = [];
    const lines = codeText.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/<(?:button|a)\b/i.test(line)) {
        // Flag dangerous micro-touch patterns like h-4, h-5, h-6, p-0.5
        if (/\b(?:h-[456]|w-[456]|p-0\.5|p-1)\b/.test(line) && !line.includes('min-h-11') && !line.includes('min-h-[44px]')) {
          issues.push({
            line: i + 1,
            severity: 'CRITICAL',
            element: line.trim(),
            message: 'Interactive button/link violates WCAG 2.2 touch target size (< 44px). Add min-h-11 min-w-11 or adequate padding.'
          });
        }
      }
    }

    return {
      hasTouchTargetViolations: issues.length > 0,
      totalViolations: issues.length,
      issues
    };
  }
}

// Standalone CLI runner
if (process.argv[1]?.endsWith('engine.mjs')) {
  const engine = new PixelGuardEngine();
  console.log(JSON.stringify(engine.calculateContrastRatio('#71717a', '#ffffff'), null, 2));
}
