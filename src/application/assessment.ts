export type Topic = 'structure'|'terms'|'traversal'|'bst';
import { learningObjectives, masteryThreshold, type LearningObjectiveId } from '../content/learningObjectives';
export interface Answer { questionId:string; correct:boolean; topic:Topic; objectiveId?:LearningObjectiveId }
export const mastery = (answers:Answer[]) => { const count=answers.length; const correct=answers.filter(a=>a.correct).length; const byTopic = (['structure','terms','traversal','bst'] as Topic[]).map(topic=>({topic, score: answers.filter(a=>a.topic===topic && a.correct).length, total:answers.filter(a=>a.topic===topic).length})); return {percent:count?Math.round(correct/count*100):0, correct,count,byTopic, weakest:byTopic.filter(x=>x.total).sort((a,b)=>a.score/a.total-b.score/b.total)[0]?.topic}; };
export const objectiveMastery = (answers: Answer[]) => learningObjectives.map(objective => {
  const relevant = answers.filter(answer => answer.objectiveId === objective.id);
  const correct = relevant.filter(answer => answer.correct).length;
  const percent = relevant.length ? Math.round(correct / relevant.length * 100) : undefined;
  return { ...objective, correct, total: relevant.length, percent, mastered: percent !== undefined && percent >= masteryThreshold };
});
