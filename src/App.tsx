import { useState } from 'react';
import { FileText, Lock } from 'lucide-react';
import { AdminModal } from './components/AdminModal';
import { BrandLogo } from './components/BrandLogo';
import { CheckPointSection } from './components/CheckPointSection';
import { ConsultFormSection } from './components/ConsultFormSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FaqSection } from './components/FaqSection';
import { GuaranteeSimulator } from './components/GuaranteeSimulator';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductComparisonSection } from './components/ProductComparisonSection';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<string>('두 상품 비교표 모두 받기');
  const [focusTrigger, setFocusTrigger] = useState<number>(0);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const handleSelectProduct = (productName: string) => {
    setSelectedProduct(productName);
    setFocusTrigger((prev) => prev + 1);
    const target = document.getElementById('consult-section');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 sm:pb-0">
        <Header />

        <main>
          <HeroSection />
          <CheckPointSection />
          <ProductComparisonSection onSelectProduct={handleSelectProduct} />
          <GuaranteeSimulator />
          <FaqSection />
          <ConsultFormSection
            selectedProduct={selectedProduct}
            onChangeProduct={setSelectedProduct}
            focusTrigger={focusTrigger}
          />
        </main>

        {/* 모바일 전용 하단 고정 플로팅 CTA 바 (15% viewport cap 준수) */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          <a
            href="#consult-section"
            className="w-full gold-gradient text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow"
          >
            <FileText className="w-4 h-4" />
            <span>내 예상 연금 수령액 무료 신청하기</span>
          </a>
        </div>

        {/* 필수 법적 고지 푸터 */}
        <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 text-xs leading-relaxed">
          <div className="max-w-5xl mx-auto space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <BrandLogo variant="dark" />
              </div>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="text-slate-500 hover:text-slate-300 text-left sm:text-right inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>[관리자 전용] 접수 고객 DB 확인</span>
              </button>
            </div>
            <p>
              • 본 페이지는 푸본현대생명의 주요 연금보험 상품(MAX 연금다운 연금보험 적립형(무), MAX
              연금보험 하이브리드 플러스 적립형(무))의 핵심 내용을 안내하기 위한 보험플러스 홍보
              랜딩페이지입니다.
            </p>
            <p>
              • 보험계약 체결 전 상품설명서 및 약관을 반드시 확인하시기 바랍니다. 중도 해지 시
              해약환급금은 납입한 보험료보다 적거나 없을 수 있습니다.
            </p>
            <p>• 비과세 혜택은 관련 세법에서 정한 요건을 충족하는 경우에 한하여 적용됩니다.</p>
          </div>
        </footer>

        <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}
