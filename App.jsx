import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// 全套 100 篇 课程数据合并库
// 前 10 篇 & 99-100 篇自带真实 GitHub CDN 音频路径与时间戳
// ─────────────────────────────────────────────
const LESSON_DATA = [
  {
    id: 1, kr: "자기소개", cn: "自我介绍",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/1.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "중국에서 왔고 지금은 한국에 살고 있습니다.", cn: "我来自中国，现在住在韩国。", start: 3, end: 7 },
      { kr: "저는 학생이고 한국어를 공부하고 있습니다.", cn: "我是学生，正在学习韩语。", start: 7, end: 11 },
      { kr: "한국어는 아직 어렵지만 재미있습니다.", cn: "韩语现在还比较难，但很有趣。", start: 11, end: 15 },
      { kr: "저는 음악을 듣는 것을 좋아하고 영화를 보는 것도 좋아합니다.", cn: "我喜欢听音乐，也喜欢看电影。", start: 15, end: 20 },
      { kr: "특히 친구들과 이야기하는 시간을 좋아합니다.", cn: "特别喜欢和朋友聊天的时间。", start: 20, end: 24 },
      { kr: "매일 학교에 가서 열심히 공부하고 있습니다.", cn: "我每天去学校努力学习。", start: 24, end: 28 },
      { kr: "앞으로 한국어를 더 잘하고 싶습니다. 감사합니다!", cn: "以后我想把韩语学得更好。谢谢！", start: 28, end: 33 },
    ],
    vocab: ["안녕하세요 你好","저 我（谦称）","중국 中国","한국 韩国","살다 居住","학생 学生","한국어 韩语","공부하다 学习","음악 音乐","영화 电影"],
  },
  {
    id: 2, kr: "내 이름", cn: "我的名字",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/2.mp3",
    script: [
      { kr: "안녕하세요. 제 이름은 왕명입니다.", cn: "你好，我的名字是王明。", start: 0, end: 3 },
      { kr: "이름은 아주 간단하고 기억하기 쉽습니다.", cn: "名字很简单，也很好记。", start: 3, end: 7 },
      { kr: "제 이름은 '王'과 '명'으로 되어 있습니다.", cn: "我的名字由“王”和“明”组成。", start: 7, end: 11 },
      { kr: "친구들은 저를 '명'이라고 자주 부릅니다.", cn: "朋友们经常叫我“明”。", start: 11, end: 15 },
      { kr: "저는 제 이름이 마음에 듭니다.", cn: "我很喜欢我的名字。", start: 15, end: 18 },
      { kr: "이름은 저를 잘 나타낸다고 생각합니다.", cn: "我觉得名字很能代表我。", start: 18, end: 21 },
      { kr: "그래서 저는 제 이름을 좋아합니다. 감사합니다.", cn: "所以我喜欢我的名字。谢谢。", start: 21, end: 25 },
    ],
    vocab: ["이름 名字","제 我的（敬语）","간단하다 简单","기억하다 记住","쉽다 容易","친구 朋友","자주 经常","부르다 叫","마음에 들다 喜欢","나타내다 代表"],
  },
  {
    id: 3, kr: "내 나이", cn: "我的年龄",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/3.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "제 나이는 스무 살입니다.", cn: "我今年20岁。", start: 3, end: 6 },
      { kr: "저는 아직 학생이고 한국어를 공부하고 있습니다.", cn: "我还是学生，正在学习韩语。", start: 6, end: 10 },
      { kr: "나이는 어리지만 열심히 공부하고 있습니다.", cn: "虽然年纪还小，但我很努力学习。", start: 10, end: 14 },
      { kr: "저는 매일 학교에 가고 친구들과 즐겁게 지냅니다.", cn: "我每天去学校，和朋友们过得很开心。", start: 14, end: 19 },
      { kr: "앞으로 더 열심히 하고 싶습니다. 감사합니다.", cn: "以后我想更加努力。谢谢。", start: 19, end: 23 },
    ],
    vocab: ["나이 年龄","스무 살 二十岁","아직 还、仍然","학생 学生","어리다 年轻","-지만 虽然…但是","열심히 努力地","매일 每天","즐겁다 开心","앞으로 以后"],
  },
  {
    id: 4, kr: "내 국적", cn: "我的国籍",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/4.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "제 국적은 중국입니다.", cn: "我的国籍是中国。", start: 3, end: 6 },
      { kr: "저는 중국 상하이에서 왔고 지금은 한국에 살고 있습니다.", cn: "我来自中国上海，现在住在韩国。", start: 6, end: 11 },
      { kr: "상하이는 아주 크고 유명한 도시입니다.", cn: "上海是一个非常大而且有名的城市。", start: 11, end: 15 },
      { kr: "저는 제 나라와 제 도시를 좋아합니다.", cn: "我很喜欢我的国家和我的城市。", start: 15, end: 19 },
      { kr: "한국에서도 열심히 공부하고 있습니다. 감사합니다.", cn: "在韩国我也在努力学习。谢谢。", start: 19, end: 24 },
    ],
    vocab: ["국적 国籍","중국 中国","상하이 上海","한국 韩国","오다 来","살다 居住","도시 城市","크다 大","유명하다 有名","나라 国家"],
  },
  {
    id: 5, kr: "내 가족", cn: "我的家人",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/5.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "제 가족은 모두 다섯 명입니다.", cn: "我们家一共有五口人。", start: 3, end: 6 },
      { kr: "부모님과 저, 그리고 남동생과 여동생이 있습니다.", cn: "有父母、我，还有弟弟和妹妹。", start: 6, end: 11 },
      { kr: "아버지와 어머니는 아주 친절하십니다.", cn: "爸爸妈妈都很亲切。", start: 11, end: 14 },
      { kr: "남동생과 여동생은 학생입니다.", cn: "弟弟和妹妹是学生。", start: 14, end: 17 },
      { kr: "우리는 함께 식사하고 이야기를 자주 합니다.", cn: "我们经常一起吃饭、聊天。", start: 17, end: 21 },
      { kr: "저는 가족과 함께 있는 시간이 아주 좋습니다. 감사합니다.", cn: "我很喜欢和家人在一起的时间。谢谢。", start: 21, end: 26 },
    ],
    vocab: ["가족 家人","모두 全部","다섯 명 五个人","부모님 父母","남동생 弟弟","여동생 妹妹","아버지 爸爸","어머니 妈妈","친절하다 亲切","함께 一起"],
  },
  {
    id: 6, kr: "내가 좋아하는 음식", cn: "我喜欢的食物",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/6.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "오늘은 제가 좋아하는 음식을 소개하겠습니다.", cn: "今天我来介绍一下我喜欢的食物。", start: 3, end: 7 },
      { kr: "저는 중국 음식을 좋아합니다. 특히 마라탕을 아주 좋아합니다.", cn: "我喜欢中国料理，特别是麻辣烫。", start: 7, end: 12 },
      { kr: "저는 보통 점심에 마라탕을 먹고 주말에는 친구들과 같이 식당에 갑니다.", cn: "我通常中午吃麻辣烫，周末和朋友一起去餐厅。", start: 12, end: 18 },
      { kr: "저는 일주일에 한두 번 마라탕을 먹습니다.", cn: "我一周吃一两次麻辣烫。", start: 18, end: 21 },
      { kr: "마라탕은 맛있고 조금 맵지만 아주 좋습니다.", cn: "麻辣烫很好吃，有点辣，但我很喜欢。", start: 21, end: 25 },
      { kr: "그래서 저는 마라탕을 좋아합니다. 감사합니다.", cn: "所以我喜欢麻辣烫。谢谢。", start: 25, end: 30 },
    ],
    vocab: ["음식 食物","중국 음식 中国料理","마라탕 麻辣烫","특히 特别","보통 一般","점심 午餐","주말 周末","일주일 一周","맛있다 好吃","맵다 辣"],
  },
  {
    id: 7, kr: "내 취미", cn: "我的爱好",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/7.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "오늘은 제 취미를 소개하겠습니다.", cn: "今天我来介绍一下我的爱好。", start: 3, end: 6 },
      { kr: "제 취미는 음악을 듣는 것과 영화를 보는 것입니다.", cn: "我的爱好是听音乐和看电影。", start: 6, end: 11 },
      { kr: "저는 시간이 있을 때 음악을 자주 듣습니다.", cn: "有时间的时候我经常听音乐。", start: 11, end: 15 },
      { kr: "보통 저녁에 음악을 듣고 주말에는 친구들과 영화를 봅니다.", cn: "一般晚上听音乐，周末和朋友一起看电影。", start: 15, end: 20 },
      { kr: "저는 일주일에 두세 번 영화를 봅니다.", cn: "我一周看两三次电影。", start: 20, end: 23 },
      { kr: "이런 활동은 저를 즐겁게 합니다. 앞으로도 계속 하고 싶습니다. 감사합니다.", cn: "这些活动让我很开心。以后我也想继续做这些事情。谢谢。", start: 23, end: 29 },
    ],
    vocab: ["취미 爱好","음악 音乐","듣다 听","영화 电影","보다 看","시간 时间","자주 经常","저녁 晚上","두세 번 两三次","활동 活动"],
  },
  {
    id: 8, kr: "내가 싫어하는 음식", cn: "我不喜欢的食物",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/8.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "오늘은 제가 싫어하는 음식을 소개하겠습니다.", cn: "今天我来介绍一下我不喜欢的食物。", start: 3, end: 7 },
      { kr: "저는 당근을 싫어합니다.", cn: "我不喜欢胡萝卜。", start: 7, end: 9 },
      { kr: "당근은 맛이 조금 이상해서 잘 먹지 않습니다.", cn: "胡萝卜味道有点奇怪，所以不太吃。", start: 9, end: 13 },
      { kr: "그래서 저는 보통 당근을 먹지 않습니다.", cn: "所以我通常不吃胡萝卜。", start: 13, end: 16 },
      { kr: "대신에 다른 채소를 더 좋아합니다.", cn: "代替它，我更喜欢其他蔬菜。", start: 16, end: 19 },
      { kr: "저는 일주일에 한 번 정도만 당근을 먹습니다. 감사합니다.", cn: "我大约一周只吃一次胡萝卜。谢谢。", start: 19, end: 24 },
    ],
    vocab: ["당근 胡萝卜","싫어하다 不喜欢","맛 味道","이상하다 奇怪","조금 一点","잘 不太","대신에 代替","채소 蔬菜","보통 一般","일주일 一周"],
  },
  {
    id: 9, kr: "내가 좋아하는 색", cn: "我喜欢的颜色",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/9.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "오늘은 제가 좋아하는 색을 소개하겠습니다.", cn: "今天我来介绍一下我喜欢的颜色。", start: 3, end: 7 },
      { kr: "저는 예전에는 다양한 색을 좋아했습니다.", cn: "以前我喜欢各种各样的颜色。", start: 7, end: 11 },
      { kr: "밝고 화려한 색이 좋아서 자주 입었습니다.", cn: "尤其是明亮、鲜艳的颜色，也经常穿。", start: 11, end: 15 },
      { kr: "하지만 지금은 검은색, 흰색, 회색 같은 색을 더 좋아합니다.", cn: "但现在我更喜欢黑色、白色和灰色。", start: 15, end: 20 },
      { kr: "한국에서 오래 살다 보니 사람들이 보통 이런 색 옷을 많이 입습니다.", cn: "在韩国生活久了，发现大家一般都穿这些颜色。", start: 20, end: 26 },
      { kr: "그래서 저도 자연스럽게 이런 색을 좋아하게 되었습니다.", cn: "所以我也慢慢喜欢上了这些颜色。", start: 26, end: 31 },
      { kr: "저는 이런 색을 보면 편안한 느낌이 듭니다. 감사합니다.", cn: "看到这些颜色会让我感觉很舒服。谢谢。", start: 31, end: 36 },
    ],
    vocab: ["색 颜色","예전 以前","다양한 多样的","밝다 明亮","화려하다 鲜艳","검은색 黑色","흰색 白色","회색 灰色","자연스럽게 自然地","편안하다 舒服"],
  },
  {
    id: 10, kr: "내가 좋아하는 날씨", cn: "我喜欢的天气",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/10.mp3",
    script: [
      { kr: "안녕하세요. 저는 왕밍입니다.", cn: "你好，我叫王明。", start: 0, end: 3 },
      { kr: "오늘은 제가 좋아하는 날씨를 소개하겠습니다.", cn: "今天我来介绍一下我喜欢的天气。", start: 3, end: 7 },
      { kr: "저는 맑은 날씨를 좋아합니다.", cn: "我喜欢晴天。", start: 7, end: 9 },
      { kr: "맑은 날에는 하늘이 파랗고 공기가 깨끗해서 기분이 좋아집니다.", cn: "晴天的时候天空很蓝，空气也很干净，心情会变好。", start: 9, end: 15 },
      { kr: "그래서 저는 이런 날에 산책을 하거나 친구를 만나는 것을 좋아합니다.", cn: "因此我喜欢在这种天气散步或者见朋友。", start: 15, end: 21 },
      { kr: "반대로 비 오는 날에는 기분이 조금 우울해지고 활동하기도 불편합니다.", cn: "相反，下雨天的时候心情会有点低落，活动也不太方便。", start: 21, end: 27 },
      { kr: "그래서 저는 맑은 날씨를 더 좋아합니다. 감사합니다.", cn: "所以我更喜欢晴天. 谢谢。", start: 27, end: 32 },
    ],
    vocab: ["날씨 天气","맑다 晴朗","하늘 天空","파랗다 蓝","공기 空气","기분 心情","산책 散步","반대로 相反","비 雨","우울하다 忧郁"],
  },
];

