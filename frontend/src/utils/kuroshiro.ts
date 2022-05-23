// @ts-nocheck
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import { not } from 'ramda';
const kuroshiro = new Kuroshiro();

const init = kuroshiro
  .init(new KuromojiAnalyzer({ dictPath: '/data/kuromoji' }))
  .then(() => true)
  .catch(() => false);

export const toRomajiPassport = async (target: string): Promise<string> => {
  if (not(await init)) return target;
  return kuroshiro.convert(target, { to: 'romaji', romajiSystem: 'passport' });
};

export const toRomajiNippon = async (target: string): Promise<string> => {
  if (not(await init)) return target;
  return kuroshiro.convert(target, { to: 'romaji', romajiSystem: 'nippon' });
};
