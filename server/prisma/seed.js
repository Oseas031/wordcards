import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const existing = await prisma.book.findFirst();
    if (existing)
        return;
    const book = await prisma.book.create({
        data: {
            name: '演示词库（内置）',
            words: {
                create: [
                    {
                        word: 'ability',
                        phonetic: '/əˈbɪləti/',
                        meaning: '能力；才能',
                        example: 'She has the ability to learn quickly.',
                    },
                    {
                        word: 'achieve',
                        phonetic: '/əˈtʃiːv/',
                        meaning: '实现；达成；取得',
                        example: 'You can achieve your goals with consistency.',
                    },
                    {
                        word: 'accurate',
                        phonetic: '/ˈækjərət/',
                        meaning: '准确的；精确的',
                        example: 'Please provide accurate information.',
                    },
                    {
                        word: 'benefit',
                        phonetic: '/ˈbenɪfɪt/',
                        meaning: '益处；好处；使受益',
                        example: 'Exercise can benefit both body and mind.',
                    },
                    {
                        word: 'challenge',
                        phonetic: '/ˈtʃælɪndʒ/',
                        meaning: '挑战；质疑',
                        example: 'Learning a new language is a challenge.',
                    },
                    {
                        word: 'consistent',
                        phonetic: '/kənˈsɪstənt/',
                        meaning: '一致的；连续的；坚持的',
                        example: 'Be consistent and results will follow.',
                    },
                    {
                        word: 'efficient',
                        phonetic: '/ɪˈfɪʃənt/',
                        meaning: '高效的；效率高的',
                        example: 'We need a more efficient process.',
                    },
                    {
                        word: 'focus',
                        phonetic: '/ˈfoʊkəs/',
                        meaning: '专注；焦点；使集中',
                        example: 'Focus on what you can control.',
                    },
                    {
                        word: 'improve',
                        phonetic: '/ɪmˈpruːv/',
                        meaning: '改善；提高',
                        example: 'Practice helps you improve.',
                    },
                    {
                        word: 'motivate',
                        phonetic: '/ˈmoʊtɪveɪt/',
                        meaning: '激励；促使',
                        example: 'Small wins can motivate you to keep going.',
                    },
                ],
            },
        },
        include: { words: true },
    });
    console.log(`已创建演示词库：${book.name}（${book.words.length} 个单词）`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
