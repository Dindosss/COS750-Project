import { node, type TreeNode } from './tree';

export type OperationKind = 'insert' | 'delete';
export interface OperationStep {
  root?: TreeNode;
  active?: string;
  visited: string[];
  narration: string;
  line: number;
  phase: string;
}
export const operationPseudo: Record<OperationKind, string[]> = {
  insert: ['start at the root', 'compare; follow left or right', 'stop if value already exists', 'attach at the empty child link'],
  delete: ['search from the root', 'compare; follow left or right', 'inspect the matching node', 'leaf: remove its parent link', 'one child: reconnect that child', 'two children: find right-subtree minimum', 'copy successor; remove its old node'],
};

// Every frame keeps an immutable tree snapshot, so Back restores the exact structure.
export function operationSteps(root: TreeNode | undefined, kind: OperationKind, value: number): OperationStep[] {
  const steps: OperationStep[] = [];
  const path: string[] = [];
  const add = (narration: string, line: number, phase: string, active?: string, snapshot = root) => {
    steps.push({ root: snapshot, active, visited: [...path], narration, line, phase });
  };
  const replace = (tree: TreeNode | undefined, id: string, replacement?: TreeNode): TreeNode | undefined => {
    if (!tree) return undefined;
    if (tree.id === id) return replacement;
    return node(tree.id, tree.value, tree.left && replace(tree.left, id, replacement), tree.right && replace(tree.right, id, replacement));
  };
  add(`Ready to ${kind} ${value}. Start at the root (level 0).`, 0, 'Ready', root?.id);
  let current = root;
  let parent: TreeNode | undefined;
  let direction: 'left' | 'right' = 'left';
  let level = 0;
  while (current && current.value !== value) {
    direction = value < current.value ? 'left' : 'right';
    add(`Level ${level}: ${value} is ${value < current.value ? 'smaller' : 'larger'} than ${current.value}. Follow the ${direction} child link.`, 1, 'Compare', current.id);
    path.push(current.id);
    parent = current;
    current = current[direction];
    level++;
  }
  if (kind === 'insert') {
    if (current) {
      add(`${value} already exists at level ${level}. This tutor keeps unique values, so no node is inserted.`, 2, 'Already present', current.id);
    } else {
      add(parent ? `Level ${level}: the ${direction} child of ${parent.value} is empty. This is the insertion position.` : 'The tree is empty. The new node becomes the root at level 0.', 3, 'Empty position', parent?.id);
      const created = node(`insert-${value}`, value);
      const result = parent ? replace(root, parent.id, node(parent.id, parent.value, direction === 'left' ? created : parent.left, direction === 'right' ? created : parent.right)) : created;
      add(`Insert ${value} ${parent ? `as the ${direction} child of ${parent.value} at level ${level}` : 'as the root'}. All ancestor links and the BST ordering are preserved.`, 3, 'Inserted', created.id, result);
    }
    return steps;
  }
  if (!current) {
    add(`The search reached an empty link. ${value} is not in the tree, so nothing is deleted.`, 1, 'Not found');
    return steps;
  }
  const target = current;
  const children = Number(!!target.left) + Number(!!target.right);
  add(`Found ${value} at level ${level}. It has ${children} ${children === 1 ? 'child' : 'children'}; choose the matching deletion case.`, 2, 'Inspect', target.id);
  if (children < 2) {
    const child = target.left ?? target.right;
    add(child ? `Reconnect ${parent ? `${parent.value}'s ${direction} link` : 'the root pointer'} to ${child.value}. Keep the child's entire subtree.` : `Remove ${parent ? `${parent.value}'s ${direction} link to the leaf` : 'the only node; the root becomes empty'}.`, child ? 4 : 3, child ? 'One child' : 'Leaf', target.id);
    const result = replace(root, target.id, child);
    // Pass undefined explicitly for a now-empty root instead of the add helper's default.
    steps.push({ root: result, active: child?.id, visited: [...path], line: child ? 4 : 3, phase: 'Deleted', narration: `Deleted ${value}. ${child ? `${child.value} takes its place, including when the deleted node was the root.` : result ? 'The parent now has an empty child link.' : 'The tree is now empty.'}` });
    return steps;
  }
  path.push(target.id);
  let successor = target.right!;
  let successorLevel = level + 1;
  add(`Two children: enter the right subtree at ${successor.value} (level ${successorLevel}). Find its smallest value: the inorder successor.`, 5, 'Find successor', successor.id);
  while (successor.left) {
    path.push(successor.id);
    successor = successor.left;
    successorLevel++;
    add(`Follow left to ${successor.value} at level ${successorLevel}; keep going until there is no left child.`, 5, 'Find successor', successor.id);
  }
  add(`${successor.value} has no left child. It is the smallest value in the right subtree, so it can replace ${value}.`, 5, 'Successor found', successor.id);
  const copied = replace(root, target.id, node(target.id, successor.value, target.left, target.right));
  add(`Copy ${successor.value} into the node that held ${value}. Two nodes temporarily show ${successor.value}; next remove the successor at its old position.`, 6, 'Copy successor value', target.id, copied);
  add(`Now remove the old successor node ${successor.value}${successor.right ? ` and reconnect its right child ${successor.right.value} to the successor's parent` : ' by clearing its parent link'}.`, 6, 'Repair successor link', successor.id, copied);
  const right = replace(target.right, successor.id, successor.right);
  const result = replace(root, target.id, node(target.id, successor.value, target.left, right));
  add(`Deleted ${value}. ${successor.value} replaces it; the successor's old link is repaired. Both subtrees still obey the BST rule.`, 6, 'Deleted', target.id, result);
  return steps;
}
