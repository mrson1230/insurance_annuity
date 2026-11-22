import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'withdrawal',
    question: 'Q. 중도에 목돈이 필요하면 해지해야 하나요?',
    answer: (
      <>
        아닙니다. <strong className="text-slate-900">MAX 연금다운 연금보험</strong>의 경우 연금
        개시 시점에 &apos;기납입보험료&apos;와 &apos;연금기준금액의 40%&apos; 중 적은 금액을
        목적자금으로 일시 인출해 교육비·의료비 등으로 활용하시고, 남은 금액으로 평생 종신연금을
        수령하실 수 있습니다.
      </>
    ),
  },
  {
    id: 'tax-free',
    question: 'Q. 비과세 혜택도 받을 수 있나요?',
    answer:
      '네, 관련 세법에서 정한 요건(5년 이상 납입 및 10년 이상 유지, 월납 150만 원 이하 한도 등)을 충족하실 경우 이자소득세 비과세 혜택을 적용받으실 수 있습니다.',
  },
  {
    id: 'preview-table',
    question: 'Q. 가입 전 예상 수령액 표만 먼저 받아볼 수 있나요?',
    answer: (
      <>
        물론입니다! 아래 무료 설계 신청란에 출생년도와 연락처만 남겨주시면 카카오톡이나 문자로{' '}
        <strong className="text-slate-900">고객님 연령 기준 맞춤 가입설계서(예상 연금액표)</strong>
        를 부담 없이 보내드립니다.
      </>
    ),
  },
] as const;

export function FaqSection() {
  const [openId, setOpenId] = useState<string>('withdrawal');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="faq-section" className="py-12 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-8">
        자주 묻는 질문 (FAQ)
      </h2>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
