import { randomTree } from '../domain/generator';
import { findNode, type TreeNode } from '../domain/tree';
import { traversalOrder } from '../domain/traversals';
import type { Topic } from '../application/assessment';
import type { Question } from './questions';

export type Difficulty = 1 | 2 | 3;
export interface DynamicAssessment { root: TreeNode; questions: Question[] }

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const question = (id: string, topic: Topic, prompt: string, correct: string, distractors: string[], explain: string): Question => {
  const options = shuffle([correct, ...distractors.filter(option => option !== correct)]).slice(0, 4);
  return {
    id, topic, prompt, options, answer: options.indexOf(correct),
    hint: ['Use the tree shown above.', 'Compare values one link at a time.', 'Check the BST rule: smaller goes left, larger goes right.'],
    explain, misconception: 'Follow the parent-child links and compare values at every node.'
  };
};

const values = (root: TreeNode) => traversalOrder(root, 'preorder').map(node => node.value);
const leaves = (root: TreeNode) => traversalOrder(root, 'preorder').filter(node => !node.left && !node.right);
const display = (items: number[]) => `[ ${items.join(', ')} ]`;
const childCount = (node: TreeNode) => Number(Boolean(node.left)) + Number(Boolean(node.right));

const insertionPath = (root: TreeNode, value: number) => {
  const path: number[] = [];
  let current: TreeNode | undefined = root;
  while (current) {
    path.push(current.value);
    current = value < current.value ? current.left : current.right;
  }
  return path;
};

const unusedValue = (root: TreeNode) => {
  const present = new Set(values(root));
  for (let value = 2; value < 99; value += 3) if (!present.has(value)) return value;
  return 100;
};

/** Builds a new tree and a question set whose examples match that exact tree. */
export const createDynamicAssessment = (difficulty: Difficulty): DynamicAssessment => {
  const root = randomTree(difficulty === 1 ? 6 : difficulty === 2 ? 8 : 10)!;
  const preorder = traversalOrder(root, 'preorder').map(node => node.value);
  const inorder = traversalOrder(root, 'inorder').map(node => node.value);
  const postorder = traversalOrder(root, 'postorder').map(node => node.value);
  const leaf = leaves(root)[0];
  const branch = traversalOrder(root, 'preorder').find(node => childCount(node) > 0) ?? root;
  const pathValue = unusedValue(root);
  const path = insertionPath(root, pathValue);
  const questions: Question[] = [
    question('root', 'terms', 'Which value is the root of this tree?', String(root.value), values(root).filter(value => value !== root.value).slice(0, 3).map(String), `The root is the top node: ${root.value}.`),
    question('leaf', 'terms', 'Which value is a leaf in this tree?', String(leaf.value), values(root).filter(value => value !== leaf.value && !leaves(root).some(item => item.value === value)).slice(0, 3).map(String), `A leaf has no children. ${leaf.value} has no child links.`),
    question('children', 'structure', `How many children does node ${branch.value} have?`, String(childCount(branch)), ['0', '1', '2', '3'].filter(option => Number(option) !== childCount(branch)), `Node ${branch.value} has ${childCount(branch)} child link(s).`),
    question('inorder', 'traversal', 'What is the inorder traversal of this BST?', display(inorder), [display(preorder), display(postorder), display([...inorder].reverse())], 'Inorder visits left subtree, node, then right subtree. In a BST, that produces ascending values.'),
  ];

  if (difficulty >= 2) {
    questions.push(
      question('insert-path', 'bst', `To insert ${pathValue}, which sequence of existing nodes is compared?`, path.join(' → '), [preorder.slice(0, Math.max(1, path.length - 1)).join(' → '), [...path].reverse().join(' → '), `${root.value} only`], `Compare ${pathValue} at each node until an empty link. The path is ${path.join(' → ')}.`),
      question('delete-leaf', 'bst', `If leaf ${leaf.value} is deleted, what changes?`, `Its parent's link to ${leaf.value} becomes empty`, ['The whole tree is deleted', `${leaf.value} becomes the root`, `All of ${leaf.value}'s ancestors are deleted`], `Because ${leaf.value} is a leaf, deletion only clears its parent's link to it.`),
      question('preorder', 'traversal', 'What is the preorder traversal of this tree?', display(preorder), [display(inorder), display(postorder), display([...preorder].reverse())], 'Preorder visits the node first, then its left and right subtrees.')
    );
  }

  if (difficulty === 3) {
    const twoChild = traversalOrder(root, 'preorder').find(node => node.left && node.right);
    if (twoChild) {
      const successor = traversalOrder(twoChild.right, 'inorder')[0];
      questions.push(question('successor', 'bst', `When deleting ${twoChild.value}, which value is its inorder successor?`, String(successor.value), values(root).filter(value => value !== successor.value).slice(0, 3).map(String), `The successor is the smallest value in ${twoChild.value}'s right subtree: ${successor.value}.`));
    }
    const chosen = findNode(root, branch.id)!;
    questions.push(question('subtree', 'structure', `If node ${chosen.value} is selected, what do its descendants together with it form?`, 'A subtree', ['A queue', 'A cycle', 'A traversal'], 'A node and every node below it form a subtree.'));
  }
  return { root, questions: shuffle(questions) };
};
