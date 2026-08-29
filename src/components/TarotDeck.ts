export interface TarotCard {
  id: string;
  name: string;
  english: string;
  number: number;
  upright: string;
  reversed: string;
  description: string;
  element: "风" | "火" | "水" | "土" | "以太";
  iconType: "sun" | "moon" | "star" | "key" | "wheel" | "swords" | "cup" | "wand" | "pentacle" | "angel" | "crown" | "tree";
  bgGradient: string;
}

export const TAROT_DECK: TarotCard[] = [
  {
    id: "0_the_fool",
    name: "愚者",
    english: "The Fool",
    number: 0,
    upright: "新的开始、自由、纯真、冒险、潜能",
    reversed: "鲁莽、草率、错失良机、犹豫不决、流浪",
    description: "悬崖边张望的纯真少年，身旁陪伴小猎狗，背负行囊去闯未知世界。",
    element: "风",
    iconType: "star",
    bgGradient: "from-sky-400 via-indigo-900 to-purple-950",
  },
  {
    id: "1_the_magician",
    name: "魔术师",
    english: "The Magician",
    number: 1,
    upright: "创造力、意志力、专注、显化、掌控元素",
    reversed: "幻术、欺骗、能力未用、自我怀疑、心机",
    description: "祭坛前手握权杖，四大元素齐备，上方环绕无穷大符号∞的施法者。",
    element: "风",
    iconType: "wand",
    bgGradient: "from-amber-500 via-red-900 to-slate-950",
  },
  {
    id: "2_the_high_priestess",
    name: "女祭司",
    english: "The High Priestess",
    number: 2,
    upright: "直觉、潜意识、神秘、内省、寂静智慧",
    reversed: "隐瞒、肤浅思想、拒绝倾听内省、焦虑、冷漠",
    description: "黑白双柱之间安坐的神圣女性，手捏摩西律法书，低头沉思宇宙至理。",
    element: "水",
    iconType: "moon",
    bgGradient: "from-blue-600 via-indigo-950 to-neutral-950",
  },
  {
    id: "3_the_empress",
    name: "皇后",
    english: "The Empress",
    number: 3,
    upright: "丰盛、自然、感官享受、母爱、繁衍与孕育",
    reversed: "贫瘠、创造瓶颈、依赖、过度干涉、失控",
    description: "金黄麦田里，身穿十二星座白裙的孕期皇后，代表生命繁育与丰饶大地。",
    element: "土",
    iconType: "tree",
    bgGradient: "from-emerald-400 via-rose-950 to-neutral-950",
  },
  {
    id: "4_the_emperor",
    name: "皇帝",
    english: "The Emperor",
    number: 4,
    upright: "权威、秩序、结构、稳定、父权、理性纪律",
    reversed: "暴政、失控、软弱无能、规矩僵化、抗拒秩序",
    description: "石雕王座上身披铁甲的肃穆皇帝，手持安卡十字架，象征着疆域与世俗强权。",
    element: "火",
    iconType: "crown",
    bgGradient: "from-red-600 via-stone-900 to-neutral-950",
  },
  {
    id: "5_the_hierophant",
    name: "教皇",
    english: "The Hierophant",
    number: 5,
    upright: "传统、宗教、体制、导师、灵性纽带、传承",
    reversed: "叛逆、打破常规、思想僵化、教条主义、迷信",
    description: "身着三重冕的布道教皇，高举右手賜福弟子，代表体制与规章智慧。",
    element: "土",
    iconType: "key",
    bgGradient: "from-indigo-600 via-amber-950 to-slate-950",
  },
  {
    id: "6_the_lovers",
    name: "恋人",
    english: "The Lovers",
    number: 6,
    upright: "爱、和谐、默契、关系、核心抉择、价值观契合",
    reversed: "不和睦、关系破裂、冷淡、错误的选择、逃避承诺",
    description: "天使拉斐尔光芒下，伫立在知识树和生命树前的男女，代表神圣而纯真抉择。",
    element: "风",
    iconType: "sun",
    bgGradient: "from-pink-500 via-purple-900 to-stone-950",
  },
  {
    id: "7_the_chariot",
    name: "战车",
    english: "The Chariot",
    number: 7,
    upright: "意志力、胜利、决断、毅力、克服障碍、自我控制",
    reversed: "失控、方向错误、鲁莽失败、内耗、被迫妥协",
    description: "黑白双狮拉动的华丽战车由青年英雄驾驭，象征克服冲突勇往直前。",
    element: "水",
    iconType: "crown",
    bgGradient: "from-blue-500 via-slate-800 to-neutral-950",
  },
  {
    id: "8_strength",
    name: "力量",
    english: "Strength",
    number: 8,
    upright: "勇气、内生力量、耐心、温柔征服、宽容",
    reversed: "软弱、沮丧、过度自负、失控狂怒、虚张声势",
    description: "白裙少女面带温柔微笑，轻抚狂狮大口，上方环绕∞，代表以柔克刚。",
    element: "火",
    iconType: "angel",
    bgGradient: "from-orange-400 via-red-950 to-zinc-950",
  },
  {
    id: "9_the_hermit",
    name: "隐士",
    english: "The Hermit",
    number: 9,
    upright: "内省、独处、灵性指引、寻找真理、导师启发",
    reversed: "孤独、逃避现实、偏执、社交恐惧、固步自封",
    description: "黑暗苍古雪山上独自提灯行进的老者，代表探寻生命本质的烛照孤旅。",
    element: "土",
    iconType: "star",
    bgGradient: "from-yellow-600 via-zinc-800 to-neutral-950",
  },
  {
    id: "10_the_wheel_of_fortune",
    name: "命运之轮",
    english: "The Wheel of Fortune",
    number: 10,
    upright: "好运、转折点、命运轮转、周期性、突变",
    reversed: "厄运、阻碍、抗拒变革、不确定性循环、重蹈覆辙",
    description: "赫尔墨斯、阿努比斯等灵兽环绕的神秘天轮在中天旋转，展示不可抗拒之局势。",
    element: "火",
    iconType: "wheel",
    bgGradient: "from-cyan-400 via-violet-950 to-neutral-950",
  },
  {
    id: "11_justice",
    name: "正义",
    english: "Justice",
    number: 11,
    upright: "公正、诚实、因果法则、责任、理性裁决",
    reversed: "不公、偏见、拒绝承担、欺骗、严苛审判",
    description: "手提天平、紧握智慧双刃剑的女神，代表绝对的正义法则和自律因果。",
    element: "风",
    iconType: "swords",
    bgGradient: "from-indigo-500 via-slate-900 to-neutral-950",
  },
  {
    id: "12_the_hanged_man",
    name: "倒吊人",
    english: "The Hanged Man",
    number: 12,
    upright: "牺牲、奉献、新视角、换位思考、静止与修行",
    reversed: "盲目牺牲、挣扎抗拒、拖延无果、自命清高",
    description: "十字木架上单脚倒吊的青年，神色安详，头顶泛起智慧的金色光晕。",
    element: "水",
    iconType: "star",
    bgGradient: "from-emerald-600 via-blue-950 to-neutral-950",
  },
  {
    id: "13_death",
    name: "死神",
    english: "Death",
    number: 13,
    upright: "结束、蜕变、新生机会、告别旧物、断舍离",
    reversed: "抗拒改变、苟延残喘、畏惧死亡、难以割舍过去",
    description: "身穿黑色盔甲的死神骑着白马，所过之处万物更替，而远方旭日东升。",
    element: "水",
    iconType: "crown",
    bgGradient: "from-gray-700 via-purple-950 to-black",
  },
  {
    id: "14_temperance",
    name: "节制",
    english: "Temperance",
    number: 14,
    upright: "平衡、调和、节制、化学融合、净化、和谐成长",
    reversed: "失衡、冲突、缺乏沟通、纵欲无度、配合阻碍",
    description: "天使一足立于陆地，一足立于溪流，在两金杯间倾倒液体，代表灵肉完美融合。",
    element: "风",
    iconType: "cup",
    bgGradient: "from-violet-500 via-pink-950 to-slate-950",
  },
  {
    id: "15_the_devil",
    name: "恶魔",
    english: "The Devil",
    number: 15,
    upright: "物质诱惑、欲望束缚、执念、沉溺、性爱原力",
    reversed: "摆脱束缚、觉醒执念、探索精神自由、断舍沉溺",
    description: "长角恶魔坐在石柱上，男女信徒被锁链套颈，然而两人的锁链其实极为宽松。",
    element: "土",
    iconType: "pentacle",
    bgGradient: "from-amber-600 via-red-950 to-black",
  },
  {
    id: "16_the_tower",
    name: "高塔",
    english: "The Tower",
    number: 16,
    upright: "骤变、彻底崩塌、打破幻想、启示性灾变、觉醒",
    reversed: "幸免于难、畏惧危机、拖延崩盘、重建阵痛",
    description: "雷霆劈开山巅的高塔，皇冠坠落，人们惊慌跳下高耸。幻想破灭，带来顿入空灵。",
    element: "火",
    iconType: "pentacle",
    bgGradient: "from-red-500 via-orange-950 to-black",
  },
  {
    id: "17_the_star",
    name: "星星",
    english: "The Star",
    number: 17,
    upright: "希望、信念、康复、灵性觉醒、宁静夜空、洗涤",
    reversed: "失望、悲观、空虚幻想、不信任、失去信仰",
    description: "在天狼星照耀下，裸体少女在水面与陆地上倾倒生命之水，注入无穷活力与希望。",
    element: "风",
    iconType: "star",
    bgGradient: "from-teal-400 via-indigo-950 to-stone-950",
  },
  {
    id: "18_the_moon",
    name: "月亮",
    english: "The Moon",
    number: 18,
    upright: "恐惧、焦虑、迷惘、直觉启示、神秘莫测、梦境",
    reversed: "破除迷雾、直面恐惧、真相大白、自我消解不安",
    description: "深海龙虾浮上海面，狼与家犬对着天空中哭泣的满月吠叫，展示恐惧与指引进化。",
    element: "水",
    iconType: "moon",
    bgGradient: "from-blue-500 via-indigo-950 to-neutral-950",
  },
  {
    id: "19_the_sun",
    name: "太阳",
    english: "The Sun",
    number: 19,
    upright: "阳光、成功、乐观、纯真、生命力量、凯旋",
    reversed: "阴郁、短暂沮丧、虚幻乐天、过度骄傲、能量打折",
    description: "在巨大红太阳下，骑着白马肆意欢笑的赤子，手摇红旗，代表全然的热烈胜利。",
    element: "火",
    iconType: "sun",
    bgGradient: "from-amber-400 via-amber-800 to-purple-950",
  },
  {
    id: "20_judgement",
    name: "审判",
    english: "Judgement",
    number: 20,
    upright: "觉醒、呼唤、解脱重获新生、判定归宿、终极选择",
    reversed: "拒绝召唤、执迷不悟、心怀悔恨、自我指责、逃避审查",
    description: "炽天使米迦勒从云端吹响黄金号角，死者从棺木中坐起向光叩拜，迎来因果拯救。",
    element: "火",
    iconType: "angel",
    bgGradient: "from-violet-600 via-purple-950 to-neutral-950",
  },
  {
    id: "21_the_world",
    name: "世界",
    english: "The World",
    number: 21,
    upright: "圆满、终点即起点、和谐、国际化、旅程达成",
    reversed: "未完成、欠缺圆满、拖延结局、旅行受阻、止步不前",
    description: "绿叶桂冠编制的椭圆环中央，飞天舞者手持权杖翩翩起舞，四大守护兽环绕其周，代表圆满结局。",
    element: "以太",
    iconType: "tree",
    bgGradient: "from-cyan-500 via-purple-900 to-neutral-950",
  }
];

