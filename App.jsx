import './index.css'
import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const COURSES = [
  {
    id: 1, level: "Level 1", levelColor: "orange", title: "首尔旅行必备地铁韩语",
    duration: "12:15", listeners: "1.8k", cover: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80",
    tags: ["入门", "旅行"], description: "学会在首尔地铁中问路、买票、找站台的实用韩语表达。",
    script: [
      { kr: "안녕하세요, 지하철 타는 곳이 어디예요?", cn: "你好，请问地铁在哪里坐？" },
      { kr: "2호선을 타고 싶어요.", cn: "我想乘坐2号线。" },
      { kr: "이 역에서 몇 정거장이에요?", cn: "从这一站到那里要几站？" },
      { kr: "환승역이 어디예요?", cn: "换乘站在哪里？" },
      { kr: "감사합니다!", cn: "谢谢！" },
    ]
  },
  {
    id: 2, level: "Level 3", levelColor: "blue", title: "市场营销专家的品牌战略访谈",
    duration: "18:40", listeners: "2.4k", cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
    tags: ["中级", "商务"], description: "深度对话韩国顶级品牌营销人，学习商务场合的专业韩语。",
    script: [
      { kr: "브랜드 전략에 대해 이야기해 주세요.", cn: "请谈谈关于品牌战略的内容。" },
      { kr: "소비자 심리를 이해하는 것이 중요합니다.", cn: "理解消费者心理非常重要。" },
      { kr: "시장 조사를 철저히 해야 합니다.", cn: "必须进行深入的市场调查。" },
      { kr: "경쟁사 분석도 필수적이에요.", cn: "竞争对手分析也是必不可少的。" },
    ]
  },
  {
    id: 3, level: "Level 2", levelColor: "green", title: "韩国美食文化深度体验",
    duration: "15:30", listeners: "3.1k", cover: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80",
    tags: ["初级", "生活"], description: "从街边小吃到高级料理，用韩语探索韩国饮食文化。",
    script: [
      { kr: "이 음식은 뭐예요?", cn: "这是什么食物？" },
      { kr: "맵지 않게 해 주세요.", cn: "请做得不辣一点。" },
      { kr: "정말 맛있어요!", cn: "真的很好吃！" },
      { kr: "계산서 주세요.", cn: "请给我账单。" },
    ]
  },
  {
    id: 4, level: "Level 4", levelColor: "purple", title: "TOPIK II 词汇强化训练",
    duration: "22:00", listeners: "1.2k", cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    tags: ["高级", "考试"], description: "系统学习TOPIK II核心词汇，攻克韩语能力考试。",
    script: [
      { kr: "어휘력을 늘리는 것이 중요합니다.", cn: "扩大词汇量非常重要。" },
      { kr: "매일 꾸준히 공부해야 합니다.", cn: "必须每天坚持学习。" },
      { kr: "반복 학습이 효과적입니다.", cn: "反复学习是有效的。" },
    ]
  },
  {
    id: 5, level: "Level 2", levelColor: "pink", title: "韩剧台词学习：经典浪漫场景",
    duration: "14:20", listeners: "5.6k", cover: "https://images.unsplash.com/photo-1616353071855-2c045c4587a7?w=400&q=80",
    tags: ["初级", "娱乐"], description: "通过经典韩剧名场面，轻松学习日常韩语对话。",
    script: [
      { kr: "사랑해요.", cn: "我爱你。" },
      { kr: "보고 싶었어요.", cn: "我很想你。" },
      { kr: "당신이 최고예요.", cn: "你是最棒的。" },
      { kr: "함께 있어 주세요.", cn: "请陪着我。" },
    ]
  },
  {
    id: 6, level: "Level 3", levelColor: "blue", title: "职场韩语：会议与汇报",
    duration: "20:10", listeners: "980", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    tags: ["中级", "商务"], description: "掌握韩国职场中开会、汇报和沟通的专业表达方式。",
    script: [
      { kr: "회의를 시작하겠습니다.", cn: "我们开始会议。" },
      { kr: "보고서를 준비했습니다.", cn: "我准备好了报告。" },
      { kr: "질문 있으시면 말씀해 주세요.", cn: "如有问题请提出。" },
    ]
  },
];

