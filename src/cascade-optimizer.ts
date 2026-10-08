/**
 * Detects redundant CSS rules that are always overridden by higher-specificity
 * selectors, helping reduce stylesheet size and style recalculation cost.
 */
export interface RedundantRule {
  selector: string;
  property: string;
  overriddenBy: string;
  line: number;
}

export class CascadeOptimizer {
  private rules: Array<{ selector: string; properties: Map<string, string>; line: number }> = [];

  addRule(selector: string, properties: Record<string, string>, line: number): void {
    this.rules.push({
      selector,
      properties: new Map(Object.entries(properties)),
      line,
    });
  }

  findRedundantRules(): RedundantRule[] {
    const redundant: RedundantRule[] = [];

    for (let i = 0; i < this.rules.length; i++) {
      for (let j = i + 1; j < this.rules.length; j++) {
        if (this.rules[j].selector === this.rules[i].selector) {
          for (const [prop] of this.rules[i].properties) {
            if (this.rules[j].properties.has(prop)) {
              redundant.push({
                selector: this.rules[i].selector,
                property: prop,
                overriddenBy: this.rules[j].selector,
                line: this.rules[i].line,
              });
            }
          }
        }
      }
    }

    return redundant;
  }

  getSavingsEstimate(): { removableRules: number; estimatedBytesSaved: number } {
    const redundant = this.findRedundantRules();
    return {
      removableRules: redundant.length,
      estimatedBytesSaved: redundant.reduce(
        (sum, r) => sum + r.selector.length + r.property.length + 10,
        0
      ),
    };
  }
}
