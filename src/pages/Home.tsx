import {
  ArrowRight,
  Coffee,
  Flag,
  Gauge,
  MapPinned,
  Mountain,
  NotebookPen,
  Printer,
  Route,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const scenarios = [
  {
    title: "爬坡段",
    description: "坡還有多長？預先標記爬坡段，慢慢龜5K，下坡段不用猜。",
    icon: Mountain,
  },
  {
    title: "補給點",
    description: "抓穩水分與能量補給的最佳時機，避免餓著肚子打仗。",
    icon: Coffee,
  },
  {
    title: "篩選",
    description: "預先紀錄拉扯段，先有心理準備，才不會被嚇到掉隊。",
    icon: Gauge,
  },
  {
    title: "號碼與筆記",
    description: "紀錄隊友、對手號碼和關鍵提醒，賽前免考試。",
    icon: Users,
  },
];

const methodSteps = [
  {
    title: "匯入路線",
    description: "先把活動或挑戰賽路線放進來，從同一條路線開始排策略。",
    icon: Route,
  },
  {
    title: "對照地圖與等高線",
    description: "看哪裡開始變難，哪裡可能拉扯，哪裡適合提早準備卡位。",
    icon: MapPinned,
  },
  {
    title: "記下戰術重點",
    description: "把攻擊、篩選、補給、號碼與提醒，留在真正有用的位置。",
    icon: NotebookPen,
  },
  {
    title: "輸出帶上路",
    description: "整理好的內容可以輸出成賽前小抄，帶上路也看得到。",
    icon: Printer,
  },
];

export default function Home() {
  return (
    <div className="terrain-page relative overflow-x-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 2600"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M1060 0C1180 160 1220 260 1138 372C1045 500 882 530 838 655C783 808 970 900 913 1085C860 1258 667 1284 604 1456C543 1622 682 1718 630 1886C593 2004 487 2078 436 2208C404 2289 408 2440 494 2600"
          stroke="#1c8bb8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 16"
          opacity="0.75"
        />
        <path
          d="M782 0C844 124 874 226 806 312C736 401 574 430 525 552C479 667 596 746 558 886C516 1042 342 1081 298 1220C246 1383 351 1492 322 1668C297 1821 190 1881 154 2038C124 2167 171 2440 260 2600"
          stroke="#d93b33"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.46"
        />
      </svg>

      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-144 bg-[radial-gradient(circle_at_top_right,rgba(28,139,184,0.18),transparent_26%),radial-gradient(circle_at_top_left,rgba(170,162,76,0.12),transparent_22%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-[#d7e7ee] bg-[#e9f4f8] px-4 py-2 text-sm font-semibold text-[#157ca4] shadow-sm">
              比賽備註，未雨綢繆
            </p>
            <h1 className="font-display max-w-3xl text-5xl leading-[1.02] font-black tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
              把賽前想的，
              <br />
              先寫下來吧。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600 sm:text-xl">
              補給點、登山點、攻擊點、卡位時機
            </p>
            <p className="max-w-xl text-lg leading-8 text-stone-600 sm:text-xl">
              VELOCUE 是獻給自行車愛好者的筆記工具
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/editor"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-green-900 bg-green-800 px-6 py-3.5 text-base font-semibold text-[#fff7f1] shadow-[0_14px_30px_rgba(167,52,49,0.18)]"
              >
                打開編輯器
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#WHEN"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#7ea445] bg-[#f5f3ea] px-6 py-3.5 text-base font-semibold text-[#547031] transition-colors hover:bg-[#eef2df]"
              >
                使用情境
              </a>
            </div>
            <p className="mt-6 text-sm text-stone-500">
              給想贏得漂亮、也想騎得開心的市民選手
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-10 -left-10 h-40 w-40 rounded-full bg-sky-200/35 blur-3xl" />
            <div className="absolute right-8 -bottom-8 h-48 w-48 rounded-full bg-lime-100/35 blur-3xl" />

            <div className="relative rounded-4xl border-2 border-[#1f1b17] bg-[#f7f4ed] p-4 shadow-[0_18px_80px_rgba(85,96,74,0.12)] backdrop-blur">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.6rem] border-2 border-[#17130f] bg-[#84b1ce] p-4 text-[#17130f]">
                  <div className="flex items-center justify-between text-xs tracking-[0.24em] text-[#1d3848] uppercase">
                    <span>Race Notes</span>
                    <span>104 km</span>
                  </div>
                  <div className="mt-4 h-72 rounded-[1.3rem] border-2 border-[#17130f] bg-[#0f8db7] p-4">
                    <div className="relative h-full rounded-[1.1rem] border-2 border-[#17130f] bg-[#8bb44a]">
                      <svg
                        viewBox="0 0 300 260"
                        className="absolute inset-0 h-full w-full"
                        fill="none"
                      >
                        <path
                          d="M40 215C80 180 98 164 128 128C154 96 182 82 220 64C238 56 248 42 258 28"
                          stroke="#fff1a8"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        <circle cx="105" cy="152" r="9" fill="#e4564f" />
                        <circle cx="164" cy="104" r="9" fill="#fff1a8" />
                        <circle cx="220" cy="64" r="9" fill="#0d5f79" />
                      </svg>

                      <div className="absolute top-5 left-6 rounded-2xl border border-[#17130f] bg-[#f6f2e9] px-3 py-2 text-xs text-[#17130f]">
                        58K 補給點
                      </div>
                      <div className="absolute bottom-12 left-10 rounded-2xl border border-[#17130f] bg-[#f6f2e9] px-3 py-2 text-xs text-[#17130f]">
                        21K 登山段前先卡位
                      </div>
                      <div className="absolute top-16 right-5 rounded-2xl border border-[#17130f] bg-[#d93b33] px-3 py-2 text-xs text-[#fff7f1]">
                        62K 登山點
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[1.6rem] border-2 border-[#17130f] bg-[#f6f2e9] p-4">
                    <p className="text-xs font-semibold tracking-[0.2em] text-stone-700 uppercase">
                      Climb Plan
                    </p>
                    <div className="mt-4 h-28 rounded-[1.2rem] bg-white p-3">
                      <svg viewBox="0 0 240 100" className="h-full w-full">
                        <defs>
                          <linearGradient
                            id="hero-elevation"
                            x1="0%"
                            x2="100%"
                            y1="0%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#84b44a" />
                            <stop offset="65%" stopColor="#f0c53d" />
                            <stop offset="100%" stopColor="#d93b33" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 80C20 76 28 72 42 66C58 60 70 34 94 36C120 38 126 78 144 72C166 66 168 18 198 20C212 21 226 38 240 14V100H0Z"
                          fill="url(#hero-elevation)"
                          opacity="0.45"
                        />
                        <path
                          d="M0 80C20 76 28 72 42 66C58 60 70 34 94 36C120 38 126 78 144 72C166 66 168 18 198 20C212 21 226 38 240 14"
                          stroke="#17130f"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border-2 border-[#17130f] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold tracking-[0.2em] text-stone-700 uppercase">
                        Race Memo
                      </p>
                      <Flag className="h-4 w-4 text-stone-400" />
                    </div>
                    <div className="mt-4 rounded-[1.2rem] border border-stone-200 bg-stone-50 p-3">
                      <div className="space-y-2 text-xs text-stone-700">
                        <div className="flex items-center justify-between rounded-full bg-[#edf2d6] px-3 py-2">
                          <span>21K</span>
                          <span className="font-semibold">登山段前先卡位</span>
                        </div>
                        <div className="flex items-center justify-between rounded-full bg-white px-3 py-2">
                          <span>58K</span>
                          <span className="font-semibold">補給點</span>
                        </div>
                        <div className="flex items-center justify-between rounded-full bg-[#f3d0cd] px-3 py-2">
                          <span>62K</span>
                          <span className="font-semibold">登山點</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" id="WHY">
        <div className="grid gap-12 rounded-[2.5rem] border border-stone-200/80 bg-white/70 p-8 shadow-[0_18px_60px_rgba(77,58,38,0.06)] lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div>
            <p className="mb-0 text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
              WHY
            </p>
            <h2 className="font-display text-3xl leading-tight font-black tracking-tight text-stone-950 sm:text-4xl">
              有了路線，有了策略
            </h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-stone-600 sm:text-lg">
            <p>
              30K有補給、56K篩選、90K爬坡段跟好、該注意的號碼是誰。VELOCUE
              就是把這些事先記在小抄裡。
            </p>
            <p>接下來該做的就是照著小抄行動，抓穩手把、掌握節奏、穩定發揮！</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="WHEN">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
            使用情境
          </p>
          <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">
            你整理的不只是路線，
            <br className="hidden sm:block" />
            還有比賽裡的判斷。
          </h2>
          <p className="mt-5 text-base leading-8 text-stone-600 sm:text-lg">
            VELOCUE 不只是把 GPX
            顯示出來，而是讓你把真正會影響節奏和決定的事整理進路線裡。
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {scenarios.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-4xl border border-[#d9d6c8] bg-white/85 p-6 shadow-[0_14px_32px_rgba(86,88,64,0.06)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1e0] text-[#4f684b]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-stone-900">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="HOW">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
              使用步驟
            </p>
            <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">
              STEP
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              先看路線，再標出關鍵段，接著把戰術和號碼記進去，最後輸出成賽前小抄。
            </p>
          </div>

          <div className="grid gap-5">
            {methodSteps.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="flex gap-5 rounded-4xl border border-[#d9d7cb] bg-[#f6f3e8] p-6 shadow-[0_14px_32px_rgba(86,88,64,0.06)]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5f7c5a] text-[#f7f2e8]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.16em] text-stone-400 uppercase">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-stone-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.8rem] border-2 border-[#17130f] bg-[#a9c7d8] px-8 py-14 text-center text-[#17130f] shadow-[0_28px_90px_rgba(28,104,140,0.16)] sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,59,51,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(126,164,69,0.18),transparent_24%)]" />
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 320"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-10 238C130 200 220 126 332 145C432 162 480 265 594 248C704 231 751 136 862 120C966 105 1046 170 1212 116"
              stroke="#d93b33"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="8 14"
            />
          </svg>
          <p className="relative text-sm font-semibold tracking-[0.18em] text-[#2d5161] uppercase">
            開始使用
          </p>
          <h2 className="font-display relative mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            下一條路線，
            <br className="hidden sm:block" />
            先從整理開始。
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
            從登山段、攻擊點、卡位到號碼筆記，把賽前真正會用到的東西先整理進路線裡。
          </p>
          <div className="relative mt-10">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-[#17130f] bg-green-700 px-6 py-3.5 text-base font-semibold text-[#fff7f1]"
            >
              START
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
