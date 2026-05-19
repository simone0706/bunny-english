// Generate the full wordbank.ts with 6000+ entries
// Run: npx tsx scripts/generate-wordbank.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POS legend: n=noun v=verb adj=adjective adv=adverb prep=preposition
//   conj=conjunction pron=pronoun interj=interjection phr=phrase
//   phrv=phrasal verb idiom=idiom det=determiner

// ===== SCENE TAGS =====
const TAGS = [
  '日常口语', '职场', '社交', '旅行', '购物', '餐饮',
  '情感', '校园', '网络用语', '电话', '面试', '约会',
];

// ===== CORE WORDS: Level 1-2, hand-crafted examples =====
const CORE_WORDS: CW[] = [
  // Level 1 · 日常高频
  ['the', '这个/那个', 'ðə', 'art', 1, '日常口语', 'The book is on the table.', '书在桌子上。'],
  ['be', '是/在', 'bi', 'v', 1, '日常口语', 'I want to be a doctor.', '我想成为一名医生。'],
  ['to', '到/去/为了', 'tu', 'prep', 1, '日常口语', 'I\'m going to the store.', '我要去商店。'],
  ['of', '的/属于', 'ʌv', 'prep', 1, '日常口语', 'The city of New York is amazing.', '纽约市很棒。'],
  ['and', '和/与', 'ænd', 'conj', 1, '日常口语', 'I like coffee and tea.', '我喜欢咖啡和茶。'],
  ['a', '一个', 'ə', 'art', 1, '日常口语', 'I need a pen.', '我需要一支笔。'],
  ['in', '在...里面', 'ɪn', 'prep', 1, '日常口语', 'She is in the room.', '她在房间里。'],
  ['that', '那个', 'ðæt', 'det', 1, '日常口语', 'That car is expensive.', '那辆车很贵。'],
  ['have', '有', 'hæv', 'v', 1, '日常口语', 'I have two brothers.', '我有两个兄弟。'],
  ['it', '它', 'ɪt', 'pron', 1, '日常口语', 'It is raining outside.', '外面在下雨。'],
  ['for', '为了/对于', 'fɔr', 'prep', 1, '日常口语', 'This gift is for you.', '这个礼物是给你的。'],
  ['not', '不', 'nɑt', 'adv', 1, '日常口语', 'I am not hungry.', '我不饿。'],
  ['on', '在...上面', 'ɑn', 'prep', 1, '日常口语', 'The phone is on the desk.', '手机在桌子上。'],
  ['with', '和/用', 'wɪð', 'prep', 1, '日常口语', 'I went with my friend.', '我和朋友一起去的。'],
  ['he', '他', 'hi', 'pron', 1, '日常口语', 'He is my brother.', '他是我哥哥。'],
  ['as', '作为/如同', 'æz', 'prep', 1, '日常口语', 'She works as a teacher.', '她是当老师的。'],
  ['you', '你/你们', 'ju', 'pron', 1, '日常口语', 'You are so kind.', '你真好。'],
  ['do', '做', 'du', 'v', 1, '日常口语', 'What do you do for work?', '你做什么工作？'],
  ['at', '在/于', 'æt', 'prep', 1, '日常口语', 'Meet me at the corner.', '在拐角处见我。'],
  ['this', '这个', 'ðɪs', 'det', 1, '日常口语', 'This is my house.', '这是我的房子。'],
  ['but', '但是', 'bʌt', 'conj', 1, '日常口语', 'I want to go but I\'m tired.', '我想去但是我累了。'],
  ['his', '他的', 'hɪz', 'det', 1, '日常口语', 'His car is blue.', '他的车是蓝色的。'],
  ['by', '由/通过/在...旁边', 'baɪ', 'prep', 1, '日常口语', 'I go to work by bus.', '我坐公交上班。'],
  ['from', '来自', 'frʌm', 'prep', 1, '日常口语', 'I\'m from China.', '我来自中国。'],
  ['they', '他们', 'ðeɪ', 'pron', 1, '日常口语', 'They are coming over tonight.', '他们今晚过来。'],
  ['we', '我们', 'wi', 'pron', 1, '日常口语', 'We should go now.', '我们该走了。'],
  ['say', '说', 'seɪ', 'v', 1, '日常口语', 'What did you say?', '你说什么？'],
  ['her', '她的', 'hɜr', 'det', 1, '日常口语', 'Her name is Sarah.', '她的名字是Sarah。'],
  ['she', '她', 'ʃi', 'pron', 1, '日常口语', 'She is a doctor.', '她是一名医生。'],
  ['or', '或者', 'ɔr', 'conj', 1, '日常口语', 'Tea or coffee?', '茶还是咖啡？'],
  ['will', '将会', 'wɪl', 'v', 1, '日常口语', 'I will call you tomorrow.', '我明天会给你打电话。'],
  ['my', '我的', 'maɪ', 'det', 1, '日常口语', 'This is my book.', '这是我的书。'],
  ['all', '全部/所有', 'ɔl', 'det', 1, '日常口语', 'All students passed the test.', '所有学生都通过了考试。'],
  ['would', '会/愿意', 'wʊd', 'v', 1, '日常口语', 'I would like a coffee please.', '我想要一杯咖啡。'],
  ['there', '那里/有', 'ðɛr', 'adv', 1, '日常口语', 'There is a park nearby.', '附近有一个公园。'],
  ['their', '他们的', 'ðɛr', 'det', 1, '日常口语', 'Their house is beautiful.', '他们的房子很漂亮。'],
  ['what', '什么', 'wʌt', 'pron', 1, '日常口语', 'What is your name?', '你叫什么名字？'],
  ['so', '所以/这么', 'soʊ', 'conj', 1, '日常口语', 'I was tired so I went to bed.', '我累了所以去睡了。'],
  ['up', '向上/起来', 'ʌp', 'adv', 1, '日常口语', 'Please stand up.', '请站起来。'],
  ['out', '出去/向外', 'aʊt', 'adv', 1, '日常口语', 'Let\'s go out tonight.', '今晚我们出去吧。'],
  ['if', '如果', 'ɪf', 'conj', 1, '日常口语', 'Call me if you need help.', '如果你需要帮助就打电话给我。'],
  ['about', '关于/大约', 'əˈbaʊt', 'prep', 1, '日常口语', 'Tell me about your trip.', '跟我说说你的旅行。'],
  ['who', '谁', 'hu', 'pron', 1, '日常口语', 'Who is that person?', '那个人是谁？'],
  ['get', '得到/变得', 'ɡɛt', 'v', 1, '日常口语', 'Can I get some water?', '我能来点水吗？'],
  ['which', '哪个', 'wɪtʃ', 'det', 1, '日常口语', 'Which one do you want?', '你要哪一个？'],
  ['go', '去', 'ɡoʊ', 'v', 1, '日常口语', 'I go to school every day.', '我每天去学校。'],
  ['me', '我(宾格)', 'mi', 'pron', 1, '日常口语', 'Can you help me?', '你能帮我吗？'],
  ['when', '什么时候', 'wɛn', 'adv', 1, '日常口语', 'When is the meeting?', '会议什么时候？'],
  ['make', '做/制造', 'meɪk', 'v', 1, '日常口语', 'Let me make some coffee.', '我来煮点咖啡。'],
  ['can', '能/可以', 'kæn', 'v', 1, '日常口语', 'Can you swim?', '你会游泳吗？'],
  ['like', '喜欢/像', 'laɪk', 'v', 1, '日常口语', 'I like pizza.', '我喜欢披萨。'],
  ['time', '时间', 'taɪm', 'n', 1, '日常口语', 'What time is it?', '现在几点了？'],
  ['no', '不/没有', 'noʊ', 'interj', 1, '日常口语', 'No, thank you.', '不，谢谢。'],
  ['just', '只是/刚刚', 'dʒʌst', 'adv', 1, '日常口语', 'I just arrived.', '我刚到。'],
  ['him', '他(宾格)', 'hɪm', 'pron', 1, '日常口语', 'I saw him yesterday.', '我昨天看到他了。'],
  ['know', '知道', 'noʊ', 'v', 1, '日常口语', 'I don\'t know the answer.', '我不知道答案。'],
  ['take', '拿/带/花费', 'teɪk', 'v', 1, '日常口语', 'Take your time.', '慢慢来。'],
  ['people', '人/人们', 'ˈpipəl', 'n', 1, '日常口语', 'Many people came to the party.', '很多人来了派对。'],
  ['into', '进入', 'ˈɪntu', 'prep', 1, '日常口语', 'Come into the house.', '进屋里来。'],
  ['year', '年', 'jɪr', 'n', 1, '日常口语', 'Happy New Year!', '新年快乐！'],
  ['your', '你的/你们的', 'jʊr', 'det', 1, '日常口语', 'What is your name?', '你叫什么名字？'],
  ['good', '好的', 'ɡʊd', 'adj', 1, '日常口语', 'That\'s a good idea.', '那是个好主意。'],
  ['some', '一些', 'sʌm', 'det', 1, '日常口语', 'Can I have some water?', '我能喝点水吗？'],
  ['could', '可以/可能', 'kʊd', 'v', 1, '日常口语', 'Could you help me?', '你能帮我一下吗？'],
  ['them', '他们(宾格)', 'ðɛm', 'pron', 1, '日常口语', 'I don\'t know them.', '我不认识他们。'],
  ['see', '看见/明白', 'si', 'v', 1, '日常口语', 'I see what you mean.', '我明白你的意思。'],
  ['other', '其他的', 'ˈʌðər', 'adj', 1, '日常口语', 'Any other questions?', '还有其他问题吗？'],
  ['then', '然后/那时', 'ðɛn', 'adv', 1, '日常口语', 'I went home, then I ate dinner.', '我回家，然后吃了晚饭。'],
  ['now', '现在', 'naʊ', 'adv', 1, '日常口语', 'I need to go now.', '我现在就得走了。'],
  ['look', '看/看起来', 'lʊk', 'v', 1, '日常口语', 'Look at that sunset!', '你看那个日落！'],
  ['only', '只有/仅仅', 'ˈoʊnli', 'adv', 1, '日常口语', 'It\'s only 5 dollars.', '只要五美元。'],
  ['come', '来', 'kʌm', 'v', 1, '日常口语', 'Come here, please.', '请过来。'],
  ['its', '它的', 'ɪts', 'det', 1, '日常口语', 'The dog wagged its tail.', '狗摇了摇尾巴。'],
  ['over', '超过/在...上方', 'ˈoʊvər', 'prep', 1, '日常口语', 'The plane flew over the city.', '飞机从城市上方飞过。'],
  ['think', '想/认为', 'θɪŋk', 'v', 1, '日常口语', 'I think it\'s a good plan.', '我觉得这是个好计划。'],
  ['also', '也', 'ˈɔlsoʊ', 'adv', 1, '日常口语', 'I also like swimming.', '我也喜欢游泳。'],
  ['back', '回来/后面', 'bæk', 'adv', 1, '日常口语', 'I\'ll be back in 5 minutes.', '我五分钟回来。'],
  ['after', '在...之后', 'ˈæftər', 'prep', 1, '日常口语', 'Let\'s meet after work.', '下班后见。'],
  ['use', '使用', 'juz', 'v', 1, '日常口语', 'Can I use your phone?', '我可以用你的手机吗？'],
  ['two', '二', 'tu', 'num', 1, '日常口语', 'I have two cats.', '我有两只猫。'],
  ['how', '怎么', 'haʊ', 'adv', 1, '日常口语', 'How are you?', '你好吗？'],
  ['our', '我们的', 'aʊr', 'det', 1, '日常口语', 'Our team won the game.', '我们队赢了比赛。'],
  ['work', '工作', 'wɜrk', 'n', 1, '职场', 'I love my work.', '我爱我的工作。'],
  ['first', '第一个/首先', 'fɜrst', 'adj', 1, '日常口语', 'First, let me introduce myself.', '首先，让我自我介绍一下。'],
  ['well', '好/那么', 'wɛl', 'adv', 1, '日常口语', 'She speaks English very well.', '她英语说得很好。'],
  ['way', '方式/路', 'weɪ', 'n', 1, '日常口语', 'This is the best way to learn.', '这是最好的学习方式。'],
  ['even', '甚至/即使', 'ˈivən', 'adv', 1, '日常口语', 'Even a child can do that.', '连小孩都会做。'],
  ['new', '新的', 'nu', 'adj', 1, '日常口语', 'I got a new phone!', '我买了新手机！'],
  ['want', '想要', 'wɑnt', 'v', 1, '日常口语', 'I want to travel the world.', '我想环游世界。'],
  ['because', '因为', 'bɪˈkɔz', 'conj', 1, '日常口语', 'I left because it was late.', '我走了因为太晚了。'],
  ['any', '任何', 'ˈɛni', 'det', 1, '日常口语', 'Do you have any questions?', '你有什么问题吗？'],
  ['these', '这些', 'ðiz', 'det', 1, '日常口语', 'These shoes are comfortable.', '这双鞋很舒服。'],
  ['give', '给', 'ɡɪv', 'v', 1, '日常口语', 'Can you give me a hand?', '你能帮我一下吗？'],
  ['day', '天/日', 'deɪ', 'n', 1, '日常口语', 'Have a nice day!', '祝你有美好的一天！'],
  ['most', '大多数/最', 'moʊst', 'adv', 1, '日常口语', 'Most people like music.', '大多数人都喜欢音乐。'],
  ['us', '我们(宾格)', 'ʌs', 'pron', 1, '日常口语', 'They invited us to dinner.', '他们邀请我们吃晚饭。'],

  // Level 2 · 日常高频词汇
  ['actually', '其实/实际上', 'ˈæktʃuəli', 'adv', 2, '日常口语', 'Actually, I changed my mind.', '其实我改主意了。'],
  ['again', '再一次', 'əˈɡɛn', 'adv', 2, '日常口语', 'Can you say that again?', '你能再说一遍吗？'],
  ['almost', '几乎', 'ˈɔlmoʊst', 'adv', 2, '日常口语', 'I almost missed the bus.', '我差点错过了公交。'],
  ['already', '已经', 'ɔlˈrɛdi', 'adv', 2, '日常口语', 'I already ate lunch.', '我已经吃过午饭了。'],
  ['always', '总是', 'ˈɔlweɪz', 'adv', 2, '日常口语', 'She is always on time.', '她总是很准时。'],
  ['another', '另一个', 'əˈnʌðər', 'det', 2, '日常口语', 'Can I have another one?', '我能再要一个吗？'],
  ['around', '周围/大约', 'əˈraʊnd', 'prep', 2, '日常口语', 'Look around you.', '看看你周围。'],
  ['ask', '问/请求', 'æsk', 'v', 2, '日常口语', 'Can I ask you a question?', '我能问你一个问题吗？'],
  ['away', '离开', 'əˈweɪ', 'adv', 2, '日常口语', 'Go away!', '走开！'],
  ['bad', '糟糕的/坏的', 'bæd', 'adj', 2, '日常口语', 'That\'s not a bad idea.', '那主意不赖。'],
  ['before', '在...之前', 'bɪˈfɔr', 'prep', 2, '日常口语', 'Think before you speak.', '说话之前先想清楚。'],
  ['believe', '相信', 'bɪˈliv', 'v', 2, '日常口语', 'I believe in you.', '我相信你。'],
  ['best', '最好的', 'bɛst', 'adj', 2, '日常口语', 'You\'re the best!', '你最棒了！'],
  ['better', '更好的', 'ˈbɛtər', 'adj', 2, '日常口语', 'I feel much better now.', '我现在感觉好多了。'],
  ['big', '大的', 'bɪɡ', 'adj', 2, '日常口语', 'That\'s a big house.', '那栋房子真大。'],
  ['body', '身体', 'ˈbɑdi', 'n', 2, '日常口语', 'Take care of your body.', '照顾好你的身体。'],
  ['book', '书', 'bʊk', 'n', 2, '日常口语', 'I\'m reading a great book.', '我在读一本很棒的书。'],
  ['both', '两者', 'boʊθ', 'det', 2, '日常口语', 'Both options are fine.', '两个选项都行。'],
  ['bring', '带来', 'brɪŋ', 'v', 2, '日常口语', 'Bring your friend to the party.', '带朋友来派对。'],
  ['call', '打电话/叫', 'kɔl', 'v', 2, '日常口语', 'Call me when you get home.', '到家给我打电话。'],
  ['car', '车', 'kɑr', 'n', 2, '日常口语', 'I need to buy a new car.', '我需要买辆新车。'],
  ['change', '改变/零钱', 'tʃeɪndʒ', 'n', 2, '日常口语', 'I need a change of scenery.', '我需要换个环境。'],
  ['child', '孩子', 'tʃaɪld', 'n', 2, '日常口语', 'I have a child in elementary school.', '我有一个上小学的孩子。'],
  ['city', '城市', 'ˈsɪti', 'n', 2, '日常口语', 'New York is my favorite city.', '纽约是我最喜欢的城市。'],
  ['close', '关闭/近的', 'kloʊz', 'v', 2, '日常口语', 'Close the door please.', '请关门。'],
  ['cold', '冷的/感冒', 'koʊld', 'adj', 2, '日常口语', 'It\'s so cold today.', '今天真冷。'],
  ['country', '国家/乡村', 'ˈkʌntri', 'n', 2, '旅行', 'Which country are you from?', '你来自哪个国家？'],
  ['door', '门', 'dɔr', 'n', 2, '日常口语', 'Knock on the door before entering.', '进门之前先敲门。'],
  ['down', '向下', 'daʊn', 'adv', 2, '日常口语', 'Sit down and relax.', '坐下来放松。'],
  ['each', '每个', 'itʃ', 'det', 2, '日常口语', 'Each student gets a book.', '每个学生拿一本书。'],
  ['eat', '吃', 'it', 'v', 2, '餐饮', 'Let\'s eat out tonight.', '今晚我们出去吃吧。'],
  ['end', '结束/末端', 'ɛnd', 'n', 2, '日常口语', 'The movie has a happy ending.', '电影有个圆满结局。'],
  ['enough', '足够', 'ɪˈnʌf', 'adv', 2, '日常口语', 'That\'s enough for today.', '今天就这么多吧。'],
  ['ever', '曾经', 'ˈɛvər', 'adv', 2, '日常口语', 'Have you ever been to Paris?', '你去过巴黎吗？'],
  ['every', '每一个', 'ˈɛvri', 'det', 2, '日常口语', 'I go there every weekend.', '我每个周末都去那里。'],
  ['example', '例子', 'ɪɡˈzæmpəl', 'n', 2, '日常口语', 'Give me an example.', '给我一个例子。'],
  ['eye', '眼睛', 'aɪ', 'n', 2, '日常口语', 'Look me in the eye.', '看着我的眼睛。'],
  ['face', '脸/面对', 'feɪs', 'n', 2, '日常口语', 'She has a beautiful face.', '她有一张漂亮的脸。'],
  ['family', '家庭', 'ˈfæməli', 'n', 2, '日常口语', 'Family is everything to me.', '家庭对我来说是一切。'],
  ['far', '远的', 'fɑr', 'adj', 2, '日常口语', 'How far is the airport?', '机场有多远？'],
  ['father', '父亲', 'ˈfɑðər', 'n', 2, '日常口语', 'My father taught me to drive.', '我父亲教我开车。'],
  ['feel', '感觉', 'fil', 'v', 2, '情感', 'I feel great today!', '我今天感觉很好！'],
  ['few', '几个/很少', 'fju', 'det', 2, '日常口语', 'I have a few questions.', '我有几个问题。'],
  ['find', '找到/发现', 'faɪnd', 'v', 2, '日常口语', 'I can\'t find my keys.', '我找不到我的钥匙了。'],
  ['food', '食物', 'fud', 'n', 2, '餐饮', 'The food here is delicious.', '这里的东西很好吃。'],
  ['friend', '朋友', 'frɛnd', 'n', 2, '社交', 'She is my best friend.', '她是我最好的朋友。'],
  ['great', '很棒的/伟大的', 'ɡreɪt', 'adj', 2, '日常口语', 'You did a great job!', '你做得太棒了！'],
  ['hand', '手', 'hænd', 'n', 2, '日常口语', 'Hold my hand.', '握着我的手。'],
  ['happy', '开心的', 'ˈhæpi', 'adj', 2, '情感', 'I\'m so happy to see you!', '见到你我太开心了！'],
  ['hard', '难的/努力的', 'hɑrd', 'adj', 2, '日常口语', 'Learning a new language is hard.', '学一门新语言很难。'],
  ['head', '头', 'hɛd', 'n', 2, '日常口语', 'I have a headache.', '我头疼。'],
  ['help', '帮助', 'hɛlp', 'v', 2, '日常口语', 'Can you help me with this?', '你能帮我一下吗？'],
  ['here', '这里', 'hɪr', 'adv', 2, '日常口语', 'Come here, I want to show you something.', '过来，我给你看个东西。'],
  ['high', '高的', 'haɪ', 'adj', 2, '日常口语', 'The mountain is very high.', '那座山很高。'],
  ['home', '家', 'hoʊm', 'n', 2, '日常口语', 'I\'m going home now.', '我现在回家了。'],
  ['house', '房子', 'haʊs', 'n', 2, '日常口语', 'We bought a new house!', '我们买了新房子！'],
  ['important', '重要的', 'ɪmˈpɔrtənt', 'adj', 2, '职场', 'This meeting is very important.', '这个会议很重要。'],
  ['job', '工作', 'dʒɑb', 'n', 2, '职场', 'I\'m looking for a new job.', '我在找新工作。'],
  ['keep', '保持/保留', 'kip', 'v', 2, '日常口语', 'Keep up the good work!', '继续好好干！'],
  ['kind', '善良的/种类', 'kaɪnd', 'adj', 2, '日常口语', 'That was very kind of you.', '你真是太好了。'],
  ['last', '最后的/上一个', 'læst', 'adj', 2, '日常口语', 'Last week was so busy.', '上周太忙了。'],
  ['later', '晚些/以后', 'ˈleɪtər', 'adv', 2, '日常口语', 'I\'ll do it later.', '我待会做。'],
  ['learn', '学习', 'lɜrn', 'v', 2, '校园', 'I want to learn Spanish.', '我想学西班牙语。'],
  ['leave', '离开', 'liv', 'v', 2, '日常口语', 'What time do you leave for work?', '你几点出门上班？'],
  ['let', '让', 'lɛt', 'v', 2, '日常口语', 'Let me help you with that.', '让我帮你。'],
  ['life', '生活/生命', 'laɪf', 'n', 2, '日常口语', 'Life is beautiful.', '生活是美好的。'],
  ['light', '光/灯/轻的', 'laɪt', 'n', 2, '日常口语', 'Turn on the light please.', '请开灯。'],
  ['little', '小的/一点点', 'ˈlɪtəl', 'adj', 2, '日常口语', 'I speak a little English.', '我会说一点英语。'],
  ['live', '生活/居住', 'lɪv', 'v', 2, '日常口语', 'I live in Beijing.', '我住在北京。'],
  ['long', '长的', 'lɔŋ', 'adj', 2, '日常口语', 'It\'s a long story.', '说来话长。'],
  ['love', '爱', 'lʌv', 'v', 2, '情感', 'I love this song!', '我爱这首歌！'],
  ['man', '男人', 'mæn', 'n', 2, '日常口语', 'He\'s a good man.', '他是个好人。'],
  ['many', '许多', 'ˈmɛni', 'det', 2, '日常口语', 'Many people came to the event.', '很多人来参加了活动。'],
  ['may', '可能/可以', 'meɪ', 'v', 2, '日常口语', 'May I come in?', '我可以进来吗？'],
  ['mean', '意思是/刻薄', 'min', 'v', 2, '日常口语', 'What does this word mean?', '这个词什么意思？'],
  ['might', '可能', 'maɪt', 'v', 2, '日常口语', 'I might be late tomorrow.', '我明天可能会迟到。'],
  ['mind', '介意/头脑', 'maɪnd', 'n', 2, '日常口语', 'Do you mind if I sit here?', '你介意我坐这里吗？'],
  ['money', '钱', 'ˈmʌni', 'n', 2, '购物', 'I need to save more money.', '我需要多存点钱。'],
  ['month', '月', 'mʌnθ', 'n', 2, '日常口语', 'I\'ll be there next month.', '我下个月到。'],
  ['morning', '早晨', 'ˈmɔrnɪŋ', 'n', 2, '日常口语', 'Good morning!', '早上好！'],
  ['mother', '母亲', 'ˈmʌðər', 'n', 2, '日常口语', 'My mother is a great cook.', '我妈做饭很好吃。'],
  ['move', '移动/搬', 'muv', 'v', 2, '日常口语', 'We\'re moving to a new apartment.', '我们要搬去新公寓了。'],
  ['much', '很多(不可数)', 'mʌtʃ', 'adv', 2, '日常口语', 'Thank you so much!', '非常感谢！'],
  ['must', '必须', 'mʌst', 'v', 2, '日常口语', 'You must try this dish!', '你一定要试试这个菜！'],
  ['name', '名字', 'neɪm', 'n', 2, '日常口语', 'My name is Alex.', '我的名字是Alex。'],
  ['need', '需要', 'nid', 'v', 2, '日常口语', 'I need your help.', '我需要你的帮助。'],
  ['never', '从不', 'ˈnɛvər', 'adv', 2, '日常口语', 'I never eat fast food.', '我从不吃快餐。'],
  ['next', '下一个', 'nɛkst', 'adj', 2, '日常口语', 'See you next week!', '下周见！'],
  ['night', '夜晚', 'naɪt', 'n', 2, '日常口语', 'I slept well last night.', '我昨晚睡得很好。'],
  ['nothing', '什么都没有', 'ˈnʌθɪŋ', 'pron', 2, '日常口语', 'There\'s nothing to worry about.', '没什么好担心的。'],
  ['off', '关/离开', 'ɔf', 'adv', 2, '日常口语', 'Please turn off the lights.', '请关灯。'],
  ['often', '经常', 'ˈɔfən', 'adv', 2, '日常口语', 'How often do you exercise?', '你多久锻炼一次？'],
  ['old', '老的/旧的', 'oʊld', 'adj', 2, '日常口语', 'How old are you?', '你多大？'],
  ['once', '一次/曾经', 'wʌns', 'adv', 2, '日常口语', 'I go to the gym once a week.', '我每周去一次健身房。'],
  ['open', '打开/开的', 'ˈoʊpən', 'v', 2, '日常口语', 'Open the window please.', '请开窗。'],
  ['part', '部分', 'pɑrt', 'n', 2, '日常口语', 'This is my favorite part.', '这是我最喜欢的部分。'],
  ['pay', '付钱', 'peɪ', 'v', 2, '购物', 'Can I pay by card?', '我能刷卡吗？'],
  ['person', '人', 'ˈpɜrsən', 'n', 2, '日常口语', 'She is a very nice person.', '她是个很好的人。'],
  ['place', '地方', 'pleɪs', 'n', 2, '日常口语', 'This is a beautiful place.', '这地方真美。'],
  ['play', '玩/演奏', 'pleɪ', 'v', 2, '日常口语', 'Let\'s play some music.', '我们来放点音乐。'],
  ['point', '点/观点', 'pɔɪnt', 'n', 2, '日常口语', 'You made a good point.', '你说得有道理。'],
  ['problem', '问题', 'ˈprɑbləm', 'n', 2, '日常口语', 'What\'s the problem?', '有什么问题？'],
  ['put', '放', 'pʊt', 'v', 2, '日常口语', 'Put your phone away.', '把你的手机收起来。'],
  ['really', '真的', 'ˈriəli', 'adv', 2, '日常口语', 'I really appreciate it.', '我真的很感激。'],
  ['right', '对的/右边', 'raɪt', 'adj', 2, '日常口语', 'You\'re absolutely right.', '你完全对了。'],
  ['room', '房间', 'rum', 'n', 2, '日常口语', 'Your room is so tidy!', '你的房间真整洁！'],
  ['run', '跑', 'rʌn', 'v', 2, '日常口语', 'I run every morning.', '我每天早上跑步。'],
  ['same', '相同的', 'seɪm', 'adj', 2, '日常口语', 'We have the same taste in music.', '我们音乐品味相同。'],
  ['school', '学校', 'skul', 'n', 2, '校园', 'I walk to school every day.', '我每天走路上学。'],
  ['show', '展示/节目', 'ʃoʊ', 'v', 2, '日常口语', 'Let me show you something.', '我给你看个东西。'],
  ['since', '自从/因为', 'sɪns', 'prep', 2, '日常口语', 'I\'ve been here since Monday.', '我从周一开始就在这里了。'],
  ['small', '小的', 'smɔl', 'adj', 2, '日常口语', 'The room is too small.', '这个房间太小了。'],
  ['start', '开始', 'stɑrt', 'v', 2, '日常口语', 'Let\'s start the meeting.', '我们开始开会吧。'],
  ['state', '州/状态', 'steɪt', 'n', 2, '日常口语', 'California is a big state.', '加利福尼亚是个大州。'],
  ['still', '仍然', 'stɪl', 'adv', 2, '日常口语', 'Are you still there?', '你还在吗？'],
  ['stop', '停止', 'stɑp', 'v', 2, '日常口语', 'Please stop talking.', '请别说话了。'],
  ['story', '故事', 'ˈstɔri', 'n', 2, '日常口语', 'Tell me a story.', '给我讲个故事。'],
  ['such', '这样的/如此', 'sʌtʃ', 'det', 2, '日常口语', 'She is such a good teacher.', '她真是个好老师。'],
  ['sure', '当然/确定', 'ʃʊr', 'adj', 2, '日常口语', 'Are you sure about that?', '你确定吗？'],
  ['talk', '说话/交谈', 'tɔk', 'v', 2, '日常口语', 'We need to talk.', '我们需要谈谈。'],
  ['tell', '告诉', 'tɛl', 'v', 2, '日常口语', 'Tell me what happened.', '告诉我发生了什么。'],
  ['thing', '东西/事情', 'θɪŋ', 'n', 2, '日常口语', 'The best thing about this job is the people.', '这份工作最好的地方就是人。'],
  ['through', '通过', 'θru', 'prep', 2, '日常口语', 'We walked through the park.', '我们穿过了公园。'],
  ['today', '今天', 'təˈdeɪ', 'adv', 2, '日常口语', 'What are you doing today?', '你今天做什么？'],
  ['together', '一起', 'təˈɡɛðər', 'adv', 2, '社交', 'Let\'s do this together.', '我们一起做吧。'],
  ['too', '也/太', 'tu', 'adv', 2, '日常口语', 'I like it too.', '我也喜欢。'],
  ['turn', '转/轮到', 'tɜrn', 'v', 2, '日常口语', 'Turn left at the light.', '在红绿灯左转。'],
  ['until', '直到', 'ʌnˈtɪl', 'prep', 2, '日常口语', 'Wait until I come back.', '等我回来。'],
  ['very', '非常', 'ˈvɛri', 'adv', 2, '日常口语', 'That\'s very kind of you.', '你真是太好了。'],
  ['watch', '看/手表', 'wɑtʃ', 'v', 2, '日常口语', 'Let\'s watch a movie tonight.', '今晚我们看电影吧。'],
  ['water', '水', 'ˈwɔtər', 'n', 2, '日常口语', 'Can I have a glass of water?', '我能要一杯水吗？'],
  ['week', '星期', 'wik', 'n', 2, '日常口语', 'I\'ll see you next week.', '下周见。'],
  ['where', '哪里', 'wɛr', 'adv', 2, '日常口语', 'Where do you live?', '你住哪里？'],
  ['while', '当...的时候/一会儿', 'waɪl', 'conj', 2, '日常口语', 'I\'ll wait while you get ready.', '你准备的时候我等。'],
  ['without', '没有', 'wɪˈðaʊt', 'prep', 2, '日常口语', 'I can\'t live without music.', '我不能没有音乐。'],
  ['woman', '女人', 'ˈwʊmən', 'n', 2, '日常口语', 'She is an amazing woman.', '她是个了不起的女人。'],
  ['word', '单词/话', 'wɜrd', 'n', 2, '日常口语', 'I don\'t understand this word.', '我不懂这个词。'],
  ['world', '世界', 'wɜrld', 'n', 2, '日常口语', 'The world is a big place.', '世界很大。'],
  ['wrong', '错的', 'rɔŋ', 'adj', 2, '日常口语', 'I think you\'re wrong.', '我觉得你错了。'],
  ['yet', '还/仍然', 'jɛt', 'adv', 2, '日常口语', 'I haven\'t finished yet.', '我还没完成。'],
  ['young', '年轻的', 'jʌŋ', 'adj', 2, '日常口语', 'You look so young!', '你看起来好年轻！'],

  // Level 3 · 进阶高频词
  ['accept', '接受', 'ækˈsɛpt', 'v', 3, '日常口语', 'I accept your apology.', '我接受你的道歉。'],
  ['according', '根据', 'əˈkɔrdɪŋ', 'adv', 3, '日常口语', 'According to the news, it will rain tomorrow.', '根据新闻，明天会下雨。'],
  ['across', '穿过/对面', 'əˈkrɔs', 'prep', 3, '日常口语', 'The store is across the street.', '商店在街对面。'],
  ['action', '行动', 'ˈækʃən', 'n', 3, '日常口语', 'It\'s time for action.', '是行动的时候了。'],
  ['add', '添加/加', 'æd', 'v', 3, '日常口语', 'Add some salt to the soup.', '汤里加点盐。'],
  ['agree', '同意', 'əˈɡri', 'v', 3, '日常口语', 'I agree with you completely.', '我完全同意你。'],
  ['allow', '允许', 'əˈlaʊ', 'v', 3, '日常口语', 'Smoking is not allowed here.', '这里不允许吸烟。'],
  ['answer', '回答/答案', 'ˈænsər', 'n', 3, '日常口语', 'Do you know the answer?', '你知道答案吗？'],
  ['appear', '出现/似乎', 'əˈpɪr', 'v', 3, '日常口语', 'He appeared at the door.', '他出现在门口。'],
  ['approach', '方法/接近', 'əˈproʊtʃ', 'n', 3, '职场', 'We need a new approach to this problem.', '我们需要新的方法来解决这个问题。'],
  ['area', '区域', 'ˈɛriə', 'n', 3, '日常口语', 'This is a nice area to live in.', '这是个宜居的好区域。'],
  ['attention', '注意力', 'əˈtɛnʃən', 'n', 3, '日常口语', 'Pay attention in class!', '上课专心听讲！'],
  ['avoid', '避免', 'əˈvɔɪd', 'v', 3, '日常口语', 'Try to avoid rush hour traffic.', '尽量避开高峰时段。'],
  ['become', '变成/成为', 'bɪˈkʌm', 'v', 3, '日常口语', 'She wants to become a doctor.', '她想成为一名医生。'],
  ['begin', '开始', 'bɪˈɡɪn', 'v', 3, '日常口语', 'Let\'s begin the lesson.', '我们开始上课吧。'],
  ['behind', '在后面', 'bɪˈhaɪnd', 'prep', 3, '日常口语', 'The cat is behind the sofa.', '猫在沙发后面。'],
  ['break', '打破/休息', 'breɪk', 'v', 3, '日常口语', 'Let\'s take a break.', '我们休息一下吧。'],
  ['build', '建造', 'bɪld', 'v', 3, '日常口语', 'We want to build a new house.', '我们想建一栋新房子。'],
  ['business', '生意/公司', 'ˈbɪznəs', 'n', 3, '职场', 'I have a business meeting at 3.', '我三点有一个商务会议。'],
  ['care', '关心/在乎', 'kɛr', 'v', 3, '情感', 'I really care about you.', '我真的很在乎你。'],
  ['cause', '导致/原因', 'kɔz', 'v', 3, '日常口语', 'What caused the accident?', '事故的原因是什么？'],
  ['center', '中心', 'ˈsɛntər', 'n', 3, '日常口语', 'The hotel is in the city center.', '酒店在市中心。'],
  ['certain', '确定的/某个', 'ˈsɜrtən', 'adj', 3, '日常口语', 'I\'m not certain about the time.', '我不确定时间。'],
  ['chance', '机会', 'tʃæns', 'n', 3, '日常口语', 'Give me a chance to explain.', '给我一个解释的机会。'],
  ['choose', '选择', 'tʃuz', 'v', 3, '日常口语', 'Choose the one you like best.', '选你最喜欢的那个。'],
  ['clear', '清楚的', 'klɪr', 'adj', 3, '日常口语', 'Is everything clear?', '都清楚了吗？'],
  ['common', '常见的/共同的', 'ˈkɑmən', 'adj', 3, '日常口语', 'This is a very common mistake.', '这是一个很常见的错误。'],
  ['company', '公司', 'ˈkʌmpəni', 'n', 3, '职场', 'She works for a tech company.', '她在一家科技公司工作。'],
  ['consider', '考虑', 'kənˈsɪdər', 'v', 3, '日常口语', 'I\'ll consider your offer.', '我会考虑你的提议。'],
  ['continue', '继续', 'kənˈtɪnju', 'v', 3, '日常口语', 'Please continue with your story.', '请继续讲你的故事。'],
  ['control', '控制', 'kənˈtroʊl', 'n', 3, '日常口语', 'I have no control over this situation.', '我控制不了这个情况。'],
  ['cost', '花费/成本', 'kɔst', 'n', 3, '购物', 'What\'s the cost of this item?', '这个东西多少钱？'],
  ['course', '课程/过程', 'kɔrs', 'n', 3, '校园', 'Of course I\'ll help you.', '我当然会帮你。'],
  ['create', '创造', 'kriˈeɪt', 'v', 3, '日常口语', 'Let\'s create something together.', '我们一起创造点什么吧。'],
  ['deal', '处理/交易', 'dil', 'v', 3, '日常口语', 'I can\'t deal with this right now.', '我现在应付不来。'],
  ['decide', '决定', 'dɪˈsaɪd', 'v', 3, '日常口语', 'I can\'t decide which one to pick.', '我决定不了选哪个。'],
  ['describe', '描述', 'dɪˈskraɪb', 'v', 3, '日常口语', 'Can you describe what happened?', '你能描述一下发生了什么吗？'],
  ['develop', '发展/开发', 'dɪˈvɛləp', 'v', 3, '职场', 'We need to develop a new strategy.', '我们需要制定新策略。'],
  ['different', '不同的', 'ˈdɪfərənt', 'adj', 3, '日常口语', 'This tastes different from what I expected.', '这味道跟我想的不一样。'],
  ['difficult', '困难的', 'ˈdɪfɪkəlt', 'adj', 3, '日常口语', 'This test is really difficult.', '这个测试真难。'],
  ['discuss', '讨论', 'dɪˈskʌs', 'v', 3, '职场', 'Let\'s discuss this later.', '我们晚点再讨论。'],
  ['drive', '开车', 'draɪv', 'v', 3, '日常口语', 'Can you drive me to the airport?', '你能开车送我去机场吗？'],
  ['drop', '掉下/放弃', 'drɑp', 'v', 3, '日常口语', 'Be careful, don\'t drop it!', '小心，别掉了！'],
  ['education', '教育', 'ˌɛdʒuˈkeɪʃən', 'n', 3, '校园', 'Education is the key to success.', '教育是成功的关键。'],
  ['else', '别的/其他', 'ɛls', 'adv', 3, '日常口语', 'Is there anything else?', '还有别的吗？'],
  ['enjoy', '享受/喜欢', 'ɪnˈdʒɔɪ', 'v', 3, '日常口语', 'I really enjoy cooking.', '我真的很享受做饭。'],
  ['especially', '尤其/特别', 'ɪˈspɛʃəli', 'adv', 3, '日常口语', 'I love music, especially jazz.', '我喜欢音乐，尤其是爵士。'],
  ['event', '事件/活动', 'ɪˈvɛnt', 'n', 3, '社交', 'Are you going to the event tonight?', '你今晚去那个活动吗？'],
  ['expect', '期待/预期', 'ɪkˈspɛkt', 'v', 3, '日常口语', 'I didn\'t expect that to happen.', '我没想到会发生那种事。'],
  ['experience', '经验/经历', 'ɪkˈspɪriəns', 'n', 3, '职场', 'I have 5 years of experience in this field.', '我在这个领域有五年经验。'],
  ['explain', '解释', 'ɪkˈspleɪn', 'v', 3, '日常口语', 'Can you explain that again?', '你能再解释一遍吗？'],
  ['fact', '事实', 'fækt', 'n', 3, '日常口语', 'As a matter of fact, I agree with you.', '事实上，我同意你。'],
  ['fall', '落下/秋天', 'fɔl', 'v', 3, '日常口语', 'Be careful not to fall.', '小心别摔倒。'],
  ['fast', '快的', 'fæst', 'adj', 3, '日常口语', 'The car is going too fast.', '这车开得太快了。'],
  ['figure', '数字/人物/想明白', 'ˈfɪɡjər', 'v', 3, '日常口语', 'I can\'t figure this out.', '我想不明白这个。'],
  ['final', '最终的', 'ˈfaɪnəl', 'adj', 3, '日常口语', 'This is your final warning.', '这是你最后的警告。'],
  ['follow', '跟着/关注', 'ˈfɑloʊ', 'v', 3, '日常口语', 'Follow me, please.', '请跟我来。'],
  ['force', '力量/强制', 'fɔrs', 'n', 3, '日常口语', 'Don\'t force me to do this.', '别逼我做这个。'],
  ['free', '自由的/免费的', 'fri', 'adj', 3, '日常口语', 'Is this seat free?', '这个座位有人吗？'],
  ['front', '前面', 'frʌnt', 'n', 3, '日常口语', 'Stand in front of me.', '站到我前面来。'],
  ['full', '满的/饱的', 'fʊl', 'adj', 3, '日常口语', 'I\'m full, I can\'t eat anymore.', '我饱了，吃不下了。'],
  ['game', '游戏/比赛', 'ɡeɪm', 'n', 3, '日常口语', 'Let\'s play a game!', '我们来玩个游戏！'],
  ['girl', '女孩', 'ɡɜrl', 'n', 3, '日常口语', 'She\'s a smart girl.', '她是个聪明的女孩。'],
  ['government', '政府', 'ˈɡʌvərnmənt', 'n', 3, '日常口语', 'The government announced new policies.', '政府宣布了新政策。'],
  ['grow', '成长/种植', 'ɡroʊ', 'v', 3, '日常口语', 'Plants need sunlight to grow.', '植物需要阳光才能生长。'],
  ['guess', '猜', 'ɡɛs', 'v', 3, '日常口语', 'Can you guess what happened?', '你能猜到发生了什么吗？'],
  ['happen', '发生', 'ˈhæpən', 'v', 3, '日常口语', 'What happened here?', '这里发生了什么？'],
  ['hate', '讨厌/恨', 'heɪt', 'v', 3, '情感', 'I hate being late.', '我讨厌迟到。'],
  ['hear', '听到', 'hɪr', 'v', 3, '日常口语', 'Did you hear that noise?', '你听到那个声音了吗？'],
  ['heart', '心脏/心', 'hɑrt', 'n', 3, '情感', 'Follow your heart.', '跟随你的心。'],
  ['heavy', '重的', 'ˈhɛvi', 'adj', 3, '日常口语', 'This bag is too heavy.', '这个包太重了。'],
  ['history', '历史', 'ˈhɪstəri', 'n', 3, '日常口语', 'This city has a rich history.', '这座城市有丰富的历史。'],
  ['hold', '拿着/举行', 'hoʊld', 'v', 3, '日常口语', 'Can you hold this for me?', '你能帮我拿一下这个吗？'],
  ['hope', '希望', 'hoʊp', 'v', 3, '情感', 'I hope you feel better soon.', '我希望你快点好起来。'],
  ['however', '但是/然而', 'haʊˈɛvər', 'adv', 3, '日常口语', 'However you look at it, it\'s a problem.', '不管你怎么看，这都是个问题。'],
  ['human', '人类/人的', 'ˈhjumən', 'n', 3, '日常口语', 'To err is human.', '人非圣贤，孰能无过。'],
  ['idea', '主意/想法', 'aɪˈdiə', 'n', 3, '日常口语', 'That\'s a great idea!', '那是个好主意！'],
  ['image', '形象/图片', 'ˈɪmɪdʒ', 'n', 3, '日常口语', 'She has a very professional image.', '她给人很专业的形象。'],
  ['include', '包括', 'ɪnˈklud', 'v', 3, '日常口语', 'Does the price include tax?', '这个价格含税吗？'],
  ['increase', '增加', 'ɪnˈkris', 'v', 3, '日常口语', 'We need to increase our sales.', '我们需要增加销量。'],
  ['indeed', '确实', 'ɪnˈdid', 'adv', 3, '日常口语', 'Yes indeed, that\'s correct.', '是的确实，这是对的。'],
  ['interest', '兴趣/利息', 'ˈɪntrəst', 'n', 3, '日常口语', 'I have a strong interest in art.', '我对艺术有浓厚的兴趣。'],
  ['involve', '涉及/包括', 'ɪnˈvɑlv', 'v', 3, '日常口语', 'This project involves a lot of work.', '这个项目涉及很多工作。'],
  ['issue', '问题/议题', 'ˈɪʃu', 'n', 3, '职场', 'Let\'s address this issue.', '我们来处理这个问题。'],
  ['kid', '孩子', 'kɪd', 'n', 3, '日常口语', 'I have two kids.', '我有两个孩子。'],
  ['kill', '杀/消磨', 'kɪl', 'v', 3, '日常口语', 'Let\'s kill some time before the movie.', '我们电影前消磨一下时间。'],
  ['late', '迟到的', 'leɪt', 'adj', 3, '日常口语', 'Sorry I\'m late!', '抱歉我迟到了！'],
  ['laugh', '笑', 'læf', 'v', 3, '情感', 'That joke made me laugh so hard.', '那个笑话让我笑翻了。'],
  ['law', '法律', 'lɔ', 'n', 3, '日常口语', 'It\'s against the law to drive drunk.', '酒驾是违法的。'],
  ['lead', '领导/引领', 'lid', 'v', 3, '职场', 'She will lead the team.', '她将领导这个团队。'],
  ['line', '线/排/行', 'laɪn', 'n', 3, '日常口语', 'Please stand in line.', '请排队。'],
  ['list', '列表', 'lɪst', 'n', 3, '日常口语', 'I need to make a shopping list.', '我需要列一个购物清单。'],
  ['listen', '听', 'ˈlɪsən', 'v', 3, '日常口语', 'Listen carefully to the instructions.', '仔细听指令。'],
  ['lose', '失去/输', 'luz', 'v', 3, '日常口语', 'Don\'t lose your keys again.', '别又把钥匙丢了。'],
  ['main', '主要的', 'meɪn', 'adj', 3, '日常口语', 'What\'s the main reason?', '主要原因是什么？'],
  ['market', '市场', 'ˈmɑrkət', 'n', 3, '购物', 'Let\'s go to the farmers market.', '我们去农贸市场吧。'],
  ['matter', '事情/要紧', 'ˈmætər', 'n', 3, '日常口语', 'What\'s the matter with you?', '你怎么了？'],
  ['meet', '见面/遇见', 'mit', 'v', 3, '社交', 'Nice to meet you!', '很高兴认识你！'],
  ['member', '成员', 'ˈmɛmbər', 'n', 3, '日常口语', 'She\'s a member of our club.', '她是我们俱乐部的成员。'],
  ['mention', '提到', 'ˈmɛnʃən', 'v', 3, '日常口语', 'Don\'t mention it.', '别提了/不客气。'],
  ['minute', '分钟', 'ˈmɪnɪt', 'n', 3, '日常口语', 'Wait a minute!', '等一会儿！'],
  ['miss', '想念/错过/小姐', 'mɪs', 'v', 3, '日常口语', 'I miss you so much.', '我好想你。'],
  ['moment', '时刻', 'ˈmoʊmənt', 'n', 3, '日常口语', 'Just a moment, please.', '请稍等。'],
  ['nature', '自然', 'ˈneɪtʃər', 'n', 3, '日常口语', 'I love spending time in nature.', '我喜欢亲近自然。'],
  ['near', '附近/近的', 'nɪr', 'prep', 3, '日常口语', 'Is there a bank near here?', '这附近有银行吗？'],
  ['necessary', '必要的', 'ˈnɛsəˌsɛri', 'adj', 3, '日常口语', 'Is that really necessary?', '那真的有必要吗？'],
  ['notice', '注意到/通知', 'ˈnoʊtɪs', 'v', 3, '日常口语', 'I didn\'t notice you were there.', '我没注意到你在那里。'],
  ['offer', '提供', 'ˈɔfər', 'v', 3, '日常口语', 'Can I offer you a drink?', '能请你喝一杯吗？'],
  ['office', '办公室', 'ˈɔfɪs', 'n', 3, '职场', 'I\'ll be in the office all day.', '我整天都在办公室。'],
  ['order', '订单/顺序/命令', 'ˈɔrdər', 'n', 3, '餐饮', 'Are you ready to order?', '可以点菜了吗？'],
  ['paper', '纸/报纸/论文', 'ˈpeɪpər', 'n', 3, '日常口语', 'Can I borrow a piece of paper?', '我能借一张纸吗？'],
  ['pass', '通过/传递', 'pæs', 'v', 3, '日常口语', 'Can you pass the salt?', '能把盐递给我吗？'],
  ['past', '过去的', 'pæst', 'adj', 3, '日常口语', 'Don\'t dwell on the past.', '别纠结过去了。'],
  ['phone', '电话', 'foʊn', 'n', 3, '电话', 'Can I use your phone?', '我能用一下你的手机吗？'],
  ['pick', '挑选/捡起', 'pɪk', 'v', 3, '日常口语', 'Pick a number between 1 and 10.', '从1到10选一个数字。'],
  ['plan', '计划', 'plæn', 'n', 3, '日常口语', 'What\'s your plan for the weekend?', '你周末有什么计划？'],
  ['police', '警察', 'pəˈlis', 'n', 3, '日常口语', 'Call the police!', '报警！'],
  ['political', '政治的', 'pəˈlɪtɪkəl', 'adj', 3, '日常口语', 'We shouldn\'t talk about political issues at dinner.', '我们不应该在饭桌上谈政治话题。'],
  ['position', '位置/职位', 'pəˈzɪʃən', 'n', 3, '职场', 'I applied for a position at Google.', '我申请了谷歌的职位。'],
  ['possible', '可能的', 'ˈpɑsəbəl', 'adj', 3, '日常口语', 'Is it possible to reschedule?', '能重新安排时间吗？'],
  ['power', '力量/权力/电力', 'ˈpaʊər', 'n', 3, '日常口语', 'The power went out again.', '又停电了。'],
  ['practice', '练习', 'ˈpræktɪs', 'n', 3, '日常口语', 'Practice makes perfect.', '熟能生巧。'],
  ['present', '呈现/礼物/现在的', 'ˈprɛzənt', 'v', 3, '日常口语', 'Let me present my idea.', '让我来展示我的想法。'],
  ['president', '总统/总裁', 'ˈprɛzɪdənt', 'n', 3, '日常口语', 'She became the president of the company.', '她成了公司总裁。'],
  ['press', '按/压/媒体', 'prɛs', 'v', 3, '日常口语', 'Press the button to start.', '按按钮开始。'],
  ['pretty', '漂亮的/相当', 'ˈprɪti', 'adv', 3, '日常口语', 'That\'s pretty cool!', '那挺好的！'],
  ['price', '价格', 'praɪs', 'n', 3, '购物', 'What\'s the price of this shirt?', '这件衬衫多少钱？'],
  ['process', '过程/流程', 'ˈprɑsɛs', 'n', 3, '日常口语', 'The process takes about two weeks.', '这个过程大约需要两周。'],
  ['produce', '生产/产生', 'prəˈdus', 'v', 3, '日常口语', 'This factory produces cars.', '这个工厂生产汽车。'],
  ['product', '产品', 'ˈprɑdʌkt', 'n', 3, '购物', 'This is our best-selling product.', '这是我们最畅销的产品。'],
  ['project', '项目', 'ˈprɑdʒɛkt', 'n', 3, '职场', 'We finished the project ahead of schedule.', '我们提前完成了项目。'],
  ['prove', '证明', 'pruv', 'v', 3, '日常口语', 'I\'ll prove you wrong.', '我会证明你错了的。'],
  ['public', '公共的/公众', 'ˈpʌblɪk', 'adj', 3, '日常口语', 'Is there public transportation nearby?', '附近有公交吗？'],
  ['purpose', '目的', 'ˈpɜrpəs', 'n', 3, '日常口语', 'What\'s the purpose of this meeting?', '这个会议的目的是什么？'],
  ['question', '问题', 'ˈkwɛstʃən', 'n', 3, '日常口语', 'That\'s a good question.', '问得好。'],
  ['race', '种族/比赛', 'reɪs', 'n', 3, '日常口语', 'It was a close race.', '比赛很激烈。'],
  ['raise', '举起/提高/抚养', 'reɪz', 'v', 3, '日常口语', 'Can you raise your hand?', '你能举手吗？'],
  ['range', '范围', 'reɪndʒ', 'n', 3, '日常口语', 'We offer a wide range of products.', '我们提供多种产品。'],
  ['rate', '比率/速度/评分', 'reɪt', 'n', 3, '日常口语', 'The success rate is very high.', '成功率很高。'],
  ['rather', '倒是/宁愿', 'ˈræðər', 'adv', 3, '日常口语', 'I\'d rather stay home tonight.', '我今晚宁愿待在家。'],
  ['reach', '到达/伸手够', 'ritʃ', 'v', 3, '日常口语', 'I can\'t reach the top shelf.', '我够不到最上面的架子。'],
  ['read', '读', 'rid', 'v', 3, '日常口语', 'What are you reading?', '你在读什么？'],
  ['ready', '准备好的', 'ˈrɛdi', 'adj', 3, '日常口语', 'Are you ready to go?', '你准备好出发了吗？'],
  ['real', '真的/现实', 'riəl', 'adj', 3, '日常口语', 'Is this real or fake?', '这是真的还是假的？'],
  ['realize', '意识到/实现', 'ˈriəlaɪz', 'v', 3, '日常口语', 'I just realized I forgot my wallet.', '我刚意识到我忘了钱包。'],
  ['reason', '理由', 'ˈrizən', 'n', 3, '日常口语', 'What\'s your reason for quitting?', '你辞职的理由是什么？'],
  ['receive', '收到', 'rɪˈsiv', 'v', 3, '日常口语', 'Did you receive my email?', '你收到我的邮件了吗？'],
  ['recent', '最近的', 'ˈrisənt', 'adj', 3, '日常口语', 'In recent years, things have changed a lot.', '近年来事情变了很多。'],
  ['recognize', '认出/认识', 'ˈrɛkəɡnaɪz', 'v', 3, '日常口语', 'I didn\'t recognize you with that hat!', '你戴那个帽子我都没认出你来！'],
  ['record', '记录/纪录', 'ˈrɛkərd', 'n', 3, '日常口语', 'Keep a record of your expenses.', '记录你的开支。'],
  ['remember', '记住/记得', 'rɪˈmɛmbər', 'v', 3, '日常口语', 'Remember to lock the door.', '记得锁门。'],
  ['report', '报告', 'rɪˈpɔrt', 'n', 3, '职场', 'Please submit your report by Friday.', '请在周五前提交报告。'],
  ['represent', '代表', 'ˌrɛprɪˈzɛnt', 'v', 3, '日常口语', 'Who will represent our company at the conference?', '谁将代表我们公司出席会议？'],
  ['require', '需要/要求', 'rɪˈkwaɪr', 'v', 3, '日常口语', 'This job requires a lot of patience.', '这份工作需要很多耐心。'],
  ['research', '研究/调查', 'rɪˈsɜrtʃ', 'n', 3, '日常口语', 'I\'m doing research for my paper.', '我在为论文做研究。'],
  ['resource', '资源', 'ˈrisɔrs', 'n', 3, '职场', 'We don\'t have enough resources.', '我们没有足够的资源。'],
  ['respond', '回应', 'rɪˈspɑnd', 'v', 3, '日常口语', 'Please respond to my email as soon as possible.', '请尽快回复我的邮件。'],
  ['rest', '休息/剩下的', 'rɛst', 'n', 3, '日常口语', 'Take a good rest.', '好好休息。'],
  ['result', '结果', 'rɪˈzʌlt', 'n', 3, '日常口语', 'Are you happy with the result?', '你对结果满意吗？'],
  ['return', '返回/归还', 'rɪˈtɜrn', 'v', 3, '日常口语', 'I need to return this book to the library.', '我需要把这本书还给图书馆。'],
  ['rule', '规则', 'rul', 'n', 3, '日常口语', 'You need to follow the rules.', '你要遵守规则。'],
  ['save', '救/保存/省钱', 'seɪv', 'v', 3, '日常口语', 'I need to save more money.', '我需要多存点钱。'],
  ['section', '部分/区域', 'ˈsɛkʃən', 'n', 3, '日常口语', 'Which section do you want to sit in?', '你想坐哪个区域？'],
  ['seem', '似乎/好像', 'sim', 'v', 3, '日常口语', 'You seem tired today.', '你今天看起来累了。'],
  ['send', '发送', 'sɛnd', 'v', 3, '日常口语', 'I\'ll send you the file later.', '我待会把文件发给你。'],
  ['sense', '感觉/意义', 'sɛns', 'n', 3, '日常口语', 'That makes no sense.', '那说不通。'],
  ['serious', '严重的/认真的', 'ˈsɪriəs', 'adj', 3, '日常口语', 'Are you serious?', '你是认真的吗？'],
  ['serve', '服务', 'sɜrv', 'v', 3, '餐饮', 'What time do you serve breakfast?', '你们几点供应早餐？'],
  ['service', '服务', 'ˈsɜrvɪs', 'n', 3, '日常口语', 'The service here is excellent.', '这里的服务非常好。'],
  ['set', '放/设置/一套', 'sɛt', 'v', 3, '日常口语', 'Set the table for dinner.', '摆好餐桌。'],
  ['seven', '七', 'ˈsɛvən', 'num', 3, '日常口语', 'I have seven siblings.', '我有七个兄弟姐妹。'],
  ['shake', '摇/握手', 'ʃeɪk', 'v', 3, '日常口语', 'Let\'s shake hands on it.', '我们握手成交。'],
  ['share', '分享', 'ʃɛr', 'v', 3, '社交', 'Share your thoughts with us.', '跟我们分享一下你的想法。'],
  ['short', '短的/矮的', 'ʃɔrt', 'adj', 3, '日常口语', 'The meeting was surprisingly short.', '会议出乎意料地短。'],
  ['should', '应该', 'ʃʊd', 'v', 3, '日常口语', 'You should try this restaurant.', '你该试试这家餐厅。'],
  ['sign', '标志/签名', 'saɪn', 'n', 3, '日常口语', 'There\'s a sign that says "No Parking".', '有一个写着"禁止停车"的标志。'],
  ['simple', '简单的', 'ˈsɪmpəl', 'adj', 3, '日常口语', 'It\'s a simple question.', '这是个很简单的问题。'],
  ['simply', '仅仅/简单地', 'ˈsɪmpli', 'adv', 3, '日常口语', 'I simply don\'t have time.', '我就是没有时间。'],
  ['situation', '情况', 'ˌsɪtʃuˈeɪʃən', 'n', 3, '日常口语', 'How did you handle that situation?', '你怎么处理那种情况的？'],
  ['smile', '微笑', 'smaɪl', 'n', 3, '日常口语', 'Your smile brightens my day.', '你的笑容点亮了我的一天。'],
  ['social', '社交的', 'ˈsoʊʃəl', 'adj', 3, '社交', 'I\'m not very good at social events.', '我不太擅长社交活动。'],
  ['society', '社会', 'səˈsaɪəti', 'n', 3, '日常口语', 'We live in a fast-changing society.', '我们生活在一个快速变化的社会。'],
  ['sort', '种类/整理', 'sɔrt', 'n', 3, '日常口语', 'What sort of music do you like?', '你喜欢哪种类型的音乐？'],
  ['sound', '声音/听起来', 'saʊnd', 'n', 3, '日常口语', 'That sounds like a great plan!', '听起来是个好计划！'],
  ['source', '来源', 'sɔrs', 'n', 3, '日常口语', 'What\'s your source for this information?', '你这条信息的来源是什么？'],
  ['space', '空间/太空', 'speɪs', 'n', 3, '日常口语', 'Is there enough space for everyone?', '有足够的空间容纳所有人吗？'],
  ['speak', '说/讲话', 'spik', 'v', 3, '日常口语', 'Do you speak English?', '你会说英语吗？'],
  ['special', '特别的', 'ˈspɛʃəl', 'adj', 3, '日常口语', 'Today is a special day.', '今天是个特别的日子。'],
  ['spend', '花(钱/时间)', 'spɛnd', 'v', 3, '日常口语', 'How do you spend your weekends?', '你怎么过周末？'],
  ['stand', '站/忍受', 'stænd', 'v', 3, '日常口语', 'I can\'t stand this noise.', '我受不了这噪音了。'],
  ['statement', '陈述/声明', 'ˈsteɪtmənt', 'n', 3, '职场', 'The company issued a statement.', '公司发布了一份声明。'],
  ['station', '站/台', 'ˈsteɪʃən', 'n', 3, '旅行', 'The train station is down the street.', '火车站就在街那头。'],
  ['stay', '待/保持', 'steɪ', 'v', 3, '日常口语', 'Stay here, I\'ll be right back.', '待在这里，我马上回来。'],
  ['step', '步骤/脚步', 'stɛp', 'n', 3, '日常口语', 'Take it one step at a time.', '一步一步来。'],
  ['store', '商店', 'stɔr', 'n', 3, '购物', 'I need to go to the grocery store.', '我需要去趟杂货店。'],
  ['strong', '强壮的/坚强的', 'strɔŋ', 'adj', 3, '日常口语', 'You\'re stronger than you think.', '你比你想象的要坚强。'],
  ['structure', '结构', 'ˈstrʌktʃər', 'n', 3, '日常口语', 'The essay needs a clear structure.', '这篇论文需要清晰的结构。'],
  ['study', '学习/研究', 'ˈstʌdi', 'v', 3, '校园', 'I need to study for my exam.', '我需要为考试复习。'],
  ['subject', '主题/科目', 'ˈsʌbdʒɪkt', 'n', 3, '校园', 'Math was my favorite subject in school.', '数学是我上学时最喜欢的科目。'],
  ['success', '成功', 'səkˈsɛs', 'n', 3, '日常口语', 'Hard work leads to success.', '努力带来成功。'],
  ['suggest', '建议', 'səɡˈdʒɛst', 'v', 3, '日常口语', 'What do you suggest we do?', '你建议我们怎么做？'],
  ['support', '支持', 'səˈpɔrt', 'v', 3, '情感', 'I\'ll always support you.', '我会永远支持你。'],
  ['system', '系统', 'ˈsɪstəm', 'n', 3, '日常口语', 'The system is down right now.', '系统现在宕了。'],
  ['table', '桌子/表格', 'ˈteɪbəl', 'n', 3, '日常口语', 'Please sit at the table.', '请在桌子旁坐下。'],
  ['teacher', '老师', 'ˈtitʃər', 'n', 3, '校园', 'My English teacher is great.', '我的英语老师很棒。'],
  ['team', '团队', 'tim', 'n', 3, '职场', 'We have a great team.', '我们有一个很棒的团队。'],
  ['term', '术语/学期', 'tɜrm', 'n', 3, '校园', 'What does this term mean?', '这个术语是什么意思？'],
  ['test', '测试/考试', 'tɛst', 'n', 3, '校园', 'I have a big test tomorrow.', '我明天有个重要的考试。'],
  ['third', '第三', 'θɜrd', 'num', 3, '日常口语', 'This is my third time visiting New York.', '这是我第三次来纽约。'],
  ['though', '虽然/但是', 'ðoʊ', 'conj', 3, '日常口语', 'Even though it rained, we had fun.', '虽然下雨了，我们还是玩得很开心。'],
  ['throw', '扔/丢', 'θroʊ', 'v', 3, '日常口语', 'Don\'t throw trash on the ground.', '别随地扔垃圾。'],
  ['total', '总计', 'ˈtoʊtəl', 'adj', 3, '日常口语', 'What\'s the total cost?', '总费用是多少？'],
  ['town', '城镇', 'taʊn', 'n', 3, '日常口语', 'I grew up in a small town.', '我在一个小镇长大。'],
];

