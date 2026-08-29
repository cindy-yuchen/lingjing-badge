import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Terminal, 
  HelpCircle, 
  Layers, 
  BookOpen, 
  Smartphone, 
  RefreshCw, 
  Github,
  Zap
} from "lucide-react";
import BadgeSimulator from "./components/BadgeSimulator";
import CompanionPanel from "./components/CompanionPanel";

interface LogMessage {
  text: string;
  type: "info" | "success" | "warn" | "error" | "ai";
  time: string;
}

interface ReadingLog {
  question: string;
  spreadName: string;
  cards: { name: string; orientation: string; position: string }[];
  readingText: string;
  timestamp: string;
}

export default function App() {
  const [readingHistory, setReadingHistory] = useState<ReadingLog[]>([]);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // Initialize companion logs with rich simulated ESP32 startup sequences
  useEffect(() => {
    const defaultTime = () => 
      new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    setLogs([
      { text: "[BOOT] ESP32-S3 system start-up loading...", type: "info", time: defaultTime() },
      { text: "[CHIP] CPU clocks set to 240MHz Dual-Core Xtensa 32-bit LX7", type: "info", time: defaultTime() },
      { text: "[MEM] 512KB SRAM + 8MB PSRAM found & map allocation OK", type: "success", time: defaultTime() },
      { text: "[SCREEN] CST9217 driver initialized. AMOLED Round Bezel set to 466x466 @ 60Hz", type: "success", time: defaultTime() },
      { text: "[SENSORS] IMU 6-Axis QMI8658 loaded. Accelerometer calibrated.", type: "success", time: defaultTime() },
      { text: "[AUDIO] Dual I2S Microphone block enabled. Noise canceling active.", type: "success", time: defaultTime() },
      { text: "[WIFI] Station successfully connected to target client. Gateway: 192.168.4.1", type: "success", time: defaultTime() },
      { text: "[SYSTEM] Tarot.app daemon running. Ready and waiting for physical trigger...", type: "info", time: defaultTime() }
    ]);
  }, []);

  const handleNewReadingLogged = (newReading: ReadingLog) => {
    const timestamp = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    // Add new reading to history
    setReadingHistory((prev) => [newReading, ...prev]);

    // Append related logs
    setLogs((prev) => [
      ...prev,
      {
        text: `[SYSTEM] 占卜结果接收成功! 牌阵: ${newReading.spreadName}`,
        type: "success",
        time: timestamp,
      },
      {
        text: `[AI] DeepSeek 完美产出了解析 (${newReading.readingText.length} 字)。契约已完成。`,
        type: "ai",
        time: timestamp,
      }
    ]);
  };

  // Helper function to append normal serial console logs externally
  const appendLog = (text: string, type: "info" | "success" | "warn" | "error" | "ai") => {
    const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [...prev, { text, type, time }]);
  };

  // Listen to visual trigger actions on the simulated badge and print corresponding logs
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
          // If classes or content inside screen updates, we can detect and print
        }
      });
    });

    // We can also simply listen to click triggers on specific element IDs!
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const elementId = target.closest("[id]")?.id;
      if (!elementId) return;

      const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      switch (elementId) {
        case "btn-pwr-hardware":
          // Check power toggle or boot triggers
          appendLog("[KEY] 触发物理 [PWR] 按键事件", "warn");
          break;
        case "btn-boot-hardware":
          appendLog("[KEY] 触发物理 [BOOT] 按键事件", "info");
          break;
        case "btn-quick-start":
          appendLog("[TOUCH] 点击屏幕 [开始启示] 触发牌阵选择程序", "info");
          break;
        case "btn-spread-confirm":
          appendLog("[TOUCH] 选择确认牌阵，加载双麦克风语音及键盘录入", "info");
          break;
        case "btn-voice-start":
          appendLog("[AUDIO] 麦克风阵列开启接收灵性问题声音信号中...", "warn");
          break;
        case "btn-voice-stop":
          appendLog("[AUDIO] 停止麦克风阵列拾音，语音识别转换进行中...", "success");
          break;
        case "btn-voice-submit":
          appendLog("[TOUCH] 确定占卜问题。加载 QMI8658 陀螺仪洗牌引擎", "success");
          break;
        case "btn-shuffle-simulate":
          appendLog("[IMU] 摇晃中断指令接收: 触发 QMI8658 洗牌算法 - 加速乱序重组", "success");
          break;
        case "btn-ai-read-trigger":
          appendLog("[WIFI] 发起 API 连接: 请求 DeepSeek 算理解析牌位契合度...", "warn");
          break;
        case "btn-go-qr":
          appendLog("[TOUCH] 进入电子吧唧 AP 配网扫码终端", "info");
          break;
        default:
          break;
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2dcd0] flex flex-col justify-between py-6 px-4 md:px-10 relative overflow-x-hidden font-serif select-none">
      
      {/* Decorative cosmic background stars and mist */}
      <div className="absolute inset-0 bg-[#0a0a0c] pointer-events-none" />
      <div className="absolute inset-0 gold-dotted-bg opacity-[0.07] pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <header className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#c5a059]/20 pb-6 mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#c5a059] flex items-center justify-center shadow-lg bg-[#0a0a0c]">
            <Sparkles className="w-5 h-5 text-[#c5a059] animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-[#e2dcd0] flex flex-wrap items-center gap-2">
              <span className="uppercase tracking-[0.1em]">ESP32-S3 灵镜电子吧唧</span>
              <span className="text-[10px] uppercase font-sans font-bold tracking-widest bg-[#c5a059]/10 text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30">
                Tarot Badge Simulator v2.1
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              1.75 英寸圆型 AMOLED 灵镜屏 • 六轴 QMI8658 陀螺仪洗牌 • 双麦麦克风 AI 智能解卦
            </p>
          </div>
        </div>

        {/* Header Status badges */}
        <div className="flex items-center gap-3 font-sans">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-[#121216] border border-[#c5a059]/20 px-3 py-1.5 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-ping" />
            <span className="text-[#c5a059]">Arcane Live Engine Activated</span>
          </div>
          <div className="text-xs font-mono text-slate-500">
            LOC: <span className="text-[#c5a059]">ESP32-S3R8 AP MODE</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER WORKBENCH */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 z-10 mb-8">
        
        {/* LEFT COLUMN: THE PHYSICAL HARDWARE PROTOTYPE SIMULATOR DISPLAY (5 cols) */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center p-3">
          {/* Main hardware container bezel frame */}
          <div className="w-full flex justify-center">
            <BadgeSimulator
              onNewReadingLogged={handleNewReadingLogged}
            />
          </div>

          {/* Quick Guidance Instructions on simulator usage */}
          <div className="mt-8 bg-[#121216] rounded-xl border border-[#c5a059]/20 p-5 w-full max-w-[430px] space-y-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-b border-[#c5a059]/10 pb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
              <span className="text-xs font-sans text-[#c5a059] font-bold uppercase tracking-[0.2em] block">
                ✧ 硬件交互操作说明 Panel
              </span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-[#c5a059] font-mono font-bold shrink-0">[PWR 键]</span>
                <span>右侧橙色物理 PWR 键可供随时点击，触发硬件休眠或冷启动流程。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#c5a059] font-mono font-bold shrink-0">[BOOT 键]</span>
                <span>左侧蓝色物理 BOOT 键可供点击，触发洗牌算法或一键明牌等核心中断行为。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#c5a059] font-mono font-bold shrink-0">[重力摇晃]</span>
                <span>在设备处于洗牌画面时，点击“模拟物理摇晃”，或者直接真实拿着您的手机进行晃动。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#c5a059] font-mono font-bold shrink-0">[密钥配网]</span>
                <span>吧唧在 AP 配网页广播热点。AI 解析由云端 DeepSeek 服务提供，密钥已在服务端安全托管。</span>
              </li>
            </ul>
          </div>
        </section>

        {/* RIGHT COLUMN: THE COMPANION ADMIN CONTROLLER LAPTOP SYSTEM (7 cols) */}
        <section className="lg:col-span-7 h-full flex flex-col">
          <CompanionPanel
            logs={logs}
            setLogs={setLogs}
            readingHistory={readingHistory}
          />
        </section>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto w-full border-t border-[#c5a059]/20 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 z-10 font-sans">
        <div>
          <span>© 2026 Waveshare Integrated Embedded Arcane Solutions. Inspired by DeepSeek LLM.</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#c5a059]/80 font-serif">
            <Zap className="w-3.5 h-3.5 text-[#c5a059]" /> Arcane Nexus v2.1
          </span>
          <span>•</span>
          <span>Single-Core ultra-low-consumption round crystal screen</span>
        </div>
      </footer>

    </div>
  );
}
