import { useEffect, useState } from 'react';
import { randomTree } from '../../domain/generator';
import { pseudo, traversalSteps, type TraversalKind } from '../../domain/traversals';
import { TreeCanvas } from './TreeCanvas';
import { OperationVisualiser } from './OperationVisualiser';
import { TreeWorkbench } from './TreeWorkbench';

type Mode = 'traversal' | 'insert' | 'delete' | 'practice';

export function Visualiser() {
  const [mode, setMode] = useState<Mode>('traversal');
  const [kind, setKind] = useState<TraversalKind>('inorder');
  const [index, setIndex] = useState(0);
  const [play, setPlay] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [studioTree, setStudioTree] = useState(() => randomTree(7)!);
  const [studioTreeVersion, setStudioTreeVersion] = useState(0);
  const steps = traversalSteps(studioTree, kind);
  const step = steps[index];
  useEffect(() => {
    if (!play) return;
    const timer = setTimeout(() => setIndex(current => { if (current >= steps.length - 1) { setPlay(false); return current; } return current + 1; }), speed);
    return () => clearTimeout(timer);
  }, [play, index, steps.length, speed]);
  const switchKind = (nextKind: TraversalKind) => { setKind(nextKind); setIndex(0); setPlay(false); };
  return <section className="visualiser">
    <div className="section-intro studio-intro"><div><p className="eyebrow">03 / TREE STUDIO</p><h2>Make the algorithm visible.</h2><p>Traverse, insert, delete, or practise changing a tree directly.</p></div><button className="refresh-tree" aria-label="Generate a new Tree Studio tree" onClick={() => { setStudioTree(randomTree(7)!); setStudioTreeVersion(version => version + 1); setIndex(0); setPlay(false); }}>↻ Generate new tree</button></div>
    <div className="tab-row" aria-label="Tree operation">{(['traversal', 'insert', 'delete', 'practice'] as Mode[]).map(item => <button key={item} className={mode === item ? 'selected' : ''} aria-pressed={mode === item} onClick={() => { setMode(item); setPlay(false); }}>{item === 'traversal' ? 'Traversal' : item === 'insert' ? 'Insertion' : item === 'delete' ? 'Deletion' : 'Build a tree'}</button>)}</div>
    <div hidden={mode !== 'practice'}><TreeWorkbench /></div>
    {mode !== 'practice' && (mode !== 'traversal' ? <OperationVisualiser key={`${mode}-${studioTreeVersion}`} kind={mode} initialRoot={studioTree} /> : <>
      <div className="tab-row">{(['preorder', 'inorder', 'postorder', 'levelorder'] as TraversalKind[]).map(item => <button key={item} className={kind === item ? 'selected' : ''} onClick={() => switchKind(item)}>{item.replace('order', '-order')}</button>)}</div>
      <div className="visual-grid"><TreeCanvas root={studioTree} active={step.active} visited={step.visited} /><aside className="code-panel"><span className="eyebrow">PSEUDOCODE</span>{pseudo[kind].map((line, lineIndex) => <code key={line} className={lineIndex === 1 ? 'lit' : ''}>{lineIndex + 1}. {line}</code>)}<div className="data-readout"><b>OUTPUT</b><strong>[ {step.output.join(', ')} ]</strong><small>{kind === 'levelorder' ? 'QUEUE' : 'NEXT UP'}: {step.frontier.length ? step.frontier.join(' · ') : 'empty'}</small></div></aside></div>
      <p className="narration" aria-live="polite">{step.narration}</p><div className="transport"><button onClick={() => setIndex(current => Math.max(0, current - 1))} disabled={!index}>← Back</button><button className="play" onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button><button onClick={() => setIndex(current => Math.min(steps.length - 1, current + 1))} disabled={index === steps.length - 1}>Next →</button><label>Speed <input aria-label="Playback speed" type="range" min="300" max="1200" step="100" value={1500 - speed} onChange={event => setSpeed(1500 - Number(event.target.value))} /></label></div>
    </>)}
  </section>;
}
