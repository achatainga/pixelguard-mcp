import assert from 'node:assert';
import { PixelGuardEngine } from '../src/engine.mjs';

async function runAllTests() {
  console.log('🧪 Starting PixelGuard MCP Live Test Gauntlet...');
  const engine = new PixelGuardEngine();

  // Test 1: Arbitrary magic number linter
  console.log('\n[Test 1] Detecting arbitrary Tailwind magic values...');
  const dirtyComponent = `
    export function Card() {
      return (
        <div className="p-[16px] rounded-[8px] bg-[#f8fafc]">
          <h2 className="text-[14px] text-gray-900">Header</h2>
        </div>
      );
    }
  `;

  const lintResult = engine.lintDesignTokens(dirtyComponent, 'src/Card.tsx');
  assert.strictEqual(lintResult.hasArbitraryTokens, true);
  assert.ok(lintResult.totalIssues >= 3);
  assert.ok(lintResult.issues.some(i => i.token === 'p-[16px]' && i.suggestion === 'p-4'));
  assert.ok(lintResult.issues.some(i => i.token === 'text-[14px]' && i.suggestion === 'text-sm'));
  console.log(`  ✅ Successfully detected ${lintResult.totalIssues} arbitrary token violations with canonical suggestions.`);

  // Test 2: WCAG 2.2 Contrast Ratio Calculation
  console.log('\n[Test 2] Calculating WCAG 2.2 relative luminance and contrast ratios...');
  // Black on white (21:1)
  const highContrast = engine.calculateContrastRatio('#000000', '#ffffff');
  assert.strictEqual(highContrast.compliance, 'PASS_AA_NORMAL');
  assert.strictEqual(highContrast.contrastRatio, 21);

  // Light gray on white (failing WCAG AA)
  const lowContrast = engine.calculateContrastRatio('#d4d4d8', '#ffffff');
  assert.strictEqual(lowContrast.passesNormalAA, false);
  assert.strictEqual(lowContrast.compliance, 'FAIL');
  console.log(`  ✅ Contrast mathematical verification passed: High=${highContrast.contrastRatio}:1 (PASS), Low=${lowContrast.contrastRatio}:1 (FAIL).`);

  // Test 3: Micro-touch target detection
  console.log('\n[Test 3] Auditing interactive touch targets for accessibility (< 44px)...');
  const badButtons = `
    <button className="h-5 w-5 bg-red-500">X</button>
  `;
  const badAudit = engine.enforceTouchTargets(badButtons);
  assert.strictEqual(badAudit.hasTouchTargetViolations, true);
  assert.strictEqual(badAudit.totalViolations, 1);
  console.log('  ✅ Flagged inaccessible micro-button (h-5 w-5).');

  // Test 4: Accessible touch target passes
  console.log('\n[Test 4] Verifying accessible touch targets pass inspection...');
  const goodButtons = `
    <button className="min-h-11 min-w-11 px-4 py-2 bg-blue-600">Save</button>
  `;
  const goodAudit = engine.enforceTouchTargets(goodButtons);
  assert.strictEqual(goodAudit.hasTouchTargetViolations, false);
  assert.strictEqual(goodAudit.totalViolations, 0);
  console.log('  ✅ Accessible button (min-h-11 min-w-11) verified 100% compliant.');

  console.log('\n🎉 ALL 4 GAUNTLET TESTS PASSED WITH 100% SUCCESS RATE!');
}

runAllTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
