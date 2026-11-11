import { describe, expect, it } from 'vitest';
import { operationSteps, type OperationKind } from './operations';
import { sampleTree, size, type TreeNode } from './tree';
import { treeFromValues } from './generator';
import { traversalOrder } from './traversals';
import { operationQuestions } from '../content/operationQuestions';

const values = (root?: TreeNode) => traversalOrder(root, 'inorder').map(n => n.value);
const run = (root: TreeNode | undefined, kind: OperationKind, value: number) => {
  const steps = operationSteps(root, kind, value);
  return { steps, result: steps[steps.length - 1].root };
};
describe('stepwise BST insertion', () => {
  it('compares at every level and only attaches on the final frame', () => {
    const root = sampleTree();
    const original = JSON.stringify(root);
    const { steps, result } = run(root, 'insert', 5);
    expect(steps.filter(s => s.phase === 'Compare').map(s => s.active)).toEqual(['a', 'b', 'e', 'g']);
    expect(steps.slice(0, -1).every(s => s.root === root)).toBe(true);
    expect(values(result)).toEqual([1, 3, 4, 5, 6, 7, 8, 10, 13, 14]);
    expect(JSON.stringify(root)).toBe(original);
  });
  it('creates a root in an empty tree', () => expect(run(undefined, 'insert', 8).result?.value).toBe(8));
  it('keeps duplicate insertion unchanged', () => {
    const root = sampleTree();
    const { steps, result } = run(root, 'insert', 6);
    expect(result).toBe(root);
    expect(steps[steps.length - 1].phase).toBe('Already present');
  });
});
describe('stepwise BST deletion', () => {
  it.each([1, 14, 3, 8, 6, 10, 13])('deletes %i while retaining ordering, IDs and the input tree', value => {
    const root = sampleTree();
    const before = JSON.stringify(root);
    const { result } = run(root, 'delete', value);
    expect(values(result)).toEqual(values(root).filter(n => n !== value));
    expect(size(result)).toBe(size(root) - 1);
    const nodes = traversalOrder(result, 'preorder');
    expect(new Set(nodes.map(n => n.id)).size).toBe(nodes.length);
    expect(JSON.stringify(root)).toBe(before);
  });
  it('shows value copying before repairing a successor with a right child', () => {
    const root = treeFromValues([8, 3, 14, 10, 12, 18]);
    const { steps, result } = run(root, 'delete', 8);
    expect(steps.filter(s => s.phase === 'Find successor').map(s => s.active)).toEqual(['n14', 'n10']);
    expect(values(steps.find(s => s.phase === 'Copy successor value')?.root)).toEqual([3, 10, 10, 12, 14, 18]);
    expect(result?.value).toBe(10);
    expect(result?.right?.left?.value).toBe(12);
    expect(values(result)).toEqual([3, 10, 12, 14, 18]);
  });
  it('promotes the only child of a deleted root', () => {
    const { result } = run(treeFromValues([8, 3, 1]), 'delete', 8);
    expect(result?.value).toBe(3);
    expect(result?.left?.value).toBe(1);
  });
  it('allows deleting the only root', () => expect(run(treeFromValues([8]), 'delete', 8).result).toBeUndefined());
  it('leaves missing values and empty trees unchanged', () => {
    const root = sampleTree();
    expect(run(root, 'delete', 99).result).toBe(root);
    expect(run(undefined, 'delete', 99).result).toBeUndefined();
  });
});
describe('operation assessment', () => {
  it('has unique IDs, valid answers and three hints for every question', () => {
    expect(new Set(operationQuestions.map(q => q.id)).size).toBe(operationQuestions.length);
    for (const question of operationQuestions) {
      expect(question.options[question.answer]).toBeTruthy();
      expect(question.hint).toHaveLength(3);
    }
  });
});
