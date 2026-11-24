import { BrandLogo } from './BrandLogo';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          aria-label="보험플러스 홈"
          className="flex items-center py-1 shrink-0"
        >
          <BrandLogo variant="light" />
        </a>

        <nav
          aria-label="주요 메뉴"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <a
            href="#checkpoint-section"
            className="hover:text-[#003366] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            핵심 장점
          </a>
          <a
            href="#compare-section"
            className="hover:text-[#003366] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            상품 비교
          </a>
          <a
            href="#simulator-section"
            className="hover:text-[#003366] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            보증 한도 계산
          </a>
          <a
            href="#faq-section"
            className="hover:text-[#003366] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            자주 묻는 질문
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#consult-section"
            className="bg-[#0055aa] hover:bg-[#004080] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            무료 설계안 받기
          </a>
        </div>
      </div>
    </header>
  );
}
