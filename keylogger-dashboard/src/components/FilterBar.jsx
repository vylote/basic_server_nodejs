import React from 'react';

const styles = `
.fb {
  --fb-surface: #16191d;
  --fb-field: #1f242a;
  --fb-border: #2c333b;
  --fb-border-hover: #3f4954;
  --fb-text: #e6e9ed;
  --fb-muted: #8a94a0;
  --fb-accent: #4fb3a5;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px 16px;
  margin-bottom: 20px;
  padding: 16px 18px;
  background: var(--fb-surface);
  border: 1px solid var(--fb-border);
  border-radius: 10px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.fb-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }

.fb-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--fb-muted);
}

.fb-control {
  position: relative;
  display: flex;
  align-items: center;
}

.fb-icon {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  color: var(--fb-muted);
  pointer-events: none;
}

.fb-input {
  width: 100%;
  box-sizing: border-box;
  height: 38px;
  padding: 0 32px 0 34px;
  background: var(--fb-field);
  color: var(--fb-text);
  border: 1px solid var(--fb-border);
  border-radius: 7px;
  font-size: 14px;
  font-family: inherit;
  color-scheme: dark;
  transition: border-color .15s, box-shadow .15s;
}

.fb-input::placeholder { color: #5d6670; }
.fb-input:hover { border-color: var(--fb-border-hover); }
.fb-input:focus {
  outline: none;
  border-color: var(--fb-accent);
  box-shadow: 0 0 0 3px rgba(79, 179, 165, .22);
}

.fb-clear {
  position: absolute;
  right: 6px;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  padding: 0;
  background: transparent;
  color: var(--fb-muted);
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
.fb-clear:hover { color: var(--fb-text); background: var(--fb-border); }
.fb-clear:focus-visible { outline: 2px solid var(--fb-accent); }

@media (prefers-reduced-motion: reduce) {
  .fb-input { transition: none; }
}
`;

const icons = {
  search: (
    <path d="M11 11l3.5 3.5M7 12.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" />
  ),
  globe: (
    <path d="M8 14.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM1.5 8h13M8 1.5c1.8 1.8 2.7 4 2.7 6.5S9.8 12.7 8 14.5C6.2 12.7 5.3 10.5 5.3 8S6.2 3.3 8 1.5z" />
  ),
  monitor: (
    <path d="M2 2.5h12v8H2zM5.5 13.5h5M8 10.5v3" />
  ),
  calendar: (
    <path d="M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 1.5v3M10.5 1.5v3" />
  ),
};

function Icon({ name }) {
  return (
    <svg
      className="fb-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Field({ label, icon, type = 'text', placeholder, value, onChange, canClear = true }) {
  return (
    <label className="fb-field">
      <span className="fb-label">{label}</span>
      <span className="fb-control">
        <Icon name={icon} />
        <input
          className="fb-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {canClear && value ? (
          <button
            type="button"
            className="fb-clear"
            aria-label={`Xoá ${label.toLowerCase()}`}
            onClick={() => onChange('')}
          >
            ×
          </button>
        ) : null}
      </span>
    </label>
  );
}

export default function FilterBar({
  searchContent, setSearchContent,
  filterIp, setFilterIp,
  filterOs, setFilterOs,
  startDate, setStartDate,
  endDate, setEndDate,
  onFilterChange,
}) {
  return (
    <div className="fb">
      <style>{styles}</style>

      <Field
        label="Nội dung"
        icon="search"
        placeholder="Tìm kiếm nội dung..."
        value={searchContent}
        onChange={(v) => onFilterChange(setSearchContent, v)}
      />
      <Field
        label="Địa chỉ IP"
        icon="globe"
        placeholder="Ví dụ: 127.0.0.1"
        value={filterIp}
        onChange={(v) => onFilterChange(setFilterIp, v)}
      />
      <Field
        label="Hệ điều hành (OS)"
        icon="monitor"
        placeholder="Ví dụ: python-requests"
        value={filterOs}
        onChange={(v) => onFilterChange(setFilterOs, v)}
      />
      <Field
        label="Từ ngày"
        icon="calendar"
        type="date"
        value={startDate}
        onChange={(v) => onFilterChange(setStartDate, v)}
        canClear={false}
      />
      <Field
        label="Đến ngày"
        icon="calendar"
        type="date"
        value={endDate}
        onChange={(v) => onFilterChange(setEndDate, v)}
        canClear={false}
      />
    </div>
  );
}