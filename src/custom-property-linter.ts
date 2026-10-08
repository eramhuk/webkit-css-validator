/**
 * Validates CSS custom property (variable) fallback chains and detects
 * circular references that would cause WebKit to use initial values.
 */
export interface CustomPropertyIssue {
  property: string;
  issue: string;
  line: number;
}

export class CustomPropertyLinter {
  private definitions = new Map<string, { value: string; line: number }>();

  addDefinition(property: string, value: string, line: number): void {
    if (!property.startsWith('--')) {
      throw new Error(`Custom property must start with --: ${property}`);
    }
    this.definitions.set(property, { value, line });
  }

  lint(): CustomPropertyIssue[] {
    const issues: CustomPropertyIssue[] = [];

    for (const [prop, def] of this.definitions) {
      const refs = this.extractVarReferences(def.value);

      for (const ref of refs) {
        if (!this.definitions.has(ref)) {
          const hasFallback = def.value.includes(`var(${ref},`);
          if (!hasFallback) {
            issues.push({
              property: prop,
              issue: `References undefined custom property "${ref}" with no fallback`,
              line: def.line,
            });
          }
        }
      }

      if (this.hasCircularReference(prop, new Set())) {
        issues.push({
          property: prop,
          issue: 'Circular reference detected — WebKit will use the initial value',
          line: def.line,
        });
      }
    }

    return issues;
  }

  private extractVarReferences(value: string): string[] {
    const refs: string[] = [];
    const regex = /var\((--[\w-]+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      refs.push(match[1]);
    }
    return refs;
  }

  private hasCircularReference(prop: string, visited: Set<string>): boolean {
    if (visited.has(prop)) return true;
    visited.add(prop);
    const def = this.definitions.get(prop);
    if (!def) return false;
    const refs = this.extractVarReferences(def.value);
    return refs.some((ref) => this.hasCircularReference(ref, new Set(visited)));
  }
}
