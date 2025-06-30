import { atom } from 'recoil';

export const wsAtom = atom<WebSocket | null>({
  key: 'webSocket',
  default: null,
  dangerouslyAllowMutability: true, // Needed because WebSocket is mutable
});