// 11–98篇 (仅标题占位，内容待更新)
const LESSON_TITLES = [
  { id: 11, kr: "날씨", cn: "天气" },
  { id: 12, kr: "오늘 기분", cn: "今天心情" },
  { id: 13, kr: "내 하루 일과", cn: "我的一天" },
  { id: 14, kr: "주말 계획", cn: "周末计划" },
  { id: 15, kr: "학교 생활", cn: "学校生活" },
  { id: 16, kr: "내가 좋아하는 과목", cn: "我最喜欢的科目" },
  { id: 17, kr: "병원에 갔습니다", cn: "去医院" },
  { id: 18, kr: "저는 왕밍입니다", cn: "我是王明" },
  { id: 19, kr: "요일", cn: "星期" },
  { id: 20, kr: "월", cn: "月" },
  { id: 21, kr: "날씨 (二)", cn: "天气（二）" },
  { id: 22, kr: "봄", cn: "春天" },
  { id: 23, kr: "여름", cn: "夏天" },
  { id: 24, kr: "가을", cn: "秋天" },
  { id: 25, kr: "겨울", cn: "冬天" },
  { id: 26, kr: "좋아하지 않는 과목", cn: "我不喜欢的科目" },
  { id: 27, kr: "교실", cn: "教室" },
  { id: 28, kr: "제 방", cn: "我的房间" },
  { id: 29, kr: "제 집", cn: "我的家" },
  { id: 30, kr: "공원", cn: "公园" },
  { id: 31, kr: "카페", cn: "咖啡店" },
  { id: 32, kr: "식당", cn: "餐厅" },
  { id: 33, kr: "주문", cn: "餐厅点单" },
  { id: 34, kr: "쇼핑", cn: "购物" },
  { id: 35, kr: "가격 묻기", cn: "问价格" },
  { id: 36, kr: "길 묻기", cn: "问路" },
  { id: 37, kr: "버스 타기", cn: "坐公交车" },
  { id: 38, kr: "지하철 타기", cn: "坐地铁" },
  { id: 39, kr: "여행을 가다", cn: "去旅行" },
  { id: 40, kr: "여행 계획", cn: "旅行计划" },
  { id: 41, kr: "가고 싶은 나라", cn: "想去的国家" },
  { id: 42, kr: "숫자", cn: "数字" },
  { id: 43, kr: "날짜", cn: "日期" },
  { id: 44, kr: "요일 (二)", cn: "星期（二）" },
  { id: 45, kr: "전화하다", cn: "打电话" },
  { id: 46, kr: "문자 보내다", cn: "发短信" },
  { id: 47, kr: "약속", cn: "约定" },
  { id: 48, kr: "약속 취소하기", cn: "取消约定" },
  { id: 49, kr: "병원 가기", cn: "去医院" },
  { id: 50, kr: "약국", cn: "药店" },
  { id: 51, kr: "감기 걸렸을 때", cn: "感冒时" },
  { id: 52, kr: "운동하기", cn: "做运动" },
  { id: 53, kr: "음악 듣기", cn: "听音乐" },
  { id: 54, kr: "내가 좋아하는 노래", cn: "我喜欢的歌曲" },
  { id: 55, kr: "영화 보기", cn: "看电影" },
  { id: 56, kr: "내가 좋아하는 영화", cn: "我喜欢的电影" },
  { id: 57, kr: "한국 드라마", cn: "韩国电视剧" },
  { id: 58, kr: "나의 취미", cn: "我的爱好" },
  { id: 59, kr: "내가 좋아하는 책", cn: "我喜欢的一本书" },
  { id: 60, kr: "공부 계획", cn: "学习计划" },
  { id: 61, kr: "한국어 공부 후기", cn: "韩语学习心得" },
  { id: 62, kr: "외국어 배우기", cn: "学习外语" },
  { id: 63, kr: "시험 준비", cn: "准备考试" },
  { id: 64, kr: "스트레스 해소", cn: "缓解压力" },
  { id: 65, kr: "휴식 시간", cn: "休息时间" },
  { id: 66, kr: "낮잠 자기", cn: "午睡" },
  { id: 67, kr: "일찍 일어나기", cn: "早起" },
  { id: 68, kr: "늦게 자기", cn: "晚睡" },
  { id: 69, kr: "아침 식사", cn: "早餐" },
  { id: 70, kr: "점심 식사", cn: "午餐" },
  { id: 71, kr: "저녁 식사", cn: "晚餐" },
  { id: 72, kr: "요리하기", cn: "做饭" },
  { id: 73, kr: "내가 좋아하는 요리", cn: "我喜欢的料理" },
  { id: 74, kr: "음식 만들기", cn: "做食物" },
  { id: 75, kr: "배달", cn: "外卖" },
  { id: 76, kr: "커피 마시기", cn: "喝咖啡" },
  { id: 77, kr: "차 문화", cn: "茶文化" },
  { id: 78, kr: "커피와 차", cn: "茶和咖啡" },
  { id: 79, kr: "물 마시기", cn: "喝水" },
  { id: 80, kr: "날씨와 기분", cn: "天气和心情" },
  { id: 81, kr: "계절", cn: "季节" },
  { id: 82, kr: "봄 (二)", cn: "春天（二）" },
  { id: 83, kr: "여름 (二)", cn: "夏天（二）" },
  { id: 84, kr: "가을 (二)", cn: "秋天（二）" },
  { id: 85, kr: "겨울 (二)", cn: "冬天（二）" },
  { id: 86, kr: "눈 오는 날", cn: "下雪天" },
  { id: 87, kr: "비 오는 날", cn: "下雨天" },
  { id: 88, kr: "더운 날", cn: "炎热的天气" },
  { id: 89, kr: "내 꿈", cn: "我的梦想" },
  { id: 90, kr: "미래 계획", cn: "未来计划" },
  { id: 91, kr: "내가 되고 싶은 직업", cn: "理想职业" },
  { id: 92, kr: "아르바이트", cn: "兼职" },
  { id: 93, kr: "회사 생활", cn: "公司生活" },
  { id: 94, kr: "하루 목표", cn: "每日目标" },
  { id: 95, kr: "좋은 습관", cn: "好习惯" },
  { id: 96, kr: "나쁜 습관", cn: "坏习惯" },
  { id: 97, kr: "나의 장점", cn: "我的优点" },
  { id: 98, kr: "나의 단점", cn: "我的缺点" },
];

