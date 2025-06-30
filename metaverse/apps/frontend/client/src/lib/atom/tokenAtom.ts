import { atom } from 'recoil';

export const tokenAtom = atom<string | null>({
  key: 'tokenState',
  default: null,
});