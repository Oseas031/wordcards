export type DemoWord = {
  id: string
  word: string
  phonetic?: string
  meaning: string
  example?: string
}

export const DEMO_WORDS: DemoWord[] = [
  {
    id: 'w-ability',
    word: 'ability',
    phonetic: '/əˈbɪləti/',
    meaning: '能力；才能',
    example: 'She has the ability to learn quickly.',
  },
  {
    id: 'w-achieve',
    word: 'achieve',
    phonetic: '/əˈtʃiːv/',
    meaning: '实现；达成；取得',
    example: 'You can achieve your goals with consistency.',
  },
  {
    id: 'w-accurate',
    word: 'accurate',
    phonetic: '/ˈækjərət/',
    meaning: '准确的；精确的',
    example: 'Please provide accurate information.',
  },
  {
    id: 'w-benefit',
    word: 'benefit',
    phonetic: '/ˈbenɪfɪt/',
    meaning: '益处；好处；使受益',
    example: 'Exercise can benefit both body and mind.',
  },
  {
    id: 'w-challenge',
    word: 'challenge',
    phonetic: '/ˈtʃælɪndʒ/',
    meaning: '挑战；质疑',
    example: 'Learning a new language is a challenge.',
  },
  {
    id: 'w-consistent',
    word: 'consistent',
    phonetic: '/kənˈsɪstənt/',
    meaning: '一致的；连续的；坚持的',
    example: 'Be consistent and results will follow.',
  },
  {
    id: 'w-efficient',
    word: 'efficient',
    phonetic: '/ɪˈfɪʃənt/',
    meaning: '高效的；效率高的',
    example: 'We need a more efficient process.',
  },
  {
    id: 'w-focus',
    word: 'focus',
    phonetic: '/ˈfoʊkəs/',
    meaning: '专注；焦点；使集中',
    example: 'Focus on what you can control.',
  },
  {
    id: 'w-improve',
    word: 'improve',
    phonetic: '/ɪmˈpruːv/',
    meaning: '改善；提高',
    example: 'Practice helps you improve.',
  },
  {
    id: 'w-motivate',
    word: 'motivate',
    phonetic: '/ˈmoʊtɪveɪt/',
    meaning: '激励；促使',
    example: 'Small wins can motivate you to keep going.',
  },
]

