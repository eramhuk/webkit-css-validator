export interface ValidatorOptions {
  /** Enable strict W3C spec compliance checking. */
  strictMode: boolean;
  /** Warn on -webkit- prefixed properties with unprefixed equivalents. */
  webkitPrefixWarnings: boolean;
  /** Maximum selector specificity score before warning. */
  maxSpecificity?: number;
}

export interface ValidationResult {
  /** Whether the stylesheet is valid. */
  valid: boolean;
  /** List of validation warnings. */
  warnings: ValidationWarning[];
  /** Overall quality score from 0-100. */
  score: number;
  /** Number of rules analyzed. */
  ruleCount: number;
}

export interface ValidationWarning {
  line: number;
  column: number;
  severity: 'info' | 'warning' | 'error';
  message: string;
  rule: string;
}

export interface SelectorScore {
  selector: string;
  specificity: [number, number, number];
  estimatedMatchCost: number;
}
