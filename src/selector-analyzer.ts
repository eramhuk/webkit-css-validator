import type { SelectorScore } from './types.js';
import { SpecificityCalculator } from './specificity.js';

/**
 * Analyzes CSS selectors for performance characteristics relevant
 * to WebKit's style resolution engine.
 */
export class SelectorAnalyzer {
  private calculator = new SpecificityCalculator();

  analyze(selector: string): SelectorScore {
    const specificity = this.calculator.calculate(selector);
    const estimatedMatchCost = this.estimateCost(selector);

    return { selector, specificity, estimatedMatchCost };
  }

  private estimateCost(selector: string): number {
    let cost = 1;
    const parts = selector.split(/\s+/);
    cost += parts.length * 2;
    if (selector.includes('*')) cost += 10;
    if (selector.includes(':not')) cost += 3;
    if (selector.includes(':nth-')) cost += 5;
    if (selector.includes('[')) cost += 2;
    if (selector.includes('+') || selector.includes('~')) cost += 4;
    return cost;
  }
}