// Append Minor Arcana programmatically to fulfill Rider-Waite 78-card deck
const SUIT_DEFS = [
  {
    key: "wands",
    name: "权杖",
    element: "火" as const,
    icon: "wand" as const,
    bg: "from-amber-600 via-orange-950 to-neutral-950",
    descriptions: {
      "1": { name: "首牌", english: "Ace of Wands", upright: "新的初创机遇、灵感爆发、生命力、强烈的创造冲动", reversed: "动力消退、半途而废、缺乏长劲、意志力动摇", desc: "云中神手，紧握苍翠生机之杖，嫩芽勃发，代表澎湃的行动力。" },
      "2": { name: "二", english: "Two of Wands", upright: "确立长远大局、规划、雄心勃勃、迈出决策第一步", reversed: "格局局限、受挫难行、畏畏缩缩、缺乏长远视野", desc: "城堡上仰首领主手托浑天仪，另一手擎长杖，极目远望浩淼波涛。" },
      "3": { name: "三", english: "Three of Wands", upright: "眺望远方向、商业探索、起锚扬帆、初步成果", reversed: "海外受阻、方向有偏、错判形势、难以落地", desc: "在金黄山巅上，行商扶着三支傲然权杖，深望浩瀚汪洋中远涉的商船。" },
      "4": { name: "四", english: "Four of Wands", upright: "安宁幸福、和谐团聚、安居乐业、奠定稳固基石", reversed: "家庭冷淡、欢庆有扰、安逸陷阱、缺少真诚共鸣", desc: "四根盛装花烛柱撑起丰稔花束藤冠，众人正举杯共聚欢歌笑语。" },
      "5": { name: "五", english: "Five of Wands", upright: "群体冲突、激烈竞争、立场分歧、头脑激荡与磨合", reversed: "无序恶竞、避免冲突、关系缓和、各执一端", desc: "五个青年高举木质权杖彼此斗狠角力，暗示激进的脑力对垒和世俗竞争。" },
      "6": { name: "六", english: "Six of Wands", upright: "荣誉凯旋、备受赞誉、获取社会认同、信心爆棚", reversed: "虚荣作崇、落马败逃、丧失拥护、昙花一现", desc: "得胜凯旋骑士头饰桂冠，骑着雪白战马高擎胜利权杖缓缓而归。" },
      "7": { name: "七", english: "Seven of Wands", upright: "孤军奋战、坚守立场、逆境抗争、顶住外部压力", reversed: "力不能支、被迫言和、防线失守、知难而退", desc: "青年屹立峻峭峰顶，挥动手棒独斗下方涌动的六根侵略长杖。" },
      "8": { name: "八", english: "Eight of Wands", upright: "极速发展、迅捷消息流、顺风出海、万事势如破竹", reversed: "事态延滞、沟通障碍、虎头尾缩、鲁莽过急", desc: "湛湛蔚蓝晴空中，八根凌空权杖如同利箭般呼啸飞坠，并无丝毫阻碍。" },
      "9": { name: "九", english: "Nine of Wands", upright: "未雨绸缪、坚忍警戒、临战防卫、最后的顽强抗争", reversed: "精疲力竭、防备过当、心理防线破碎、错失时机", desc: "头缠绷带的骁勇勇士警惕地拄着木棍，身后九根围栏之杖铸成坚铜壁防线。" },
      "10": { name: "十", english: "Ten of Wands", upright: "身负重担、过度劳神、不堪负重、最后一公里难行", reversed: "减轻负累、解脱释放、不堪重压而垮掉、分卸责任", desc: "背脊被十支沉重权杖牢牢压弯的挑夫，正筋疲力竭迈向虚幻模糊的城堡。" },
      "11": { name: "侍从", english: "Page of Wands", upright: "热忱满怀、灵光初现、探究求知、充当热衷使者", reversed: "言过其实、焦头烂额、想法难以施行、缺乏信誉", desc: "身披蜥蜴金袍的年轻侍从举杖细看，目光盈满对于浩淼荒原的求索意志。" },
      "12": { name: "骑士", english: "Knight of Wands", upright: "雷厉风行、英勇无畏、开拓进取、热烈果决", reversed: "缺乏长性、盲目急躁、暴躁起怒、横冲直撞", desc: "铠甲明澈的骑士身披猎猎红鬃，策马腾空向前，长枪在握急不可耐。" },
      "13": { name: "女王", english: "Queen of Wands", upright: "温煦慷慨、大方得体、社交明星、母仪天下之感召力", reversed: "控制狂、飞醋连天、感情失配、情绪阴暗易怒", desc: "宝座前手擎朝阳向日葵的女王高贵温和，脚旁蹲伏一只深邃而充满秘密的黑猫。" },
      "14": { name: "国王", english: "King of Wands", upright: "高瞻远瞩的统帅、意志坚决、雄心不凡、开拓产业", reversed: "独断暴恣、专横冷酷、野大心粗、缺乏宽仁与细节管理", desc: "火蜥蜴王冠灿灿，国王手擎粗朴木棒傲然端坐，象征火焰力量支配世俗江山。" }
    }
  },
  {
    key: "cups",
    name: "圣杯",
    element: "水" as const,
    icon: "cup" as const,
    bg: "from-sky-500 via-blue-950 to-neutral-950",
    descriptions: {
      "1": { name: "首牌", english: "Ace of Cups", upright: "情感充盈、大爱泛起、灵性直觉、崭新的感情契机", reversed: "情感枯竭、爱意封闭、玻璃心碎、空虚无神", desc: "天之神手托圣杯，五道丰盈甘露泻入深邃池塘，鸽子銜食，神降福祐爱与直觉。" },
      "2": { name: "二", english: "Two of Cups", upright: "心有灵犀、和谐盟契、情爱深融、对等之诺、神圣共振", reversed: "意气不合、誓言难守、关系破裂、各生芥蒂", desc: "一对璧人于温馨圣烛下深情凝视，彼此倾倒手中黄金杯，头悬赫尔墨斯合契双蛇杖。" },
      "3": { name: "三", english: "Three of Cups", upright: "挚友相聚、庆功言欢、喜上眉梢、多方融洽合作、丰盛友情", reversed: "流于奢逸、酒肉关系、三角纷争、合作停阻", desc: "三位身着靓丽长裙的曼妙少女紧紧相依高举圣杯，正向大地泼洒琼浆、共庆丰登。" },
      "4": { name: "四", english: "Four of Cups", upright: "心生厌倦、冷眼旁观、冥想沉思、对现有索然无味", reversed: "拒绝自闭、直面挑战、重新寻找目标、被外界惊醒", desc: "青年抱臂安坐于繁茂老树下，漠视身前浮云伸出的三只圣杯，闭目静思，似对外界毫无兴趣。" },
      "5": { name: "五", english: "Five of Cups", upright: "自哀自怨、抱负成空、痛得失落、聚焦于过去阴云、悲伤", reversed: "走出阴霾、重拾希望、释怀过去、关注尚存的机缘", desc: "身穿黑色斗篷的孤影面对三只倾覆的圣杯垂头哽咽，却全然忽略了身后还稳稳伫立的两只充满美酒的圣杯。" },
      "6": { name: "六", english: "Six of Cups", upright: "温馨童年、旧日恩情、念旧相遇、纯真关怀、受到庇护", reversed: "深陷过去不能自拔、逃避当下责任、向向虚无桃源", desc: "在古老静谧的安全花园里，年幼男童亲切递给白裙女童一只盛满香草小花的黄金圣杯，极尽纯情。" },
      "7": { name: "七", english: "Seven of Cups", upright: "充满选择、虚幻空想、欲望纷呈、面临交叉口诱惑、乱花渐欲", reversed: "戳破泡影、看清现实真相、意志回归、做出艰难决断", desc: "在漆黑缥缈的幻雾里，七只金杯载满各色奇珍——财富、名誉、长生、恐怖蛇头、天使，引人深溺。" },
      "8": { name: "八", english: "Eight of Cups", upright: "毅然放弃、精神求索、追求高维、远走他乡去修行、出征", reversed: "不敢放手、优柔寡断、在泥潭中徘徊苦捱", desc: "圆月高悬，一个旅人头也不回地拄拐前行，向密林古山而去，身后将苦心经营的八只圣杯整齐遗留。" },
      "9": { name: "九", english: "Nine of Cups", upright: "心愿达成、物质极大快乐、得意洋洋、知足常乐、感官满足", reversed: "纵欲无度、骄奢自负、心有空虚、虚荣买单", desc: "胖乎乎的富商满面春风地叠手靠在红缎座椅上，背后一字排开叠着九只闪光的圣杯，尽显物质幸福。" },
      "10": { name: "十", english: "Ten of Cups", upright: "家庭圆滿、阖家大欢聚、福荫子孙、心安即是归处、理想幸福", reversed: "家庭冷淡、关系离散、不被认同、核心价值观分裂", desc: "斑斓的彩虹天桥横跨群山，桥上整齐缀着满天圣杯，一对恩爱眷侣相搂、欢歌笑语向天指引。" },
      "11": { name: "侍从", english: "Page of Cups", upright: "感性且诗意的年轻人、直觉灵动、艺术创造思维萌动", reversed: "沉溺空想、多愁善感、谎报军情、不守信用", desc: "锦衣华盖的柔美侍从手中高捧着一杯金盏，杯里竟探出一只调皮的小飞鱼，与其默然逗趣。" },
      "12": { name: "骑士", english: "Knight of Cups", upright: "温良如玉、诚意邀约、白马王子、浪漫浪漫主义、执着追求者", reversed: "情感骗子、朝三暮四、意志缥缈、自恋自怜不自知", desc: "身披画满游鱼的水之战袍的骑士驾驭骏马徐徐行军，温雅地伸杯呈祥，传递心底万千爱意。" },
      "13": { name: "女王", english: "Queen of Cups", upright: "极度通灵、悲悯慈祥、艺术丰蕴、爱意无垠之女性本色", reversed: "心神错乱、感情敏感脆弱、患得患失、陷入偏执癔症", desc: "极尽繁复雕饰的黄金杯由海之宝座的女皇凝望，其裙摆翻滚如粼绚浪花，神性与灵感一体。" },
      "14": { name: "国王", english: "King of Cups", upright: "情绪的执掌者、悲天悯人、理性又不失温情、灵敏导师、宰相宰辅", reversed: "伪善算计、玩弄人心情绪、掌控欲重、情绪化冷漠暴力", desc: "在海风翻涌的大海上，慈祥国王端坐海岩王座，手托圣杯，任由风云幻变，内心岿然不动，爱意恒常。" }
    }
  },
  {
    key: "swords",
    name: "宝剑",
    element: "风" as const,
    icon: "swords" as const,
    bg: "from-slate-500 via-indigo-950 to-neutral-950",
    descriptions: {
      "1": { name: "首牌", english: "Ace of Swords", upright: "思维理路清晰、斩断乱障、意志爆发、理性的决胜利剑", reversed: "观念暴力、滥用权谋、精神内耗、计划折戟", desc: "威严之手擎天托起皇冠与智慧双刃宝剑，月桂环垂，风云退散，正视绝对理性能量。" },
      "2": { name: "二", english: "Two of Swords", upright: "僵局、两难抉择、逃避直面、内心筑防、冷酷中立平衡", reversed: "僵局破冰、直面冲突、重新选择、谎言被解", desc: "蒙眼的白裙少女怀中交叉锁定两把沉重钢剑，背对幽深海水，封锁五感，陷于理智拔河。" },
      "3": { name: "三", english: "Three of Swords", upright: "痛彻骨髓、背叛、情感剥离、悲怆之泪、精神遭受暴击", reversed: "痛苦愈合、原谅背离、释然心锁、走出地狱幽谷", desc: "阴云密布的凄风冷雨里，一颗血红的心脏被三柄残酷宝剑深深穿透，极为悲怆触目。" },
      "4": { name: "四", english: "Four of Swords", upright: "退隐修整、养精蓄锐、消极避战、精神休眠、积蓄新力", reversed: "重回战场、摆脱倦怠、重新投入行动、休整告终", desc: "神圣大教堂的石棺浮雕卧像上，骑士双手合十。墙覆三剑，身侧横放一刃，代表内省静默与避战。" },
      "5": { name: "五", english: "Five of Swords", upright: "惨胜之争、两败俱伤、不择手段的利益最大化、丧失情义", reversed: "重修和解、厌恶恶战、认清无谓牺牲、避免争端", desc: "海风尖啸、卷云凌乱，神色狡黠的纹章男子正搜刮众人丢下的宝剑，只留下两个含恨败走的溃卒身影。" },
      "6": { name: "六", english: "Six of Swords", upright: "暗度陈仓、缓缓脱困、疗愈之渡、寻求心灵庇难、回归安宁", reversed: "逃避未果、半途生变、旧病复发、滞阻不前", desc: "破晓微茫里，艄公默默摇橹送渡，扁舟一叶。插着六刃圣剑，载着披蓑衣的母子缓缓渡向新生彼岸。" },
      "7": { name: "七", english: "Seven of Swords", upright: "暗行其谋、窃取便宜、逃避正面角斗、取巧走捷径、隐藏真实动机", reversed: "计谋败露、坦诚面对、放下伪装、寻求正当合规", desc: "神色鬼祟的谍影抱着抢来的五把锋芒军刃从营地溜走，眼光却斜斜盯视着后方未防守的另两把宝剑。" },
      "8": { name: "八", english: "Eight of Swords", upright: "思想画地为牢、自我设限、束手无策、陷入被控制境遇", reversed: "思想挣脱束缚、发现逃生出路、拒绝受害者思想、解除危机", desc: "被繁复藤锁紧捆且蒙上重纱的白衣少女被困在八把尖利尖刀阵中，实则出路宽敞，只是内心作茧自缚。" },
      "9": { name: "九", english: "Nine of Swords", upright: "焦虑折磨、噩梦惊魂、精神高度紧绷、极度自责惊恐、绝望", reversed: "走出魇境、看淡忧虑、噩梦清醒、寻求心理专业疏解", desc: "在如墨黑夜中，卧榻上的少妇用双手蒙脸绝望大哭，墙头横悬九把大剑，如达摩克利斯之重压压迫心魄。" },
      "10": { name: "十", english: "Ten of Swords", upright: "触底及死、全盘惨败、痛苦极点、置之死地而后生、毁灭", reversed: "痛苦终结、缓缓复苏、向向而生、最坏时刻已渡过", desc: "黑云漫天的荒野，一个匍匐地上的男人后背齐整钉入十柄雪刃宝剑。然而远方湖面上正冉冉升起晨光霓彩。" },
      "11": { name: "侍从", english: "Page of Swords", upright: "机警聪慧、敏锐探索、高度戒备、八面玲珑的线情报讯者", reversed: "道听途说、疑神疑鬼、口无遮拦、爱管闲事招祸", desc: "轻柔的风卷云中，长发青年高擎重剑，转头警觉地洞察八面来风，眼神充满警戒与超常智慧。" },
      "12": { name: "骑士", english: "Knight of Swords", upright: "冲锋陷阵、一往无前、锐不可当、雷厉风行、直击要害", reversed: "鲁莽暴虐、狂怒行事、智商下限、成事不足败事有余", desc: "烈风怒卷、卷云如撕！铁骑骑士平端明晃宝剑，呼啸怒吼着踏碎险境，誓要与天底魔障拼个你死我活。" },
      "13": { name: "女王", english: "Queen of Swords", upright: "明澈聪睿、高冷理智、直言不讳、经历练就的风霜高古、斩断私执", reversed: "刻薄怨怼、偏激固执、冷血算计、情感绝交暴君", desc: "御座极尽华美，女王正面威严安坐，右擎智慧锋刃，左手前伸驱散凡庸云翳，神态独立冷绝。" },
      "14": { name: "国王", english: "King of Swords", upright: "法理与秩序的统辖、智谋化身、明断秋毫、绝对自律冷酷、宰割乾坤", reversed: "酷吏暴行、刚愎滥法、心机城府极深、情绪寡恩毒辣", desc: "威严冷峻的军王执掌无暇圣刃正襟危坐，俯察众生，其眼神明洞宇宙理脉，万法秩序皆自森列成规。" }
    }
  },
  {
    key: "pentacles",
    name: "星币",
    element: "土" as const,
    icon: "pentacle" as const,
    bg: "from-emerald-500 via-stone-900 to-neutral-950",
    descriptions: {
      "1": { name: "首牌", english: "Ace of Pentacles", upright: "丰渥契机、物质开端、实打实收益、丰饶福祉、实业落地", reversed: "投资折损、贪得无厌、时机难握、财物白白流走", desc: "神之圣手于金云浮出，稳托着覆有五芒星黄金大币，下方繁花锦簇、拱门开启，代表物理财富新天地。" },
      "2": { name: "二", english: "Two of Pentacles", upright: "资金周转、精妙平衡、灵活腾挪、应对多方杂事、玩乐中前行", reversed: "资金链断、心力交瘁、忙乱失衡、难于应对多头债", desc: "杂耍艺人立于波涛边缘，在无边大索链中轻灵旋转两块星币，背景商船随巨浪起伏跌宕。" },
      "3": { name: "三", english: "Three of Pentacles", upright: "大师匠人、专业打磨、通力合作、技能备受肯定、基建精益求精", reversed: "技术不精、团队分裂、粗制滥造、沟通鸿沟", desc: "在宏大教堂拱卫中，雕刻工手扶凿子正听取僧侣和神父对于建筑的审核，精诚切磋，打磨无上技艺。" },
      "4": { name: "四", english: "Four of Pentacles", upright: "守财、严防死守、安于稳定、抗拒变化、资本吝啬、划定绝对界限", reversed: "散财破财、放下控制、抗拒失序、投资亏折", desc: "男人端于城堡前，双手紧紧抱住一只金币，双脚各蹬一片，头顶还顶着一块，视金如命，固守本己域度。" },
      "5": { name: "五", english: "Five of Pentacles", upright: "物质赤贫、雪上加霜、孤独无靠、内心信念危机、孤单行进", reversed: "峰回路转、寒冬消退、破产愈合、寻求组织济度", desc: "风雪夹道，两个衣衫褴褛、肢体残疾的乞讨者拄拐蹒跚在教堂色彩斑斓、温暖明亮的花窗外，满心落寞。" },
      "6": { name: "六", english: "Six of Pentacles", upright: "慈善布施、财力通达、阶梯分配、获取公平薪酬、掌控支配力", reversed: "伪善附条件、施恩求报、沦为债务奴役、偏心不均", desc: "满月巨富衣着体面，单手持精细法理天平分配金钱，脚前匍匐两个接受赒济的贫苦，表现天平施受和谐。" },
      "7": { name: "七", english: "Seven of Pentacles", upright: "耐心静候、评估收成、阶段思考、谋划下一步扩张、见好就收", reversed: "拔苗助长、不求上进、徒劳无功、过度负债急功近利", desc: "农夫立于茁壮繁茂的葡萄藤旁，藤上缀满七块灿灿金盘，他拄锄观望，正沉静估量收获的成熟度和下一步规划。" },
      "8": { name: "八", english: "Eight of Pentacles", upright: "匠人精神、每日打磨、持之以恒工作、专一钻研、精细化工艺", reversed: "应付差事、技术瓶颈、缺乏创意、抄袭取巧", desc: "老石匠在简朴工作室中一心一意凿刻一锤锤星币，墙上齐整排挂雕琢完美的心血成果，极具专注质朴。" },
      "9": { name: "九", english: "Nine of Pentacles", upright: "高度自足、精神财富两得、庄园享乐、精致优雅生活、自律结硕果", reversed: "德不配位、金丝鸟笼、财务虚假泡影、生活寂寞过度", desc: "在金黄成串的葡萄庄园中央，高贵少妇披肩锦罗，手站猎隼，雍容温和。代表独自拥有的尊贵极乐安详。" },
      "10": { name: "十", english: "Ten of Pentacles", upright: "财富世家、大团圆继承、丰厚遗产、家族永续荣耀、基业长青", reversed: "家族争产、财务分崩离析、后继无传、背弃古老传统传承", desc: "拱门覆有显赫星辉，老祖宗抚摸爱犬斜躺。中景是继承青年夫妻及幼童，金币绘满家徽，代表百年家族传承与富贵。" },
      "11": { name: "侍从", english: "Page of Pentacles", upright: "务实可靠的年轻学者、学习财务经营、奠定稳定物质基础", reversed: "不思进取、财不自量、丢三落四、不切实际空想", desc: "在葱郁草原旷野上，求学青年正将两手合围，神似托拂圣殿般凝望手心升腾的星盘，潜心苦读自然规律。" },
      "12": { name: "骑士", english: "Knight of Pentacles", upright: "最坚忍踏实、勤勉笃实、言出必诺、按部就班达成宏愿的黑马守护者", reversed: "安逸懒散、固化死板、不知变通、贪恋守成庸碌", desc: "沉稳重铠骑士端坐重型漆黑战马，静静守卫在辽阔金色垄亩之中，神情坚毅不拔，默默计量收获之实。" },
      "13": { name: "女王", english: "Queen of Pentacles", upright: "丰美滋养、母爱满溢、理财巧匠、温暖惬意的世俗温馨、家政执掌", reversed: "贪图感官享乐、唯物自私、失去理财重心、丧失母仪高雅", desc: "安坐于饰有繁花和瑞兔的至尊宝座之上，知性女皇俯瞰手中唯一的金币，满脸柔慈温煦，滋养大地。" },
      "14": { name: "国王", english: "King of Pentacles", upright: "商业大鳄、资本帝国大君、富国强民功德圆满、产业大拿", reversed: "唯利是图、黑心剥削、目光短浅贪酷、精神赤贪无底", desc: "置于葡萄与雕刻羊头的石雕神座上，国王端庄披熊袍、持王权金球。脚踏富庶庄稼，坐拥天下财富实业。" }
    }
  }
];

