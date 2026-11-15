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
  const [root, setRoot] = useState<TreeNode | undefined>(() => randomTree(7));
  const [selected, setSelected] = useState(() => root?.id);
  const [dragAction, setDragAction] = useState<'insert' | 'delete'>();
  const [message, setMessage] = useState('Drag the green value into the insert zone, or drag your selected node into the delete zone.');
  const selectedNode = findNode(root, selected ?? '');
  const insertValue = nextValue(root);
  const insert = () => {
    const wasEmpty = !root;
    setRoot(tree => run(tree, 'insert', insertValue));
    if (wasEmpty) setSelected(`insert-${insertValue}`);
    setMessage(`Inserted ${insertValue}; the tree has adjusted to keep BST order.`);
  };
  const remove = () => {
    if (!selectedNode) return;
    const value = selectedNode.value;
    const updated = run(root, 'delete', value);
    setRoot(updated); setSelected(updated?.id); setMessage(`Deleted ${value}; links were repaired to preserve the BST.`);
  };
  const reset = () => { const tree = randomTree(7); setRoot(tree); setSelected(tree?.id); setMessage('Fresh practice tree ready.'); };
  return <section className="tree-workbench">
    <p className="operation-intro">Practice directly: select a node, then drag its chip to delete it. Drag the proposed value to insert it. The tree redraws after every valid operation.</p>
    <div className="workbench-actions">
      <div className="drag-token insert-token" draggable onDragStart={event => { event.dataTransfer.setData('bst-action', 'insert'); setDragAction('insert'); }} onDragEnd={() => setDragAction(undefined)} onClick={insert} role="button" tabIndex={0} onKeyDown={event => event.key === 'Enter' && insert()}>Drag {insertValue} to insert</div>
      <div className="drop-zone insert-zone" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (dragAction === 'insert' || event.dataTransfer.getData('bst-action') === 'insert') insert(); setDragAction(undefined); }}>Drop to insert</div>
      <button onClick={insert}>Insert {insertValue}</button>
      <div className={`drag-token delete-token ${selectedNode ? '' : 'disabled'}`} draggable={Boolean(selectedNode)} onDragStart={event => { event.dataTransfer.setData('bst-action', 'delete'); setDragAction('delete'); }} onDragEnd={() => setDragAction(undefined)} role="button" tabIndex={0} onKeyDown={event => event.key === 'Enter' && remove()}>Drag {selectedNode?.value ?? 'a node'} to delete</div>
      <div className="drop-zone delete-zone" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (dragAction === 'delete' || event.dataTransfer.getData('bst-action') === 'delete') remove(); setDragAction(undefined); }}>Drop to delete</div>
      <button onClick={remove} disabled={!selectedNode}>Delete selected</button>
      <button onClick={reset}>New practice tree</button>
    </div>
    <TreeCanvas root={root} active={selected} onSelect={setSelected} />
    <p className="narration" aria-live="polite">{message}</p>
  </section>;
}