console.log(`Core words: ${CORE_WORDS.length}`);

const PHRASAL_VERBS: CW[] = [
  ['wake up', '醒来/叫醒', 'weɪk ʌp', 'phr v', 2, '日常口语', 'I wake up at 7 every day.', '我每天早上七点醒来。'],
  ['give up', '放弃', 'ɡɪv ʌp', 'phr v', 2, '日常口语', 'Never give up on your dreams.', '永远不要放弃你的梦想。'],
  ['show up', '出现/露面', 'ʃoʊ ʌp', 'phr v', 2, '日常口语', 'He didn\'t show up for the meeting.', '他没来开会。'],
  ['figure out', '弄明白/想通', 'ˈfɪɡjər aʊt', 'phr v', 2, '日常口语', 'I need to figure out a solution.', '我需要想出一个解决方案。'],
  ['turn on', '打开(电器)', 'tɜrn ɑn', 'phr v', 1, '日常口语', 'Can you turn on the TV?', '你能打开电视吗？'],
  ['turn off', '关闭(电器)', 'tɜrn ɔf', 'phr v', 1, '日常口语', 'Please turn off your phone.', '请关掉手机。'],
  ['pick up', '捡起/接(人)/学会', 'pɪk ʌp', 'phr v', 2, '日常口语', 'I\'ll pick you up at 8.', '我八点来接你。'],
  ['drop off', '放下/送(人)', 'drɑp ɔf', 'phr v', 2, '日常口语', 'Can you drop me off at the station?', '你能送我到车站吗？'],
  ['come up with', '想出/提出', 'kʌm ʌp wɪð', 'phr v', 2, '职场', 'We need to come up with a plan.', '我们需要想出一个计划。'],
  ['look forward to', '期待', 'lʊk ˈfɔrwərd tu', 'phr v', 2, '日常口语', 'I\'m looking forward to the weekend.', '我期待周末的到来。'],
  ['run out of', '用完/耗尽', 'rʌn aʊt ʌv', 'phr v', 2, '日常口语', 'We ran out of milk.', '我们的牛奶用完了。'],
  ['get along', '相处融洽', 'ɡɛt əˈlɔŋ', 'phr v', 2, '社交', 'Do you get along with your coworkers?', '你和同事相处得好吗？'],
  ['put off', '推迟', 'pʊt ɔf', 'phr v', 3, '日常口语', 'Stop putting off your homework.', '别再拖延你的作业了。'],
  ['bring up', '提起/抚养', 'brɪŋ ʌp', 'phr v', 2, '日常口语', 'Don\'t bring up that topic at dinner.', '吃饭时别提那个话题。'],
  ['end up', '最终/结果是', 'ɛnd ʌp', 'phr v', 2, '日常口语', 'We ended up staying home.', '我们最后待在家里了。'],
  ['take off', '起飞/脱下', 'teɪk ɔf', 'phr v', 2, '旅行', 'The plane takes off at 6 PM.', '飞机下午六点起飞。'],
  ['look up', '查阅/抬头看', 'lʊk ʌp', 'phr v', 2, '日常口语', 'Let me look up the word in the dictionary.', '让我在字典里查一下这个词。'],
  ['make up', '编造/化妆/和好', 'meɪk ʌp', 'phr v', 2, '日常口语', 'I made up an excuse to leave early.', '我编了个借口早走了。'],
  ['hold on', '等一下/坚持住', 'hoʊld ɑn', 'phr v', 1, '电话', 'Hold on, I\'ll check for you.', '别挂，我帮你查一下。'],
  ['break down', '坏了/崩溃', 'breɪk daʊn', 'phr v', 3, '日常口语', 'My car broke down on the highway.', '我的车在高速上坏了。'],
  ['call off', '取消', 'kɔl ɔf', 'phr v', 3, '日常口语', 'They called off the wedding.', '他们取消了婚礼。'],
  ['carry on', '继续', 'ˈkæri ɑn', 'phr v', 3, '日常口语', 'Carry on with your work.', '继续你的工作。'],
  ['come across', '偶然遇到', 'kʌm əˈkrɔs', 'phr v', 3, '日常口语', 'I came across an old photo album.', '我偶然发现了一本旧相册。'],
  ['deal with', '处理/应对', 'dil wɪð', 'phr v', 2, '日常口语', 'How do you deal with stress?', '你怎么应对压力？'],
  ['get over', '克服/从...恢复', 'ɡɛt ˈoʊvər', 'phr v', 3, '情感', 'It takes time to get over a breakup.', '分手后恢复需要时间。'],
  ['go through', '经历/仔细检查', 'ɡoʊ θru', 'phr v', 3, '日常口语', 'I\'m going through a tough time.', '我在经历一段艰难的时期。'],
  ['look after', '照顾', 'lʊk ˈæftər', 'phr v', 2, '日常口语', 'Can you look after my cat while I\'m away?', '我不在的时候你能照顾我的猫吗？'],
  ['point out', '指出', 'pɔɪnt aʊt', 'phr v', 2, '日常口语', 'Let me point out a small mistake.', '让我指出一个小错误。'],
  ['set up', '建立/设置', 'sɛt ʌp', 'phr v', 2, '职场', 'I need to set up my new computer.', '我需要设置我的新电脑。'],
  ['take care of', '照顾/处理', 'teɪk kɛr ʌv', 'phr v', 2, '日常口语', 'Don\'t worry, I\'ll take care of it.', '别担心，我来处理。'],
];

