import { useEffect, useMemo, useState } from 'react';
import { sampleTree } from '../../domain/tree';
import { treeFromValues } from '../../domain/generator';
import { operationPseudo, operationSteps, type OperationKind } from '../../domain/operations';
import { TreeCanvas } from './TreeCanvas';

const examples = {
  sample: { label: 'Sample tree', values: undefined },
  leaf: { label: 'Delete leaf · 1', values: [8, 3, 10, 1], value: 1 },
  child: { label: 'Delete one child · 10', values: [8, 3, 10, 14, 13], value: 10 },
  root: { label: 'Delete root · 8', values: [8, 3, 10, 1, 6, 14, 13], value: 8 },
  successor: { label: 'Successor with child · 8', values: [8, 3, 14, 10, 12, 18], value: 8 },
  single: { label: 'Single node · 8', values: [8], value: 8 },
  empty: { label: 'Empty tree', values: [], value: 8 },
} satisfies Record<string, { label: string; values?: number[]; value?: number }>;
type Example = keyof typeof examples;

export function OperationVisualiser({ kind }: { kind: OperationKind }) {
  const [example, setExample] = useState<Example>('sample');
  const [input, setInput] = useState(kind === 'insert' ? '5' : '8');
  const [value, setValue] = useState(kind === 'insert' ? 5 : 8);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [error, setError] = useState('');
  const root = useMemo(() => example === 'sample' ? sampleTree() : treeFromValues(examples[example].values ?? []), [example]);
  const steps = useMemo(() => operationSteps(root, kind, value), [root, kind, value]);
  const step = steps[index];
  useEffect(() => {
    if (!playing) return;
    if (index === steps.length - 1) { setPlaying(false); return; }
    const timer = setTimeout(() => setIndex(i => i + 1), speed);
    return () => clearTimeout(timer);
  }, [playing, index, steps.length, speed]);
  const reset = () => { setIndex(0); setPlaying(false); };
  return <>
    <p className="operation-intro">{kind === 'insert' ? 'Compare at every level, then attach a new leaf at an empty link.' : 'Search at every level, inspect the children, then repair the links. Try each deletion case below.'} These are binary search tree (BST) operations; values are unique. Level 0 is the root.</p>
    <form className="operation-controls" onSubmit={e => {
      e.preventDefault();
      const next = Number(input);
      if (!input.trim() || !Number.isSafeInteger(next) || Math.abs(next) > 999) { setError('Enter a whole number from -999 to 999.'); return; }
      setValue(next); setError(''); reset();
    }}>
      <label>Starting tree<select value={example} onChange={e => {
        const key = e.target.value as Example;
        setExample(key); reset(); setError('');
        const preset = examples[key];
        // Insertions into an empty tree may use any learner-entered value.
        // Deletion examples retain their preset target value.
        if (kind === 'delete' && 'value' in preset) { setInput(String(preset.value)); setValue(preset.value); }
      }}>{Object.entries(examples).filter(([key]) => kind === 'delete' || ['sample', 'single', 'empty'].includes(key)).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>)}</select></label>
      <label>Value to {kind}<input type="number" min="-999" max="999" step="1" value={input} onChange={e => {
        const nextInput = e.target.value;
        setInput(nextInput);
        const nextValue = Number(nextInput);
        if (nextInput.trim() && Number.isSafeInteger(nextValue) && Math.abs(nextValue) <= 999) {
          setValue(nextValue); setError(''); reset();
        }
      }} /></label>
      <button type="submit">Show steps</button>
    </form>
    {error && <p role="alert" className="operation-error">{error}</p>}
    <div className="step-status"><span>{kind === 'insert' ? 'INSERT' : 'DELETE'} {value}</span><span>Step {index + 1} of {steps.length} · {step.phase}</span></div>
    <div className="visual-grid">
      <TreeCanvas root={step.root} active={step.active} visited={step.visited} />
      <aside className="code-panel"><span className="eyebrow">PSEUDOCODE</span>{operationPseudo[kind].map((line, i) => <code key={line} className={step.line === i ? 'lit' : ''}>{i + 1}. {line}</code>)}<div className="data-readout"><b>COLOUR KEY</b><small>Orange: active node · Green: search path</small><small>Back restores the previous tree and explanation.</small></div></aside>
    </div>
    <p className="narration" aria-live="polite">{step.narration}</p>
    <div className="transport">
      <button disabled={!index} onClick={() => { setPlaying(false); setIndex(i => i - 1); }}>← Back</button>
      <button className="play" onClick={() => { if (index === steps.length - 1) setIndex(0); setPlaying(!playing); }}>{playing ? 'Pause' : index === steps.length - 1 ? 'Replay' : 'Play'}</button>
      <button disabled={index === steps.length - 1} onClick={() => { setPlaying(false); setIndex(i => i + 1); }}>Next →</button>
      <button onClick={reset}>Reset</button>
      <label>Speed<input aria-label="Operation playback speed" type="range" min="300" max="1200" step="100" value={1500 - speed} onChange={e => setSpeed(1500 - Number(e.target.value))} /></label>
    </div>
  </>;
}
