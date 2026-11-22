export const LEAD_CONSTRAINTS = {
  product: { minLength: 1, maxLength: 100 },
  name: { minLength: 1, maxLength: 50 },
  age: { minLength: 1, maxLength: 30 },
  phone: { minLength: 9, maxLength: 20, pattern: /^[0-9-]+$/ },
  budget: { minLength: 1, maxLength: 50 },
  memo: { minLength: 1, maxLength: 300 },
  statusEnum: ['상담대기', '상담완료'] as const,
  time: { minLength: 10, maxLength: 30 },
  docIdPattern: /^[a-zA-Z0-9_-]+$/,
} as const;

export type LeadStatus = (typeof LEAD_CONSTRAINTS.statusEnum)[number];

export interface LeadRecord {
  id: string;
  product: string;
  name: string;
  age: string;
  phone: string;
  budget: string;
  memo: string;
  status: LeadStatus;
  time: string;
}

export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.length > 3 && digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  if (digits.length > 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
  return digits;
}

export function formatMoneyMan(man: number): string {
  if (man >= 10000) {
    const uk = Math.floor(man / 10000);
    const rest = man % 10000;
    return rest > 0 ? `${uk}억 ${rest.toLocaleString('ko-KR')}만 원` : `${uk}억 원`;
  }
  return `${man.toLocaleString('ko-KR')}만 원`;
}

export function generateSafeLeadId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  const candidate = `lead_${ts}_${rand}`;
  return LEAD_CONSTRAINTS.docIdPattern.test(candidate) ? candidate : `lead_${Date.now()}`;
}

export function formatSubmissionTime(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export interface SanitizedLeadInput {
  product: string;
  name: string;
  age: string;
  phone: string;
  budget: string;
  memo: string;
  status: '상담대기';
  time: string;
}

export function validateAndSanitizeLeadInput(input: {
  product: string;
  name: string;
  age: string;
  phone: string;
  budget: string;
  memo: string;
}): { ok: true; data: SanitizedLeadInput } | { ok: false; message: string } {
  const product = input.product.trim().slice(0, LEAD_CONSTRAINTS.product.maxLength);
  const name = input.name.trim().slice(0, LEAD_CONSTRAINTS.name.maxLength);
  const age = input.age.trim().slice(0, LEAD_CONSTRAINTS.age.maxLength);
  const phone = input.phone.trim().slice(0, LEAD_CONSTRAINTS.phone.maxLength);
  const budget = input.budget.trim().slice(0, LEAD_CONSTRAINTS.budget.maxLength);
  const memoRaw = input.memo.trim();
  const memo = (memoRaw.length > 0 ? memoRaw : '-').slice(0, LEAD_CONSTRAINTS.memo.maxLength);
  const time = formatSubmissionTime().slice(0, LEAD_CONSTRAINTS.time.maxLength);

  if (product.length < LEAD_CONSTRAINTS.product.minLength) {
    return { ok: false, message: '관심 상품을 선택해 주세요.' };
  }
  if (name.length < LEAD_CONSTRAINTS.name.minLength) {
    return { ok: false, message: '성함을 입력해 주세요.' };
  }
  if (age.length < LEAD_CONSTRAINTS.age.minLength) {
    return { ok: false, message: '출생년도 또는 나이를 입력해 주세요.' };
  }
  if (
    phone.length < LEAD_CONSTRAINTS.phone.minLength ||
    !LEAD_CONSTRAINTS.phone.pattern.test(phone)
  ) {
    return { ok: false, message: '올바른 휴대폰 번호(숫자 및 하이픈)를 입력해 주세요.' };
  }
  if (budget.length < LEAD_CONSTRAINTS.budget.minLength) {
    return { ok: false, message: '희망 월 저축액을 선택해 주세요.' };
  }

  return {
    ok: true,
    data: {
      product,
      name,
      age,
      phone,
      budget,
      memo,
      status: '상담대기',
      time,
    },
  };
}
