import { useState } from 'react';
import { createDynamicAssessment } from '../../content/dynamicQuestions';
import { TreeCanvas } from './TreeCanvas';

export function RecapCheck() {
  const [assessment, setAssessment] = useState(() => createDynamicAssessment(3));
  const [choices, setChoices] = useState<Record<string, number>>({});
  const answered = Object.keys(choices).length;
  const correct = assessment.questions.filter(question => choices[question.id] === question.answer).length;
  const retry = () => { setAssessment(createDynamicAssessment(3)); setChoices({}); };
  return <div className="recap-check">
    <h3>Can you predict the next change?</h3>
    <p>This challenge recap is generated from a fresh tree each time, including traversal, insertion and deletion reasoning.</p>
    <div className="assessment-tree"><TreeCanvas root={assessment.root} /><p>Use this tree to answer the recap questions.</p></div>
    {assessment.questions.map(question => <article key={question.id} className="question-card">
      <h3>{question.prompt}</h3>
      <div className="answers">{question.options.map((option, index) => <button key={option} disabled={choices[question.id] !== undefined} className={choices[question.id] === undefined ? '' : index === question.answer ? 'right' : index === choices[question.id] ? 'wrong' : ''} onClick={() => setChoices(previous => ({ ...previous, [question.id]: index }))}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
      {choices[question.id] !== undefined && <div className={`feedback ${choices[question.id] === question.answer ? 'good' : 'bad'}`} role="status"><b>{choices[question.id] === question.answer ? 'Correct.' : 'Not quite.'}</b><p>{choices[question.id] !== question.answer && `${question.misconception} `}{question.explain}</p></div>}
    </article>)}
    <p aria-live="polite">{answered} of {assessment.questions.length} answered · {correct} correct</p>
    {answered === assessment.questions.length && <button className="primary" onClick={retry}>Try a new challenge tree</button>}
  </div>;
}
