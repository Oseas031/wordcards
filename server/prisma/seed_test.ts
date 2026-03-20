import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const commonWords = [
  'ability', 'able', 'about', 'above', 'accept', 'according', 'account', 'across', 'act', 'action',
  'activity', 'actually', 'add', 'address', 'administration', 'admit', 'adult', 'affect', 'after', 'again',
  'against', 'agency', 'agent', 'ago', 'agree', 'agreement', 'ahead', 'air', 'all', 'allow',
  'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'american', 'among', 'amount',
  'analysis', 'animal', 'another', 'answer', 'anyone', 'anything', 'appear', 'apply', 'approach', 'area',
  'argue', 'arm', 'around', 'arrive', 'art', 'article', 'artist', 'assume', 'attack', 'attention',
  'attorney', 'audience', 'author', 'authority', 'available', 'avoid', 'away', 'baby', 'back', 'bad',
  'bag', 'ball', 'bank', 'bar', 'base', 'be', 'beat', 'beautiful', 'because', 'become',
  'bed', 'before', 'begin', 'behavior', 'behind', 'believe', 'benefit', 'best', 'better', 'between',
  'beyond', 'big', 'bill', 'billion', 'bit', 'black', 'blood', 'blue', 'board', 'body',
  'book', 'both', 'box', 'boy', 'break', 'bring', 'brother', 'budget', 'build', 'building',
  'business', 'but', 'buy', 'by', 'call', 'camera', 'campaign', 'can', 'cancer', 'candidate',
  'capital', 'car', 'card', 'care', 'career', 'carry', 'case', 'catch', 'cause', 'cell',
  'center', 'central', 'century', 'certain', 'certainly', 'chair', 'challenge', 'chance', 'change', 'character',
  'charge', 'check', 'child', 'choice', 'choose', 'church', 'citizen', 'city', 'civil', 'claim',
  'class', 'clear', 'clearly', 'close', 'coach', 'code', 'cold', 'collection', 'college', 'color',
  'come', 'commercial', 'common', 'community', 'company', 'compare', 'compile', 'concern', 'condition', 'conference',
  'congress', 'consider', 'constant', 'consumer', 'contain', 'continue', 'control', 'cost', 'could', 'country',
  'couple', 'course', 'court', 'cover', 'create', 'crime', 'cultural', 'culture', 'cup', 'current',
  'customer', 'cut', 'dark', 'data', 'daughter', 'day', 'dead', 'deal', 'death', 'debate',
  'decade', 'decide', 'decision', 'deep', 'defense', 'degree', 'democrat', 'democratic', 'describe', 'design',
  'despite', 'detail', 'determine', 'develop', 'development', 'difference', 'different', 'difficult', 'dinner', 'direction',
  'director', 'discover', 'discuss', 'discussion', 'disease', 'doctor', 'document', 'dog', 'door', 'down',
  'draw', 'dream', 'drive', 'drop', 'drug', 'during', 'each', 'early', 'east', 'easy', 'economic',
  'economy', 'edge', 'education', 'effect', 'effort', 'eight', 'either', 'election', 'else', 'employee',
  'end', 'energy', 'enjoy', 'enough', 'enter', 'entire', 'environment', 'episode', 'establish', 'even',
  'evening', 'event', 'ever', 'every', 'everybody', 'everyone', 'everything', 'evidence', 'exactly', 'example',
  'executive', 'exist', 'expect', 'experience', 'expert', 'explain', 'eye', 'face', 'fact', 'factor',
  'fail', 'fall', 'family', 'far', 'fast', 'father', 'fear', 'federal', 'feel', 'feeling',
  'few', 'field', 'fight', 'figure', 'file', 'fill', 'film', 'final', 'finally', 'financial',
  'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'floor', 'focus',
  'follow', 'food', 'foot', 'force', 'foreign', 'forest', 'forget', 'form', 'former', 'forward',
  'found', 'four', 'free', 'freedom', 'friend', 'front', 'full', 'function', 'fund', 'future',
  'game', 'garden', 'general', 'generation', 'girl', 'give', 'glass', 'go', 'goal', 'god',
  'gold', 'good', 'government', 'great', 'green', 'ground', 'group', 'grow', 'growth', 'guess',
  'gun', 'guy', 'hair', 'half', 'hand', 'hang', 'happen', 'happy', 'hard', 'have',
  'head', 'health', 'hear', 'heart', 'heat', 'heavy', 'help', 'here', 'herself', 'high',
  'himself', 'history', 'hit', 'hold', 'home', 'hope', 'hospital', 'hot', 'hotel', 'hour',
  'house', 'how', 'however', 'huge', 'human', 'hundred', 'husband', 'idea', 'identify', 'image',
  'imagine', 'impact', 'important', 'improve', 'include', 'including', 'income', 'increase', 'indeed', 'indicate',
  'individual', 'industry', 'information', 'inside', 'instead', 'institution', 'interest', 'interesting', 'international', 'interview',
  'into', 'investment', 'involve', 'issue', 'item', 'its', 'itself', 'job', 'join', 'just',
  'keep', 'kill', 'kind', 'kitchen', 'know', 'knowledge', 'land', 'language', 'large', 'last',
  'late', 'later', 'laugh', 'law', 'lawyer', 'lay', 'lead', 'leader', 'learn', 'least',
  'leave', 'left', 'leg', 'legal', 'less', 'let', 'letter', 'level', 'life', 'light',
  'like', 'likely', 'line', 'list', 'listen', 'little', 'live', 'local', 'long', 'look',
  'lose', 'loss', 'lot', 'love', 'machine', 'magazine', 'main', 'maintain', 'major', 'majority',
  'make', 'man', 'manage', 'management', 'manager', 'many', 'market', 'marriage', 'material', 'matter',
  'may', 'maybe', 'me', 'mean', 'measure', 'media', 'medical', 'meet', 'meeting', 'member',
  'memory', 'mention', 'message', 'method', 'middle', 'might', 'military', 'million', 'mind', 'minute',
  'miss', 'mission', 'model', 'modern', 'moment', 'money', 'month', 'more', 'morning', 'most',
  'mother', 'mouth', 'move', 'movement', 'movie', 'much', 'music', 'must', 'myself', 'name',
  'nation', 'national', 'natural', 'nature', 'near', 'nearly', 'necessary', 'need', 'network', 'never',
  'news', 'newspaper', 'next', 'nice', 'night', 'none', 'nor', 'north', 'not', 'note',
  'nothing', 'notice', 'notion', 'now', 'number', 'occur', 'offer', 'office', 'officer', 'official',
  'often', 'oh', 'oil', 'ok', 'old', 'once', 'one', 'only', 'onto', 'open',
  'operation', 'opinion', 'opportunity', 'option', 'order', 'organization', 'original', 'other', 'others', 'our',
  'ourselves', 'out', 'outside', 'over', 'own', 'owner', 'page', 'pain', 'painting', 'paper',
  'parent', 'part', 'participant', 'particular', 'particularly', 'partner', 'party', 'pass', 'past',
  'patient', 'pattern', 'pay', 'peace', 'people', 'per', 'perform', 'performance', 'perhaps', 'period',
  'permit', 'person', 'personal', 'phone', 'photo', 'physical', 'pick', 'picture', 'piece', 'place',
  'plan', 'plant', 'platform', 'play', 'player', 'please', 'point', 'police', 'policy', 'political',
  'politics', 'poor', 'popular', 'population', 'position', 'positive', 'possible', 'power', 'practice', 'prepare',
  'present', 'president', 'press', 'pressure', 'pretty', 'prevent', 'price', 'private', 'probably', 'problem',
  'process', 'produce', 'product', 'production', 'professional', 'professor', 'program', 'project', 'property', 'protect',
  'prove', 'provide', 'public', 'pull', 'purpose', 'push', 'put', 'quality', 'question', 'quickly',
  'quite', 'race', 'radio', 'raise', 'range', 'rate', 'rather', 'reach', 'read', 'ready',
  'real', 'reality', 'realize', 'really', 'reason', 'receive', 'recent', 'recently', 'recognize', 'record',
  'reduce', 'reflect', 'region', 'relate', 'relationship', 'religious', 'remain', 'remember', 'remove', 'report',
  'represent', 'republican', 'require', 'research', 'resource', 'respond', 'response', 'rest', 'result', 'return',
  'reveal', 'rich', 'right', 'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule',
  'safe', 'same', 'save', 'scene', 'school', 'science', 'scientist', 'score', 'sea', 'search',
  'season', 'seat', 'second', 'section', 'security', 'seek', 'seem', 'sell', 'send', 'senior',
  'sense', 'series', 'serious', 'serve', 'service', 'seven', 'several', 'sexual', 'shake', 'shall',
  'shape', 'share', 'she', 'shoot', 'short', 'shot', 'should', 'shoulder', 'show', 'side',
  'sign', 'significant', 'similar', 'simple', 'simply', 'since', 'sing', 'single', 'sister', 'sit',
  'site', 'situation', 'size', 'skill', 'skin', 'small', 'smile', 'so', 'social', 'society',
  'soldier', 'some', 'somebody', 'someone', 'something', 'sometimes', 'son', 'song', 'soon', 'sort',
  'sound', 'source', 'south', 'southern', 'space', 'speak', 'special', 'specific', 'speech', 'spend',
  'spirit', 'sport', 'spring', 'staff', 'stage', 'stand', 'standard', 'star', 'start', 'state',
  'statement', 'station', 'stay', 'step', 'still', 'stock', 'stop', 'store', 'story', 'strategy',
  'street', 'strong', 'structure', 'student', 'study', 'stuff', 'style', 'subject', 'success', 'successful',
  'such', 'suddenly', 'suffer', 'suggest', 'summer', 'support', 'suppose', 'sure', 'surface', 'system',
  'table', 'take', 'talk', 'task', 'tax', 'teach', 'teacher', 'team', 'technology', 'television',
  'tell', 'tend', 'term', 'test', 'text', 'than', 'thank', 'that', 'their', 'them',
  'themselves', 'then', 'theory', 'there', 'these', 'they', 'thing', 'think', 'third', 'this',
  'those', 'though', 'thought', 'thousand', 'threat', 'three', 'through', 'throughout', 'throw', 'thus',
  'time', 'tiny', 'today', 'together', 'tonight', 'total', 'tough', 'toward', 'town', 'trade',
  'tradition', 'trial', 'tree', 'trip', 'trouble', 'true', 'truth', 'try', 'turn', 'type',
  'under', 'understand', 'unit', 'until', 'up', 'upon', 'us', 'use', 'usually', 'value',
  'various', 'very', 'victim', 'view', 'violence', 'visit', 'voice', 'vote', 'wait', 'walk',
  'wall', 'want', 'watch', 'water', 'weapon', 'wear', 'week', 'weight', 'well', 'west',
  'western', 'what', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'white', 'who',
  'whole', 'whom', 'whose', 'why', 'wide', 'wife', 'will', 'win', 'window', 'wish', 'with',
  'within', 'without', 'woman', 'wonder', 'word', 'work', 'worker', 'world', 'worry', 'would',
  'write', 'writer', 'wrong', 'yard', 'yeah', 'year', 'yellow', 'yes', 'yet', 'you',
  'young', 'your', 'yourself', 'zero'
]

async function main() {
  const bookCode = 'TEST1000'
  
  const book = await prisma.book.upsert({
    where: { code: bookCode },
    create: { code: bookCode, name: '性能测试词库（1000词）' },
    update: { name: '性能测试词库（1000词）' },
  })

  await prisma.word.deleteMany({ where: { bookId: book.id } })

  const words = commonWords.flatMap((word, idx) => {
    return Array(14).fill(null).map((_, i) => ({
      bookId: book.id,
      word: `${word}_${i}`,
      wordKey: `${word}_${i}`,
      phonetic: `/${word.slice(0, 2)}eɪʃən/`,
      meaning: `这是 ${word} 的第 ${i + 1} 个测试释义 - 用于性能测试`,
      example: `This is an example sentence for ${word}_${i}.`,
    }))
  })

  console.log(`生成 ${words.length} 个测试单词...`)
  
  await prisma.word.createMany({ data: words })
  
  const count = await prisma.word.count({ where: { bookId: book.id } })
  console.log(`词库就绪：${bookCode} ${book.name}（${count} 个单词）`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