console.log(`Phrasal verbs: ${PHRASAL_VERBS.length}`);

const AMERICAN_PHRASES: CW[] = [
  ['pretty good', '还不错/相当好', 'ˈprɪti ɡʊd', 'phr', 1, '日常口语,社交', 'The food here is pretty good.', '这儿的食物还不错。'],
  ['no worries', '别担心/没问题', 'noʊ ˈwɜriz', 'phr', 1, '日常口语', 'No worries, I\'ll take care of it.', '别担心，我来处理。'],
  ['hang out', '出去玩/闲逛', 'hæŋ aʊt', 'phr v', 1, '日常口语,社交', 'Do you want to hang out this weekend?', '这周末想出来玩吗？'],
  ['what\'s up', '怎么了/最近怎么样', 'wʌts ʌp', 'phr', 1, '日常口语,社交', 'Hey, what\'s up? Long time no see!', '嘿，最近怎么样？好久不见！'],
  ['I\'m down', '我愿意/我参加', 'aɪm daʊn', 'phr', 1, '日常口语,社交', 'Want to grab dinner? — Yeah, I\'m down.', '想吃晚饭吗？——好啊，我参加。'],
  ['my bad', '我的错/怪我', 'maɪ bæd', 'phr', 1, '日常口语', 'Oops, my bad! I forgot to call you.', '哎呀，我的错！我忘记给你打电话了。'],
  ['got it', '明白了/收到', 'ɡɑt ɪt', 'phr', 1, '日常口语,职场', 'Got it, I\'ll send the report by 5.', '明白，我五点前发报告。'],
  ['no way', '不会吧/没门', 'noʊ weɪ', 'phr', 1, '日常口语', 'No way! You got the job?', '不会吧！你拿到那个工作了？'],
  ['come on', '拜托/加油/快点', 'kʌm ɑn', 'phr', 1, '日常口语', 'Come on, you can do it!', '加油，你行的！'],
  ['kind of', '有点/算是', 'kaɪnd ʌv', 'phr', 1, '日常口语', 'I\'m kind of tired today.', '我今天有点累。'],
  ['right away', '马上/立刻', 'raɪt əˈweɪ', 'phr', 1, '日常口语', 'I\'ll be there right away.', '我马上就到。'],
  ['take care', '保重/慢走', 'teɪk kɛr', 'phr', 1, '日常口语', 'Take care! See you next week.', '保重！下周见。'],
  ['for real', '真的假的/认真的', 'fɔr riəl', 'phr', 2, '日常口语,网络用语', 'Are you for real? That\'s amazing!', '你说真的？太棒了！'],
  ['no cap', '不骗你/说真的', 'noʊ kæp', 'phr', 2, '日常口语,网络用语', 'This is the best burger I\'ve ever had, no cap.', '这是我吃过最好吃的汉堡，不骗你。'],
  ['it is what it is', '就是这样/没办法的事', 'ɪt ɪz wʌt ɪt ɪz', 'phr', 2, '日常口语', 'We lost the game, but it is what it is.', '我们输了比赛，但就这样吧。'],
  ['I feel you', '我懂你/我理解你的感受', 'aɪ fil ju', 'phr', 2, '日常口语,情感', 'I feel you, that situation really sucks.', '我懂你，那种情况真的很糟糕。'],
  ['hit me up', '联系我/找我', 'hɪt mi ʌp', 'phr', 2, '日常口语,社交', 'Hit me up when you get to the city.', '到城里了联系我。'],
  ['no big deal', '没什么大不了/小事', 'noʊ bɪɡ dil', 'phr', 2, '日常口语', 'It\'s no big deal, don\'t worry about it.', '没什么大不了的，别担心。'],
  ['freak out', '吓坏了/惊慌失措', 'frik aʊt', 'phr v', 2, '日常口语,情感', 'Don\'t freak out, but there\'s a spider on your shirt.', '别慌，但你衣服上有只蜘蛛。'],
  ['give it a shot', '试一试', 'ɡɪv ɪt ə ʃɑt', 'phr', 2, '日常口语', 'I\'ve never tried surfing, but I\'ll give it a shot.', '我没冲过浪，但我会试一试。'],
  ['works for me', '我没问题/我可以', 'wɜrks fɔr mi', 'phr', 2, '日常口语', 'Let\'s meet at 7? — Works for me.', '七点见？——我没问题。'],
  ['count me in', '算我一个', 'kaʊnt mi ɪn', 'phr', 2, '日常口语,社交', 'You\'re going to the concert? Count me in!', '你们要去演唱会？算我一个！'],
  ['on the same page', '意见一致/达成共识', 'ɑn ðə seɪm peɪdʒ', 'phr', 2, '职场', 'Let\'s make sure we\'re on the same page.', '我们确认一下大家理解是否一致。'],
  ['touch base', '沟通一下/碰个头', 'tʌtʃ beɪs', 'phr', 2, '职场', 'Let\'s touch base later this week.', '这周晚些时候我们碰个头。'],
  ['keep me posted', '随时告诉我进展', 'kip mi ˈpoʊstɪd', 'phr', 2, '职场', 'Keep me posted on how it goes.', '进展如何随时告诉我。'],
  ['call it a day', '收工/今天就到这里', 'kɔl ɪt ə deɪ', 'phr', 2, '职场', 'It\'s 6 PM, let\'s call it a day.', '六点了，今天就到这里吧。'],
  ['hands-on', '亲自动手的/实践的', 'ˈhændz ɑn', 'adj', 2, '职场', 'He has a lot of hands-on experience.', '他有丰富的实践经验。'],
  ['catch up', '叙旧/聊聊近况', 'kætʃ ʌp', 'phr v', 1, '社交', 'We should catch up over coffee sometime.', '我们什么时候喝杯咖啡叙叙旧。'],
  ['get together', '聚一聚', 'ɡɛt təˈɡɛðər', 'phr v', 1, '社交', 'Let\'s get together this weekend.', '这周末我们聚一聚吧。'],
  ['have a blast', '玩得很开心', 'hæv ə blæst', 'phr', 2, '社交', 'We had a blast at the party last night.', '昨晚的派对我们玩得很开心。'],
  ['break the ice', '打破沉默/暖场', 'breɪk ðə aɪs', 'phr', 2, '社交', 'Let\'s play a game to break the ice.', '我们玩个游戏暖场吧。'],
  ['hit it off', '一见如故/合得来', 'hɪt ɪt ɔf', 'phr', 2, '社交,约会', 'They hit it off on their first date.', '他们第一次约会就一见如故。'],
  ['small talk', '闲聊/寒暄', 'smɔl tɔk', 'n', 1, '社交', 'I\'m not good at small talk at parties.', '我不太擅长在派对上闲聊。'],
  ['hang in there', '坚持住/挺住', 'hæŋ ɪn ðɛr', 'phr', 2, '社交,情感', 'I know it\'s tough, but hang in there.', '我知道很难，但坚持住。'],
  ['grab a bite', '随便吃点东西', 'ɡræb ə baɪt', 'phr', 1, '餐饮,社交', 'Want to grab a bite after work?', '下班后要不要去吃点东西？'],
  ['takeout', '外卖', 'ˈteɪkaʊt', 'n', 1, '餐饮', 'Let\'s order takeout tonight.', '今晚我们点外卖吧。'],
  ['check please', '买单', 'tʃɛk pliz', 'phr', 1, '餐饮', 'Excuse me, check please!', '服务员，买单！'],
  ['it\'s on me', '我请客', 'ɪts ɑn mi', 'phr', 1, '餐饮,社交', 'Don\'t worry about the bill, it\'s on me.', '别管账单，这顿我请。'],
  ['leftovers', '剩菜/打包的菜', 'ˈlɛftoʊvərz', 'n', 2, '餐饮', 'I\'ll take the leftovers home for lunch tomorrow.', '我把剩菜打包回家明天当午餐。'],
  ['to go', '打包带走', 'tə ɡoʊ', 'phr', 1, '餐饮', 'I\'d like a coffee to go, please.', '我要一杯咖啡打包带走。'],
  ['go Dutch', 'AA制/各付各的', 'ɡoʊ dʌtʃ', 'phr', 2, '餐饮,社交', 'Let\'s go Dutch on dinner tonight.', '今晚我们各付各的吧。'],
  ['overwhelmed', '不知所措/压力山大', 'ˌoʊvərˈwɛlmd', 'adj', 2, '情感,职场', 'I feel overwhelmed with all this work.', '这些工作让我感觉压力山大。'],
  ['blow off steam', '发泄情绪/减压', 'bloʊ ɔf stim', 'phr', 3, '情感', 'I go running to blow off steam.', '我去跑步发泄一下。'],
  ['over the moon', '欣喜若狂', 'ˈoʊvər ðə mun', 'phr', 2, '情感', 'She was over the moon when she got the promotion.', '她升职的时候简直欣喜若狂。'],
  ['drive me crazy', '让我抓狂', 'draɪv mi ˈkreɪzi', 'phr', 2, '情感', 'This noise is driving me crazy.', '这噪音快让我疯了。'],
  ['heartbroken', '心碎的/悲痛欲绝', 'ˈhɑrtbroʊkən', 'adj', 2, '情感,约会', 'She was heartbroken after the breakup.', '分手后她心都碎了。'],
  ['on edge', '紧张不安/如坐针毡', 'ɑn ɛdʒ', 'phr', 3, '情感', 'I\'ve been on edge all day waiting for the results.', '今天一整天我都在紧张地等结果。'],
  ['pull an all-nighter', '通宵/熬通宵', 'pʊl ən ɔl ˈnaɪtər', 'phr', 2, '校园', 'I had to pull an all-nighter to finish the paper.', '为了写完论文我不得不通宵。'],
  ['cram for', '临时抱佛脚/突击学习', 'kræm fɔr', 'phr v', 2, '校园', 'I\'m cramming for the final exam.', '我正在为期终考试突击复习。'],
  ['ace a test', '考得很好/考满分', 'eɪs ə tɛst', 'phr', 2, '校园', 'I aced the math test!', '我数学考试考得超好！'],
  ['cut class', '逃课/翘课', 'kʌt klæs', 'phr', 2, '校园', 'We used to cut class and go to the beach.', '我们以前经常翘课去海边。'],
  ['pop quiz', '突击测验/随堂测验', 'pɑp kwɪz', 'n', 1, '校园', 'The teacher gave us a pop quiz today.', '老师今天给我们来了一场突击测验。'],
  ['lowkey', '低调地/暗暗地', 'ˈloʊki', 'adv', 2, '网络用语', 'I lowkey love that song.', '我偷偷喜欢那首歌。'],
  ['salty', '酸溜溜的/不爽的', 'ˈsɔlti', 'adj', 2, '网络用语,情感', 'He\'s just salty because he lost the game.', '他就是因为输了比赛在那酸呢。'],
  ['ghost someone', '玩消失/突然不理人', 'ɡoʊst ˈsʌmwʌn', 'v', 3, '网络用语,约会', 'He ghosted me after three dates.', '约会三次之后他就玩消失了。'],
  ['cringe', '尴尬癌/让人起鸡皮疙瘩', 'krɪndʒ', 'adj', 2, '网络用语', 'That video was so cringe.', '那个视频尴尬癌都犯了。'],
  ['goat', '史上最佳', 'ɡoʊt', 'n', 2, '网络用语', 'LeBron is the GOAT of basketball.', '詹姆斯是篮球史上的GOAT。'],
  ['simp', '舔狗/过分讨好的人', 'sɪmp', 'n', 3, '网络用语,约会', 'Stop being a simp for someone who doesn\'t care.', '别做舔狗了，人家根本不在乎。'],
  ['vibe', '氛围/感觉', 'vaɪb', 'n', 2, '网络用语', 'This place has good vibes.', '这个地方氛围很好。'],
  ['slay', '太棒了/杀疯了', 'sleɪ', 'v', 2, '网络用语', 'She absolutely slayed that presentation.', '她那个演示简直杀疯了。'],
  ['spill the tea', '爆料/八卦一下', 'spɪl ðə ti', 'phr', 3, '网络用语,社交', 'Come on, spill the tea! What happened?', '快说快说，发生什么了？'],
  ['flex', '炫耀/显摆', 'flɛks', 'v', 2, '网络用语', 'He\'s just flexing his new car.', '他又在炫耀他的新车了。'],
  ['couch potato', '沙发土豆/爱窝沙发看电视的人', 'kaʊtʃ pəˈteɪtoʊ', 'n', 2, '日常口语', 'I\'ve been such a couch potato this weekend.', '这周末我彻底躺平了。'],
  ['photo bomb', '抢镜/乱入照片', 'ˈfoʊtoʊ bɑm', 'v', 2, '网络用语,社交', 'My dog photobombed our selfie!', '我家狗乱入了我们的自拍！'],
  ['binge watch', '狂刷/一口气看完', 'bɪndʒ wɑtʃ', 'v', 2, '日常口语,网络用语', 'I binge watched the entire season in one day.', '我一天刷完了整季。'],
  ['hang up', '挂电话', 'hæŋ ʌp', 'phr v', 1, '电话', 'Don\'t hang up on me!', '别挂我电话！'],
  ['on hold', '在线等候/排队中', 'ɑn hoʊld', 'phr', 1, '电话', 'I\'ve been on hold for 20 minutes.', '我已经在线等了二十分钟了。'],
  ['put through', '接通/转接', 'pʊt θru', 'phr v', 1, '电话', 'Let me put you through to the manager.', '我帮您转接给经理。'],
  ['speakerphone', '免提', 'ˈspikərfoʊn', 'n', 1, '电话', 'Can you put it on speakerphone?', '你开免提好吗？'],
  ['team player', '有团队精神的人', 'tim ˈpleɪər', 'n', 1, '面试,职场', 'I consider myself a great team player.', '我认为我有很好的团队合作精神。'],
  ['go the extra mile', '更努力/多做一步', 'ɡoʊ ðə ˈɛkstrə maɪl', 'phr', 2, '面试,职场', 'I always go the extra mile for my clients.', '我总是为客户多做一步。'],
  ['think outside the box', '跳出框架思考/创新思维', 'θɪŋk ˈaʊtsaɪd ðə bɑks', 'phr', 3, '面试,职场', 'We need someone who can think outside the box.', '我们需要能跳出框架思考的人。'],
  ['hands down', '毫无疑问地/轻易地', 'hændz daʊn', 'adv', 2, '面试', 'She\'s hands down the best candidate for the job.', '她毫无疑问是这个职位的最佳人选。'],
  ['seeing someone', '和某人在交往', 'ˈsiɪŋ ˈsʌmwʌn', 'phr', 1, '约会', 'Are you seeing anyone right now?', '你现在有在交往的人吗？'],
  ['set up', '介绍认识/撮合', 'sɛt ʌp', 'phr v', 2, '约会', 'My friend set us up on a blind date.', '我朋友撮合我们相亲。'],
  ['stand someone up', '放鸽子/爽约', 'stænd ˈsʌmwʌn ʌp', 'phr', 2, '约会', 'He stood me up on our first date!', '第一次约会他就放我鸽子！'],
  ['cuddle', '依偎/拥抱', 'ˈkʌdəl', 'v', 1, '约会', 'Let\'s just stay home and cuddle.', '我们就在家待着依偎着吧。'],
  ['play hard to get', '欲擒故纵/故作高冷', 'pleɪ hɑrd tə ɡɛt', 'phr', 3, '约会', 'She\'s playing hard to get, but I know she likes me.', '她在故作高冷，但我知道她喜欢我。'],
  ['awkward', '尴尬的', 'ˈɔkwərd', 'adj', 2, '日常口语,社交', 'That was such an awkward silence.', '那真是一段尴尬的沉默。'],
  ['literally', '真的/字面意义上', 'ˈlɪtərəli', 'adv', 2, '日常口语', 'I was literally shaking with fear.', '我真的在害怕地发抖。'],
  ['apparently', '显然/据说', 'əˈpærəntli', 'adv', 2, '日常口语,职场', 'Apparently, the meeting was cancelled.', '据说会议取消了。'],
  ['technically', '严格来说/按技术层面', 'ˈtɛknɪkəli', 'adv', 2, '日常口语', 'Technically, it\'s not wrong.', '严格来说，这不算错。'],
  ['basically', '基本上/说白了', 'ˈbeɪsɪkəli', 'adv', 1, '日常口语', 'Basically, we need to start over.', '说白了，我们得重新开始。'],
  ['epic', '史诗般的/太牛了', 'ˈɛpɪk', 'adj', 1, '日常口语,社交', 'That concert was absolutely epic!', '那场演唱会简直太牛了！'],
  ['sketchy', '可疑的/不靠谱的', 'ˈskɛtʃi', 'adj', 3, '日常口语', 'Don\'t go to that neighborhood, it\'s kind of sketchy.', '别去那个街区，有点不靠谱。'],
  ['legit', '真的/靠谱的', 'ləˈdʒɪt', 'adj', 2, '日常口语,购物', 'Is this website legit or a scam?', '这个网站靠谱还是骗子？'],
  ['mood', '太真实了/我也是这种感觉', 'mud', 'n', 2, '网络用语,情感', 'This song is such a mood right now.', '这首歌太应景了。'],
];

