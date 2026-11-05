import React, { useState, useEffect } from 'react';

function App() {
  const [logs, setLogs] = useState("Đang tải dữ liệu từ server...");
  const [lastUpdate, setLastUpdate] = useState("");
  const [activeTab, setActiveTab] = useState("logs");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Tự động lấy URL dựa theo môi trường (Local vs Production)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // Hàm gọi API lấy log
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs`);
      const data = await response.json();
      setLogs(data.logs || "Chưa có dữ liệu log.");
      setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
    } catch (error) {
      setLogs(`Lỗi: Không thể kết nối tới Backend (${API_BASE_URL}).`);
    }
  };

  // Tự động làm mới log mỗi 4 giây nếu bật tính năng auto-refresh
  useEffect(() => {
    fetchLogs();
    if (!isAutoRefresh) return;
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  return (
    <div className="bg-[#0b0f19] text-[#e2e8f0] min-h-screen flex font-mono selection:bg-sky-500 selection:text-white">
      
      {/* 1. SIDEBAR (Menu bên trái) */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-3 h-3 bg-sky-500 rounded-full animate-ping"></div>
          <span className="font-bold text-lg text-white tracking-wider">KeyLogger v1.0</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <button 
            onClick={() => setActiveTab("logs")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-3 ${activeTab === "logs" ? 'bg-sky-600/10 text-sky-400 border border-sky-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <span>📊</span> Live Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-3 ${activeTab === "settings" ? 'bg-sky-600/10 text-sky-400 border border-sky-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <span>⚙️</span> Cấu hình hệ thống
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Environment: {import.meta.env.MODE}
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR (Thanh Bar phía trên) */}
        <header className="h-16 bg-[#111827] border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold text-base">Hệ thống Giám sát Thời gian Thực</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Server Connected
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Cập nhật: {lastUpdate || "Đang tải..."}</span>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {activeTab === "logs" ? (
            <>
              {/* Thẻ thống kê (Widgets Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1f2937] p-4 rounded-xl border border-slate-800 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Trạng thái Auto-Refresh</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-400 font-semibold">{isAutoRefresh ? "Đang bật (4s)" : "Đã tắt"}</span>
                    <button 
                      onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded text-white transition"
                    >
                      {isAutoRefresh ? "Tắt" : "Bật"}
                    </button>
                  </div>
                </div>

                <div className="bg-[#1f2937] p-4 rounded-xl border border-slate-800 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Backend Host</p>
                  <p className="text-sky-400 font-semibold text-sm mt-2 truncate">{API_BASE_URL}</p>
                </div>

                <div className="bg-[#1f2937] p-4 rounded-xl border border-slate-800 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Môi trường</p>
                  <p className="text-purple-400 font-semibold text-sm mt-2 uppercase">{import.meta.env.MODE}</p>
                </div>

                <div className="bg-[#1f2937] p-4 rounded-xl border border-slate-800 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Thao tác nhanh</p>
                  <button 
                    onClick={fetchLogs}
                    className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white text-xs py-1.5 rounded transition font-semibold"
                  >
                    Làm mới dữ liệu
                  </button>
                </div>
              </div>

              {/* Khu vực xem Log chính */}
              <div className="bg-[#1f2937] rounded-xl border border-slate-800 shadow-lg flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span>📄</span> Nhật ký văn bản từ Client
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    UTF-8 Log Stream
                  </span>
                </div>
                <div className="p-4">
                  <pre className="bg-[#0b0f19] text-[#34d399] p-4 rounded-lg whitespace-pre-wrap break-words leading-relaxed text-xs sm:text-sm border border-slate-900 max-h-[550px] overflow-y-auto shadow-inner">
                    {logs}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* Trang cấu hình */
            <div className="bg-[#1f2937] p-6 rounded-xl border border-slate-800 shadow-lg space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Cấu hình Hệ thống</h3>
              <p className="text-sm text-slate-400">Các thiết lập kết nối API Backend và tham số hiển thị dashboard.</p>
              <div className="space-y-2 text-sm">
                <label className="block text-slate-300 font-semibold">Active API Endpoint URL:</label>
                <input 
                  type="text" 
                  readOnly 
                  value={`${API_BASE_URL}/api/logs`} 
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded px-3 py-2 text-slate-400 select-all"
                />
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

export default App;