import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function keyOf(word: string) {
  return word.trim().toLowerCase()
}

async function main() {
  const books = [
    {
      code: 'DEMO',
      name: '演示词库（少量）',
      words: [
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
      ],
    },
    {
      code: 'CET4',
      name: 'CET-4（四级）示例词库',
      words: [
        { word: 'important', phonetic: '/ɪmˈpɔːrtnt/', meaning: '重要的', example: 'It is important to be on time.' },
        { word: 'different', phonetic: '/ˈdɪfrənt/', meaning: '不同的', example: 'We have different opinions.' },
        { word: 'increase', phonetic: '/ɪnˈkriːs/', meaning: '增加；提高', example: 'We need to increase efficiency.' },
        { word: 'possible', phonetic: '/ˈpɑːsəbl/', meaning: '可能的', example: 'Everything is possible.' },
        { word: 'experience', phonetic: '/ɪkˈspɪriəns/', meaning: '经历；经验', example: 'This is a valuable experience.' },
        { word: 'describe', phonetic: '/dɪˈskraɪb/', meaning: '描述', example: 'Please describe the problem.' },
        { word: 'develop', phonetic: '/dɪˈveləp/', meaning: '发展；开发', example: 'We need to develop new skills.' },
        { word: 'provide', phonetic: '/prəˈvaɪd/', meaning: '提供', example: 'We provide support to users.' },
        { word: 'common', phonetic: '/ˈkɑːmən/', meaning: '常见的；共同的', example: 'This is a common mistake.' },
        { word: 'public', phonetic: '/ˈpʌblɪk/', meaning: '公众的；公共的', example: 'It is a public place.' },
        { word: 'result', phonetic: '/rɪˈzʌlt/', meaning: '结果', example: 'The result is encouraging.' },
        { word: 'future', phonetic: '/ˈfjuːtʃər/', meaning: '未来', example: 'Think about your future.' },
      ],
    },
    {
      code: 'CET6',
      name: 'CET-6（六级）示例词库',
      words: [
        { word: 'significant', phonetic: '/sɪɡˈnɪfɪkənt/', meaning: '显著的；重要的', example: 'There is a significant difference.' },
        { word: 'efficient', phonetic: '/ɪˈfɪʃənt/', meaning: '高效的', example: 'We need an efficient workflow.' },
        { word: 'essential', phonetic: '/ɪˈsenʃl/', meaning: '必不可少的', example: 'Sleep is essential for health.' },
        { word: 'contribute', phonetic: '/kənˈtrɪbjuːt/', meaning: '贡献；促成', example: 'Everyone can contribute.' },
        { word: 'maintain', phonetic: '/meɪnˈteɪn/', meaning: '维持；维护', example: 'Maintain a steady pace.' },
        { word: 'consequence', phonetic: '/ˈkɑːnsɪkwens/', meaning: '后果；结果', example: 'Every action has a consequence.' },
        { word: 'interpret', phonetic: '/ɪnˈtɜːrprɪt/', meaning: '解释；口译', example: 'How do you interpret this sentence?' },
        { word: 'complicated', phonetic: '/ˈkɑːmplɪkeɪtɪd/', meaning: '复杂的', example: 'The situation is complicated.' },
        { word: 'assumption', phonetic: '/əˈsʌmpʃn/', meaning: '假设；设想', example: 'That is a wrong assumption.' },
        { word: 'alternative', phonetic: '/ɔːlˈtɜːrnətɪv/', meaning: '替代方案', example: 'We need an alternative plan.' },
        { word: 'nevertheless', phonetic: '/ˌnevərðəˈles/', meaning: '然而；不过', example: 'It was hard; nevertheless, we tried.' },
        { word: 'perspective', phonetic: '/pərˈspektɪv/', meaning: '视角；观点', example: 'Try to see it from another perspective.' },
      ],
    },
  ] as const

  for (const b of books) {
    const book = await prisma.book.upsert({
      where: { code: b.code },
      create: { code: b.code, name: b.name },
      update: { name: b.name },
    })

    for (const w of b.words) {
      await prisma.word.upsert({
        where: { bookId_wordKey: { bookId: book.id, wordKey: keyOf(w.word) } },
        create: {
          bookId: book.id,
          word: w.word,
          wordKey: keyOf(w.word),
          phonetic: w.phonetic,
          meaning: w.meaning,
          example: w.example,
        },
        update: {
          word: w.word,
          phonetic: w.phonetic,
          meaning: w.meaning,
          example: w.example,
        },
      })
    }

    const count = await prisma.word.count({ where: { bookId: book.id } })
    console.log(`词库就绪：${b.code} ${b.name}（${count} 个）`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