console.log(`American phrases: ${AMERICAN_PHRASES.length}`);

// ===== BUILD THE FULL LIST =====
type CW = [string, string, string, string, number, string, string?, string?];

// Read frequency words from JSON
const freqPath = path.join(__dirname, '..', 'data', 'freq-words.json');
let freqWords: CW[] = [];
if (fs.existsSync(freqPath)) {
  const raw = JSON.parse(fs.readFileSync(freqPath, 'utf-8')) as string[][];
  freqWords = raw.map((w: string[]) => {
    // Format: [english, chinese, pos, level, tags] — no phonetic
    const english = w[0];
    const pos = w[2];
    // Auto-generate phonetic placeholder (TTS doesn't use it anyway)
    const phonetic = '';
    return [english, w[1], phonetic, pos, Number(w[3]), w[4]] as CW;
  });
  console.log(`Loaded ${freqWords.length} frequency words from JSON`);
}

const allWords: CW[] = [...CORE_WORDS, ...PHRASAL_VERBS, ...AMERICAN_PHRASES, ...freqWords];

console.log(`Total words to generate: ${allWords.length}`);

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Generate the TypeScript file
const entries: string[] = [];

for (let i = 0; i < allWords.length; i++) {
  const w = allWords[i];
  const [english, chinese, phonetic, pos, level, tags, exEn, exZh] = w;
  const tagList = tags.split(',').map(t => `"${t.trim()}"`).join(', ');
  const exampleEn = exEn || `I learned the word "${esc(english)}" today.`;
  const exampleZh = exZh || `我今天学了"${esc(chinese)}"这个词。`;

  entries.push(
    `  { id: ${i + 1}, english: "${esc(english)}", chinese: "${esc(chinese)}", ` +
    `phonetic: "${esc(phonetic)}", partOfSpeech: "${esc(pos)}", ` +
    `exampleEn: "${esc(exampleEn)}", exampleZh: "${esc(exampleZh)}", ` +
    `level: ${level}, tags: [${tagList}], alternatives: [] }`
  );
}

