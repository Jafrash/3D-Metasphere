import { atom } from 'recoil';

export interface Dimensions {
  width: number;
  height: number;
}

export const dimensionsAtom = atom<Dimensions>({
  key: 'dimensionsState',
  default: {
    width: 0,
    height: 0,
  },
});