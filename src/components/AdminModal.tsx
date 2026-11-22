import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  AlertCircle,
  Database,
  Download,
  LogIn,
  LogOut,
  Phone,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import type { LeadRecord, LeadStatus } from '../lib/validation';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StatusFilter = '전체' | LeadStatus;

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);

      if (!user) {
        setIsAdminAuthorized(false);
        setLeads([]);
        return;
      }

      if (!user.emailVerified) {
        setIsAdminAuthorized(false);
        setAuthError('이메일 인증이 완료된 Google 계정이 필요합니다.');
        return;
      }

      if (user.email === BOOTSTRAPPED_ADMIN_EMAIL) {
        setIsAdminAuthorized(true);
        setAuthError(null);
        return;
      }

      setAuthChecking(true);
      try {
        const adminSnap = await getDoc(doc(db, 'admins', user.uid));
        setIsAdminAuthorized(adminSnap.exists());
        setAuthError(null);
      } catch {
        setIsAdminAuthorized(false);
      } finally {
        setAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen || !authReady || !currentUser || !isAdminAuthorized) {
      return;
    }

    setLoadingLeads(true);
    setDbError(null);

    const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      leadsQuery,
      (snapshot) => {
        const items: LeadRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            product: String(data.product ?? ''),
            name: String(data.name ?? ''),
            age: String(data.age ?? ''),
            phone: String(data.phone ?? ''),
            budget: String(data.budget ?? ''),
            memo: String(data.memo ?? '-'),
            status: data.status === '상담완료' ? '상담완료' : '상담대기',
            time: String(data.time ?? ''),
          };
        });
        setLeads(items);
        setLoadingLeads(false);
      },
      (error) => {
        setLoadingLeads(false);
        setDbError('고객 DB를 불러오는 중 권한 또는 연결 오류가 발생했습니다.');
        try {
          handleFirestoreError(error, OperationType.LIST, 'leads');
        } catch {
          // Handled via inline UI error state
        }
      }
    );

    return () => unsubscribe();
  }, [isOpen, authReady, currentUser, isAdminAuthorized]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((item) => {
      if (statusFilter !== '전체' && item.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.product.toLowerCase().includes(q) ||
        item.memo.toLowerCase().includes(q)
      );
    });
  }, [leads, statusFilter, searchQuery]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthError('Google 로그인 창이 닫혔거나 인증에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  const handleToggleStatus = async (lead: LeadRecord) => {
    const nextStatus: LeadStatus = lead.status === '상담대기' ? '상담완료' : '상담대기';
    try {
      await updateDoc(doc(db, 'leads', lead.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setDbError('상태 변경에 실패했습니다.');
      try {
        handleFirestoreError(error, OperationType.UPDATE, `leads/${lead.id}`);
      } catch {
        // Error logged
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      setConfirmDeleteId(null);
    } catch (error) {
      setDbError('상담 내역 삭제에 실패했습니다.');
      try {
        handleFirestoreError(error, OperationType.DELETE, `leads/${leadId}`);
      } catch {
        // Error logged
      }
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['접수일시', '상태', '성함', '출생/나이', '연락처', '관심상품', '희망납입', '메모'];
    const rows = leads.map((l) =>
      [l.time, l.status, l.name, l.age, l.phone, l.product, l.budget, l.memo]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `푸본현대연금_홍보DB_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 id="admin-modal-title" className="font-bold text-base sm:text-lg">
              접수된 상담 고객 DB{' '}
              {isAdminAuthorized && (
                <span className="font-num text-amber-300">({leads.length}건)</span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="관리자 창 닫기"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate: Not Signed In */}
        {!currentUser && (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-2">관리자 Google 인증</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              고객 연락처 및 개인정보 보호를 위해 승인된 관리자 Google 계정으로 로그인한 후 DB를
              열람할 수 있습니다.
            </p>
            {authError && (
              <div className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {authError}
              </div>
            )}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-[#0055aa] hover:bg-[#004080] text-white font-bold py-3.5 px-5 rounded-xl text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Google 계정으로 관리자 로그인</span>
            </button>
          </div>
        )}

        {/* Auth Gate: Checking or Unauthorized */}
        {currentUser && !isAdminAuthorized && (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            {authChecking ? (
              <p className="text-sm text-slate-500">관리자 권한을 확인하는 중입니다...</p>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">접근 권한이 없습니다</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  현재 로그인된 계정(<strong>{currentUser.email}</strong>)에는 관리자 DB 열람
                  권한이 없습니다. 승인된 관리자 계정으로 다시 로그인해 주세요.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    다른 계정으로 전환
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Authorized Admin Dashboard */}
        {currentUser && isAdminAuthorized && (
          <>
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                  {(['전체', '상담대기', '상담완료'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === tab
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="이름, 번호, 상품 검색"
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055aa]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={exportToCSV}
                disabled={leads.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>엑셀(CSV) 저장</span>
              </button>
            </div>

            {dbError && (
              <div className="mx-5 mt-4 flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dbError}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {loadingLeads ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  상담 신청 내역을 불러오는 중입니다...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  {leads.length === 0
                    ? '아직 접수된 상담 신청 내역이 없습니다.'
                    : '검색 조건에 해당하는 상담 내역이 없습니다.'}
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(lead)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                            lead.status === '상담완료'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {lead.status}
                        </button>
                        <span className="font-black text-slate-900">{lead.name}</span>
                        <span className="text-xs text-slate-500">({lead.age})</span>
                        <span className="text-xs text-slate-400 font-mono-num">{lead.time}</span>
                      </div>

                      <p className="text-xs text-slate-700">
                        <strong>관심:</strong> {lead.product} <span aria-hidden="true">·</span>{' '}
                        <strong>희망:</strong> {lead.budget}
                      </p>

                      {lead.memo !== '-' && (
                        <p className="text-xs text-slate-500">
                          <strong>메모:</strong> {lead.memo}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#0055aa] hover:bg-[#004080] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors font-num whitespace-nowrap"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lead.phone}</span>
                      </a>

                      {confirmDeleteId === lead.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="px-2.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          >
                            삭제 확인
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(lead.id)}
                          title="삭제"
                          aria-label={`${lead.name} 상담 내역 삭제`}
                          className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
