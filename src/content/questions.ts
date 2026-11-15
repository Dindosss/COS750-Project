import { operationQuestions } from './operationQuestions';
import type { Topic } from '../application/assessment';
import type { LearningObjectiveId } from './learningObjectives';
export interface Question { id:string; topic:Topic; objectiveId?:LearningObjectiveId; prompt:string; options:string[]; answer:number; hint:string[]; explain:string; misconception:string }
const make = (id:string,topic:Topic,prompt:string,options:string[],answer:number,explain:string):Question => ({id,topic,prompt,options,answer,hint:['Look at the word in the question.','Sketch a tiny root with two child positions.','Eliminate choices that contradict the BST or traversal rule.'],explain,misconception:'A common mix-up is treating a tree like a list: position and parent-child links matter.'});
export const questions:Question[] = [...operationQuestions,
make('q1','terms','What is the topmost node called?',['Leaf','Root','Edge','Subtree'],1,'The root is the single starting node.'),
make('q2','terms','A node with no children is a…',['Leaf','Root','Parent','Branch'],0,'Leaves have no child nodes.'),
make('q3','structure','How many children can a binary-tree node have?',['One','Two','Three','Unlimited'],1,'Binary means at most two children.'),
make('q4','structure','A connection between nodes is an…',['Edge','Leaf','Root','Level'],0,'Edges connect a parent to a child.'),
make('q5','bst','In a BST, smaller values belong on the…',['Left','Right','Top','Bottom'],0,'Smaller values go into the left subtree.'),
make('q6','bst','In a BST rooted at 8, where can 3 occur?',['Right subtree','Left subtree','Only as root','Never'],1,'3 is smaller than 8, so it belongs left.'),
make('q7','traversal','Preorder visits the root…',['last','first','twice','never'],1,'Preorder is root, left, right.'),
make('q8','traversal','Inorder visits the root…',['before left','between left and right','after right','at random'],1,'Inorder is left, root, right.'),
make('q9','traversal','Postorder visits the root…',['first','between children','last','only if leaf'],2,'Postorder is left, right, root.'),
make('q10','traversal','Level-order explores nodes…',['by depth','right to left only','from leaves','in sorted order'],0,'It visits each level before the next.'),
make('q11','structure','The nodes under a selected node form a…',['Queue','Subtree','Stack','Cycle'],1,'That node and descendants are its subtree.'),
make('q12','terms','Which is a valid binary tree shape?',['A node with 3 children','A node with 2 children','A circular parent link','A node with 4 children'],1,'A binary node may have zero, one, or two children.'),
make('q13','bst','Where would 12 go relative to root 8?',['Left','Right','Nowhere','Both'],1,'12 is larger than 8.'),
make('q14','bst','What does inorder traversal of a BST produce?',['Typically ascending values','Only roots','Descending values always','Random values'],0,'Left, root, right gives ascending values in a BST.'),
make('q15','traversal','Which traversal suits “children before parent”?',['Preorder','Inorder','Postorder','Level-order'],2,'Postorder processes children first.'),
make('q16','traversal','Which structure supports level-order traversal?',['Queue','Stack','Array only','Recursion only'],0,'A queue preserves first-in, first-out order.'),
make('q17','structure','Can a binary-tree node have one child?',['Yes','No','Only root can','Only leaves can'],0,'“At most two” includes one child.'),
make('q18','terms','A node directly above another is its…',['Child','Parent','Sibling','Leaf'],1,'The parent points to its child.'),
make('q19','bst','Can 9 be in the left subtree of root 8 in a BST?',['Yes','No','Only as leaf','Only if root'],1,'All left-subtree values are smaller than 8.'),
make('q20','traversal','Which starts at a root then explores left before right?',['Preorder','Postorder','Level-order','None'],0,'Preorder is root, then left, then right.')
];
