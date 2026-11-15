import { useState } from 'react';
import { mastery, type Answer } from '../../application/assessment';
import { createDynamicAssessment, type Difficulty } from '../../content/dynamicQuestions';
import { TreeCanvas } from './TreeCanvas';

const difficultyLabel: Record<Difficulty, string> = { 1: 'Foundation', 2: 'Practice', 3: 'Challenge' };

export function Quiz({ onComplete }: { onComplete: (score: number) => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [assessment, setAssessment] = useState(() => createDynamicAssessment(1));
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number>();
  const [hint, setHint] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const q = assessment.questions[i];
  const answered = choice !== undefined;
  const correct = choice === q.answer;
  const startAssessment = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty); setAssessment(createDynamicAssessment(nextDifficulty));
    setI(0); setChoice(undefined); setHint(0); setAnswers([]);
  };
  const advance = () => {
    const next = [...answers, { questionId: q.id, correct, topic: q.topic }];
    setAnswers(next); setChoice(undefined); setHint(0);
    if (i === assessment.questions.length - 1) onComplete(mastery(next).percent); else setI(i + 1);
  };
  return <section className="quiz">
    <div className="section-intro"><p className="eyebrow">04 / QUICK CHECK</p><h2>Test your instincts.</h2><p>Every check-in uses a newly generated tree. Raise the level when you are ready for traversal, insertion and deletion reasoning.</p></div>
    <div className="difficulty" aria-label="Assessment difficulty"><span>Difficulty</span>{([1, 2, 3] as Difficulty[]).map(level => <button key={level} className={difficulty === level ? 'selected' : ''} aria-pressed={difficulty === level} onClick={() => startAssessment(level)}>{difficultyLabel[level]}</button>)}<button className="new-test" onClick={() => startAssessment(difficulty)}>New tree</button></div>
    <div className="assessment-tree"><TreeCanvas root={assessment.root} /><p>Use this generated tree for every question in this check-in.</p></div>
    <div className="quiz-meter"><span>Question {i + 1} of {assessment.questions.length}</span><div><i style={{ width: `${(i + 1) / assessment.questions.length * 100}%` }} /></div><span>{q.topic}</span></div>
    <article className="question-card"><p className="eyebrow">{q.topic.toUpperCase()} · {difficultyLabel[difficulty]}</p><h3>{q.prompt}</h3><div className="answers">{q.options.map((o, n) => <button key={o} disabled={answered} className={answered ? (n === q.answer ? 'right' : n === choice ? 'wrong' : '') : ''} onClick={() => setChoice(n)}><span>{String.fromCharCode(65 + n)}</span>{o}</button>)}</div>{!answered ? <div className="hints"><button onClick={() => setHint(Math.min(3, hint + 1))}>Need a hint ({3 - hint} left)</button>{hint > 0 && <p>Hint {hint}: {q.hint[hint - 1]}</p>}</div> : <div className={`feedback ${correct ? 'good' : 'bad'}`}><b>{correct ? 'Correct — nice work.' : 'Not quite — use that as a clue.'}</b><p>{correct ? q.explain : q.misconception + ' ' + q.explain}</p><button onClick={advance}>{i === assessment.questions.length - 1 ? 'See my summary' : 'Continue →'}</button></div>}</article>
  </section>;
}
