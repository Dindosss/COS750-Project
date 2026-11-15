import { useState } from 'react';
import { randomTree } from '../../domain/generator';
import { findNode, type TreeNode } from '../../domain/tree';
import { operationSteps } from '../../domain/operations';
import { TreeCanvas } from './TreeCanvas';

const nextValue = (root?: TreeNode) => {
  const used = new Set<number>();
  const collect = (node?: TreeNode) => { if (node) { used.add(node.value); collect(node.left); collect(node.right); } };
  collect(root);
  for (let value = 5; value < 100; value += 5) if (!used.has(value)) return value;
  return 101;
};

const run = (root: TreeNode | undefined, kind: 'insert' | 'delete', value: number) => {
  const steps = operationSteps(root, kind, value);
  return steps[steps.length - 1].root;
};

export function TreeWorkbench() {
  const [root, setRoot] = useState<TreeNode | undefined>();
  const [selected, setSelected] = useState(() => root?.id);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('Drag the green value into the insert zone, or drag your selected node into the delete zone.');
  const selectedNode = findNode(root, selected ?? '');
  const suggestedValue = nextValue(root);
  const parsedValue = Number(input);
  const insertValue = input.trim() && Number.isSafeInteger(parsedValue) && Math.abs(parsedValue) <= 999 ? parsedValue : suggestedValue;
  const insert = () => {
    const alreadyPresent = (node: TreeNode | undefined): boolean => !node ? false : node.value === insertValue || alreadyPresent(node.left) || alreadyPresent(node.right);
    if (alreadyPresent(root)) { setMessage(`${insertValue} is already in this BST. Values must be unique.`); return; }
    const wasEmpty = !root;
    setRoot(tree => run(tree, 'insert', insertValue));
    if (wasEmpty) setSelected(`insert-${insertValue}`);
    setInput('');
    setMessage(`Inserted ${insertValue}; the tree has adjusted to keep BST order.`);
  };
  const remove = () => {
    if (!selectedNode) return;
    const value = selectedNode.value;
    const updated = run(root, 'delete', value);
    setRoot(updated); setSelected(updated?.id); setMessage(`Deleted ${value}; links were repaired to preserve the BST.`);
  };
  const clear = () => { setRoot(undefined); setSelected(undefined); setInput(''); setMessage('Your tree is empty. Add any whole number to create its root.'); };
  const loadExample = () => { const tree = randomTree(7); setRoot(tree); setSelected(tree?.id); setMessage('Example tree loaded. Add or remove nodes to make it your own.'); };
  return <section className="tree-workbench">
    <p className="operation-intro">Start with an empty tree and build your own BST. Add as many unique whole numbers as you want, then select and delete nodes to see how the links adjust.</p>
    <div className="workbench-actions">
      <label className="workbench-number">Value to insert <input type="number" min="-999" max="999" step="1" placeholder={String(suggestedValue)} value={input} onChange={event => setInput(event.target.value)} /></label>
      <button onClick={insert}>Insert {insertValue}</button>
      <button onClick={remove} disabled={!selectedNode}>Delete {selectedNode?.value ?? 'selected node'}</button>
      <button onClick={clear}>Clear tree</button>
      <button onClick={loadExample}>Load example</button>
    </div>
    <TreeCanvas root={root} active={selected} onSelect={setSelected} />
    <p className="narration" aria-live="polite">{message}</p>
  </section>;
}
