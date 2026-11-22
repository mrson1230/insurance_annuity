import { Lock } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="text-base sm:text-lg font-black tracking-tight text-[#003366] whitespace-nowrap shrink-0"
        >
          푸본현대생명 연금플랜
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

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#consult-section"
            className="bg-[#0055aa] hover:bg-[#004080] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            무료 설계안 받기
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            title="설계사 DB 관리"
            aria-label="관리자 DB 열기"
            className="p-2.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">관리자</span>
          </button>
        </div>
      </div>
    </header>
  );
}
