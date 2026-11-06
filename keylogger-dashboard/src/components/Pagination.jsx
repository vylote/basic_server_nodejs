import React from 'react';

const styles = `
.pg {
  --pg-surface: #16191d;
  --pg-field: #1f242a;
  --pg-border: #2c333b;
  --pg-border-hover: #3f4954;
  --pg-text: #e6e9ed;
  --pg-muted: #8a94a0;
  --pg-accent: #4fb3a5;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.pg-nav { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }

.pg-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--pg-field);
  color: var(--pg-text);
  border: 1px solid var(--pg-border);
  border-radius: 7px;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color .15s, background-color .15s;
}
.pg-btn:hover:not(:disabled) { border-color: var(--pg-border-hover); background: #262c33; }
.pg-btn:focus-visible { outline: 2px solid var(--pg-accent); outline-offset: 2px; }
.pg-btn:disabled { opacity: .4; cursor: not-allowed; }

.pg-btn[aria-current="page"] {
  background: var(--pg-accent);
  border-color: var(--pg-accent);
  color: #0d1514;
  font-weight: 600;
  cursor: default;
}

.pg-gap { padding: 0 4px; color: var(--pg-muted); user-select: none; }

.pg-info { font-size: 13px; color: var(--pg-muted); }
.pg-info strong { color: var(--pg-text); font-weight: 600; }

@media (max-width: 560px) {
  .pg { justify-content: center; }
  .pg-info { width: 100%; text-align: center; order: 2; }
}
@media (prefers-reduced-motion: reduce) {
  .pg-btn { transition: none; }
}
`;

// Trả về mảng số trang kèm dấu "…", ví dụ: [1, '…', 4, 5, 6, '…', 20]
function getPageItems(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  if (start > 2) items.push('gap-left');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push('gap-right');
  items.push(total);
  return items;
}

export default function Pagination({ page, totalPages, setPage }) {
  const total = Math.max(totalPages || 1, 1);
  const goTo = (p) => setPage(Math.min(Math.max(p, 1), total));

  return (
    <nav className="pg" aria-label="Phân trang">
      <style>{styles}</style>

      <span className="pg-info">
        Trang <strong>{page}</strong> / <strong>{total}</strong>
      </span>

      <div className="pg-nav">
        <button
          type="button"
          className="pg-btn"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Trang trước"
        >
          ‹ Trước
        </button>

        {getPageItems(page, total).map((item) =>
          typeof item === 'string' ? (
            <span key={item} className="pg-gap" aria-hidden="true">…</span>
          ) : (
            <button
              key={item}
              type="button"
              className="pg-btn"
              onClick={() => goTo(item)}
              aria-current={item === page ? 'page' : undefined}
              aria-label={`Trang ${item}`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className="pg-btn"
          onClick={() => goTo(page + 1)}
          disabled={page >= total}
          aria-label="Trang sau"
        >
          Sau ›
        </button>
      </div>
    </nav>
  );
}