// GitHub 托管的 99 & 100 篇内容
const SPECIAL_LESSONS = [
  {
    id: 99, kr: "나의 장점", cn: "我的优点",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/99.mp3",
    script: [
      { kr: "저는 성실한 사람입니다.", cn: "我是一个诚实勤奋的人。", start: 0, end: 3 },
      { kr: "저는 항상 최선을 다합니다.", cn: "我总是尽最大努力。", start: 3, end: 6 },
    ],
    vocab: ["성실하다 诚实、勤奋", "항상 总是", "최선 最好的努力", "다하다 尽力"]
  },
  {
    id: 100, kr: "나의 단점", cn: "我的缺点",
    audioFile: "https://raw.githubusercontent.com/wangfengjiao456-gif/KoreanLab/main/audio/100.mp3",
    script: [
      { kr: "저는 조금 게으를 때가 있습니다.", cn: "我有时候有点懒。", start: 0, end: 3 },
      { kr: "저는 긴장을 자주 합니다.", cn: "我经常紧张。", start: 3, end: 6 },
    ],
    vocab: ["게으르다 懒惰", "긴장 紧张", "자주 经常", "단점 缺点"]
  }
];

// 合并为最终 100 篇完美数据集
const ALL_LESSONS = [
  ...LESSON_DATA,
  ...LESSON_TITLES.map(l => ({ ...l, audioFile: null, script: [], vocab: [] })),
  ...SPECIAL_LESSONS
].sort((a, b) => a.id - b.id);

