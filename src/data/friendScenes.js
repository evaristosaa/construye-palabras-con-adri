// Stable scenes follow the activity; they never change while a child is answering.
export const friendScenes = Object.freeze({
  welcome: { image: 'amigos-bienvenida-v2.webp', order: ['Adri', 'Cayetana', 'Juan'] },
  read: { box: [0, 0, 790, 470] },
  explore: { box: [790, 0, 746, 470] },
  picnic: { box: [0, 470, 790, 554] },
  celebrate: { box: [790, 470, 746, 554] },
});
export function missionFriendScene(subject, index = 0) {
  const scenes = subject === 'lengua' ? ['read', 'welcome', 'read'] : subject === 'medio' ? ['explore', 'welcome', 'explore'] : ['explore', 'read', 'welcome'];
  return scenes[Math.abs(index) % scenes.length];
}
