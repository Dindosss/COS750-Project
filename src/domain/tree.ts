export type NodeId = string;
export interface TreeNode { id: NodeId; value: number; left?: TreeNode; right?: TreeNode }
export type Direction = 'left' | 'right';
export const node = (id: string, value: number, left?: TreeNode, right?: TreeNode): TreeNode => Object.freeze({ id, value, left, right });
export const findNode = (root: TreeNode | undefined, id: NodeId): TreeNode | undefined => !root ? undefined : root.id === id ? root : findNode(root.left, id) ?? findNode(root.right, id);
export const size = (root?: TreeNode): number => root ? 1 + size(root.left) + size(root.right) : 0;
export const height = (root?: TreeNode): number => root ? 1 + Math.max(height(root.left), height(root.right)) : 0;
export const insert = (root: TreeNode | undefined, value: number, id = `n${value}`): TreeNode => !root ? node(id, value) : value < root.value ? node(root.id, root.value, insert(root.left, value, id), root.right) : node(root.id, root.value, root.left, insert(root.right, value, id));
export const sampleTree = (): TreeNode => node('a', 8, node('b', 3, node('d', 1), node('e', 6, node('g', 4), node('h', 7))), node('c', 10, undefined, node('f', 14, node('i', 13))));
