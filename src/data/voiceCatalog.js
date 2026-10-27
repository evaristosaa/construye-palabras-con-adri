import { voiceLines } from "./adriAudioCatalog.js";
import { lessonVoiceLines } from "./primaryLessonSupport.js";
import { wordVoiceLines } from "./primaryPlayDesign.js";
import { mathWorkshopVoices } from "./mathWorkshop.js";
import { subjectWorkshopVoices } from "./subjectWorkshop.js";
import { constructionVoices } from "./missionStories.js";
import { snackVoiceLines } from "./snackAdventure.js";
import { primaryReadingLines } from "./primaryReadings.js";
import { seedVoiceLines } from "./seedStory.js";

export const voiceCatalog = Object.freeze([
  ...voiceLines, ...lessonVoiceLines, ...wordVoiceLines,
  ...mathWorkshopVoices, ...subjectWorkshopVoices, ...constructionVoices,
  ...snackVoiceLines,
  ...primaryReadingLines, ...seedVoiceLines,
]);
