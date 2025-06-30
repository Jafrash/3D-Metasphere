import { atom } from 'recoil';

export const userNameAtom = atom<string | null>({
  key: 'userNameState',
  default: null,
});