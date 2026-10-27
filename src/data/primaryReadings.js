import {primaryMissions} from './primaryData.js';

// A passage can support several questions. Record its exact text once, and
// match by text so alternate examples never inherit another passage's audio.
const recordings = new Map();
for(const mission of primaryMissions) for(const activity of mission.activities) {
  [activity,...activity.variants].forEach((example,index)=>{
    if(example.passage && !recordings.has(example.passage)) {
      const key=`reading-${activity.id}-${index===0?'original':'alternate'}`;
      recordings.set(example.passage,{key,text:example.passage,filename:`${key}.wav`});
    }
  });
}
export const primaryReadingLines=Object.freeze([...recordings.values()]);
export function passageAudioKey(activity) {return recordings.get(activity.passage)?.key || null;}