const VOCAB_STORE_KEY = "teco_vocab";
const NOTES_STORE_KEY = "teco_notes";
const PROGRESS_KEY   = "teco_progress";
const USER_KEY       = "teco_user";

const load = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    home:       <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    course:     <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    crown:      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l3.5 7L12 4l3.5 6L21 3l-2 14H5L3 3z" />,
    headphones: <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3zm14-3h-1a2 2 0 00-2 2v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2z" />,
    user:       <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    play:       <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />,
    pause:      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />,
    back:       <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    check:      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    mic:        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
    book:       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    trash:      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    search:     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:        <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
    eyeOff:     <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>,
    info:       <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    settings:   <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    receipt:    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    refresh:    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    volume:     <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M6.343 9.657a8 8 0 000 4.686" />,
    repeat:     <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    list:       <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    lock:       <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

// ─── BOTTOM NAV ──────────────────────────────
const NAV_ITEMS = [
  { id: "home",      label: "首页", icon: "home" },
  { id: "courses",   label: "课程", icon: "course" },
  { id: "subscribe", label: "订阅", icon: "crown" },
  { id: "learn",     label: "学习", icon: "headphones" },
  { id: "personal",  label: "我的", icon: "user" },
];

function BottomNav({ page, setPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/95 backdrop-blur border-t border-slate-100 px-2 py-2 flex justify-between items-center z-50 shadow-xl">
      {NAV_ITEMS.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${page === n.id ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-700"}`}>
          <Icon name={n.icon} className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────
function HomePage({ setPage, setActiveLesson, progress }) {
  const [showAll, setShowAll] = useState(false);
  const completed = Object.values(progress).filter(Boolean).length;
  
  // 过滤出真正可以学的课程（有音频的）
  const activeLessonsOnly = ALL_LESSONS.filter(l => l.script && l.script.length > 0);
  const displayedLessons = showAll ? ALL_LESSONS : ALL_LESSONS.slice(0, 15);

  return (
    <div className="px-5 pb-4">
      {/* Hero */}
      <div className="bg-slate-900 rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/20 rounded-full translate-y-6 -translate-x-4" />
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">每日学习</p>
        <h2 className="text-white text-xl font-bold leading-tight mb-0.5">王明的韩语之路</h2>
        <p className="text-blue-300 text-sm font-semibold mb-1">· 100篇全程陪伴 ·</p>
        <p className="text-slate-400 text-xs mb-4">今日已有 <span className="text-white font-bold">1,582</span> 人完成了学习</p>
        <button
          onClick={() => { 
            // 默认寻找第一篇未完成的有内容课文
            const targetLesson = activeLessonsOnly.find(l => !progress[l.id]) || activeLessonsOnly[0];
            setActiveLesson(targetLesson); 
            setPage("learn"); 
          }}
          className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition animate-bounce">
          <Icon name="play" className="w-4 h-4" />
          {completed > 0 ? `继续学习` : "开始第一课"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "完成课时", val: `${completed}/100` },
          { label: "连击天数", val: `5 天` },
          { label: "学习时长", val: `${Math.round(completed * 4)} Mins` },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-base font-black text-slate-900">{s.val}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 总进度条 */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-5">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-700">总学完进度</span>
          <span className="text-xs font-bold text-blue-600">{completed}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${completed}%` }} />
        </div>
      </div>

      {/* 100篇列表 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">王明的韩语之路 · 100篇目录</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">前10篇与99-100篇已上传音频，支持精准点读跟读</p>
          </div>
          <button onClick={() => setPage("courses")} className="text-xs text-blue-600 font-medium">全部 →</button>
        </div>

        <div className="space-y-1.5">
          {displayedLessons.map(lesson => {
            const hasAudio   = !!lesson.audioFile;
            const hasContent = lesson.script && lesson.script.length > 0;
            const isDone     = progress[lesson.id];

            return (
              <div key={lesson.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 border transition cursor-pointer group
                  ${hasContent
                    ? "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200"
                    : "bg-slate-50 border-slate-100 opacity-60"}`}
                onClick={() => { if (hasContent) { setActiveLesson(lesson); setPage("learn"); } }}
              >
                {/* 编号 */}
                <span className={`text-[11px] font-black w-6 flex-shrink-0 text-center
                  ${isDone ? "text-green-500" : hasContent ? "text-orange-400" : "text-slate-300"}`}>
                  {isDone ? "✓" : String(lesson.id).padStart(2, "0")}
                </span>

                {/* 标题 */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-snug truncate transition
                    ${hasContent ? "text-slate-800 group-hover:text-orange-600" : "text-slate-400"}`}>
                    {lesson.kr}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{lesson.cn}</p>
                </div>

                {/* 音频标签 */}
                {hasAudio ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded">🎧 音频</span>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <Icon name="lock" className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showAll && ALL_LESSONS.length > 15 && (
          <button onClick={() => setShowAll(true)}
            className="w-full mt-3 py-3 border-2 border-dashed border-orange-200 rounded-xl text-orange-500 text-xs font-bold hover:bg-orange-50 transition">
            展开全部 100 篇目录 ↓
          </button>
        )}
        {showAll && (
          <button onClick={() => setShowAll(false)}
            className="w-full mt-3 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition">
            收起目录 ↑
          </button>
        )}
      </div>
    </div>
  );
}

// ─── COURSES PAGE ─────────────────────────────
function CoursesPage({ setPage, setActiveLesson, progress }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("全部");
  const filters = ["全部", "已上传音频", "未开放"];

  const filtered = ALL_LESSONS.filter(l => {
    const matchSearch = l.kr.includes(search) || l.cn.includes(search);
    const matchFilter = filter === "全部"
      ? true
      : filter === "已上传音频" ? !!l.audioFile
      : !l.audioFile;
    return matchSearch && matchFilter;
  });

  return (
    <div className="pb-4">
      <div className="sticky top-0 bg-white z-40 px-5 pt-4 pb-3 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-0.5">王明的韩语之路</h2>
        <p className="text-xs text-slate-400 mb-3">100篇全程大纲 · 快速搜索检索</p>
        <div className="relative mb-3">
          <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="搜索韩文、中文关键词..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition
                ${filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-2">
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">没有找到相关课程</div>}
        {filtered.map(lesson => {
          const hasAudio   = !!lesson.audioFile;
          const hasContent = lesson.script && lesson.script.length > 0;
          const isDone     = progress[lesson.id];

          return (
            <div key={lesson.id}
              className={`flex items-center gap-3 rounded-2xl p-3 border transition
                ${hasContent ? "bg-white border-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-200" : "bg-slate-50 border-slate-100 opacity-50"}`}
              onClick={() => { if (hasContent) { setActiveLesson(lesson); setPage("learn"); } }}
            >
              {/* 编号徽章 */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black
                ${isDone ? "bg-green-100 text-green-600" : hasAudio ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-300"}`}>
                {isDone ? "✓" : String(lesson.id).padStart(2, "0")}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{lesson.kr}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400">{lesson.cn}</span>
                  {hasAudio && <span className="text-[9px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded">🎧 有音频</span>}
                  {isDone   && <span className="text-[9px] bg-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded">✓ 已学</span>}
                </div>
              </div>

              {!hasContent && <Icon name="lock" className="w-4 h-4 text-slate-300 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LEARN PAGE (核心音频跟读交互引擎) ───────────────────────────
function LearnPage({ lesson, setPage, onComplete, progress }) {
  const [tab, setTab]             = useState("script");
  const [dictMode, setDictMode]   = useState(false);
  
  // 跟读模式状态
  const [followMode, setFollowMode] = useState(false);
  const [followLine, setFollowLine] = useState(0);
  const [followStep, setFollowStep] = useState("listen"); // listen -> repeat
  const [followCount, setFollowCount] = useState(0);

  const [revealed, setRevealed]   = useState({});
  const [activeLine, setActiveLine] = useState(-1);
  const [notes, setNotes]         = useState(() => load(NOTES_STORE_KEY, {}));
  const [noteText, setNoteText]   = useState("");
  const [vocab, setVocab]         = useState(() => load(VOCAB_STORE_KEY, []));
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1.0); // 语速控制

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [checked, setChecked] = useState({}); 
  
  // 自定义通知弹窗状态，替代浏览器原生 alert
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const done = progress[lesson?.id];

  // 音频定时检测，用于普通播放高亮
  const [currentTime, setCurrentTime] = useState(0);

  // 初始化重置
  useEffect(() => {
    setActiveLine(-1); 
    setRevealed({});
    setFollowLine(0); 
    setFollowStep("listen"); 
    setFollowMode(false); 
    setFollowCount(0);
    setIsAudioPlaying(false);
    setUserInputs({}); 
    setChecked({});
    setRecordedUrl(null);
    if (audioRef.current) { 
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
      audioRef.current.playbackRate = playSpeed;
    }
  }, [lesson?.id]);

  // 监听语速改变
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playSpeed;
    }
  }, [playSpeed]);

  // 实时同步音频播放进度，完美高亮当前行
  const handleTimeUpdate = () => {
    if (!audioRef.current || !lesson?.script) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    // 根据有无 start/end 进行时间线匹配高亮
    const matchedIdx = lesson.script.findIndex(item => {
      if (item.start !== undefined && item.end !== undefined) {
        return cur >= item.start && cur <= item.end;
      }
      return false;
    });

    if (matchedIdx !== -1) {
      setActiveLine(matchedIdx);
    }
  };

  // 单句点击精细播放
  const playSentence = (index) => {
    if (!audioRef.current || !lesson?.script?.[index]) return;
    const audio = audioRef.current;
    const line = lesson.script[index];

    setActiveLine(index);
    
    if (line.start !== undefined && line.end !== undefined) {
      audio.currentTime = line.start;
      audio.play().catch(() => {});
      setIsAudioPlaying(true);

      // 设置播放终点自动暂停逻辑
      const stopCheck = () => {
        if (audio.currentTime >= line.end) {
          audio.pause();
          setIsAudioPlaying(false);
          audio.ontimeupdate = handleTimeUpdate; // 还原全局同步监听
        }
      };
      audio.ontimeupdate = () => {
        handleTimeUpdate();
        stopCheck();
      };
    } else {
      // 无精确时间戳的退化处理
      const duration = audio.duration || 15;
      const seg = duration / lesson.script.length;
      audio.currentTime = index * seg;
      audio.play().catch(() => {});
      setIsAudioPlaying(true);
    }
  };

  // 音频总控制开关
  const toggleAudio = () => {
    if (!audioRef.current) return;
    // 每次播放恢复当前设置的语速
    audioRef.current.playbackRate = playSpeed;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.ontimeupdate = handleTimeUpdate; // 还原默认同步
      audioRef.current.play().catch(err => console.warn('播放失败:', err));
      setIsAudioPlaying(true);
    }
  };

  // ─── 录音及麦克风模块 ───
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordedUrl(null);
    } catch (err) {
      showToast("请在系统或浏览器设置中允许网页麦克风录音权限哦 🎤");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ─── 跟读流程驱动 ───
  useEffect(() => {
    if (!followMode || followStep !== "listen" || !audioRef.current) return;
    const audio = audioRef.current;
    const currentLineData = lesson.script[followLine];
    if (!currentLineData) return;

    const runListenStep = () => {
      audio.playbackRate = playSpeed;
      if (currentLineData.start !== undefined) {
        audio.currentTime = currentLineData.start;
        audio.play().catch(() => {});
        audio.ontimeupdate = () => {
          if (audio.currentTime >= currentLineData.end) {
            audio.pause();
            audio.ontimeupdate = null;
          }
        };
      } else {
        const seg = (audio.duration || 10) / lesson.script.length;
        audio.currentTime = followLine * seg;
        audio.play().catch(() => {});
        audio.ontimeupdate = () => {
          if (audio.currentTime >= (followLine + 1) * seg) {
            audio.pause();
            audio.ontimeupdate = null;
          }
        };
      }
    };

    if (audio.readyState >= 1) runListenStep();
    else audio.onloadedmetadata = runListenStep;

    return () => { audio.pause(); audio.ontimeupdate = null; };
  }, [followLine, followStep, followMode]);

  const nextFollowStep = () => {
    if (followStep === "listen") {
      setFollowStep("repeat");
    } else {
      const nextCount = followCount + 1;
      if (nextCount >= 2) {
        if (followLine < (lesson.script.length - 1)) {
          setFollowLine(l => l + 1);
          setFollowStep("listen");
          setFollowCount(0);
          setRecordedUrl(null);
        } else {
          setFollowStep("done");
          onComplete(lesson.id);
        }
      } else {
        setFollowCount(nextCount);
        setRecordedUrl(null);
      }
    }
  };

  // ─── 笔记生词 ───
  const saveNote = () => {
    if (!noteText.trim() || !lesson) return;
    const updated = { ...notes, [lesson.id]: [...(notes[lesson.id] || []), { text: noteText, time: new Date().toLocaleString() }] };
    setNotes(updated); save(NOTES_STORE_KEY, updated); setNoteText("");
    showToast("📝 笔记保存成功！");
  };

  const deleteNote = (idx) => {
    const updated = { ...notes, [lesson.id]: notes[lesson.id].filter((_, i) => i !== idx) };
    setNotes(updated); save(NOTES_STORE_KEY, updated);
    showToast("🗑️ 笔记已删除");
  };

  const addVocab = (word) => {
    const cleanWord = word.replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "");
    if (vocab.find(v => v.word === cleanWord)) return;
    const updated = [...vocab, { word: cleanWord, addedAt: new Date().toLocaleDateString(), lessonId: lesson.id }];
    setVocab(updated); save(VOCAB_STORE_KEY, updated);
    showToast(`⭐ 已将生词 "${cleanWord}" 添加到生词本！`);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* 自定义 UI Toast 提示层 */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/50 flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* 课文主图/封面 */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 relative px-5 pt-4 pb-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-500/20">
              第 {lesson.id} 篇
            </span>
            <h2 className="text-white font-bold text-lg mt-2.5 leading-tight">{lesson.kr}</h2>
            <p className="text-slate-400 text-xs mt-1">{lesson.cn}</p>
            {done && <p className="text-green-400 text-xs font-bold mt-2 flex items-center gap-1"><Icon name="check" className="w-3.5 h-3.5" />已掌握此课</p>}
          </div>

          {/* 音频大脑组件 */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            {lesson.audioFile ? (
              <>
                <audio ref={audioRef} src={lesson.audioFile} preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => { setIsAudioPlaying(false); onComplete(lesson.id); }}
                  onPlay={() => setIsAudioPlaying(true)}
                  onPause={() => setIsAudioPlaying(false)} />
                
                <button onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition duration-300 transform active:scale-95
                    ${isAudioPlaying ? "bg-orange-500 text-white animate-pulse" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  <Icon name={isAudioPlaying ? "pause" : "play"} className="w-5 h-5" />
                </button>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {isAudioPlaying ? "播音中" : "整篇播放"}
                </span>
              </>
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center opacity-40">
                <Icon name="volume" className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* 语速选择面板 */}
        {lesson.audioFile && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
            <span className="text-[10px] text-slate-400 font-bold">调节语速 SPEED:</span>
            <div className="flex gap-1.5">
              {[0.8, 1.0, 1.2, 1.5].map(s => (
                <button key={s} onClick={() => setPlaySpeed(s)}
                  className={`text-[10px] font-black px-2 py-1 rounded transition
                    ${playSpeed === s ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                  {s.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 交互核心 Tabs */}
      <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10">
        {[["script","台词跟读"],["notes","学习笔记本"],["vocab","课后生词"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2
              ${tab === id ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── 台词/跟读 Tab ── */}
      {tab === "script" && (
        <div className="flex-1 overflow-y-auto">
          {/* 学习模式快捷切换 */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <button onClick={() => { setFollowMode(false); setDictMode(false); setRevealed({}); }}
              className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-bold py-2 rounded-lg transition
                ${!followMode && !dictMode ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
              <Icon name="eye" className="w-3.5 h-3.5" /> 逐句精读
            </button>
            <button onClick={() => { setFollowMode(false); setDictMode(d => !d); setRevealed({}); }}
              className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-bold py-2 rounded-lg transition
                ${dictMode ? "bg-purple-600 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
              <Icon name="eyeOff" className="w-3.5 h-3.5" /> 听音默写
            </button>
            <button onClick={() => { setFollowMode(true); setFollowLine(0); setFollowStep("listen"); setFollowCount(0); }}
              className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-bold py-2 rounded-lg transition
                ${followMode ? "bg-green-600 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
              <Icon name="mic" className="w-3.5 h-3.5" /> 智能跟读
            </button>
          </div>

          {/* ── 模式 A: 智能跟读 ── */}
          {followMode && (
            <div className="p-4">
              {followStep === "done" ? (
                <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">跟读大满贯！</h3>
                  <p className="text-sm text-slate-500 mb-5">第 {lesson.id} 篇完美跟读学习完毕</p>
                  <button onClick={() => setFollowMode(false)} className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md">返回逐句精读</button>
                </div>
              ) : (
                <>
                  {/* 进度控制指示器 */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-slate-400 font-mono">跟读段落: {followLine + 1} / {lesson.script.length}</span>
                    <div className="flex gap-1">
                      {lesson.script.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300
                          ${i < followLine ? "bg-green-500" : i === followLine ? "bg-blue-500 w-4" : "bg-slate-200"}`} />
                      ))}
                    </div>
                  </div>

                  {/* 核心台词跟读卡片 */}
                  <div className={`rounded-2xl p-5 mb-4 text-center border-2 transition-all duration-300 shadow-sm
                    ${followStep === "listen" ? "bg-blue-50/60 border-blue-200" : "bg-green-50/60 border-green-200"}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-3
                      ${followStep === "listen" ? "text-blue-500" : "text-green-600"}`}>
                      {followStep === "listen" ? "👂 请先仔细倾听示范音频..." : `🎤 大声跟读录音 (${followCount + 1} / 2)`}
                    </p>
                    <p className="text-lg font-extrabold text-slate-900 leading-relaxed mb-2">
                      {lesson.script[followLine].kr}
                    </p>
                    <p className="text-xs text-slate-500">{lesson.script[followLine].cn}</p>
                  </div>

                  {/* 录音与下一步控制器 */}
                  {followStep === "repeat" ? (
                    <div className="space-y-3">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300
                          ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-green-600 hover:bg-green-700 text-white"}`}>
                        <Icon name="mic" className="w-4 h-4" />
                        {isRecording ? "正在录音... 点击停止" : "启动跟读录音"}
                      </button>
                      
                      {recordedUrl && (
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                          <p className="text-[10px] text-slate-400 mb-2 font-bold">你的原声回放：</p>
                          <audio src={recordedUrl} controls className="w-full h-8 mb-2.5" />
                          <button onClick={nextFollowStep}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">
                            录音完成，下一句 →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button onClick={nextFollowStep}
                      className="w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 bg-blue-600 text-white shadow-lg active:scale-98 transition-all">
                      <Icon name="volume" className="w-4 h-4" /> 听完了，我也来读 →
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── 模式 B: 逐句精读 与 听音默写 ── */}
          {!followMode && (
            <div className="p-3 space-y-2">
              {lesson.script.map((line, i) => (
                <div key={i} onClick={() => playSentence(i)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border-l-4 shadow-sm
                    ${activeLine === i 
                      ? "bg-blue-50/80 border-blue-600 scale-[1.01]" 
                      : "bg-white border-transparent hover:bg-slate-50"}`}>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {/* 拆分点击单词生词本 */}
                        <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                          {line.kr.split(" ").map((word, wi) => (
                            <span key={wi}
                              onClick={e => { e.stopPropagation(); addVocab(word); }}
                              className={`inline-block mr-1 rounded transition px-0.5 hover:bg-orange-100 hover:text-orange-700
                                ${dictMode && !revealed[`${i}-${wi}`] ? "bg-slate-200 text-transparent select-none" : ""}`}
                              onDoubleClick={() => setRevealed(r => ({ ...r, [`${i}-${wi}`]: true }))}>
                              {word}
                            </span>
                          ))}
                        </p>
                        
                        {(!dictMode || revealed[`${i}-all`]) && (
                          <p className="text-xs text-slate-500 mt-1.5">{line.cn}</p>
                        )}
                        
                        {dictMode && !revealed[`${i}-all`] && (
                          <button onClick={e => { e.stopPropagation(); setRevealed(r => ({ ...r, [`${i}-all`]: true })); }}
                            className="text-[10px] text-blue-500 font-bold mt-1.5 underline block">查看原句对照</button>
                        )}
                      </div>
                      
                      <span className="text-slate-300 text-[10px] font-mono font-black">{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    {/* 听写默写校验面板 */}
                    {dictMode && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-100/80 space-y-2" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <input
                            value={userInputs[i] || ""}
                            onChange={e => setUserInputs(u => ({ ...u, [i]: e.target.value }))}
                            placeholder="输入你听到的韩语拼写..."
                            className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          <button
                            onClick={() => setChecked(c => ({ ...c, [i]: true }))}
                            className="text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold">
                            校对
                          </button>
                        </div>
                        
                        {checked[i] && (
                          <p className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${
                            userInputs[i]?.trim().replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "") === line.kr.trim().replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "")
                              ? "bg-green-100 text-green-600" : "bg-red-50 text-red-500"}`}>
                            {userInputs[i]?.trim().replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "") === line.kr.trim().replace(/[.,?/#!$%^&*;:{}=\-_`~()]/g, "") 
                              ? "✓ 拼写正确！听力非常完美" 
                              : `✘ 答案不符。参考: ${line.kr}`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 笔记 Tab ── */}
      {tab === "notes" && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="写下你对本篇语法、固定搭配、生词的分析总结..." rows={3} />
            <div className="flex justify-end mt-2">
              <button onClick={saveNote} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow">保存笔记</button>
            </div>
          </div>
          
          {(notes[lesson.id] || []).length === 0 ? (
            <p className="text-center text-slate-400 text-xs py-8">本课尚未留下笔记，立刻写下你的第一条见解吧！</p>
          ) : (
            (notes[lesson.id] || []).map((n, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm mb-3">
                <p className="text-xs text-slate-800 leading-relaxed">{n.text}</p>
                <div className="flex justify-between items-center mt-2.5 border-t border-slate-50 pt-2">
                  <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                  <button onClick={() => deleteNote(i)} className="text-red-400 hover:text-red-600">
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── 生词 Tab ── */}
      {tab === "vocab" && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* 本课核心单词展示 */}
          {lesson.vocab && lesson.vocab.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-black text-slate-500 mb-2.5 uppercase tracking-wider">本课推荐核心词</p>
              <div className="grid grid-cols-2 gap-2">
                {lesson.vocab.map((v, i) => {
                  const parts = v.split(" ");
                  const kr = parts[0];
                  const cn = parts.slice(1).join(" ");
                  return (
                    <div key={i} className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5">
                      <p className="text-xs font-black text-slate-900">{kr}</p>
                      <p className="text-[10px] text-orange-700 mt-0.5">{cn}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 生词本收藏夹 */}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">我在本课收藏的单词</p>
            {vocab.filter(v => v.lessonId === lesson.id).length === 0 ? (
              <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[11px] text-slate-400">💡 提示: 轻轻点击上方台词里的任何韩文单词，即可自动同步到生词口袋！</p>
              </div>
            ) : (
              vocab.filter(v => v.lessonId === lesson.id).map((v, i) => (
                <div key={i} className="flex justify-between items-center bg-white border border-slate-100 rounded-xl p-3 shadow-sm mb-2">
                  <span className="text-xs font-bold text-slate-900">{v.word}</span>
                  <span className="text-[9px] text-slate-400 font-mono">收藏于: {v.addedAt}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUBSCRIBE PAGE ───────────────────────────
function SubscribePage({ isVip }) {
  const [plan, setPlan] = useState("yearly");
  const [showQR, setShowQR] = useState(false);
  const [qrType, setQrType] = useState("wechat");

  return (
    <div className="px-5 pb-4">
      {isVip && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <p className="text-sm font-bold text-blue-800">您已是尊贵的 VIP 会员</p>
            <p className="text-xs text-blue-600">全能年度方案 · 2027-04-01 到期</p>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 mb-6 text-center shadow-lg">
        <p className="text-4xl mb-2">👑</p>
        <h2 className="text-white font-black text-xl mb-1">TEco Lab VIP 畅听卡</h2>
        <p className="text-slate-400 text-xs mt-1">解锁全部 100 篇高质量韩语精品播客</p>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { id: "yearly",  label: "全能年度会员", price: "¥199", sub: "仅需 ¥16.6/月", tag: "最划算选择" },
          { id: "monthly", label: "标准月度会员", price: "¥28",  sub: "连续按月购买" },
        ].map(p => (
          <div key={p.id} onClick={() => setPlan(p.id)}
            className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300
              ${plan === p.id ? "border-blue-500 bg-blue-50/60 shadow" : "border-slate-200 bg-white"}`}>
            {p.tag && <span className="absolute -top-2 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.tag}</span>}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-900">{p.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.sub}</p>
              </div>
              <p className="text-lg font-black text-blue-600">{p.price}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowQR(true)}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-sm shadow-xl hover:bg-slate-800 transition active:scale-98">
        确认订阅 {plan === "yearly" ? "¥199 / 年" : "¥28 / 月"}
      </button>
      <p className="text-center text-[10px] text-slate-400 mt-3.5">支付支持随时取消，到期不产生无端自动续费扣款</p>

      {/* 收款二维码弹窗 */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl transition-all" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-black text-slate-900 text-center mb-4">扫码安全支付</h3>
            
            <div className="flex gap-2 mb-4">
              <button onClick={() => setQrType("wechat")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${qrType === "wechat" ? "bg-green-500 text-white" : "bg-slate-100 text-slate-600"}`}>微信支付</button>
              <button onClick={() => setQrType("alipay")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${qrType === "alipay" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"}`}>支付宝</button>
            </div>

            {qrType === "wechat" ? (
              <div className="relative">
                <img src="https://i.ibb.co/KpRK5ZRS/image.jpg" alt="微信收款码" className="w-full rounded-2xl border" />
                <p className="text-center text-[10px] text-green-600 font-bold mt-1">[微信支付快捷通道]</p>
              </div>
            ) : (
              <div className="relative">
                <img src="https://i.ibb.co/5gK1wr1P/image.jpg" alt="支付宝收款码" className="w-full rounded-2xl border" />
                <p className="text-center text-[10px] text-blue-600 font-bold mt-1">[支付宝快捷通道]</p>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-2.5 mt-3 text-center border">
              <p className="text-[10px] text-slate-500">付款后请截图您的账单，发送给官方客服开通正式学习权限：</p>
              <p className="text-xs text-blue-600 font-bold mt-1.5">客服微信：k-pod客服</p>
            </div>

            <button onClick={() => setShowQR(false)} className="w-full mt-4 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl active:bg-slate-200">完成付款并返回</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PERSONAL PAGE ────────────────────────────
function PersonalPage({ setPage, isVip, progress, vocab }) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [showRenewConfirm, setShowRenewConfirm] = useState(false);
  const completed  = Object.values(progress).filter(Boolean).length;
  const totalHours = Math.round(completed * 4 / 60 * 10) / 10;

  return (
    <div className="px-5 pb-4">
      {/* 个人资料卡 */}
      <div className="bg-slate-900 rounded-3xl p-5 mb-5 flex items-center gap-4 shadow-sm">
        <div className="w-14 h-14 rounded-full border-2 border-blue-500 overflow-hidden flex-shrink-0">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover bg-blue-100" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-base">王明</h2>
            {isVip && <span className="bg-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-full text-white uppercase">VIP</span>}
          </div>
          <p className="text-slate-400 text-xs mt-0.5">韩语之路 · 今日第 {completed + 1} 课备课中</p>
        </div>
      </div>

      {/* 个人核心数据 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[["完成学完", `${completed}/100`], ["总学时", `${totalHours} 小时`], ["生词口袋", vocab.length]].map(([l, v]) => (
          <div key={l} className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-base font-black text-slate-900">{v}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* 学完进度面板 */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-5">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-700">100篇精品课完成度</span>
          <span className="text-xs font-bold text-blue-600">{completed} / 100</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${completed}%` }} />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">加油！还剩下 {100 - completed} 节课完成王明的全部成长课</p>
      </div>

      {isVip ? (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-900">年度全能会员</p>
              <p className="text-xs text-slate-500 mt-0.5">到期时间: 2027-04-01</p>
            </div>
            <button onClick={() => setShowRenewConfirm(true)} className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm active:bg-blue-50">管理自动扣费</button>
          </div>
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5 text-center">
          <p className="text-sm font-bold text-orange-950">解锁王明全套 100 篇高品质音频与精准单句跟读</p>
          <button onClick={() => setPage("subscribe")} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl mt-3 shadow-md">现在订阅 VIP 会员</button>
        </div>
      )}

      {/* 功能菜单列表 */}
      <div className="bg-slate-50 rounded-2xl overflow-hidden mb-5">
        {[
          { icon: "book",    label: "生词收藏本",   sub: `${vocab.length} 个当前收藏生词` },
          { icon: "receipt", label: "我的购买账单",     sub: "查看我的付款开通记录" },
          { icon: "refresh", label: "续费服务状态", sub: autoRenew ? "已安全开启" : "已手动关闭", action: () => setShowRenewConfirm(true) },
          { icon: "settings",label: "技术反馈与客服",   sub: "有任何疑惑一键找客服" },
        ].map((item, i, arr) => (
          <button key={item.label} onClick={item.action}
            className={`w-full flex items-center justify-between p-4 hover:bg-slate-100/60 transition ${i < arr.length - 1 ? "border-b border-white" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Icon name={item.icon} className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700">{item.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
            <span className="text-slate-300 font-bold">›</span>
          </button>
        ))}
      </div>

      {showRenewConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowRenewConfirm(false)}>
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <h3 className="text-base font-black text-slate-900 mb-1">自动续费管理</h3>
            <p className="text-xs text-slate-400 mb-4">您可以自行关闭或打开续费功能：</p>
            
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 mb-5 border">
              <div>
                <p className="text-sm font-bold text-slate-900">到期后自动续费扣款</p>
                <p className="text-xs text-slate-500 mt-0.5">关闭后到期后将不会产生任何扣费</p>
              </div>
              <button onClick={() => setAutoRenew(r => !r)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoRenew ? "bg-blue-500" : "bg-slate-300"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${autoRenew ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
            
            <button onClick={() => setShowRenewConfirm(false)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm">保存并返回</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────
export default function App() {
  const [page, setPage]               = useState("home");
  const [activeLesson, setActiveLesson] = useState(null);
  const [isVip, setIsVip]             = useState(() => load(USER_KEY, {}).isVip || true); // 默认为开启VIP模式以直接畅听所有功能
  const [progress, setProgress]       = useState(() => load(PROGRESS_KEY, {}));
  const [vocab, setVocab]             = useState(() => load(VOCAB_STORE_KEY, []));

  useEffect(() => { 
    setVocab(load(VOCAB_STORE_KEY, [])); 
  }, [page]);

  const handleComplete = useCallback((lessonId) => {
    setProgress(p => {
      const updated = { ...p, [lessonId]: true };
      save(PROGRESS_KEY, updated);
      return updated;
    });
  }, []);

  const pageTitles = {
    home: "TEco Lab 韩语播客", 
    courses: "课程学习目录", 
    subscribe: "订阅中心",
    learn: activeLesson ? `第 ${activeLesson.id} 篇 · ${activeLesson.cn}` : "智能学习仓",
    personal: "个人中心"
  };

  const pageContent = () => {
    switch (page) {
      case "home":      return <HomePage      setPage={setPage} setActiveLesson={setActiveLesson} progress={progress} />;
      case "courses":   return <CoursesPage   setPage={setPage} setActiveLesson={setActiveLesson} progress={progress} />;
      case "subscribe": return <SubscribePage isVip={isVip} />;
      case "learn":     return <LearnPage     lesson={activeLesson} setPage={setPage} onComplete={handleComplete} progress={progress} />;
      case "personal":  return <PersonalPage  setPage={setPage} isVip={isVip} progress={progress} vocab={vocab} />;
      default:          return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Noto Sans SC', sans-serif", background: "#F1F5F9", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      
      <div className="max-w-[480px] mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col">
        {/* 页头栏 */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {page !== "home" && (
              <button onClick={() => page === "learn" ? setPage("courses") : setPage("home")} className="text-slate-600 transition hover:text-slate-900 mr-1">
                <Icon name="back" className="w-5 h-5" />
              </button>
            )}
            {page === "home" ? (
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-950">TEco</span>
                <span className="text-lg font-black text-blue-600">Lab</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">韩语播客</span>
              </div>
            ) : (
              <h1 className="text-sm font-black text-slate-900 truncate max-w-[200px]">{pageTitles[page]}</h1>
            )}
          </div>
          
          <button onClick={() => setPage("personal")} className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 transition hover:border-blue-400">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full bg-blue-50" />
          </button>
        </header>

        {/* 内容加载显示 */}
        <div className="flex-1 overflow-y-auto pb-24 pt-2">
          {pageContent()}
        </div>

        {/* 底部导航 */}
        <BottomNav page={page} setPage={setPage} />
      </div>
    </div>
  );
}
