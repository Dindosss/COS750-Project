export const glossary = [
 ['Root','The single starting node at the very top.'],['Node','One item in a tree; it stores a value and links.'],['Edge','A connecting line from a parent to a child.'],['Leaf','A node with no children.'],['Subtree','A node and everything below it.'],['BST','A binary search tree: smaller values go left; larger go right.']
] as const;
export const lessonCards = [
 {title:'Why trees?',body:'A tree models a hierarchy. Each node may point to a left child and a right child—never more than two.'},
 {title:'Read the shape',body:'Start at the root. Edges lead downward to children. A leaf is where a path ends.'},
 {title:'The BST rule',body:'For every node, values to its left are smaller; values to its right are larger. This makes search efficient.'}
];
