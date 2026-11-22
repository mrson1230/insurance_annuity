import { Clock, HandCoins, TrendingDown } from 'lucide-react';

const CHECK_POINTS = [
  {
    index: '01',
    icon: TrendingDown,
    iconBg: 'bg-blue-50 text-[#0055aa]',
    quote: '"금리가 떨어지면 내 연금도 줄어들까 걱정돼요"',
    description: (
      <>
        일반 공시이율형 연금은 시중 금리 하락 시 수령액이 줄어들 수 있습니다.{' '}
        <strong className="text-slate-900">푸본현대 MAX 연금</strong>은 가입 시 약속한
        최저연금기준금액을 확정 보증합니다.
      </>
    ),
  },
  {
    index: '02',
    icon: HandCoins,
    iconBg: 'bg-amber-50 text-amber-700',
    quote: '"은퇴 시점에 목돈 쓸 일이 생기면 어쩌죠?"',
    description: (
      <>
        연금 개시 시점에 기납입보험료 또는 연금기준금액의{' '}
        <strong className="text-slate-900">최대 40%까지 목적자금 인출</strong>이 가능해 자녀
        결혼·의료비로 쓰고 나머지는 종신연금으로 받습니다.
      </>
    ),
  },
  {
    index: '03',
    icon: Clock,
    iconBg: 'bg-emerald-50 text-emerald-700',
    quote: '"10년, 20년 납입은 너무 길게 느껴져요"',
    description: (
      <>
        <strong className="text-slate-900">3년납·5년납 단기 플랜</strong>도 준비되어 있습니다.
        짧은 기간 납입하고 5년 유지 시 3.70% 보증이율과 장기유지보너스 혜택까지 챙기실 수 있습니다.
      </>
    ),
  },
] as const;

export function CheckPointSection() {
  return (
    <section id="checkpoint-section" className="py-14 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <p className="text-[#0055aa] font-extrabold text-xs sm:text-sm tracking-wider">
          CHECK POINT
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 text-balance">
          이런 고민을 하고 계신다면 꼭 확인하세요
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {CHECK_POINTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.index}
              className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-num">{item.index}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2.5 leading-snug">
                  {item.quote}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
