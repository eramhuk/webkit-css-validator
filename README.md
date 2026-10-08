# webkit-css-validator

A CSS specification validator and structural linter built around WebKit's
CSS parsing model. Validates stylesheets against the CSS specification and
identifies patterns that cause expensive style recalculations in WebKit.

## Features

- **Selector Complexity Analyzer** — Scores selectors by specificity and match cost
- **Property Validation** — Validates CSS property values against spec grammars
- **Cascade Optimizer** — Detects redundant rules that are always overridden
- **Containment Checker** — Verifies correct usage of CSS containment properties
- **Custom Property Linter** — Validates CSS custom property fallback chains

## Installation

```bash
npm install webkit-css-validator
```

## Usage

```typescript
import { CSSValidator } from 'webkit-css-validator';

const validator = new CSSValidator({
  strictMode: true,
  webkitPrefixWarnings: true,
});

const result = validator.validate(`
  .container {
    display: flex;
    -webkit-backdrop-filter: blur(10px);
    contain: layout style;
  }
`);

console.log(result.warnings);
console.log(result.score);
```

## License

MIT
