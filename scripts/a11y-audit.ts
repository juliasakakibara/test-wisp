/**
 * WCAG theme audit — run: npm run a11y:audit
 * Validates all presets for 1.4.3, 1.4.11 and reports contrast ratios.
 */
import {
  THEME_PRESETS,
  contrastRatio,
  deriveAccessibleTokens,
  validateThemePreset,
} from "../src/lib/theme-presets";

function runA11yAudit(): void {
  console.log("Julia Portfolio — WCAG theme audit\n");
  console.log("Criteria: text 4.5:1 · UI/border 3:1\n");

  let failed = 0;

  for (const preset of THEME_PRESETS) {
    try {
      validateThemePreset(preset);
    } catch (error) {
      failed += 1;
      console.log(`✗ ${preset.name}: ${error instanceof Error ? error.message : error}`);
      continue;
    }

    const tokens = deriveAccessibleTokens(preset);
    const fg = contrastRatio(preset.foreground, preset.background).toFixed(2);
    const primary = contrastRatio(preset.primary, preset.background).toFixed(2);
    const muted = contrastRatio(tokens["--muted-foreground"], preset.background).toFixed(2);
    const border = contrastRatio(tokens["--border"], preset.background).toFixed(2);

    console.log(`✓ ${preset.name}`);
    console.log(`    foreground/background  ${fg}:1`);
    console.log(`    primary/background     ${primary}:1`);
    console.log(`    muted/background       ${muted}:1`);
    console.log(`    border/background      ${border}:1  (--border: ${tokens["--border"]})`);
    console.log("");
  }

  if (failed > 0) {
    console.error(`${failed} preset(s) failed validation.`);
    process.exit(1);
  }

  console.log(`All ${THEME_PRESETS.length} presets pass WCAG 1.4.3 (text) and 1.4.11 (UI/border).`);
}

runA11yAudit();
