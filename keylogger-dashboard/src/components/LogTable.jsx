import React from 'react';

const styles = `
.lt {
  --lt-surface: #16191d;
  --lt-head: #1b1f24;
  --lt-row-hover: #1d2227;
  --lt-border: #2c333b;
  --lt-text: #e6e9ed;
  --lt-muted: #8a94a0;
  --lt-accent: #4fb3a5;

  background: var(--lt-surface);
  border: 1px solid var(--lt-border);
  border-radius: 10px;
  overflow-x: auto;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.lt-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
  color: var(--lt-text);
}

.lt-table th {
  position: sticky;
  top: 0;
  padding: 12px 16px;
  background: var(--lt-head);
  border-bottom: 1px solid var(--lt-border);
  color: var(--lt-muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.lt-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--lt-border);
  vertical-align: top;
}

.lt-table tbody tr:last-child td { border-bottom: 0; }
.lt-table tbody tr:hover td { background: var(--lt-row-hover); }

.lt-time { white-space: nowrap; color: var(--lt-accent); font-variant-numeric: tabular-nums; }

.lt-ip {
  white-space: nowrap;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px;
}

.lt-ua {
  max-width: 260px;
  color: var(--lt-muted);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lt-content {
  max-width: 520px;
  word-break: break-all;
  line-height: 1.5;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px;
}

.lt-empty {
  padding: 44px 16px !important;
  text-align: center;
  color: var(--lt-muted);
}
.lt-empty svg { display: block; margin: 0 auto 10px; width: 28px; height: 28px; }
`;

function formatTime(value) {
  if (!value) return 'N/A';
  const d = new Date(value);
  return isNaN(d) ? 'N/A' : d.toLocaleString('vi-VN');
}

export default function LogTable({ logs = [] }) {
  return (
    <div className="lt">
      <style>{styles}</style>
      <table className="lt-table">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>IP</th>
            <th>Hệ điều hành (User Agent)</th>
            <th>Nội dung ghi nhận</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log._id}>
                <td className="lt-time">{formatTime(log.createdAt)}</td>
                <td className="lt-ip">{log.clientIp}</td>
                <td className="lt-ua" title={log.userAgent}>{log.userAgent}</td>
                <td className="lt-content">{log.content}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="lt-empty">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 11l3.5 3.5M7 12.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" />
                </svg>
                Không tìm thấy bản ghi nào khớp. Thử đổi hoặc xoá bớt bộ lọc.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}