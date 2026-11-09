import type { TreeNode } from './tree';
export type TraversalKind = 'preorder' | 'inorder' | 'postorder' | 'levelorder';
export interface TraversalStep { active?: string; visited: string[]; frontier: string[]; output: number[]; narration: string }
const collect = (root: TreeNode | undefined, kind: TraversalKind): TreeNode[] => {
  if (!root) return []; const l = collect(root.left, kind), r = collect(root.right, kind);
  return kind === 'preorder' ? [root,...l,...r] : kind === 'inorder' ? [...l,root,...r] : kind === 'postorder' ? [...l,...r,root] : [];
};
export const traversalOrder = (root: TreeNode | undefined, kind: TraversalKind): TreeNode[] => {
  if (kind !== 'levelorder') return collect(root, kind);
  const result: TreeNode[] = [], q = root ? [root] : []; while(q.length) { const n=q.shift()!; result.push(n); if(n.left)q.push(n.left); if(n.right)q.push(n.right); } return result;
};
export const traversalSteps = (root: TreeNode | undefined, kind: TraversalKind): TraversalStep[] => {
 const order = traversalOrder(root,kind), visited:string[]=[], output:number[]=[];
 return [{visited:[],frontier:root?[root.id]:[],output:[],narration:'Ready. Choose play or step through the traversal.'}, ...order.map((n,i)=>{ visited.push(n.id); output.push(n.value); return {active:n.id,visited:[...visited],frontier:order.slice(i+1,i+4).map(x=>x.id),output:[...output],narration:`Visit ${n.value}; add it to the output.`}; })];
};
export const pseudo: Record<TraversalKind,string[]> = { preorder:['visit(node)','walk left subtree','walk right subtree'], inorder:['walk left subtree','visit(node)','walk right subtree'], postorder:['walk left subtree','walk right subtree','visit(node)'], levelorder:['enqueue root','dequeue and visit','enqueue children'] };
