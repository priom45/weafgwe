export interface ExtractedMetric {
  value: string;
  type: 'percentage' | 'multiplier' | 'currency' | 'time' | 'scale' | 'quantity' | 'range';
  context: string;
  position: number;
  normalized: string;
}

export interface MetricValidationResult {
  preserved: ExtractedMetric[];
  lost: ExtractedMetric[];
  allPreserved: boolean;
  preservationRate: number;
}

export class MetricPreserver {
  private static readonly METRIC_PATTERNS = [
    {
      type: 'percentage' as const,
      pattern: /(\d+(?:\.\d+)?%)/g,
      weight: 10
    },
    {
      type: 'multiplier' as const,
      pattern: /(\d+(?:\.\d+)?x)(?:\s+(?:faster|more|increase|growth|improvement))?/gi,
      weight: 9
    },
    {
      type: 'currency' as const,
      pattern: /(\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*[KMB])?)/gi,
      weight: 10
    },
    {
      type: 'scale' as const,
      pattern: /(\d+(?:,\d{3})+\+?)(?:\s+(?:users?|customers?|clients?|requests?|transactions?|records?))?/gi,
      weight: 9
    },
    {
      type: 'time' as const,
      pattern: /(\d+(?:\.\d+)?\s+(?:hours?|days?|weeks?|months?|years?|seconds?|minutes?))/gi,
      weight: 8
    },
    {
      type: 'quantity' as const,
      pattern: /(\d+\+?\s+(?:engineers?|developers?|teams?|projects?|features?|applications?|systems?|services?))/gi,
      weight: 7
    },
    {
      type: 'range' as const,
      pattern: /((?:reduced|increased|improved|grew|achieved|saved|generated|enhanced|optimized|accelerated)(?:\s+\w+){0,3}\s+(?:by|to|from)\s+\d+(?:\.\d+)?(?:%|x)?)/gi,
      weight: 10
    }
  ];

  private static readonly ACTION_IMPACT_PHRASES = [
    'reduced', 'increased', 'improved', 'grew', 'achieved', 'saved',
    'generated', 'enhanced', 'optimized', 'accelerated', 'boosted',
    'delivered', 'exceeded', 'minimized', 'maximized', 'doubled',
    'tripled', 'decreased', 'elevated', 'streamlined'
  ];

  static extractMetrics(text: string): ExtractedMetric[] {
    const metrics: ExtractedMetric[] = [];
    const seenMetrics = new Set<string>();

    for (const { type, pattern } of this.METRIC_PATTERNS) {
      const matches = text.matchAll(pattern);

      for (const match of matches) {
        if (match[0] && match.index !== undefined) {
          const value = match[0].trim();
          const normalized = this.normalizeMetric(value);

          if (!seenMetrics.has(normalized)) {
            seenMetrics.add(normalized);

            const contextStart = Math.max(0, match.index - 30);
            const contextEnd = Math.min(text.length, match.index + value.length + 30);
            const context = text.substring(contextStart, contextEnd).trim();

            metrics.push({
              value,
              type,
              context,
              position: match.index,
              normalized
            });
          }
        }
      }
    }

    return metrics.sort((a, b) => a.position - b.position);
  }

  static validateMetricsInRewrite(
    originalMetrics: ExtractedMetric[],
    rewrittenText: string
  ): MetricValidationResult {
    if (originalMetrics.length === 0) {
      return {
        preserved: [],
        lost: [],
        allPreserved: true,
        preservationRate: 1.0
      };
    }

    const rewrittenMetrics = this.extractMetrics(rewrittenText);
    const rewrittenNormalized = new Set(
      rewrittenMetrics.map(m => m.normalized)
    );

    const preserved: ExtractedMetric[] = [];
    const lost: ExtractedMetric[] = [];

    for (const original of originalMetrics) {
      if (rewrittenNormalized.has(original.normalized)) {
        preserved.push(original);
      } else {
        const partialMatch = rewrittenMetrics.some(rewritten =>
          this.metricsPartiallyMatch(original, rewritten)
        );

        if (partialMatch) {
          preserved.push(original);
        } else {
          lost.push(original);
        }
      }
    }

    return {
      preserved,
      lost,
      allPreserved: lost.length === 0,
      preservationRate: preserved.length / originalMetrics.length
    };
  }

  static reinsertMetrics(
    rewrittenText: string,
    lostMetrics: ExtractedMetric[]
  ): string {
    if (lostMetrics.length === 0) {
      return rewrittenText;
    }

    let updatedText = rewrittenText;

    for (const metric of lostMetrics) {
      const insertionPoint = this.findBestInsertionPoint(updatedText, metric);

      if (insertionPoint !== -1) {
        const before = updatedText.substring(0, insertionPoint);
        const after = updatedText.substring(insertionPoint);

        const connector = this.needsConnector(before, after) ? ', ' : ' ';
        updatedText = `${before}${connector}${this.formatMetricForInsertion(metric)}${after}`;
      } else {
        updatedText = `${updatedText} ${this.formatMetricForInsertion(metric)}`;
      }
    }

    return updatedText;
  }

  private static findBestInsertionPoint(text: string, metric: ExtractedMetric): number {
    const contextWords = metric.context
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);

    let bestScore = 0;
    let bestPosition = -1;

    const sentences = text.split(/[.!?]\s+/);
    let currentPosition = 0;

    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      let score = 0;

      for (const word of contextWords) {
        if (sentenceLower.includes(word)) {
          score++;
        }
      }

      for (const phrase of this.ACTION_IMPACT_PHRASES) {
        if (sentenceLower.includes(phrase)) {
          score += 2;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestPosition = currentPosition + sentence.length;
      }

      currentPosition += sentence.length + 2;
    }

    return bestPosition;
  }

  private static needsConnector(before: string, after: string): boolean {
    const beforeEnds = before.trimEnd();
    const afterStarts = after.trimStart();

    if (beforeEnds.endsWith(',') || beforeEnds.endsWith('.')) {
      return false;
    }

    if (afterStarts.startsWith(',') || afterStarts.startsWith('.')) {
      return false;
    }

    return true;
  }

  private static formatMetricForInsertion(metric: ExtractedMetric): string {
    switch (metric.type) {
      case 'percentage':
        return `(${metric.value} improvement)`;
      case 'multiplier':
        return `achieving ${metric.value} performance`;
      case 'currency':
        return `generating ${metric.value}`;
      case 'scale':
        return `serving ${metric.value}`;
      case 'time':
        return `in ${metric.value}`;
      case 'quantity':
        return `involving ${metric.value}`;
      case 'range':
        return metric.value;
      default:
        return metric.value;
    }
  }

  static normalizeMetric(metric: string): string {
    return metric
      .toLowerCase()
      .replace(/[,\s]/g, '')
      .replace(/\b(users?|customers?|clients?|engineers?|developers?|teams?|projects?|features?|applications?|systems?|hours?|days?|weeks?|months?|years?)\b/gi, '');
  }

  private static metricsPartiallyMatch(metric1: ExtractedMetric, metric2: ExtractedMetric): boolean {
    const num1 = metric1.value.match(/\d+(?:\.\d+)?/);
    const num2 = metric2.value.match(/\d+(?:\.\d+)?/);

    if (num1 && num2) {
      const value1 = parseFloat(num1[0]);
      const value2 = parseFloat(num2[0]);

      const percentDiff = Math.abs(value1 - value2) / value1;
      if (percentDiff < 0.1) {
        return true;
      }
    }

    if (metric1.type === metric2.type) {
      const similarity = this.calculateStringSimilarity(
        metric1.normalized,
        metric2.normalized
      );
      return similarity > 0.7;
    }

    return false;
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  static generateMetricPreservationPrompt(
    originalBullet: string,
    metrics: ExtractedMetric[]
  ): string {
    if (metrics.length === 0) {
      return '';
    }

    const metricsList = metrics.map(m => `- ${m.value} (${m.type})`).join('\n');

    return `
CRITICAL: This bullet contains quantifiable metrics that MUST be preserved exactly:
${metricsList}

Original bullet: "${originalBullet}"

Requirements for rewrite:
1. Include ALL metrics listed above with EXACT same numbers
2. Keep metrics in similar context (e.g., if "reduced by 40%" was about performance, keep it about performance)
3. Use strong action verbs but maintain the metric values
4. Follow STAR format while preserving all measurements

Rewrite maintaining ALL metrics:
`.trim();
  }

  static getMetricsSummary(metrics: ExtractedMetric[]): {
    total: number;
    byType: Record<string, number>;
    highImpact: ExtractedMetric[];
  } {
    const byType: Record<string, number> = {};
    const highImpactTypes = new Set(['percentage', 'multiplier', 'currency', 'range']);

    for (const metric of metrics) {
      byType[metric.type] = (byType[metric.type] || 0) + 1;
    }

    const highImpact = metrics.filter(m => highImpactTypes.has(m.type));

    return {
      total: metrics.length,
      byType,
      highImpact
    };
  }

  static analyzeMetricQuality(metric: ExtractedMetric): {
    quality: 'high' | 'medium' | 'low';
    hasContext: boolean;
    hasActionVerb: boolean;
    score: number;
  } {
    let score = 0;
    let hasActionVerb = false;
    let hasContext = false;

    const contextLower = metric.context.toLowerCase();

    for (const phrase of this.ACTION_IMPACT_PHRASES) {
      if (contextLower.includes(phrase)) {
        hasActionVerb = true;
        score += 3;
        break;
      }
    }

    const meaningfulWords = ['team', 'project', 'system', 'platform', 'service', 'application', 'performance', 'efficiency', 'quality'];
    for (const word of meaningfulWords) {
      if (contextLower.includes(word)) {
        hasContext = true;
        score += 1;
      }
    }

    const typeScores = {
      percentage: 3,
      multiplier: 3,
      currency: 3,
      range: 3,
      scale: 2,
      quantity: 2,
      time: 1
    };

    score += typeScores[metric.type] || 0;

    let quality: 'high' | 'medium' | 'low';
    if (score >= 6) {
      quality = 'high';
    } else if (score >= 3) {
      quality = 'medium';
    } else {
      quality = 'low';
    }

    return {
      quality,
      hasContext,
      hasActionVerb,
      score
    };
  }
}

export const metricPreserver = MetricPreserver;