const VOCAB_STORE_KEY = "teco_vocab";
const NOTES_STORE_KEY = "teco_notes";
const PROGRESS_KEY = "teco_progress";
const USER_KEY = "teco_user";

const levelColors = {
  orange: { bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", badge: "bg-green-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", badge: "bg-purple-100" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", badge: "bg-pink-100" },
};

// ─────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────
const load = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ─────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    course: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    crown: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l3.5 7L12 4l3.5 6L21 3l-2 14H5L3 3z" />,
    headphones: <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3zm14-3h-1a2 2 0 00-2 2v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    eye: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
    eyeOff: <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    receipt: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

// ─────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "首页", icon: "home" },
  { id: "courses", label: "课程", icon: "course" },
  { id: "subscribe", label: "订阅", icon: "crown" },
  { id: "learn", label: "学习", icon: "headphones" },
  { id: "personal", label: "我的", icon: "user" },
];

function BottomNav({ page, setPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/95 backdrop-blur border-t border-slate-100 px-2 py-2 flex justify-between items-center z-50 shadow-xl">
      {NAV_ITEMS.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${page === n.id ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-700"}`}>
          <Icon name={n.icon} className="w-5 h-5" />
          <span className={`text-[10px] font-semibold`}>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function HomePage({ setPage, setActiveCourse, progress }) {
  const featured = COURSES.slice(0, 3);
  const recent = COURSES.slice(3, 6);

  return (
    <div className="px-5 pb-4">
      {/* Hero */}
      <div className="bg-slate-900 rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/20 rounded-full translate-y-6 -translate-x-4" />
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">每日学习</p>
        <h2 className="text-white text-xl font-bold leading-tight mb-1">用韩语对话，<br/>开启新世界</h2>
        <p className="text-slate-400 text-xs mb-4">今日已有 <span className="text-white font-bold">1,234</span> 人完成了学习</p>
        <button onClick={() => { setActiveCourse(COURSES[0]); setPage("learn"); }}
          className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">
          <Icon name="play" className="w-4 h-4" /> 继续学习
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "已学天数", val: Object.keys(progress).length || 1 },
          { label: "完成课时", val: Object.values(progress).filter(Boolean).length },
          { label: "学习时长", val: `${Math.round(Object.values(progress).filter(Boolean).length * 15)}m` },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-lg font-black text-slate-900">{s.val}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900">精选课程</h3>
          <button onClick={() => setPage("courses")} className="text-xs text-blue-600 font-medium">全部 →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {featured.map(c => {
            const col = levelColors[c.levelColor];
            return (
              <div key={c.id} onClick={() => { setActiveCourse(c); setPage("learn"); }}
                className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition">
                <div className="h-24 overflow-hidden">
                  <img src={c.cover} alt={c.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <span className={`text-[9px] font-bold uppercase ${col.text} ${col.badge} px-1.5 py-0.5 rounded`}>{c.level}</span>
                  <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-2 leading-snug">{c.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{c.duration}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">最新上线</h3>
        <div className="space-y-3">
          {recent.map(c => {
            const col = levelColors[c.levelColor];
            const done = progress[c.id];
            return (
              <div key={c.id} onClick={() => { setActiveCourse(c); setPage("learn"); }}
                className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={c.cover} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[9px] font-bold uppercase ${col.text} ${col.badge} px-1.5 py-0.5 rounded`}>{c.level}</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-2">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">{c.duration}</span>
                    {done && <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5"><Icon name="check" className="w-3 h-3" />已完成</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COURSE LIST PAGE
// ─────────────────────────────────────────────
function CoursesPage({ setPage, setActiveCourse, progress }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("全部");
  const filters = ["全部", "入门", "初级", "中级", "高级", "商务"];

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.includes(search) || c.description.includes(search);
    const matchFilter = filter === "全部" || c.tags.includes(filter);
    return matchSearch && matchFilter;
  });

  return (
    <div className="pb-4">
      <div className="sticky top-0 bg-white z-40 px-5 pt-4 pb-3 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-3">全部节目</h2>
        <div className="relative mb-3">
          <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="搜索课程..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition ${filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 mt-4 space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">没有找到相关课程</div>
        )}
        {filtered.map(c => {
          const col = levelColors[c.levelColor];
          const done = progress[c.id];
          return (
            <div key={c.id} onClick={() => { setActiveCourse(c); setPage("learn"); }}
              className="flex gap-4 cursor-pointer group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={c.cover} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                <div>
                  <span className={`text-[10px] font-bold uppercase ${col.text} ${col.badge} px-2 py-0.5 rounded`}>{c.level}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug">{c.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>⏱ {c.duration}</span>
                  <span>👥 {c.listeners}</span>
                  {done && <span className="text-green-600 font-bold">✓ 已完成</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LEARN / DETAIL PAGE
// ─────────────────────────────────────────────
function LearnPage({ course, setPage, onComplete, progress }) {
  const [tab, setTab] = useState("script");
  const [dictMode, setDictMode] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [notes, setNotes] = useState(() => load(NOTES_STORE_KEY, {}));
  const [noteText, setNoteText] = useState("");
  const [vocab, setVocab] = useState(() => load(VOCAB_STORE_KEY, []));
  const [wordModal, setWordModal] = useState(null);
  const [playTime, setPlayTime] = useState(0);
  const timerRef = useRef(null);
  const done = progress[course?.id];

  useEffect(() => {
    setActiveLine(0); setRevealed({}); setIsPlaying(false); setPlayTime(0);
    return () => clearInterval(timerRef.current);
  }, [course?.id]);

  const togglePlay = () => {
    if (!isPlaying) {
      timerRef.current = setInterval(() => {
        setPlayTime(t => t + 1);
        setActiveLine(l => {
          if (l < (course?.script.length - 1)) return l + 1;
          clearInterval(timerRef.current);
          setIsPlaying(false);
          onComplete(course.id);
          return l;
        });
      }, 2000);
    } else {
      clearInterval(timerRef.current);
    }
    setIsPlaying(p => !p);
  };

  const saveNote = () => {
    if (!noteText.trim() || !course) return;
    const key = course.id;
    const updated = { ...notes, [key]: [...(notes[key] || []), { text: noteText, time: new Date().toLocaleString() }] };
    setNotes(updated); save(NOTES_STORE_KEY, updated); setNoteText("");
  };

  const deleteNote = (idx) => {
    const key = course.id;
    const updated = { ...notes, [key]: notes[key].filter((_, i) => i !== idx) };
    setNotes(updated); save(NOTES_STORE_KEY, updated);
  };

  const addVocab = (word) => {
    if (vocab.find(v => v.word === word)) return;
    const updated = [...vocab, { word, addedAt: new Date().toLocaleString(), courseId: course.id }];
    setVocab(updated); save(VOCAB_STORE_KEY, updated);
  };

  if (!course) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3 px-8 text-center">
      <Icon name="headphones" className="w-12 h-12 text-slate-200" />
      <p className="text-sm">请从课程列表中选择一个课程开始学习</p>
      <button onClick={() => setPage("courses")} className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl">浏览课程</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Cover + Controls */}
      <div className="bg-slate-900 relative">
        <img src={course.cover} alt={course.title} className="w-full h-40 object-cover opacity-30" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="flex items-end justify-between">
            <div>
              <span className={`text-[10px] font-bold uppercase text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded`}>{course.level}</span>
              <h2 className="text-white font-bold text-base mt-1 leading-tight">{course.title}</h2>
              <p className="text-slate-400 text-xs mt-0.5">{course.duration} · {course.listeners} 人学习</p>
            </div>
            <button onClick={togglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition ${isPlaying ? "bg-white text-slate-900" : "bg-blue-600 text-white"}`}>
              <Icon name={isPlaying ? "pause" : "play"} className="w-5 h-5" />
            </button>
          </div>
          {done && (
            <div className="mt-2 flex items-center gap-1 text-green-400 text-xs font-bold">
              <Icon name="check" className="w-3 h-3" /> 已完成
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10">
        {[["script", "学习台词"], ["notes", "学习笔记"], ["vocab", "生词本"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${tab === id ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Script Tab */}
      {tab === "script" && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-b border-slate-100">
            <button onClick={() => { setDictMode(d => !d); setRevealed({}); }}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition ${dictMode ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-white text-slate-600 border-slate-200"}`}>
              <Icon name={dictMode ? "eyeOff" : "eye"} className="w-3.5 h-3.5" />
              {dictMode ? "听写模式 ON" : "听写模式"}
            </button>
            <span className="text-[10px] text-slate-400">点击单词加入生词本</span>
          </div>
          <div className="p-3 space-y-1">
            {course.script.map((line, i) => (
              <div key={i} onClick={() => setActiveLine(i)}
                className={`p-3 rounded-xl cursor-pointer transition border-l-4 ${activeLine === i ? "bg-blue-50 border-blue-500" : "bg-white border-transparent hover:bg-slate-50"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">
                      {line.kr.split(" ").map((word, wi) => (
                        <span key={wi} onClick={e => { e.stopPropagation(); setWordModal({ word, meaning: `${word}的中文释义` }); addVocab(word); }}
                          className={`inline-block mr-1 cursor-pointer rounded transition hover:text-blue-600 ${dictMode && !revealed[`${i}-${wi}`] ? "bg-slate-200 text-transparent select-none px-1" : ""}`}
                          onDoubleClick={() => setRevealed(r => ({ ...r, [`${i}-${wi}`]: true }))}>
                          {word}
                        </span>
                      ))}
                    </p>
                    {(!dictMode || revealed[`${i}-all`]) && (
                      <p className="text-xs text-slate-500 mt-1">{line.cn}</p>
                    )}
                    {dictMode && (
                      <button onClick={e => { e.stopPropagation(); setRevealed(r => ({ ...r, [`${i}-all`]: true })); }}
                        className="text-[10px] text-blue-500 mt-1 underline">显示译文</button>
                    )}
                  </div>
                  <span className="text-slate-300 text-xs font-mono flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {tab === "notes" && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="写下你的感悟..." rows={3} />
            <div className="flex justify-end mt-2">
              <button onClick={saveNote} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg">保存笔记</button>
            </div>
          </div>
          <div className="space-y-3">
            {(notes[course.id] || []).length === 0 && (
              <p className="text-center text-slate-400 text-sm py-8">还没有笔记，开始记录吧！</p>
            )}
            {(notes[course.id] || []).map((n, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                <p className="text-sm text-slate-800 leading-relaxed">{n.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                  <button onClick={() => deleteNote(i)} className="text-red-400 hover:text-red-600">
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocab Tab */}
      {tab === "vocab" && (
        <div className="flex-1 overflow-y-auto p-4">
          {vocab.filter(v => v.courseId === course.id).length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">点击台词中的单词添加到生词本</p>
          )}
          <div className="space-y-2">
            {vocab.filter(v => v.courseId === course.id).map((v, i) => (
              <div key={i} className="flex justify-between items-center bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                <span className="text-sm font-bold text-slate-900">{v.word}</span>
                <span className="text-[10px] text-slate-400">{v.addedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Word Modal */}
      {wordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" onClick={() => setWordModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-slate-900 mb-1">{wordModal.word}</h3>
            <p className="text-slate-500 text-sm mb-4">{wordModal.meaning}</p>
            <div className="flex gap-2">
              <button onClick={() => { addVocab(wordModal.word); setWordModal(null); }}
                className="flex-1 bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl">加入生词本</button>
              <button onClick={() => setWordModal(null)} className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2.5 rounded-xl">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUBSCRIBE PAGE
// ─────────────────────────────────────────────
function SubscribePage({ isVip, onSubscribe }) {
  const [plan, setPlan] = useState("yearly");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); onSubscribe(); }, 1500);
  };

  if (paid) return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Icon name="check" className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-1">支付成功</h2>
      <p className="text-slate-500 text-sm mb-6">感谢您的订阅，祝您学习愉快！</p>
      <div className="w-full bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
        {[["已购方案", plan === "yearly" ? "年度 VIP 订阅" : "月度 VIP 订阅"], ["实付金额", plan === "yearly" ? "¥199.00" : "¥28.00"], ["支付时间", new Date().toLocaleString()], ["订单编号", "TRX_" + Math.random().toString().slice(2, 12)]].map(([k, v]) => (
          <div key={k} className="flex justify-between items-center">
            <span className="text-slate-500 text-xs">{k}</span>
            <span className="text-slate-900 text-xs font-bold">{v}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full mb-4">
        {[["无限次收听", "🎧"], ["离线下载", "📥"], ["精编讲义", "📄"], ["专属社群", "👥"]].map(([t, e]) => (
          <div key={t} className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-3">
            <span className="text-lg">{e}</span>
            <span className="text-xs font-bold text-slate-700">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-5 pb-4">
      {isVip && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <p className="text-sm font-bold text-blue-800">您已是 VIP 会员</p>
            <p className="text-xs text-blue-600">年度会员方案 · 2027-04-01 到期</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 mb-6 text-center">
        <p className="text-4xl mb-2">👑</p>
        <h2 className="text-white font-black text-xl mb-1">TEco Lab VIP 会员</h2>
        <p className="text-slate-400 text-xs">解锁所有课程，开启沉浸式学习体验</p>
      </div>

      {/* Plan Selection */}
      <h3 className="text-sm font-bold text-slate-900 mb-3">选择方案</h3>
      <div className="space-y-3 mb-6">
        {[
          { id: "yearly", label: "年度会员", price: "¥199", sub: "约 ¥16.6/月", tag: "最受欢迎" },
          { id: "monthly", label: "月度会员", price: "¥28", sub: "按月续费" },
        ].map(p => (
          <div key={p.id} onClick={() => setPlan(p.id)}
            className={`relative border-2 rounded-2xl p-4 cursor-pointer transition ${plan === p.id ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}>
            {p.tag && <span className="absolute -top-2 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.tag}</span>}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-900">{p.label}</p>
                <p className="text-xs text-slate-500">{p.sub}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-blue-600">{p.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-6">
        <h4 className="text-xs font-bold text-slate-900 mb-3">会员权益</h4>
        <div className="grid grid-cols-2 gap-3">
          {[["🎧", "无限次收听全部课程"], ["📥", "离线下载随时学习"], ["📄", "精编讲义助力复习"], ["👥", "加入 VIP 专属社群"]].map(([e, t]) => (
            <div key={t} className="flex items-center gap-2">
              <span className="text-lg">{e}</span>
              <span className="text-xs text-slate-600">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handlePay} disabled={paying}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-sm shadow-lg hover:bg-slate-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
        {paying ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> 处理中...</> : `立即订阅 ${plan === "yearly" ? "¥199/年" : "¥28/月"}`}
      </button>
      <p className="text-center text-[10px] text-slate-400 mt-3">支持随时取消，到期不自动续费</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// PERSONAL PAGE
// ─────────────────────────────────────────────
function PersonalPage({ setPage, isVip, progress, vocab }) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [showRenewConfirm, setShowRenewConfirm] = useState(false);

  const completed = Object.values(progress).filter(Boolean).length;
  const totalHours = Math.round(completed * 15 / 60 * 10) / 10;

  return (
    <div className="px-5 pb-4">
      {/* Profile Card */}
      <div className="bg-slate-900 rounded-3xl p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full border-2 border-blue-500 overflow-hidden flex-shrink-0">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover bg-blue-100" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-white font-bold text-base">韩语学习者_01</h2>
            {isVip && <span className="bg-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-full text-white uppercase">VIP 会员</span>}
          </div>
          <p className="text-slate-400 text-xs mt-0.5">2026-04-01 加入</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[["已学天数", Math.max(1, completed)], ["完成课时", completed], ["学习时长", `${totalHours}h`]].map(([l, v]) => (
          <div key={l} className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-lg font-black text-slate-900">{v}</p>
            <p className="text-[10px] text-slate-400">{l}</p>
          </div>
        ))}
      </div>

      {/* VIP Status */}
      {isVip && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-bold text-slate-900">年度会员方案</p>
              <p className="text-xs text-slate-500">2027-04-01 到期</p>
            </div>
            <button onClick={() => setShowRenewConfirm(true)}
              className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200">管理续费</button>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-700">
            <Icon name="info" className="w-3 h-3" />
            <span>自动续费已{autoRenew ? "开启" : "关闭"}，将于 2027-04-01 扣款</span>
          </div>
        </div>
      )}

      {!isVip && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-center">
          <p className="text-sm text-slate-600 mb-2">订阅 VIP 解锁全部课程</p>
          <button onClick={() => setPage("subscribe")} className="bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-xl">立即订阅</button>
        </div>
      )}

      {/* Progress */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">学习进度</h3>
        <div className="space-y-3">
          {COURSES.slice(0, 3).map(c => (
            <div key={c.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</p>
                <span className="text-xs text-blue-600 font-bold">{progress[c.id] ? "100%" : "0%"}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: progress[c.id] ? "100%" : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-slate-50 rounded-2xl overflow-hidden">
        {[
          { icon: "receipt", label: "订单历史", sub: "查看购买记录" },
          { icon: "book", label: "我的生词本", sub: `${vocab.length} 个单词` },
          { icon: "refresh", label: "自动续费设置", sub: autoRenew ? "已开启" : "已关闭" },
          { icon: "settings", label: "帮助与支持", sub: "联系客服" },
        ].map((item, i, arr) => (
          <button key={item.label} onClick={() => item.label === "自动续费设置" && setShowRenewConfirm(true)}
            className={`w-full flex items-center justify-between p-4 hover:bg-slate-100 transition ${i < arr.length - 1 ? "border-b border-white" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Icon name={item.icon} className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-[10px] text-slate-400">{item.sub}</p>
              </div>
            </div>
            <span className="text-slate-300">›</span>
          </button>
        ))}
      </div>

      {/* Auto Renew Modal */}
      {showRenewConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 pb-0" onClick={() => setShowRenewConfirm(false)}>
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">自动续费管理</h3>
            <p className="text-xs text-slate-500 mb-4">年度 VIP · ¥199/年 · 下次扣款：2027-04-01</p>
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-slate-900">自动续费</p>
                <p className="text-xs text-slate-500">关闭后到期不再自动续费</p>
              </div>
              <button onClick={() => setAutoRenew(r => !r)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoRenew ? "bg-blue-500" : "bg-slate-300"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoRenew ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
            {!autoRenew && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4">
                <p className="text-xs text-orange-700">取消自动续费后，您在当前有效期内仍可享受所有权益。</p>
              </div>
            )}
            <button onClick={() => setShowRenewConfirm(false)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">确认</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [activeCourse, setActiveCourse] = useState(null);
  const [isVip, setIsVip] = useState(() => load(USER_KEY, {}).isVip || false);
  const [progress, setProgress] = useState(() => load(PROGRESS_KEY, {}));
  const [vocab, setVocab] = useState(() => load(VOCAB_STORE_KEY, []));

  // Sync vocab from storage when relevant
  useEffect(() => { setVocab(load(VOCAB_STORE_KEY, [])); }, [page]);

  const handleComplete = useCallback((courseId) => {
    setProgress(p => {
      const updated = { ...p, [courseId]: true };
      save(PROGRESS_KEY, updated);
      return updated;
    });
  }, []);

  const handleSubscribe = useCallback(() => {
    setIsVip(true);
    save(USER_KEY, { isVip: true });
  }, []);

  const pageContent = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setActiveCourse={setActiveCourse} progress={progress} />;
      case "courses": return <CoursesPage setPage={setPage} setActiveCourse={setActiveCourse} progress={progress} />;
      case "subscribe": return <SubscribePage isVip={isVip} onSubscribe={handleSubscribe} />;
      case "learn": return <LearnPage course={activeCourse} setPage={setPage} onComplete={handleComplete} progress={progress} />;
      case "personal": return <PersonalPage setPage={setPage} isVip={isVip} progress={progress} vocab={vocab} />;
      default: return null;
    }
  };

  const pageTitles = { home: "TEco Lab", courses: "全部节目", subscribe: "订阅会员", learn: activeCourse?.title || "学习", personal: "个人中心" };

  return (
    <div style={{ fontFamily: "'Noto Sans SC', sans-serif", background: "#F1F5F9", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <div className="max-w-[480px] mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100 px-5 py-3 flex items-center gap-3">
          {(page !== "home") && (
            <button onClick={() => page === "learn" ? setPage("courses") : setPage("home")} className="text-slate-600">
              <Icon name="back" className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            {page === "home" ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">TEco</span>
                <span className="text-lg font-black text-blue-600">Lab</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">韩语播客</span>
              </div>
            ) : (
              <h1 className="text-base font-bold text-slate-900 truncate">{pageTitles[page]}</h1>
            )}
          </div>
          {page === "home" && (
            <button onClick={() => setPage("personal")} className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full bg-blue-50" />
            </button>
          )}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pb-20 pt-4">
          {pageContent()}
        </div>

        <BottomNav page={page} setPage={setPage} />
      </div>
    </div>
  );
}
