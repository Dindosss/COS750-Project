import { useState } from 'react';
import { operationQuestions } from '../../content/operationQuestions';

export function RecapCheck() {
  const [choices, setChoices] = useState<Record<string, number>>({});
  const answered = Object.keys(choices).length;
  const correct = operationQuestions.filter(q => choices[q.id] === q.answer).length;
  return <div className="recap-check">
    <h3>Can you predict the next change?</h3>
    <p>Test insertion and every deletion case. Choose an answer for immediate feedback.</p>
    {operationQuestions.map(q => <article key={q.id} className="question-card">
      <h3>{q.prompt}</h3>
      <div className="answers">{q.options.map((option, i) => <button key={option} disabled={choices[q.id] !== undefined} className={choices[q.id] === undefined ? '' : i === q.answer ? 'right' : i === choices[q.id] ? 'wrong' : ''} onClick={() => setChoices(previous => ({ ...previous, [q.id]: i }))}><span>{String.fromCharCode(65 + i)}</span>{option}</button>)}</div>
      {choices[q.id] !== undefined && <div className={`feedback ${choices[q.id] === q.answer ? 'good' : 'bad'}`} role="status"><b>{choices[q.id] === q.answer ? 'Correct.' : 'Not quite.'}</b><p>{choices[q.id] !== q.answer && `${q.misconception} `}{q.explain}</p></div>}
    </article>)}
    <p aria-live="polite">{answered} of {operationQuestions.length} answered · {correct} correct</p>
    {answered === operationQuestions.length && <button className="primary" onClick={() => setChoices({})}>Retry recap questions</button>}
  </div>;
}
