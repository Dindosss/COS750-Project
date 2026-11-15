export type LearningObjectiveId = 'LO-1' | 'LO-2' | 'LO-3' | 'LO-4' | 'LO-5' | 'LO-6' | 'LO-7' | 'LO-8';

export interface LearningObjective {
  id: LearningObjectiveId;
  statement: string;
  level: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYSE' | 'EVALUATE';
  activity: string;
  checkIn: string;
}

export const masteryThreshold = 80;

export const learningObjectives: LearningObjective[] = [
  { id: 'LO-1', statement: 'Identify the parts of a binary tree and recognise a valid shape.', level: 'REMEMBER', activity: 'Tree Lab: inspect nodes and child links.', checkIn: 'Tree-part and shape items.' },
  { id: 'LO-2', statement: 'Explain the BST rule and use it to place a value.', level: 'UNDERSTAND', activity: 'Tree Lab and Build a tree.', checkIn: 'BST placement item.' },
  { id: 'LO-3', statement: 'Trace preorder, inorder and postorder on a BST.', level: 'APPLY', activity: 'Tree Studio traversal playback.', checkIn: 'Traversal-order items.' },
  { id: 'LO-4', statement: 'Trace level-order, including the queue contents.', level: 'APPLY', activity: 'Tree Studio level-order playback.', checkIn: 'Level-order queue item.' },
  { id: 'LO-5', statement: 'Tell traversals apart and explain why their orders differ.', level: 'ANALYSE', activity: 'Compare Tree Studio traversal modes.', checkIn: 'Traversal-comparison item.' },
  { id: 'LO-6', statement: 'Trace an insertion: comparison path and new leaf link.', level: 'APPLY', activity: 'Insertion walkthrough and Build a tree.', checkIn: 'Insertion-path item.' },
  { id: 'LO-7', statement: 'Carry out a deletion for all three cases.', level: 'APPLY', activity: 'Deletion walkthrough and Build a tree.', checkIn: 'Leaf, one-child and two-child items.' },
  { id: 'LO-8', statement: 'Choose and justify a traversal for a practical scenario.', level: 'EVALUATE', activity: 'Traversal comparison in Tree Studio.', checkIn: 'Scenario-selection item.' },
];