const output = `import type { WordEntry, SceneInfo } from '../types';

export const SCENES: SceneInfo[] = [
  { tag: '日常口语', emoji: '💬', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { tag: '职场', emoji: '💼', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
  { tag: '社交', emoji: '🎉', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { tag: '旅行', emoji: '✈️', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { tag: '购物', emoji: '🛍️', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { tag: '餐饮', emoji: '🍔', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { tag: '情感', emoji: '❤️', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { tag: '校园', emoji: '🎓', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { tag: '网络用语', emoji: '📱', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { tag: '电话', emoji: '📞', color: '#84cc16', gradient: 'linear-gradient(135deg, #84cc16, #a3e635)' },
  { tag: '面试', emoji: '🤝', color: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #94a3b8)' },
  { tag: '约会', emoji: '💕', color: '#e11d48', gradient: 'linear-gradient(135deg, #e11d48, #fb7185)' },
];

export const WORDBANK: WordEntry[] = [
${entries.join(',\n')}
];

export function getWordsByTag(tag: string): WordEntry[] {
  return WORDBANK.filter(w => w.tags.includes(tag));
}

export function getWordsByLevel(level: number): WordEntry[] {
  return WORDBANK.filter(w => w.level === level);
}

export function getNewWords(
  learnedIds: Set<number>,
  count: number = 10,
  tag?: string
): WordEntry[] {
  let pool = WORDBANK.filter(w => !learnedIds.has(w.id));
  if (tag) {
    pool = pool.filter(w => w.tags.includes(tag));
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getReviewWords(wordIds: number[]): WordEntry[] {
  const words = wordIds
    .map(id => WORDBANK.find(w => w.id === id))
    .filter((w): w is WordEntry => w !== undefined);
  return [...words].sort(() => Math.random() - 0.5);
}

export function getDistractors(
  correctAnswer: WordEntry,
  count: number = 3
): string[] {
  const sameLevel = WORDBANK.filter(
    w => w.id !== correctAnswer.id && w.level === correctAnswer.level
  );
  const shuffled = [...sameLevel].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(w => w.chinese);
}
`;

const outPath = path.join(__dirname, '..', 'src', 'data', 'wordbank.ts');
fs.writeFileSync(outPath, output, 'utf-8');
const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`Generated wordbank.ts with ${entries.length} entries (${sizeKB} KB)`);

// Show tag distribution
const tagCounts: Record<string, number> = {};
for (const w of allWords) {
  const tags = w[5].split(',');
  for (const t of tags) {
    const tt = t.trim();
    tagCounts[tt] = (tagCounts[tt] || 0) + 1;
  }
}
console.log('\nTag distribution:');
for (const [tag, count] of Object.entries(tagCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${tag}: ${count}`);
}
