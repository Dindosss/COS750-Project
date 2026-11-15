import { useEffect, useState } from 'react';
import { RecapCheck } from '../components/cos212/RecapCheck';
import { stages, type StageId } from '../application/flow';
import { load, save } from '../persistence/storage';
import { findNode } from '../domain/tree';
import { randomTree } from '../domain/generator';
import { glossary, lessonCards } from '../content/lesson';
import { TreeCanvas } from '../components/cos212/TreeCanvas';
import { Visualiser } from '../components/cos212/Visualiser';
import { Quiz } from '../components/cos212/Quiz';

const completedDefault: StageId[] = ['welcome'];

export default function App() {
  const [stage, setStage] = useState<StageId>(() => load('cos212-stage', 'welcome'));
  const [done, setDone] = useState<StageId[]>(() => load('cos212-done', completedDefault));
  const [score, setScore] = useState(() => load('cos212-score', 0));
  const [lessonTree, setLessonTree] = useState(() => randomTree(7)!);
  const [selected, setSelected] = useState(() => lessonTree.id);
  useEffect(() => { save('cos212-stage', stage); save('cos212-done', done); save('cos212-score', score); }, [stage, done, score]);
  const go = (nextStage: StageId) => { setStage(nextStage); if (!done.includes(nextStage)) setDone([...done, nextStage]); };
  const current = stages.findIndex(item => item.id === stage);
  const next = () => go(stages[Math.min(4, current + 1)].id);
  const node = findNode(lessonTree, selected);
  const refreshLesson = () => { const nextTree = randomTree(7)!; setLessonTree(nextTree); setSelected(nextTree.id); };

  return <main>
    <header><a className="brand" href="#top"><span>⌘</span>COS212 <em>Binary trees</em></a></header>
    <nav aria-label="Learning stages">{stages.map(item => <button key={item.id} onClick={() => done.includes(item.id) && go(item.id)} disabled={!done.includes(item.id) && item.id !== stage} className={stage === item.id ? 'here' : done.includes(item.id) ? 'done' : ''}><small>{item.kicker}</small>{item.label}</button>)}</nav>
    <div id="top" className="page">
      {stage === 'welcome' && <section className="hero"><div><p className="eyebrow">SELF-PACED MINI COURSE</p><h1>Binary trees,<br /><mark>made tangible.</mark></h1><p className="lead">Learn to read, build and traverse a binary search tree—one clean visual step at a time.</p><button className="primary" onClick={next}>Begin the tutor <b>→</b></button><p className="time">About 25 minutes · Your progress stays here</p></div><div className="hero-art"><span>ROOT</span><div className="root-dot">8</div><i className="line l1" /><i className="line l2" /><div className="leaf one">3</div><div className="leaf two">10</div><b>at most<br />two children</b></div></section>}
      {stage === 'lesson' && <section className="lesson"><div className="section-intro"><p className="eyebrow">02 / TREE LAB</p><h2>Start with the shape.</h2><p>Tap a node, then use the terms below to build your vocabulary. This tree is new each time you restart the page.</p><button className="refresh-tree" onClick={refreshLesson}>↻ Generate new tree</button></div><div className="lesson-grid"><TreeCanvas root={lessonTree} active={selected} onSelect={setSelected} /><aside className="node-detail"><p className="eyebrow">NODE INSPECTOR</p><strong>{node?.value}</strong><p>{selected === lessonTree.id ? 'Root node: the entry point to this tree.' : `${node?.value} is a ${!node?.left && !node?.right ? 'leaf' : 'node'} with ${Number(Boolean(node?.left)) + Number(Boolean(node?.right))} child link(s).`}</p><button onClick={() => setSelected(lessonTree.id)}>Reset selection</button></aside></div><div className="concepts">{lessonCards.map((card, index) => <article key={card.title}><span>0{index + 1}</span><h3>{card.title}</h3><p>{card.body}</p></article>)}</div><div className="glossary"><h3>Tap-to-learn glossary</h3>{glossary.map(([word, definition]) => <details key={word}><summary>{word}<b>+</b></summary><p>{definition}</p></details>)}</div><button className="primary next" onClick={next}>Explore tree operations <b>→</b></button></section>}
      {stage === 'visualiser' && <><Visualiser /><button className="primary next" onClick={next}>Take the check-in <b>→</b></button></>}
      {stage === 'quiz' && <Quiz onComplete={result => { setScore(result); go('summary'); }} />}
      {stage === 'summary' && <section className="summary"><p className="eyebrow">05 / YOUR RECAP</p><h2>That’s a solid start.</h2><div className="score"><strong>{score}%</strong><span>check-in mastery</span></div><p>{score >= 75 ? 'You can now identify tree parts and reason about traversals, insertion and deletion.' : 'Revisit the tree lab and tree studio, then retry the check-in—practice makes the order feel natural.'}</p><div className="recap-grid"><article><b>Remember</b><p>BST: smaller left, larger right.</p></article><article><b>For traversal</b><p>Say the order out loud: root/left/right, left/root/right, or left/right/root.</p></article></div><div className="recap-grid"><article><b>For insertion</b><p>Compare at every level. Attach a new leaf at an empty link.</p></article><article><b>For deletion</b><p>Leaf: remove the link. One child: reconnect it. Two children: use the minimum in the right subtree, then repair its old link.</p></article></div><RecapCheck /><button className="primary" onClick={() => go('visualiser')}>Practise tree operations again</button></section>}
    </div>
    <footer>COS212 · Binary Trees Tutor <span>Designed for focused learning.</span></footer>
  </main>;
}
