import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminLayout, { useAdminGuard } from './AdminLayout';
import { C, MILESTONES, ORDER_STATUS_COLOR } from '../../constants';

const PAGE_SIZE = 20;

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtPrice(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function milestoneLabel(key) {
  return MILESTONES.find((m) => m.key === key)?.en ?? key?.replace(/_/g, ' ') ?? '—';
}

function milestoneIcon(key) {
  return MILESTONES.find((m) => m.key === key)?.icon ?? '📍';
}

// ─── Skeleton rows ─────────────────────────────────────────
function SkeletonRows({ n = 8 }) {
  return Array.from({ length: n }).map((_, i) => (
    <tr key={i} style={{ pointerEvents: 'none' }}>
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j}>
          <div className="cv-skeleton" style={{ height: 14, width: j === 0 ? 90 : j === 2 ? 140 : 80, borderRadius: 4 }} />
        </td>
      ))}
    </tr>
  ));
}

// ─── Status filter tabs ─────────────────────────────────────
const STATUS_TABS = [
  { value: '',          label: 'All' },
  { value: 'PENDING',   label: 'Pending' },
  { value: 'PAID',      label: 'Paid' },
  { value: 'SHIPPING',  label: 'Shipping' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function AdminOrders({ lang, setLang }) {
  const isAdmin = useAdminGuard();

  const [orders, setOrders]           = useState([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [statusTab, setStatusTab]     = useState('');
  const [page, setPage]               = useState(1);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('bmw_token');
    try {
      // Fetch up to 500 at once for client-side search + pagination
      const params = new URLSearchParams({ page: '1', limit: '500' });
      if (statusTab) params.set('status', statusTab);

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { window.location.hash = '#/login'; return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
      setError(null);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [statusTab]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Reset page when search or tab changes
  useEffect(() => { setPage(1); }, [search, statusTab]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.carModel.toLowerCase().includes(q),
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToDetail(orderId) {
    window.location.hash = `#/admin/orders/${orderId}`;
  }

  if (!isAdmin) return null;

  return (
    <AdminLayout lang={lang} setLang={setLang}>
      {/* Page header */}
      <div className="cv-admin-page-header">
        <div>
          <div className="cv-admin-page-title">Orders</div>
          <div className="cv-admin-page-subtitle">
            {loading ? 'Loading…' : `${total.toLocaleString()} total orders`}
          </div>
        </div>
        <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={fetchOrders} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`cv-btn cv-btn-sm${statusTab === tab.value ? ' cv-btn-primary' : ' cv-btn-ghost'}`}
            onClick={() => setStatusTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="cv-admin-toolbar">
        <div className="cv-search">
          <span className="cv-search-icon">🔍</span>
          <input
            className="cv-input"
            type="search"
            placeholder="Search by order ID, email, or model…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="cv-text-sm cv-text-dim" style={{ whiteSpace: 'nowrap' }}>
          {filtered.length !== orders.length
            ? `${filtered.length} of ${orders.length} shown`
            : `${filtered.length} orders`}
        </span>
      </div>

      {error && (
        <div className="cv-alert cv-alert-error cv-mb-16">
          <span className="cv-alert-icon">✕</span>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="cv-table-card">
        <div className="cv-table-wrap">
          <table className="cv-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Car Model</th>
                <th>Milestone</th>
                <th>Status</th>
                <th>Last Update</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows n={8} />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="cv-table-empty">
                    {search ? 'No orders match your search.' : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                paginated.map((order) => {
                  const milestone = order.shipment?.currentMilestone;
                  const lastEvent = order.shipment?.trackingEvents?.[0];
                  const statusClass = ORDER_STATUS_COLOR[order.status] ?? 'cv-badge-gray';

                  return (
                    <tr key={order.id} onClick={() => goToDetail(order.id)}>
                      {/* Order ID */}
                      <td>
                        <span className="cv-table-mono">{order.id.slice(0, 12)}…</span>
                      </td>

                      {/* Customer */}
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{order.user?.name}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{order.user?.email}</div>
                      </td>

                      {/* Car model */}
                      <td style={{ fontWeight: 500 }}>{order.carModel}</td>

                      {/* Milestone */}
                      <td>
                        {milestone ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                            <span>{milestoneIcon(milestone)}</span>
                            <span>{milestoneLabel(milestone)}</span>
                          </span>
                        ) : (
                          <span style={{ color: C.textDim, fontSize: 12 }}>No shipment</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`cv-badge ${statusClass}`}>{order.status}</span>
                      </td>

                      {/* Last update */}
                      <td style={{ fontSize: 12, color: C.textDim, whiteSpace: 'nowrap' }}>
                        {fmtDate(lastEvent?.timestamp ?? order.createdAt)}
                      </td>

                      {/* Price */}
                      <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {fmtPrice(order.totalPrice)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {!loading && paginated.length > 0 && (
          <div className="cv-admin-table-footer">
            <span className="cv-text-sm cv-text-dim">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="cv-pagination">
              <button
                className="cv-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹ Prev
              </button>

              {/* Page number pills (show up to 5) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} style={{ color: C.textDim, fontSize: 12, padding: '0 4px' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className={`cv-page-btn${page === p ? ' active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                className="cv-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
