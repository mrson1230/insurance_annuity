import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { formatMoneyMan } from '../lib/validation';

const TERM_OPTIONS = [3, 5, 10, 20] as const;

export function GuaranteeSimulator() {
  const [monthlyMan, setMonthlyMan] = useState<number>(30);
  const [years, setYears] = useState<(typeof TERM_OPTIONS)[number]>(10);

  const totalPrincipalMan = monthlyMan * 12 * years;

  let highlightTitle = '하이브리드 플러스 5년 유지 보증이율';
  let highlightValue = `${formatMoneyMan(totalPrincipalMan)} + 연 3.70%`;

  if (years === 10) {
    highlightTitle = 'MAX 연금다운 최대 보증 한도 (350%)';
    highlightValue = `최대 ${formatMoneyMan(Math.round(totalPrincipalMan * 3.5))}`;
  } else if (years === 20) {
    highlightTitle = 'MAX 연금다운 최대 보증 한도 (300%)';
    highlightValue = `최대 ${formatMoneyMan(Math.round(totalPrincipalMan * 3.0))}`;
  }

  return (
    <section id="simulator-section" className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10">
        <div className="text-center mb-8">
          <p className="inline-flex items-center gap-1.5 text-[#0055aa] font-extrabold text-xs sm:text-sm mb-2">
            <Calculator className="w-4 h-4" />
            <span>10초 간편 계산기</span>
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-balance">
            내가 매달 저축하면 얼마나 보증받을까?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            슬라이더를 움직여 총 납입 원금과 최대 보증 한도를 확인해 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div>
            <div className="flex justify-between items-end mb-2.5">
              <label htmlFor="sim-amount" className="text-sm font-bold text-slate-700">
                월 희망 납입액
              </label>
              <span className="text-xl sm:text-2xl font-black text-[#0055aa] font-num">
                {monthlyMan.toLocaleString('ko-KR')}만 원
              </span>
            </div>
            <input
              id="sim-amount"
              type="range"
              min={10}
              max={200}
              step={10}
              value={monthlyMan}
              onChange={(e) => setMonthlyMan(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg accent-[#0055aa] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-num">
              <span>10만 원</span>
              <span>100만 원</span>
              <span>200만 원</span>
            </div>
          </div>

          <div>
            <p className="block text-sm font-bold text-slate-700 mb-2.5">희망 납입 기간</p>
            <div className="grid grid-cols-4 gap-2" role="group" aria-label="희망 납입 기간 선택">
              {TERM_OPTIONS.map((term) => {
                const isActive = years === term;
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setYears(term)}
                    aria-pressed={isActive}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-2 border-[#0055aa] bg-blue-50 text-[#0055aa]'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {term}년납
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#002855] text-white rounded-2xl p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <div className="pb-4 sm:pb-0 border-b sm:border-b-0 border-white/15">
            <p className="text-xs text-blue-200">내가 납입하는 총 원금</p>
            <p className="text-2xl sm:text-3xl font-black mt-1 font-num">
              {formatMoneyMan(totalPrincipalMan)}
            </p>
          </div>
          <div className="sm:border-l sm:border-white/15 sm:pl-6">
            <p className="text-xs text-amber-300 font-bold">{highlightTitle}</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 font-num">
              {highlightValue}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
          * 이해를 돕기 위한 단순 한도 예시이며, 실제 연금 수령액은 연령·성별·거치기간·보증비용 등에 따라
          달라지므로 아래에서 정확한 가입설계서를 받아보세요.
        </p>
      </div>
    </section>
  );
}
