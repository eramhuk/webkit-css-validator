/**
 * Verifies correct usage of CSS containment properties (contain, content-visibility)
 * which are critical for WebKit rendering performance optimization.
 */
export type ContainmentType = 'none' | 'layout' | 'style' | 'paint' | 'size' | 'strict' | 'content';

export interface ContainmentIssue {
  selector: string;
  issue: string;
  suggestion: string;
  severity: 'info' | 'warning' | 'error';
}

export class ContainmentChecker {
  check(selector: string, containValue: string): ContainmentIssue[] {
    const issues: ContainmentIssue[] = [];
    const values = containValue.split(/\s+/) as ContainmentType[];

    if (values.includes('size') && !values.includes('layout')) {
      issues.push({
        selector,
        issue: 'size containment without layout containment has limited benefit',
        suggestion: 'Use "contain: layout size" or "contain: strict" for maximum optimization',
        severity: 'info',
      });
    }

    if (values.includes('paint') && values.includes('layout') && values.includes('style')) {
      issues.push({
        selector,
        issue: 'This combination is equivalent to "contain: content"',
        suggestion: 'Replace with "contain: content" for clarity',
        severity: 'info',
      });
    }

    if (values.includes('strict')) {
      issues.push({
        selector,
        issue: 'strict containment requires explicit dimensions on the element',
        suggestion: 'Ensure width and height are set to avoid collapsed layout',
        severity: 'warning',
      });
    }

    return issues;
  }
}
