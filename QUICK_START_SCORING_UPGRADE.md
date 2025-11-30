# Quick Start: Scoring System Upgrade Integration

## Overview

This guide helps you integrate the new scoring system into your existing codebase.

---

## What's New

✅ **500+ Skill Dictionary** - Comprehensive AI/ML/LLM/Cloud mappings
✅ **Semantic Matching** - 60% semantic + 40% literal scoring
✅ **Proportional Penalties** - Max 15% per issue (vs 20-30% drops)
✅ **Context Analysis** - Action verbs + metrics detection
✅ **Smart Confidence** - ML-based with detailed breakdown
✅ **Date Intelligence** - Handles "Expected", "Present", future dates

---

## Quick Integration

### Option 1: Use Directly (Recommended for Testing)

```typescript
import { scoringCore } from './services/scoringCore';

// Example usage
async function analyzeResume(resumeText: string, jdText: string) {
  // 1. Semantic matching
  const match = await scoringCore.semantic_match(
    resumeText,
    jdText,
    ['python', 'machine learning', 'docker']
  );

  console.log(`Match score: ${(match.combinedScore * 100).toFixed(1)}%`);
  console.log(`Matched: ${match.matchedKeywords.join(', ')}`);
  console.log(`Missing: ${match.missingKeywords.join(', ')}`);

  // 2. Context analysis for each keyword
  for (const keyword of match.matchedKeywords) {
    const context = scoringCore.context_validator(keyword, resumeText);
    console.log(`${keyword}: ${context.contextQuality} quality (${context.contextWeight}x weight)`);
  }

  // 3. Calculate penalties for missing skills
  const missingSkills = match.missingKeywords.map(skill => ({
    skill,
    importance: 'high' as const
  }));

  const penalties = scoringCore.calculate_proportional_penalty(missingSkills, 10);
  console.log(`Total penalty: ${penalties.cappedPenalty}% (max 15%)`);

  // 4. Compute confidence
  const features = {
    literalMatchPercentage: match.literalScore * 100,
    semanticSimilarityScore: match.semanticScore,
    experienceRelevancyPercentage: 80,
    missingCriticalKeywordsCount: match.missingKeywords.length,
    totalCriticalKeywords: 10,
    contextQualityScore: 75,
    hasQuantifiedAchievements: true,
    sectionCompleteness: 90,
    formattingScore: 85
  };

  const confidence = scoringCore.compute_confidence(features);
  console.log(`Confidence: ${confidence.level} (${confidence.numericScore}/100)`);
  console.log(`Reasoning:`, confidence.reasoning);
}
```

### Option 2: Enhance Existing scoringService.ts

```typescript
// In scoringService.ts
import { scoringCore } from './scoringCore';
import { keywordContextAnalyzer } from './keywordContextAnalyzer';

// Add to getComprehensiveScore function
export const getComprehensiveScore = async (
  resumeText: string,
  jobDescription?: string,
  jobTitle?: string,
  scoringMode: ScoringMode = 'general'
): Promise<ComprehensiveScore> => {

  // ... existing code ...

  // NEW: Add semantic matching if JD provided
  if (jobDescription && scoringMode === 'jd_based') {
    const keywords = extractKeywordsFromJD(jobDescription); // implement this

    const semanticMatch = await scoringCore.semantic_match(
      resumeText,
      jobDescription,
      keywords
    );

    const contextAnalysis = await scoringCore.analyze_keyword_context_batch(
      resumeText,
      keywords
    );

    // Enhance response with new data
    result.section_scores = {
      jd_alignment_score: Math.round(semanticMatch.combinedScore * 100),
      ats_score: result.overall, // Use existing
      skills_gap_score: Math.round((1 - (semanticMatch.missingKeywords.length / keywords.length)) * 100),
      experience_relevancy_score: 85, // Calculate from dates
      project_match_score: contextAnalysis.overallQuality.averageScore
    };

    result.confidence_breakdown = {
      numeric_score: confidence.numericScore,
      components: {
        literal_match: semanticMatch.literalScore * 100,
        semantic_match: semanticMatch.semanticScore * 100,
        experience_relevancy: 80,
        keyword_coverage: result.section_scores.skills_gap_score,
        context_quality: contextAnalysis.overallQuality.averageScore
      },
      reasoning: confidence.reasoning
    };
  }

  return result;
};
```

---

## Feature-by-Feature Guide

### 1. Skill Dictionary

The dictionary auto-loads on first use:

```typescript
import { synonymExpansionService } from './services/synonymExpansionService';

// Check if loaded
if (synonymExpansionService.isDictionaryLoaded()) {
  console.log('Dictionary ready!');
}

// Get synonyms for a keyword
const synonyms = await synonymExpansionService.expandKeyword('python');
console.log(synonyms); // ['py', 'python3', 'python development', ...]

// Get metadata
const metadata = synonymExpansionService.getKeywordMetadata('python');
console.log(metadata);
// { confidence: 0.95, category: 'backend', importance: 'high' }
```

### 2. Date Normalization

```typescript
import { dateNormalizer } from './utils/dateNormalizer';

// Parse dates
const date1 = dateNormalizer.parseDateFlexible('Expected 06/2025');
console.log(date1);
// {
//   year: 2025,
//   month: 6,
//   isFuture: true,
//   isExpected: true,
//   normalized: 'Expected June 2025',
//   isValid: true
// }

// Calculate duration
const duration = dateNormalizer.calculateDuration('01/2020', 'Present');
console.log(`${duration.years} years, ${duration.months} months`);

// Validate date range
const validation = dateNormalizer.validateDateRange('01/2020', '12/2023');
console.log(`Valid: ${validation.isValid}`);
console.log(`Warnings:`, validation.warnings);
```

