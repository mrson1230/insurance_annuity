import { ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="top"
      className="hero-bg text-white pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-300 mb-4">
            2026년 최신 확정 보증형 연금보험 특별 안내
          </p>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-5 text-balance">
            시중 금리가 떨어져도 내 연금은{' '}
            <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-8">
              연복리 6% · 최대 350%
            </span>
            로 지킵니다
          </h1>

          <p className="text-blue-100 text-sm sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            국민연금만으로는 부족한 은퇴 후 30년! 변동하는 공시이율 걱정 없이{' '}
            <strong className="text-white font-bold">최저연금기준금액을 확정 보증</strong>해주는
            푸본현대생명 MAX 연금으로 든든한 평생 월급을 준비하세요.
          </p>

          <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto mb-10">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5">
              <p className="text-[11px] sm:text-xs text-blue-200 mb-1">납입 중 보증</p>
              <p className="text-lg sm:text-3xl font-black text-amber-300 font-num">연복리 6%</p>
              <p className="text-[11px] sm:text-xs text-blue-100 mt-1">납입 후 4% 보증</p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5">
              <p className="text-[11px] sm:text-xs text-blue-200 mb-1">최대 지급 한도</p>
              <p className="text-lg sm:text-3xl font-black text-white font-num">최대 350%</p>
              <p className="text-[11px] sm:text-xs text-blue-100 mt-1">10년납 기준 한도</p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5">
              <p className="text-[11px] sm:text-xs text-blue-200 mb-1">단기납 보증이율</p>
              <p className="text-lg sm:text-3xl font-black text-emerald-300 font-num">연 3.70%</p>
              <p className="text-[11px] sm:text-xs text-blue-100 mt-1">5년 유지 시 확정</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#consult-section"
              className="w-full sm:w-auto gold-gradient hover:opacity-95 text-slate-950 font-black px-8 py-4 rounded-xl text-base sm:text-lg shadow-xl transition-opacity flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>내 나이 기준 예상 연금액 무료 조회</span>
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="#compare-section"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-6 py-4 rounded-xl text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
            >
              두 가지 상품 한눈에 비교하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
