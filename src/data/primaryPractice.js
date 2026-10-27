import {selectSkillPractice} from "./learningSkills.js";
import { primaryMissions, primarySubjects } from "./primaryData.js";

export function needsPrimaryPractice(attempt) {
  return (attempt?.mistakes || 0) >= 2 && (attempt?.correctStreak || 0) < 2;
}
export function isReviewDue(attempt, now = new Date()) {
  const due = Date.parse(attempt?.reviewDue);
  return Number.isFinite(due) && due <= new Date(now).getTime();
}
export function presentPrimaryActivity(activity, progress) {
  const attempt = progress.primaryAttempts?.[activity.id];
  const successes = attempt?.successes ?? Math.max(0, (attempt?.attempts || 0) - (attempt?.mistakes || 0));
  const variant = successes % 2 ? activity.variants[0] : null;
  // Pick once per mounted game. Wrong answers never change the presented question.
  const presented = variant ? { id:activity.id, skills:activity.skills, topic:activity.topic, idea:activity.idea, ideaAudioKey:activity.ideaAudioKey, variants:activity.variants, ...variant, variantKey:"alternate" } : { ...activity, variantKey:"original" };
  if (presented.options) {
    const offset = (activity.id.length + successes) % presented.options.length;
    presented.options = [...presented.options.slice(offset), ...presented.options.slice(0, offset)];
  }
  if (presented.pieces) presented.pieces = [...presented.pieces].reverse();
  return presented;
}
export function preparePrimaryMission(mission, progress) {
  return { ...mission, activities:mission.activities.map(a => presentPrimaryActivity(a,progress)) };
}
export function buildPrimaryAdventure(progress, now = new Date()) {
  return primarySubjects.map(subject => {
    const activities = primaryMissions.filter(m => m.subject === subject.id).flatMap(m => m.activities);
    const review = activities.find(a => needsPrimaryPractice(progress.primaryAttempts?.[a.id]));
    const due = activities.filter(a => isReviewDue(progress.primaryAttempts?.[a.id],now)).sort((a,b) => Date.parse(progress.primaryAttempts[a.id].reviewDue)-Date.parse(progress.primaryAttempts[b.id].reviewDue))[0];
    const next = activities.find(a => !progress.completedGames.includes(a.id));
    const leastRecent = [...activities].sort((a,b) => (Date.parse(progress.primaryAttempts?.[a.id]?.lastAttemptAt)||0)-(Date.parse(progress.primaryAttempts?.[b.id]?.lastAttemptAt)||0))[0];
    const activity = review || due || selectSkillPractice(activities,progress,now) || next || leastRecent;
    return { ...presentPrimaryActivity(activity,progress), subject: subject.id, practice: Boolean(review || due) };
  });
}
