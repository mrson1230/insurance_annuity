import React, { useEffect, useRef, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  formatPhoneInput,
  generateSafeLeadId,
  LEAD_CONSTRAINTS,
  validateAndSanitizeLeadInput,
} from '../lib/validation';

interface ConsultFormSectionProps {
  selectedProduct: string;
  onChangeProduct: (product: string) => void;
  focusTrigger: number;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqpqgorn';

const PRODUCT_OPTIONS = [
  {
    value: '두 상품 비교표 모두 받기',
    label: '두 상품 비교표 모두 받아보기 (추천)',
  },
  {
    value: 'MAX 연금다운 연금보험 적립형(무)',
    label: '1. MAX 연금다운 연금보험 적립형(무) - 연복리 6%/4%',
  },
  {
    value: 'MAX 연금보험 하이브리드 플러스 적립형(무)',
    label: '2. MAX 연금보험 하이브리드 플러스 적립형(무) - 단기납/3.70%',
  },
] as const;

const BUDGET_OPTIONS = [
  { value: '월 20만원대', label: '월 20만 원대' },
  { value: '월 30만원대', label: '월 30만 원대' },
  { value: '월 50만원대', label: '월 50만 원대' },
  { value: '월 100만원 이상', label: '월 100만 원 이상' },
  { value: '월 10만원대(하이브리드)', label: '월 10만 원대 (10년납)' },
  { value: '상담 후 결정', label: '상담 후 결정' },
] as const;

export function ConsultFormSection({
  selectedProduct,
  onChangeProduct,
  focusTrigger,
}: ConsultFormSectionProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('월 30만원대');
  const [memo, setMemo] = useState('');
  const [agreed, setAgreed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedSummary, setSubmittedSummary] = useState<{
    name: string;
    product: string;
  } | null>(null);

  useEffect(() => {
    if (focusTrigger > 0) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [focusTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreed) {
      setErrorMsg('개인정보 수집 및 이용 동의가 필요합니다.');
      return;
    }

    const validation = validateAndSanitizeLeadInput({
      product: selectedProduct,
      name,
      age,
      phone,
      budget,
      memo,
    });

    if (!validation.ok) {
      setErrorMsg(validation.message);
      return;
    }

    setIsSubmitting(true);
    const leadId = generateSafeLeadId();
    const docPath = `leads/${leadId}`;

    try {
      await setDoc(doc(db, 'leads', leadId), {
        ...validation.data,
        createdAt: serverTimestamp(),
      });

      try {
        const emailResponse = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: `[보험플러스] 새 연금보험 상담 접수 - ${validation.data.name} (${validation.data.age})`,
            접수일시: validation.data.time,
            관심상품: validation.data.product,
            성함: validation.data.name,
            출생_나이: validation.data.age,
            휴대폰번호: validation.data.phone,
            희망월저축액: validation.data.budget,
            문의사항: validation.data.memo,
            접수상태: validation.data.status,
            DB문서ID: leadId,
          }),
        });
        if (!emailResponse.ok) {
          console.error('Formspree 메일 전송 응답 오류:', emailResponse.status);
        }
      } catch (emailErr) {
        console.error('Formspree 메일 전송 중 네트워크 오류:', emailErr);
      }

      setSubmittedSummary({
        name: validation.data.name,
        product: validation.data.product,
      });

      setName('');
      setAge('');
      setPhone('');
      setBudget('월 30만원대');
      setMemo('');
      setAgreed(true);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      } catch {
        setErrorMsg('일시적인 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consult-section" className="py-14 sm:py-20 px-4 sm:px-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-[#0055aa] overflow-hidden shadow-xl">
        <div className="hero-bg text-white p-6 sm:p-8 text-center">
          <p className="text-xs font-extrabold text-amber-300 mb-2">
            100% 무료 · 비대면 카톡/문자 안내 가능
          </p>
          <h2 className="text-2xl sm:text-3xl font-black leading-snug text-balance">
            내 연령 기준 예상 연금 수령액
            <br />
            무료 설계안 받아보기
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-2">
            지금 신청하시면 두 상품 비교표와 맞춤 수령액 시뮬레이션 결과를 보내드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div>
            <label htmlFor="input-product" className="block text-sm font-bold text-slate-800 mb-1.5">
              관심 상품 선택
            </label>
            <select
              id="input-product"
              value={selectedProduct}
              onChange={(e) => onChangeProduct(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
            >
              {PRODUCT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-name" className="block text-sm font-bold text-slate-800 mb-1.5">
                성함 <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="input-name"
                type="text"
                required
                maxLength={LEAD_CONSTRAINTS.name.maxLength}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김연금"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
              />
            </div>

            <div>
              <label htmlFor="input-age" className="block text-sm font-bold text-slate-800 mb-1.5">
                출생년도 (또는 나이) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-age"
                type="text"
                required
                maxLength={LEAD_CONSTRAINTS.age.maxLength}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="예: 1980년생"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-phone" className="block text-sm font-bold text-slate-800 mb-1.5">
                휴대폰 번호 <span className="text-red-500">*</span>
              </label>
              <input
                id="input-phone"
                type="tel"
                required
                maxLength={13}
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                placeholder="010-0000-0000"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm font-num focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
              />
            </div>

            <div>
              <label htmlFor="input-budget" className="block text-sm font-bold text-slate-800 mb-1.5">
                희망 월 저축액
              </label>
              <select
                id="input-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-memo" className="block text-sm font-bold text-slate-800 mb-1.5">
              희망 안내 방식 / 문의사항 (선택)
            </label>
            <input
              id="input-memo"
              type="text"
              maxLength={LEAD_CONSTRAINTS.memo.maxLength}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 전화 전 카톡으로 먼저 설계안 부탁드려요."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
            />
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 accent-[#0055aa] rounded shrink-0"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">[필수] 개인정보 수집 및 이용 동의:</strong> 연금보험
                무료 가입설계 및 상담 안내를 위해 성함, 출생년도, 연락처를 수집·이용하는 것에
                동의합니다.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gold-gradient hover:opacity-95 disabled:opacity-60 text-slate-950 font-black py-4 px-6 rounded-xl text-base sm:text-lg shadow-lg transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? '접수 처리 중...' : '무료 연금 설계안 지금 신청하기'}</span>
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* 신청 완료 모달 */}
      {submittedSummary && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 id="success-modal-title" className="text-xl font-black text-slate-900 mb-2">
              설계안 신청이 완료되었습니다!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              <strong className="text-slate-900">{submittedSummary.name}</strong> 고객님의 무료 설계
              신청이 안전하게 접수되었습니다.
              <br />
              선택하신 <strong className="text-[#0055aa]">[{submittedSummary.product}]</strong>{' '}
              안내표를 준비해 빠르게 연락드리겠습니다.
            </p>
            <button
              type="button"
              onClick={() => setSubmittedSummary(null)}
              className="w-full bg-[#0055aa] hover:bg-[#004080] text-white font-bold py-3.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
