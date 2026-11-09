export type StageId = 'welcome'|'lesson'|'visualiser'|'quiz'|'summary';
export const stages: {id:StageId; label:string; kicker:string}[] = [{id:'welcome',label:'Start',kicker:'01'},{id:'lesson',label:'Tree lab',kicker:'02'},{id:'visualiser',label:'Traverse',kicker:'03'},{id:'quiz',label:'Check-in',kicker:'04'},{id:'summary',label:'Recap',kicker:'05'}];
