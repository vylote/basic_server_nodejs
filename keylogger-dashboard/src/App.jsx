import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from './components/FilterBar';
import LogTable from './components/LogTable';
import Pagination from './components/Pagination';

const styles = `
.app {
  --app-bg: #0f1114;
  --app-surface: #16191d;
  --app-border: #2c333b;
  --app-text: #e6e9ed;
  --app-muted: #8a94a0;
  --app-accent: #4fb3a5;

  min-height: 100vh;
  padding: 28px 24px 48px;
  background: var(--app-bg);
  color: var(--app-text);
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.app-inner { max-width: 1180px; margin: 0 auto; }

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.app-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--app-accent);
  box-shadow: 0 0 0 3px rgba(79, 179, 165, .18);
}

.app-stats {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--app-muted);
}

.app-stats strong { color: var(--app-text); font-weight: 600; }

.app-error {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #2a1a1a;
  border: 1px solid #5a2a2a;
  border-radius: 8px;
  color: #f0a8a8;
  font-size: 13px;
}

.app-table-wrap { position: relative; }

.app-table-wrap.is-loading { opacity: .55; pointer-events: none; }
@media (prefers-reduced-motion: no-preference) {
  .app-table-wrap { transition: opacity .15s; }
}
`;

export default function App() {
  const [logs, setLogs] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const limit = 15;

  // Bộ lọc
  const [searchContent, setSearchContent] = useState('');
  const [filterIp, setFilterIp] = useState('');
  const [filterOs, setFilterOs] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(searchContent && { search: searchContent }),
        ...(filterIp && { ip: filterIp }),
        ...(filterOs && { os: filterOs }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`${API_BASE_URL}/api/logs?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setTotalLogs(data.totalLogs || 0);
      setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
      setError('');
    } catch (err) {
      setError(`Không thể kết nối tới máy chủ (${API_BASE_URL}).`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, page, searchContent, filterIp, filterOs, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="app">
      <style>{styles}</style>
      <div className="app-inner">
        <header className="app-header">
          <h1 className="app-title">
            <span className="app-dot" aria-hidden="true" />
            Dashboard Quản Lý Log
          </h1>
          <div className="app-stats">
            <span>Tổng bản ghi: <strong>{totalLogs}</strong></span>
            <span>Cập nhật lúc: <strong>{lastUpdate || '—'}</strong></span>
          </div>
        </header>

        {error && <div className="app-error">{error}</div>}

        <FilterBar
          searchContent={searchContent} setSearchContent={setSearchContent}
          filterIp={filterIp} setFilterIp={setFilterIp}
          filterOs={filterOs} setFilterOs={setFilterOs}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          onFilterChange={handleFilterChange}
        />

        <div className={`app-table-wrap${loading ? ' is-loading' : ''}`}>
          <LogTable logs={logs} />
        </div>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}