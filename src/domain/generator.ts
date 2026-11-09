import { insert, type TreeNode } from './tree';
export const treeFromValues = (values: number[]): TreeNode | undefined => values.reduce<TreeNode | undefined>((root,value) => insert(root,value), undefined);
export const randomTree = (count=7): TreeNode | undefined => treeFromValues(Array.from({length:count},(_,i)=>((i*11+7)%97)+1));
