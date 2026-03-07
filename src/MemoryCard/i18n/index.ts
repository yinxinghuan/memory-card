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
    'char.guitarist.name': '吉他少年 · Algram',
    'char.guitarist_happy.name': 'Algram 开心版',
    'char.coder.name': '咖啡女孩 · Jenny',
    'char.coder_shy.name': 'Jenny 害羞版',
    'char.hacker.name': '眼镜大叔 · JM·F',
    'char.hacker_surprised.name': 'JM·F 惊讶版',
    'char.ghost.name': '调皮幽灵 · ghostpixel',
    'char.ghost_happy.name': 'ghostpixel 开心版',
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
    'char.guitarist.name': 'Guitar Boy · Algram',
    'char.guitarist_happy.name': 'Algram Happy',
    'char.coder.name': 'Coffee Girl · Jenny',
    'char.coder_shy.name': 'Jenny Shy',
    'char.hacker.name': 'Hacker Dude · JM·F',
    'char.hacker_surprised.name': 'JM·F Surprised',
    'char.ghost.name': 'Cheeky Ghost · ghostpixel',
    'char.ghost_happy.name': 'ghostpixel Happy',
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
