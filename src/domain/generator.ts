import { insert, type TreeNode } from './tree';
export const treeFromValues = (values: number[]): TreeNode | undefined => values.reduce<TreeNode | undefined>((root,value) => insert(root,value), undefined);

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** Creates a fresh, reasonably varied BST for a learning session. */
export const randomTree = (count = 7): TreeNode | undefined => {
  for (let attempt = 0; attempt < 12; attempt++) {
    const values = new Set<number>();
    while (values.size < count) values.add(1 + Math.floor(Math.random() * 98));
    const root = treeFromValues(shuffle([...values]));
    if (count < 3 || (root?.left && root.right)) return root;
  }
  // The fallback is still random; the retry guard only keeps generation bounded.
  const values = new Set<number>();
  while (values.size < count) values.add(1 + Math.floor(Math.random() * 98));
  return treeFromValues(shuffle([...values]));
};
