import { atom } from 'recoil';
import { Avatar } from '../../types';

export const avatarAtom = atom<Avatar | null>({
  key: 'avatarState',
  default: null,
});