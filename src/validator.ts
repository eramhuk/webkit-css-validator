import type { ValidatorOptions, ValidationResult, ValidationWarning } from './types.js';

const DEFAULT_OPTIONS: ValidatorOptions = {
  strictMode: false,
  webkitPrefixWarnings: true,
};

const WEBKIT_PREFIXED_WITH_STANDARD: Record<string, string> = {
  '-webkit-backdrop-filter': 'backdrop-filter',
  '-webkit-text-stroke': 'text-stroke',
  '-webkit-overflow-scrolling': 'overflow: auto (with overscroll-behavior)',
  '-webkit-line-clamp': 'line-clamp',
  '-webkit-appearance': 'appearance',
};

export class CSSValidator {
  private options: ValidatorOptions;

  constructor(opts?: Partial<ValidatorOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...opts };
  }

  validate(css: string): ValidationResult {
    const warnings: ValidationWarning[] = [];
    const lines = css.split('\n');
    let ruleCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.includes('{')) ruleCount++;

      if (this.options.webkitPrefixWarnings) {
        for (const [prefixed, standard] of Object.entries(WEBKIT_PREFIXED_WITH_STANDARD)) {
          if (line.includes(prefixed)) {
            warnings.push({
              line: i + 1,
              column: lines[i].indexOf(prefixed) + 1,
              severity: 'warning',
              message: `Prefixed property "${prefixed}" has standard equivalent: ${standard}`,
              rule: 'no-webkit-prefix',
            });
          }
        }
      }

      if (this.options.strictMode && line.includes('!important')) {
        warnings.push({
          line: i + 1,
          column: lines[i].indexOf('!important') + 1,
          severity: 'warning',
          message: 'Avoid !important — it disrupts the natural cascade',
          rule: 'no-important',
        });
      }
    }

    const score = Math.max(0, 100 - warnings.length * 5);

    return {
      valid: warnings.filter((w) => w.severity === 'error').length === 0,
      warnings,
      score,
      ruleCount,
    };
  }
}
