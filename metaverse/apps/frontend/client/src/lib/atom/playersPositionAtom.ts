import { atom } from 'recoil';

export interface PlayerPosition {
  x: number;
  y: number;
}

export const playerPositionAtom = atom<PlayerPosition>({
  key: 'playerPosition',
  default: { x: 0, y: 0 },
});
