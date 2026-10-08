/**
 * Calculates CSS selector specificity using the standard
 * (id, class, element) tuple scoring system.
 */
export class SpecificityCalculator {
  calculate(selector: string): [number, number, number] {
    let ids = 0;
    let classes = 0;
    let elements = 0;

    const cleaned = selector
      .replace(/:not\(([^)]*)\)/g, '$1')
      .replace(/\[.*?\]/g, () => { classes++; return ''; })
      .trim();

    const idMatches = cleaned.match(/#[\w-]+/g);
    ids += idMatches?.length ?? 0;

    const classMatches = cleaned.match(/\.[\w-]+/g);
    classes += classMatches?.length ?? 0;

    const pseudoClasses = cleaned.match(/:[\w-]+/g);
    classes += pseudoClasses?.length ?? 0;

    const remaining = cleaned
      .replace(/#[\w-]+/g, '')
      .replace(/\.[\w-]+/g, '')
      .replace(/:[\w-]+/g, '')
      .replace(/[>+~*]/g, '')
      .trim();

    const tags = remaining.split(/\s+/).filter((t) => t.length > 0);
    elements += tags.length;

    return [ids, classes, elements];
  }
}
