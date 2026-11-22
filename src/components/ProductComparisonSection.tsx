import { Award, Check, ShieldCheck } from 'lucide-react';

interface ProductComparisonSectionProps {
  onSelectProduct: (productName: string) => void;
}

export function ProductComparisonSection({ onSelectProduct }: ProductComparisonSectionProps) {
  return (
    <section id="compare-section" className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-[#0055aa] font-extrabold text-xs sm:text-sm tracking-wider">
            PRODUCT COMPARISON
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 text-balance">
            내 자금 계획에 딱 맞는 MAX 연금 2종 비교
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            장기 고수익 보증형과 단기납 보너스형 중 나에게 유리한 플랜을 선택해 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 상품 1 */}
          <article className="rounded-2xl border-2 border-[#0055aa] bg-slate-50/40 overflow-hidden flex flex-col">
            <div className="bg-[#003366] text-white p-6">
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-bold text-amber-300">대표 플랜 · 연복리 6% 보증</span>
                <span className="text-blue-200 font-medium">가입나이 0세 ~ 65세</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                1. MAX 연금다운 연금보험 적립형(무)
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
                10년·20년 적립으로 연금 재원을 최대 350%까지 키우는 정통 보증연금
              </p>
            </div>

            <div className="p-6 flex-1 space-y-5 text-sm">
              <div className="pb-5 border-b border-slate-200">
                <p className="font-extrabold text-[#003366] mb-3 flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#0055aa]" />
                  <span>최저연금기준금액 강력 보증 (1형 가입 시)</span>
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50/80 py-3 px-3 rounded-xl">
                    <span className="block text-xs text-slate-600 mb-0.5">납입 기간 중</span>
                    <strong className="text-base sm:text-lg font-black text-[#0055aa] font-num">
                      연복리 6%
                    </strong>
                  </div>
                  <div className="bg-blue-50/80 py-3 px-3 rounded-xl">
                    <span className="block text-xs text-slate-600 mb-0.5">납입 완료 후 개시 전</span>
                    <strong className="text-base sm:text-lg font-black text-[#0055aa] font-num">
                      연복리 4%
                    </strong>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-slate-700 leading-relaxed text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0055aa] shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">최대 지급 한도:</strong> 10년납은 납입
                    총보험료의 <strong className="text-slate-900">최대 350%</strong>, 20년납은{' '}
                    <strong className="text-slate-900">최대 300%</strong>까지 보증 한도 설정
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0055aa] shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">목적자금 인출:</strong> 개시 시점에
                    &apos;기납입보험료&apos;와 &apos;연금기준금액의 40%&apos; 중 적은 금액 인출
                    가능 (잔여 재원 종신연금 수령)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0055aa] shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">가입 조건:</strong> 월 20만 원 이상 /
                    10년납·20년납 선택 / 연금 개시 45~80세
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0055aa] shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">가족 상속 및 세제 혜택:</strong> 보증기간 내
                    사망 시 가족 상속, 80% 이상 재해장해 시 월 50만 원(36회) 지급, 요건 충족 시{' '}
                    <strong className="text-[#0055aa]">비과세 혜택</strong>
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white border-t border-slate-200">
              <button
                type="button"
                onClick={() => onSelectProduct('MAX 연금다운 연금보험 적립형(무)')}
                className="w-full bg-[#0055aa] hover:bg-[#004080] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap"
              >
                이 상품으로 무료 설계안 신청하기 →
              </button>
            </div>
          </article>

          {/* 상품 2 */}
          <article className="rounded-2xl border border-slate-200 bg-slate-50/40 overflow-hidden flex flex-col">
            <div className="bg-slate-800 text-white p-6">
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-bold text-emerald-300">단기납 · 보너스 특화</span>
                <span className="text-slate-300 font-medium">연금 개시 45세 ~ 90세</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                2. MAX 연금보험 하이브리드 플러스 적립형(무)
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                3년·5년 짧은 납입으로 3.70% 보증과 장기유지보너스를 받는 실속형
              </p>
            </div>

            <div className="p-6 flex-1 space-y-5 text-sm">
              <div className="pb-5 border-b border-slate-200">
                <p className="font-extrabold text-emerald-900 mb-3 flex items-center gap-1.5 text-sm">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>5년 유지 시 확정 보증이율 &amp; 보너스</span>
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-emerald-50/80 py-3 px-3 rounded-xl">
                    <span className="block text-xs text-slate-600 mb-0.5">5년 유지 시 최저적립액</span>
                    <strong className="text-base sm:text-lg font-black text-emerald-700 font-num">
                      연 3.70% 보증
                    </strong>
                  </div>
                  <div className="bg-emerald-50/80 py-3 px-3 rounded-xl">
                    <span className="block text-xs text-slate-600 mb-0.5">유지 기간에 따른 혜택</span>
                    <strong className="text-base sm:text-lg font-black text-emerald-700">
                      장기유지보너스
                    </strong>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-slate-700 leading-relaxed text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">초단기 납입 가능:</strong> 긴 납입이
                    부담스러운 분들을 위한 <strong className="text-slate-900">3년납 · 5년납</strong>{' '}
                    및 여유로운 <strong className="text-slate-900">10년납</strong> 선택
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">가벼운 시작 금액:</strong> 3년납·5년납은{' '}
                    <strong className="text-slate-900">월 20만 원 이상</strong>, 10년납은{' '}
                    <strong className="text-slate-900">월 10만 원 이상</strong>부터 가입 가능
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1 stroke-[2.5]" />
                  <span>
                    <strong className="text-slate-900">여유로운 개시 시점:</strong> 은퇴 시기에
                    맞춰 <strong className="text-slate-900">45세 ~ 90세</strong> 사이에서 자유롭게
                    연금 개시 연령 선택
                  </span>
                </li>
              </ul>

              <p className="pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900">추천 포인트:</strong> 3~5년 안에 납입을 끝내고
                공시이율 변동과 무관하게 안정적인 최저적립액 보장을 원하시는 분께 추천합니다.
              </p>
            </div>

            <div className="p-5 bg-white border-t border-slate-200">
              <button
                type="button"
                onClick={() => onSelectProduct('MAX 연금보험 하이브리드 플러스 적립형(무)')}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap"
              >
                이 상품으로 무료 설계안 신청하기 →
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