let globalCardIndex = 22;
SUIT_DEFS.forEach((suit) => {
  const ranksKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
  ranksKeys.forEach((rk) => {
    const cardDef = suit.descriptions[rk as keyof typeof suit.descriptions];
    if (cardDef) {
       TAROT_DECK.push({
         id: `${suit.key}_${rk}`,
         name: `${suit.name}${cardDef.name}`,
         english: cardDef.english,
         number: globalCardIndex++,
         upright: cardDef.upright,
         reversed: cardDef.reversed,
         description: cardDef.desc,
         element: suit.element,
         iconType: suit.icon,
         bgGradient: suit.bg,
       });
    }
  });
});

export interface CardSpread {
  id: string;
  name: string;
  description: string;
  count: number;
  positions: {
    index: number;
    name: string;
    description: string;
  }[];
}

export const TAROT_SPREADS: CardSpread[] = [
  {
    id: "single",
    name: "单牌启示 (1张)",
    description: "解答具体的“是/否”问题，或者获得当下对某件事的最核心精神状态和当日指引。",
    count: 1,
    positions: [
      { index: 0, name: "启示与核心", description: "当下你需要知道的真相或指引方向" }
    ]
  },
  {
    id: "past_present_future",
    name: "三牌时空阵 (3张)",
    description: "经典的线性关系探索，全方位了解事件的前因后果、当前核心和未来走势。",
    count: 3,
    positions: [
      { index: 0, name: "过去 (Past)", description: "阻碍或促进当前局势发展的历史根源与经历" },
      { index: 1, name: "现在 (Present)", description: "你此时此刻处于的真实状态、挑战与机会" },
      { index: 2, name: "未来 (Future)", description: "如果沿着当前能量点发展，最可能产生的前景与结果" }
    ]
  },
  {
    id: "choice_spread",
    name: "多择两难阵 (3张)",
    description: "适用于面临重大抉择时。评估选择A与选择B的不同走向，并给出中立指引。",
    count: 3,
    positions: [
      { index: 0, name: "核心现状", description: "你面临的根本冲突和决策焦点" },
      { index: 1, name: "选择A的方向", description: "迈出选择A对应的行为将收获和面临的结果" },
      { index: 2, name: "选择B的方向", description: "选择B对应的机会、代价及可能走势" }
    ]
  },
  {
    id: "five_cross",
    name: "五牌十字圣三角 (5张)",
    description: "全面穿透，探索事件的核心、内在潜意识影响、客观困难及跨越之径。",
    count: 5,
    positions: [
      { index: 0, name: "主题现状 (Theme)", description: "事件当前的现实本貌与核心状况" },
      { index: 1, name: "潜在挑战 (Obstacles)", description: "你所遭遇的暗流阻碍、心魔或外部困难" },
      { index: 2, name: "深层理想 (Subconscious)", description: "你的深层潜意识渴望、理想状态或高我期盼" },
      { index: 3, name: "历史演变 (Past)", description: "构筑目前情境的历史成因，潜移默化的力量" },
      { index: 4, name: "启示前景 (Future)", description: "整合各方力量后局势演化带来的最终启示与高维走向" }
    ]
  }
];
