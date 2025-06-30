import { atom } from 'recoil';
import { SpaceElementsState } from '../../types';

export const spaceElementsAtom = atom<SpaceElementsState>({
  key: 'spaceElementsState',
  default: {},
});