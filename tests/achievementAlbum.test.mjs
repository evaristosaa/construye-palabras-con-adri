import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAchievementAlbum } from '../src/data/achievementAlbum.js';
import { primaryMissions } from '../src/data/primaryData.js';
import { modules } from '../src/data/learningData.js';
import { workshopId } from '../src/data/mathWorkshop.js';

test('the whole album exposes all subjects, both math ranges and every letter together',()=>{
 const album=buildAchievementAlbum({});
 assert.deepEqual(album.areas.map(a=>a.id),['lengua','matematicas','medio','taller']);
 assert.deepEqual(album.areas.map(a=>a.stickers.length),[8,8,8,12]);
 assert.equal(album.letters.length,27);assert.equal(album.total,63);assert.equal(album.earned,0);
 assert.equal(new Set(album.areas.flatMap(a=>a.stickers.map(s=>s.id))).size,36);
 assert.ok(album.letters.every(l=>l.letter&&l.title));assert.ok(album.next);
});

test('stickers respect specific completed missions and never infer letters from other games',()=>{
 const mission=primaryMissions.find(m=>m.subject==='medio');
 const p={primaryCompletedLevels:[mission.id,mission.id,'unknown'],completedLevels:[modules[26].id],completedGames:[workshopId(10,0,0),workshopId(10,0,1),workshopId(10,0,2),'unrelated']};
 const before=JSON.stringify(p),album=buildAchievementAlbum(p);
 assert.equal(album.earned,3);assert.equal(album.areas[2].stickers[0].earned,true);
 assert.equal(album.areas[0].earned,0);assert.equal(album.areas[3].earned,1);
 assert.equal(album.areas[3].stickers[6].earned,false);
 assert.equal(album.letters.filter(l=>l.earned).length,1);
 assert.equal(JSON.stringify(p),before);
});

test('next sticker points to a partially played mission and finished albums remain replayable',()=>{
 const mission=primaryMissions[4];
 const album=buildAchievementAlbum({completedGames:[mission.activities[0].id]});
 assert.equal(album.next.id,mission.id);assert.equal(album.next.done,1);
 const completedGames=[10,20].flatMap(range=>Array.from({length:6},(_,s)=>[0,1,2].map(i=>workshopId(range,s,i))).flat());
 const full=buildAchievementAlbum({completedGames,primaryCompletedLevels:primaryMissions.map(m=>m.id),completedLevels:modules.map(m=>m.id)});
 assert.equal(full.earned,63);assert.equal(full.next,undefined);
 const lettersLeft=buildAchievementAlbum({completedGames,primaryCompletedLevels:primaryMissions.map(m=>m.id)});
 assert.equal(lettersLeft.next.id,modules[0].id);assert.equal(lettersLeft.next.to,`/juego/${modules[0].id}`);
});