### 3. Context Analysis

```typescript
import { keywordContextAnalyzer } from './services/keywordContextAnalyzer';

// Analyze single keyword
const pythonContext = keywordContextAnalyzer.analyzeKeywordContext(
  resumeText,
  'python'
);

console.log(`Quality: ${pythonContext.contextQuality}`);
console.log(`Has action verb: ${pythonContext.hasActionVerb}`);
console.log(`Has metric: ${pythonContext.hasMetric}`);
console.log(`Snippets:`, pythonContext.contextSnippets);

// Analyze multiple keywords
const results = keywordContextAnalyzer.analyzeMultipleKeywords(
  resumeText,
  ['python', 'machine learning', 'docker']
);

// Get overall quality
const overall = keywordContextAnalyzer.calculateOverallContextQuality(results);
console.log(`Average score: ${overall.averageScore}/100`);
console.log(`High quality contexts: ${overall.highQualityCount}`);
```

### 4. Proportional Penalties

```typescript
import { scoringCore } from './services/scoringCore';

const missingSkills = [
  { skill: 'Python', importance: 'critical' },
  { skill: 'Docker', importance: 'medium' },
  { skill: 'Redis', importance: 'low' }
];

const penalties = scoringCore.calculate_proportional_penalty(missingSkills, 10);

console.log(`Penalties:`, penalties.penalties);
console.log(`Total: ${penalties.totalPenalty}%`);
console.log(`Capped: ${penalties.cappedPenalty}%`); // Max 15%

// Apply to score
const baseScore = 85;
const adjusted = scoringCore.apply_soft_penalties(baseScore, penalties.penalties);
console.log(`Score: ${baseScore} → ${adjusted.adjustedScore}`);
```

### 5. Confidence Calculation

```typescript
import { confidenceCalculator } from './services/confidenceCalculator';

// Create features from your analysis
const features = confidenceCalculator.createFeaturesFromAnalysis(
  70,    // literal match %
  0.75,  // semantic score
  5,     // experience years
  3,     // required years
  2,     // missing keywords
  10,    // total keywords
  80,    // context quality
  true,  // has metrics
  95,    // section completeness
  90     // formatting score
);

// Compute confidence
const confidence = confidenceCalculator.computeConfidence(features);

console.log(`Level: ${confidence.level}`);
console.log(`Score: ${confidence.numericScore}/100`);
console.log(`Components:`, confidence.components);
console.log(`Reasoning:`, confidence.reasoning);
console.log(`Strengths:`, confidence.strengths);
console.log(`Weaknesses:`, confidence.weaknesses);
```

---

## Testing

Run the test suite:

```bash
npm test -- scoringCore.test.ts
```

Expected output:
```
✓ should calculate combined score with 60/40 weighting
✓ should parse MM/YYYY format
✓ should apply max 15% penalty per issue
✓ should detect high quality context
✓ should return High confidence for strong features
✓ should maintain score consistency across multiple runs
```

---

## Migration Checklist

- [ ] Review `SCORING_SYSTEM_UPGRADE_SUMMARY.md` for full details
- [ ] Test new modules individually (see examples above)
- [ ] Integrate into existing scoring pipeline (Option 2)
- [ ] Add feature flags for gradual rollout
- [ ] Monitor score distributions in production
- [ ] A/B test old vs new scoring
- [ ] Collect user feedback
- [ ] Measure confidence correlation with human assessment

---

## Performance Notes

**Optimizations Built-In:**
- ✅ Embedding caching (24hr TTL)
- ✅ Skill dictionary loads once on init
- ✅ Batch context analysis
- ✅ Efficient synonym lookups (Map-based)

**Best Practices:**
- Reuse scoringCore instance
- Batch analyze multiple keywords at once
- Cache semantic match results per resume+JD pair
- Pre-warm dictionary on app startup

---

## Troubleshooting

### Issue: "Skill dictionary not loading"

```typescript
import { synonymExpansionService } from './services/synonymExpansionService';

// Force check
if (!synonymExpansionService.isDictionaryLoaded()) {
  console.error('Dictionary failed to load');
  // Check if skillDictionary.json exists at src/data/
}
```

### Issue: "Embeddings taking too long"

```typescript
// Pre-initialize semantic matching
import { semanticMatchingService } from './services/semanticMatchingService';

// On app startup
await semanticMatchingService.initialize();
```

### Issue: "Scores still dropping suddenly"

Verify you're using proportional penalties:

```typescript
// ❌ Old way (binary)
if (missingCriticalSkill) {
  score -= 25; // Sudden cliff
}

// ✅ New way (proportional)
const penalties = scoringCore.calculate_proportional_penalty(
  missingSkills,
  totalSkills
);
const adjusted = scoringCore.apply_soft_penalties(score, penalties.penalties);
score = adjusted.adjustedScore; // Gradual degradation
```

---

## Support

For issues or questions:
1. Check `SCORING_SYSTEM_UPGRADE_SUMMARY.md` for detailed documentation
2. Review test cases in `scoringCore.test.ts` for usage examples
3. Examine `scoringCore.ts` for available APIs

---

## Next Steps

1. **Start Small**: Test one module at a time
2. **Measure Impact**: Compare old vs new scores on sample resumes
3. **Iterate**: Refine based on real-world data
4. **Scale Up**: Gradually roll out to all users

Good luck! 🚀
