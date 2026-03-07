type Locale = 'zh' | 'en';

const MESSAGES: Record<Locale, Record<string, string>> = {
  zh: {
    title: '记忆翻牌',
    subtitle: '翻开匹配相同的角色',
    rule: '翻开卡片，找出所有匹配的角色对',
    startBtn: '开始游戏',
    replayBtn: '再玩一次',
    homeBtn: '返回',
    moves: '步数',
    time: '用时',
    best: '最佳',
    won: '挑战成功！',
    newRecord: '🎉 新纪录！',
    seconds: '秒',
    pairs: '对',
    'char.guitarist.name': 'Algram',
    'char.guitarist_happy.name': 'Algram 开心',
    'char.guitarist_sad.name': 'Algram 难过',
    'char.guitarist_shy.name': 'Algram 害羞',
    'char.guitarist_surprised.name': 'Algram 惊讶',
    'char.coder.name': 'Jenny',
    'char.coder_happy.name': 'Jenny 开心',
    'char.coder_sad.name': 'Jenny 难过',
    'char.coder_shy.name': 'Jenny 害羞',
    'char.coder_surprised.name': 'Jenny 惊讶',
    'char.hacker.name': 'JM·F',
    'char.hacker_happy.name': 'JM·F 开心',
    'char.hacker_sad.name': 'JM·F 难过',
    'char.hacker_shy.name': 'JM·F 害羞',
    'char.hacker_surprised.name': 'JM·F 惊讶',
    'char.ghost.name': 'ghostpixel',
    'char.ghost_happy.name': 'ghostpixel 开心',
    'char.ghost_sad.name': 'ghostpixel 难过',
    'char.ghost_shy.name': 'ghostpixel 害羞',
    'char.ghost_surprised.name': 'ghostpixel 惊讶',
  },
  en: {
    title: 'MEMORY',
    subtitle: 'Match the pairs',
    rule: 'Flip cards and match all character pairs',
    startBtn: 'Start',
    replayBtn: 'Play Again',
    homeBtn: 'Home',
    moves: 'Moves',
    time: 'Time',
    best: 'Best',
    won: 'You Win!',
    newRecord: '🎉 New Record!',
    seconds: 's',
    pairs: 'pairs',
    'char.guitarist.name': 'Algram',
    'char.guitarist_happy.name': 'Algram Happy',
    'char.guitarist_sad.name': 'Algram Sad',
    'char.guitarist_shy.name': 'Algram Shy',
    'char.guitarist_surprised.name': 'Algram Surprised',
    'char.coder.name': 'Jenny',
    'char.coder_happy.name': 'Jenny Happy',
    'char.coder_sad.name': 'Jenny Sad',
    'char.coder_shy.name': 'Jenny Shy',
    'char.coder_surprised.name': 'Jenny Surprised',
    'char.hacker.name': 'JM·F',
    'char.hacker_happy.name': 'JM·F Happy',
    'char.hacker_sad.name': 'JM·F Sad',
    'char.hacker_shy.name': 'JM·F Shy',
    'char.hacker_surprised.name': 'JM·F Surprised',
    'char.ghost.name': 'ghostpixel',
    'char.ghost_happy.name': 'ghostpixel Happy',
    'char.ghost_sad.name': 'ghostpixel Sad',
    'char.ghost_shy.name': 'ghostpixel Shy',
    'char.ghost_surprised.name': 'ghostpixel Surprised',
  },
};

function detectLocale(): Locale {
  const override = localStorage.getItem('mc_locale');
  if (override === 'en' || override === 'zh') return override;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function t(key: string): string {
  const locale = detectLocale();
  return MESSAGES[locale][key] ?? MESSAGES['en'][key] ?? key;
}

import { useState, useCallback } from 'react';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem('mc_locale', l);
    setLocaleState(l);
  }, []);
  const tFn = useCallback(
    (key: string) => MESSAGES[locale][key] ?? MESSAGES['en'][key] ?? key,
    [locale]
  );
  return { t: tFn, locale, setLocale };
}
