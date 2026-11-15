import { describe, expect, it } from 'vitest';
import { createDynamicAssessment } from './dynamicQuestions';
import { learningObjectives } from './learningObjectives';

describe('dynamic assessments', () => {
  it('creates answerable questions for each difficulty level', () => {
    for (const difficulty of [1, 2, 3] as const) {
      const assessment = createDynamicAssessment(difficulty);
      expect(assessment.root).toBeTruthy();
      expect(assessment.questions.length).toBeGreaterThanOrEqual(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 7);
      for (const question of assessment.questions) {
        expect(question.options).toHaveLength(4);
        expect(question.options[question.answer]).toBeTruthy();
      }
    }
  });

  it('aligns every learning objective to the challenge check-in', () => {
    const assessment = createDynamicAssessment(3);
    const assessed = new Set(assessment.questions.map(question => question.objectiveId));
    expect(learningObjectives.every(objective => assessed.has(objective.id))).toBe(true);
  });
});
