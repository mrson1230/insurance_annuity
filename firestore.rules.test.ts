/**
 * Security Rules Verification Specification for /leads/{leadId} and /admins/{adminId}.
 * Documents and verifies the 12 adversarial ("Dirty Dozen") payloads against the ruleset.
 */

export interface AdversarialTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid?: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
  enforcedByRule: string;
}

export const DIRTY_DOZEN_TESTS: AdversarialTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated list scrape on /leads',
    operation: 'list',
    path: '/leads',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'allow list: if isBootstrappedAdmin()'
  },
  {
    id: 2,
    name: 'Non-admin authenticated list scrape on /leads',
    operation: 'list',
    path: '/leads',
    auth: { uid: 'u-1', email: 'visitor@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'allow list: if isBootstrappedAdmin()'
  },
  {
    id: 3,
    name: 'Spoofed unverified admin email on /leads',
    operation: 'get',
    path: '/leads/lead_001',
    auth: { uid: 'u-2', email: 'jeonggons53@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isVerified() requires email_verified == true'
  },
  {
    id: 4,
    name: 'Shadow field injection during lead create',
    operation: 'create',
    path: '/leads/lead_002',
    auth: null,
    payload: {
      product: 'MAX 연금다운 연금보험 적립형(무)',
      name: '김연금',
      age: '1980년생',
      phone: '010-1234-5678',
      budget: '월 30만원대',
      memo: '-',
      status: '상담대기',
      time: '2026-11-22 10:00',
      createdAt: 'SERVER_TIME',
      isAdmin: true
    },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'data.keys().hasOnly([...]) rejects shadow keys'
  },
  {
    id: 5,
    name: 'Pre-completed status spoof during lead create',
    operation: 'create',
    path: '/leads/lead_003',
    auth: null,
    payload: {
      product: 'MAX 연금다운 연금보험 적립형(무)',
      name: '김연금',
      age: '1980년생',
      phone: '010-1234-5678',
      budget: '월 30만원대',
      memo: '-',
      status: '상담완료',
      time: '2026-11-22 10:00',
      createdAt: 'SERVER_TIME'
    },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: "incoming().status == '상담대기'"
  },
  {
    id: 6,
    name: 'Client timestamp spoofing on lead create',
    operation: 'create',
    path: '/leads/lead_004',
    auth: null,
    payload: {
      product: 'MAX 연금다운 연금보험 적립형(무)',
      name: '김연금',
      age: '1980년생',
      phone: '010-1234-5678',
      budget: '월 30만원대',
      memo: '-',
      status: '상담대기',
      time: '2026-11-22 10:00',
      createdAt: '2020-01-01T00:00:00Z'
    },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'incoming().createdAt == request.time'
  },
  {
    id: 7,
    name: 'Oversized phone/memo resource poisoning',
    operation: 'create',
    path: '/leads/lead_005',
    auth: null,
    payload: {
      product: 'MAX 연금다운 연금보험 적립형(무)',
      name: '김연금',
      age: '1980년생',
      phone: '010-1234-5678-999999999999999',
      budget: '월 30만원대',
      memo: 'x'.repeat(301),
      status: '상담대기',
      time: '2026-11-22 10:00',
      createdAt: 'SERVER_TIME'
    },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'data.phone.size() <= 20 && data.memo.size() <= 300'
  },
  {
    id: 8,
    name: 'Malformed lead document ID',
    operation: 'create',
    path: '/leads/invalid$doc!id',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: "isValidId(leadId) matches '^[a-zA-Z0-9_\\\\-]+$'"
  },
  {
    id: 9,
    name: 'Non-admin status update attempt',
    operation: 'update',
    path: '/leads/lead_001',
    auth: { uid: 'u-3', email: 'visitor@example.com', email_verified: true },
    payload: { status: '상담완료', updatedAt: 'SERVER_TIME' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isAdmin() required on update'
  },
  {
    id: 10,
    name: 'Immutable phone/createdAt mutation on update',
    operation: 'update',
    path: '/leads/lead_001',
    auth: { uid: 'admin-1', email: 'jeonggons53@gmail.com', email_verified: true },
    payload: { phone: '010-9999-9999', status: '상담완료', updatedAt: 'SERVER_TIME' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: "affectedKeys().hasOnly(['status', 'updatedAt'])"
  },
  {
    id: 11,
    name: 'Self-assigned admin escalation',
    operation: 'create',
    path: '/admins/u-attacker',
    auth: { uid: 'u-attacker', email: 'attacker@example.com', email_verified: true },
    payload: { email: 'attacker@example.com', role: 'admin', createdAt: 'SERVER_TIME' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'Only isBootstrappedAdmin() can write /admins'
  },
  {
    id: 12,
    name: 'Non-admin lead deletion attempt',
    operation: 'delete',
    path: '/leads/lead_001',
    auth: { uid: 'u-4', email: 'visitor@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'allow delete: if isValidId(leadId) && isAdmin()'
  }
];
