import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Settings, 
  HelpCircle, 
  Clock, 
  Eye, 
  FileText, 
  MessageSquare, 
  Copy, 
  Check, 
  Compass, 
  Sparkles,
  Link,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface LogMessage {
  text: string;
  type: "info" | "success" | "warn" | "error" | "ai";
  time: string;
}

interface CompanionPanelProps {
  logs: LogMessage[];
  setLogs: React.Dispatch<React.SetStateAction<LogMessage[]>>;
  readingHistory: {
    question: string;
    spreadName: string;
    cards: { name: string; orientation: string; position: string }[];
    readingText: string;
    timestamp: string;
  }[];
}

export default function CompanionPanel({
  logs,
  setLogs,
  readingHistory
}: CompanionPanelProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "reading" | "history" | "api_settings">("reading");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedHistoryIdx, setExpandedHistoryIdx] = useState<number | null>(null);
  const [simulatedIp, setSimulatedIp] = useState("192.168.4.1");

  // Handle auto scrolling for the terminal tab
  useEffect(() => {
    const el = document.getElementById("terminal-scroll-area");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs, activeTab]);

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentReading = readingHistory[0]; // Most recent reading

  return (
    <div className="bg-[#0c0c0e] rounded-2xl border border-[#c5a059]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] h-full flex flex-col overflow-hidden">
      
      {/* Upper header section showing companion name and live indicators */}
      <div className="border-b border-[#c5a059]/20 p-4 bg-[#0a0a0c]/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse glow-gold" />
          <div>
            <h1 className="text-sm font-sans font-bold tracking-wider text-slate-200 flex items-center gap-1.5">
              <span>ARCANE NEXUS SECURE PORTAL</span>
              <span className="text-[10px] bg-[#c5a059]/10 text-[#c5a059] font-mono border border-[#c5a059]/30 rounded px-1.5 py-0.5">
                ESP32 ONLINE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Gate Access: <span className="text-[#c5a059] underline cursor-pointer">http://{simulatedIp}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">Node IP:</span>
          <span className="text-[10px] font-mono text-[#c5a059] font-bold bg-[#121216] px-2 py-0.5 rounded border border-[#c5a059]/20">
            {simulatedIp}
          </span>
        </div>
      </div>

      {/* Admin Tab selection bar */}
      <div className="flex border-b border-[#c5a059]/10 bg-[#121216]/40 px-2 pt-1 gap-1">
        <button
          id="tab-reading"
          onClick={() => setActiveTab("reading")}
          className={`px-3 py-2 text-xs font-sans font-semibold cursor-pointer rounded-t-lg transition-all ${
            activeTab === "reading"
              ? "bg-[#0c0c0e] text-[#c5a059] border-x border-t border-[#c5a059]/30 -mb-[1px]"
              : "text-slate-400 hover:text-slate-200"
          } flex items-center gap-1.5`}
        >
          <Sparkles className="w-3.5 h-3.5" /> 🔮 AI 占卜解析
        </button>

        <button
          id="tab-terminal"
          onClick={() => setActiveTab("terminal")}
          className={`px-3 py-2 text-xs font-sans font-semibold cursor-pointer rounded-t-lg transition-all ${
            activeTab === "terminal"
              ? "bg-[#0c0c0e] text-[#c5a059] border-x border-t border-[#c5a059]/30 -mb-[1px]"
              : "text-slate-400 hover:text-slate-200"
          } flex items-center gap-1.5`}
        >
          <Terminal className="w-3.5 h-3.5" /> 💻 硬件串口日志
        </button>

        <button
          id="tab-history"
          onClick={() => setActiveTab("history")}
          className={`px-3 py-2 text-xs font-sans font-semibold cursor-pointer rounded-t-lg transition-all ${
            activeTab === "history"
              ? "bg-[#0c0c0e] text-[#c5a059] border-x border-t border-[#c5a059]/30 -mb-[1px]"
              : "text-slate-400 hover:text-slate-200"
          } flex items-center gap-1.5`}
        >
          <Clock className="w-3.5 h-3.5" /> 📜 历史卦象
        </button>

        <button
          id="tab-settings"
          onClick={() => setActiveTab("api_settings")}
          className={`px-3 py-2 text-xs font-sans font-semibold cursor-pointer rounded-t-lg transition-all ${
            activeTab === "api_settings"
              ? "bg-[#0c0c0e] text-[#c5a059] border-x border-t border-[#c5a059]/30 -mb-[1px]"
              : "text-slate-400 hover:text-slate-200"
          } flex items-center gap-1.5`}
        >
          <Settings className="w-3.5 h-3.5" /> ⚙️ 扫码配网
        </button>
      </div>

      {/* Dynamic contents */}
      <div className="flex-1 overflow-y-auto p-5 relative select-text">
        
        {/* TABA: DEEPMIND AI TAROT READING SCREEN */}
        {activeTab === "reading" && (
          <div className="h-full flex flex-col font-serif">
            {currentReading ? (
              <div className="space-y-4">
                {/* Visual spread details overlay */}
                <div className="bg-[#121216] rounded-xl p-5 border border-[#c5a059]/20 shadow-[inset_0_4px_24px_rgba(0,0,0,0.5)]">
                  <div className="text-[10px] font-sans text-[#c5a059]/80 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-[1px] bg-[#c5a059]/40"></span>
                    CURRENT DISK SPREAD
                    <span className="w-1.5 h-[1px] bg-[#c5a059]/40"></span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 font-serif mt-1">
                    {currentReading.spreadName}
                  </h2>
                  <p className="text-xs text-[#c5a059] mt-2 font-medium italic pl-3 border-l border-[#c5a059]/35">
                    “{currentReading.question || "未设置求索问题"}”
                  </p>

                  {/* Draw Cards mini ribbon list */}
                  <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                    {currentReading.cards.map((c, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#0a0a0c]/80 border border-[#c5a059]/20 rounded-md px-3 py-1.5 text-[11px] flex items-center gap-2 shadow-sm font-sans"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                        <span className="text-slate-400 font-mono">[{c.position}]</span>
                        <span className="text-[#e2dcd0] font-bold font-serif">{c.name}</span>
                        <span className={`text-[9px] px-1 font-bold rounded ${
                          c.orientation === "逆位" ? "bg-red-950/40 text-red-400 border border-red-900/30" : "bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20"
                        }`}>
                          {c.orientation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main scrollable text output window with rich beautiful custom css */}
                <div className="bg-[#121216]/40 border border-[#c5a059]/15 rounded-xl p-5 relative min-h-[220px]">
                  <div className="absolute top-4 right-4 flex items-center gap-2 font-sans">
                    <button
                      id="btn-copy-reading"
                      onClick={() => handleCopyText(currentReading.readingText, 99)}
                      className="p-1.5 px-3 bg-[#0c0c0e] border border-[#c5a059]/30 hover:border-[#c5a059] hover:bg-[#121216] hover:text-white rounded text-[10px] text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
                    >
                      {copiedIndex === 99 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>已复制!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#c5a059]" />
                          <span>复制全篇</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-xs font-sans text-slate-500 mb-4 tracking-[0.2em] uppercase">
                    🔮 REVELATION DEFEATED • DEEPSEEK AI CORE
                  </h3>
                  
                  {/* Styled markdown output panel */}
                  <div className="text-sm text-slate-350 leading-relaxed font-sans space-y-3 whitespace-pre-line select-text pl-1">
                    {currentReading.readingText}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-52 text-slate-500">
                <Compass className="w-12 h-12 text-[#c5a059]/30 animate-spin-slow mb-4" />
                <p className="text-xs font-bold tracking-widest text-slate-300 uppercase">Awaiting Sacred Reading Signal</p>
                <p className="text-[11px] text-slate-400 mt-2 max-w-sm leading-relaxed font-sans">
                  请按圆盘 AMOLED 屏身上的 [开始启示]、输入灵性问题并抽取牌面，一经双向握手，高阶 DeepSeek 便会计量卦象重组，在此向您徐徐展开长文解牌。
                </p>
              </div>
            )}
          </div>
        )}

        {/* TABB: VIRTUAL HARDWARE SERIAL LOG TERMINAL */}
        {activeTab === "terminal" && (
          <div className="flex flex-col h-full font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#c5a059]" />
                ESP32 UART0 @ 115200 BAUD CORE SHELL
              </span>
              <button
                id="btn-clear-logs"
                onClick={() => setLogs([])}
                className="text-[9.5px] text-[#c5a059] hover:text-[#e2dcd0] border border-[#c5a059]/30 bg-[#c5a059]/5 px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                清空控制台
              </button>
            </div>

            <div 
              id="terminal-scroll-area"
              className="bg-black/95 p-4 rounded-xl border border-[#c5a059]/20 text-xs text-slate-300 leading-normal overflow-y-auto max-h-[350px] min-h-[220px] shadow-inner select-text h-72"
            >
              {logs.map((log, idx) => (
                <div key={idx} className="mb-1.5 flex items-start gap-2">
                  <span className="text-slate-600 shrink-0 text-[10px] select-none font-sans">
                    [{log.time}]
                  </span>
                  <span className={`break-all ${
                    log.type === "success" ? "text-emerald-400" :
                    log.type === "warn" ? "text-[#c5a059]" :
                    log.type === "error" ? "text-red-400 font-bold" :
                    log.type === "ai" ? "text-sky-300" : "text-slate-300"
                  }`}>
                    {log.text}
                  </span>
                </div>
              ))}
              <div className="w-full h-1" />
            </div>
          </div>
        )}

        {/* TABC: ARCHIVE HISTORY LOG SUMMARY LIST */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 mb-2 font-sans border-b border-[#c5a059]/10 pb-2">
              <FileText className="w-4 h-4 text-[#c5a059]" />
              <span className="text-xs font-mono text-[#c5a059] font-bold uppercase tracking-[0.2em] block">
                Reading Chronicles Archives ({readingHistory.length})
              </span>
            </div>

            {readingHistory.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-xs font-sans">
                暂无历史神龛留底记录
              </div>
            ) : (
              readingHistory.map((item, idx) => {
                const isExpanded = expandedHistoryIdx === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-[#121216]/50 border border-[#c5a059]/15 rounded-xl overflow-hidden transition-all hover:border-[#c5a059]/30"
                  >
                    {/* Collapsed view banner header clicker */}
                    <div 
                      onClick={() => setExpandedHistoryIdx(isExpanded ? null : idx)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#c5a059]/5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-[#c5a059]/10 text-[#c5a059] px-2 py-0.5 rounded font-mono font-bold border border-[#c5a059]/20">
                            {item.timestamp}
                          </span>
                          <span className="text-xs font-bold text-slate-100 font-serif">
                            {item.spreadName}
                          </span>
                        </div>
                        <p className="text-xs text-[#c5a059]/80 italic line-clamp-1 max-w-[400px] pl-1 font-sans">
                          &ldquo;{item.question}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#c5a059]" /> : <ChevronDown className="w-4 h-4 text-[#c5a059]/60" />}
                      </div>
                    </div>

                    {/* Expand details view */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-[#c5a059]/10 bg-black/30 pt-3 space-y-3 select-text font-sans">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.cards.map((c, i) => (
                            <span 
                              key={i} 
                              className="bg-[#0c0c0e] border border-[#c5a059]/15 text-[10px] text-slate-300 px-2 py-0.5 rounded font-serif"
                            >
                              [{c.position}] <strong className="text-[#c5a059]">{c.name}</strong> • {c.orientation}
                            </span>
                          ))}
                        </div>

                        <div className="bg-[#0c0c0e] p-4 rounded-lg border border-[#c5a059]/10 text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                          {item.readingText}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TABD: DIGITAL QR & MANUAL CONFIG WEB PORTAL */}
        {activeTab === "api_settings" && (
          <div className="space-y-4 font-sans">
            <div className="bg-[#121216] border border-[#c5a059]/20 rounded-xl p-4 flex gap-3 text-slate-300">
              <Link className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  ESP32 AP Node Access Guide (无线配置门户)
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  您的 ESP32 暗黑电子吧唧塔罗牌阅读器配备了 AP 热点功能。在真实的硬件上，您可以用手机连接其广播的
                  <strong className="text-[#c5a059]"> Tarot-Badge-AP </strong> 热点，随后登录浏览器网关地址即可完成对网络 Wi-Fi 的扫描配网。AI 解析由云端 DeepSeek 服务统一提供。
                </p>
              </div>
            </div>

            <div className="bg-[#121216] border border-[#c5a059]/20 p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-mono text-[#c5a059] font-bold uppercase tracking-[0.2em]">
                🔑 LLM KEY ACCESS (服务端托管)
              </h4>
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  DeepSeek API 密钥已由 Cloudflare 服务端 Secret（DEEPSEEK_API_KEY）安全托管，
                  不会暴露在前端、也不会写入任何代码或仓库。
                </p>
                <span className="text-[9px] text-slate-500 block leading-normal mt-1.5">
                  ⚠️ 如需更换密钥，请在 Cloudflare Pages 面板的环境变量中更新 Secret，前端无需任何操作。
                </span>
              </div>
            </div>

            <div className="p-3 text-center bg-[#c5a059]/5 border border-[#c5a059]/15 rounded-lg text-[#c5a059] text-[10px] font-mono">
              ⚡ WLAN Connection Established OK • AP Module: ESP32-S3-A2-BD7F ⚡
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
