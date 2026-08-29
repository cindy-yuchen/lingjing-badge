import React, { useState, useEffect, useRef } from "react";
import { 
  RotateCw, 
  Sparkles, 
  Settings, 
  Cpu, 
  Wifi, 
  Battery, 
  Hourglass, 
  Compass, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Info,
  QrCode
} from "lucide-react";
import { TAROT_DECK, TAROT_SPREADS, TarotCard, CardSpread } from "./TarotDeck";
import AudioVisualizer from "./AudioVisualizer";

// Define the simulated board state
type PowerState = "OFF" | "BOOTING" | "RUNNING" | "SLEEP";
type ActiveAppView = "HOME" | "SPREAD_CHOOSER" | "QUESTION_INTAKE" | "SHUFFLING" | "DRAW_BOARD" | "READING_RESULT" | "QR_CONFIG";

interface DrawnCard extends TarotCard {
  orientation: "upright" | "reversed";
  isRevealed: boolean;
  positionLabel: string;
  positionDesc: string;
}

interface BadgeSimulatorProps {
  onNewReadingLogged: (log: {
    question: string;
    spreadName: string;
    cards: { name: string; orientation: string; position: string }[];
    readingText: string;
    timestamp: string;
  }) => void;
}

export default function BadgeSimulator({
  onNewReadingLogged
}: BadgeSimulatorProps) {
  // Device hardware states
  const [powerState, setPowerState] = useState<PowerState>("RUNNING");
  const [ledColor, setLedColor] = useState<"blue" | "green" | "amber" | "red" | "off">("green");
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [wifiConnected, setWifiConnected] = useState(true);
  const [activeView, setActiveView] = useState<ActiveAppView>("HOME");
  const [isPhysicalShaking, setIsPhysicalShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Ref for badge container to manage gentle 3D tilt without React re-renders
  const badgeContainerRef = useRef<HTMLDivElement | null>(null);

  // App logical states
  type AppMode = "TAROT" | "LIUYAO" | "SETTINGS";
  const [appMode, setAppMode] = useState<AppMode>("TAROT");
  const [liuYaoLines, setLiuYaoLines] = useState<number[]>([]);

  const [selectedSpread, setSelectedSpread] = useState<CardSpread>(TAROT_SPREADS[1]); // Past-Present-Future default
  const [spreadIndex, setSpreadIndex] = useState(1);
  const [question, setQuestion] = useState("");
  const [deck, setDeck] = useState<TarotCard[]>([...TAROT_DECK]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [selectedCardDetail, setSelectedCardDetail] = useState<DrawnCard | null>(null);
  
  // AI reading state
  const [isReadingPending, setIsReadingPending] = useState(false);
  const [aiReadingText, setAiReadingText] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Sound effects generator inside the e-Badge
  const playBeep = (freq = 800, duration = 0.08) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext blocks until touch, which is fine
    }
  };

  // Gyro accelerometer hover motion on GPU via inline styles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const badgeEl = badgeContainerRef.current;
      if (!badgeEl) return;
      const rect = badgeEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Constraint check: only apply transform when mouse is close to the badge simulator region
      const padding = 120;
      const isNear = 
        e.clientX >= rect.left - padding && 
        e.clientX <= rect.right + padding && 
        e.clientY >= rect.top - padding && 
        e.clientY <= rect.bottom + padding;

      if (isNear) {
        // High fidelity and incredibly lightweight 2D shift to look interactive, but 100% click-safe in Chrome cross-domain iframe environments
        const maxShiftX = 8; // Max px shift
        const maxShiftY = 8;
        const rotateFactor = 1.8; // subtle angle
        badgeEl.style.setProperty("--shift-x", `${x * maxShiftX}px`);
        badgeEl.style.setProperty("--shift-y", `${y * maxShiftY}px`);
        badgeEl.style.setProperty("--tilt-r", `${x * rotateFactor}deg`);
      } else {
        badgeEl.style.setProperty("--shift-x", "0px");
        badgeEl.style.setProperty("--shift-y", "0px");
        badgeEl.style.setProperty("--tilt-r", "0deg");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Physical mobile phone shake detection (QMI8658 gyro integration!)
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let threshold = 18; // Shake acceleration threshold

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (powerState !== "RUNNING" || activeView !== "SHUFFLING") return;
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const { x, y, z } = accel;
      if (x === null || y === null || z === null) return;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if ((deltaX > threshold && deltaY > threshold) || (deltaX > threshold && deltaZ > threshold) || (deltaY > threshold && deltaZ > threshold)) {
          triggerShakeEffect();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (window.DeviceMotionEvent) {
      // In modern browsers, permission request might be needed, handled gracefully
      window.addEventListener("devicemotion", handleDeviceMotion);
    }

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [powerState, activeView]);

  // Handle active states and LED colors
  useEffect(() => {
    if (powerState === "OFF") {
      setLedColor("off");
    } else if (powerState === "BOOTING") {
      setLedColor("red");
    } else if (powerState === "SLEEP") {
      setLedColor("amber");
    } else {
      // Running - change color based on action
      if (isReadingPending) {
        setLedColor("blue");
      } else if (activeView === "QUESTION_INTAKE") {
        setLedColor("amber");
      } else {
        setLedColor("green");
      }
    }
  }, [powerState, activeView, isReadingPending]);

  // Boot sequence simulation
  const handlePowerButton = () => {
    if (powerState === "OFF" || powerState === "SLEEP") {
      setPowerState("BOOTING");
      playBeep(440, 0.2);
      setTimeout(() => {
        playBeep(880, 0.15);
      }, 200);
      setTimeout(() => {
        setPowerState("RUNNING");
        setActiveView("HOME");
        playBeep(1200, 0.25);
      }, 2200);
    } else if (powerState === "RUNNING") {
      if (activeView === "HOME") {
        setAppMode(prev => {
          if (prev === "TAROT") return "LIUYAO";
          if (prev === "LIUYAO") return "SETTINGS";
          return "TAROT";
        });
        playBeep(1000, 0.1);
      } else {
        playBeep(800, 0.1);
        goHome();
      }
    }
  };

  const isBootPressedRef = useRef(false);

  const handleBootDown = (e: React.PointerEvent) => {
    if (powerState !== "RUNNING") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isBootPressedRef.current = true;
    
    if (activeView === "QUESTION_INTAKE") {
      window.dispatchEvent(new CustomEvent('boot-button-start-recording'));
      playBeep(800, 0.1);
    }
  };

  const handleBootUp = (e: React.PointerEvent) => {
    if (!isBootPressedRef.current) return;
    isBootPressedRef.current = false;
    
    if (powerState !== "RUNNING") return;

    if (activeView === "QUESTION_INTAKE") {
      window.dispatchEvent(new CustomEvent('boot-button-stop-recording'));
      return;
    }

    handleBootButtonPress();
  };

  const handleBootButtonPress = () => {
    if (powerState !== "RUNNING") return;
    playBeep(900, 0.05);

    // Context aware physical BOOT button behavior
    if (activeView === "HOME") {
      if (appMode === "TAROT") {
        enterChooseSpread();
      } else if (appMode === "LIUYAO") {
        confirmSpread(); // confirmSpread actually enters QUESTION_INTAKE
      } else if (appMode === "SETTINGS") {
        setActiveView("QR_CONFIG");
      }
    } else if (activeView === "SPREAD_CHOOSER" && appMode === "TAROT") {
      confirmSpread();
    } else if (activeView === "SHUFFLING") {
      triggerShakeEffect();
    } else if (activeView === "DRAW_BOARD") {
      const allRevealed = appMode === "TAROT" ? drawnCards.every(c => c.isRevealed) : true;
      if (allRevealed) {
        triggerAiReading();
      } else {
        revealNextCard();
      }
    } else {
      // Go home
      goHome();
    }
  };

  const goHome = () => {
    playBeep(600, 0.05);
    setActiveView("HOME");
    setSelectedCardDetail(null);
    setQuestion("");
    setDrawnCards([]);
    setDeck([...TAROT_DECK]);
    setAiReadingText("");
    setLiuYaoLines([]);
  };

  const enterChooseSpread = () => {
    playBeep(700, 0.05);
    setActiveView("SPREAD_CHOOSER");
  };

  const handleSpreadPrev = () => {
    playBeep(600, 0.03);
    const newIdx = (spreadIndex - 1 + TAROT_SPREADS.length) % TAROT_SPREADS.length;
    setSpreadIndex(newIdx);
    setSelectedSpread(TAROT_SPREADS[newIdx]);
  };

  const handleSpreadNext = () => {
    playBeep(600, 0.03);
    const newIdx = (spreadIndex + 1) % TAROT_SPREADS.length;
    setSpreadIndex(newIdx);
    setSelectedSpread(TAROT_SPREADS[newIdx]);
  };

  const confirmSpread = () => {
    playBeep(1000, 0.1);
    setActiveView("QUESTION_INTAKE");
    setLiuYaoLines([]);
  };

  const handleVoiceInputFinished = (questionText: string) => {
    playBeep(1100, 0.08);
    setQuestion(questionText);
    setLiuYaoLines([]);
    setActiveView("SHUFFLING");
  };

  // Triggering shuffling deck
  const triggerShakeEffect = () => {
    if (isPhysicalShaking) return;
    if (appMode === "LIUYAO" && liuYaoLines.length >= 6) return;
    setIsPhysicalShaking(true);
    playBeep(450, 0.15);
    setTimeout(() => playBeep(550, 0.15), 150);
    setTimeout(() => playBeep(650, 0.15), 300);

    if (appMode === "LIUYAO") {
      setTimeout(() => {
        setIsPhysicalShaking(false);
        const coins = [1, 2, 3].map(() => (Math.random() > 0.5 ? 3 : 2));
        const newLine = coins.reduce((a, b) => a + b, 0);
        setLiuYaoLines(prev => {
          const next = [...prev, newLine];
          if (next.length >= 6) {
            setTimeout(() => {
              setActiveView("DRAW_BOARD");
              playBeep(950, 0.15);
            }, 600);
          }
          return next;
        });
      }, 1000);
      return;
    }

    // Shuffle Tarot Deck array randomly
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);

    setTimeout(() => {
      setIsPhysicalShaking(false);
      // Automatically transition to deal cards view
      dealCardsFromPool(shuffled);
    }, 1200);
  };

  const dealCardsFromPool = (poolItems: TarotCard[]) => {
    playBeep(950, 0.15);
    
    // Choose cards from the recently shuffled deck matching count
    const pool = [...poolItems];
    const chosen: DrawnCard[] = [];
    
    for (let i = 0; i < selectedSpread.count; i++) {
      const card = pool.pop()!;
      const orientation: "upright" | "reversed" = Math.random() > 0.5 ? "upright" : "reversed";
      const positionMeta = selectedSpread.positions[i];
      
      chosen.push({
        ...card,
        orientation,
        isRevealed: false,
        positionLabel: positionMeta.name,
        positionDesc: positionMeta.description
      });
    }

    setDrawnCards(chosen);
    setActiveView("DRAW_BOARD");
  };

  const handleCardClick = (idx: number) => {
    if (drawnCards[idx].isRevealed) {
      // Toggle card detail view inside high fidelity display
      playBeep(750, 0.05);
      setSelectedCardDetail(drawnCards[idx]);
    } else {
      // Reveal single card inside draw board screen
      playBeep(1050, 0.1);
      setDrawnCards((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], isRevealed: true };
        return next;
      });
    }
  };

  const revealNextCard = () => {
    const unrevealedIdx = drawnCards.findIndex(c => !c.isRevealed);
    if (unrevealedIdx !== -1) {
      handleCardClick(unrevealedIdx);
    }
  };

  // Generate Tarot AI Reading directly proxying server
  const triggerAiReading = async () => {
    const allRevealed = drawnCards.every(c => c.isRevealed);
    if (!allRevealed) {
      // Force reveal all cards first for professional safety
      setDrawnCards(prev => prev.map(c => ({ ...c, isRevealed: true })));
      playBeep(500, 0.3);
    }

    playBeep(1150, 0.2);
    setIsReadingPending(true);
    setAiReadingText("");
    setActiveView("READING_RESULT");
    setReadingProgress(10);

    const progressTimer = setInterval(() => {
      setReadingProgress(p => (p < 90 ? p + Math.floor(Math.random() * 8) + 2 : p));
    }, 400);

    try {
      const response = await fetch("/api/tarot/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appMode: appMode,
          question: question,
          spreadName: appMode === "TAROT" ? selectedSpread.name : "六爻占卜",
          cards: appMode === "TAROT" ? drawnCards.map(c => ({
            name: c.name,
            english: c.english,
            orientation: c.orientation,
            positionLabel: c.positionLabel,
            upright: c.upright,
            reversed: c.reversed,
            description: c.description
          })) : undefined,
          liuYaoLines: appMode === "LIUYAO" ? liuYaoLines : undefined
        })
      });

      const data = await response.json();
      clearInterval(progressTimer);

      if (data.error) {
        throw new Error(data.error);
      }

      setReadingProgress(100);
      setAiReadingText(data.text);
      
      // Log reading in local logs
      onNewReadingLogged({
        question: question || (appMode === "TAROT" ? "今日启示占卜" : "六爻占卜起卦"),
        spreadName: appMode === "TAROT" ? selectedSpread.name : "六爻占卜",
        cards: appMode === "TAROT" ? drawnCards.map(c => ({
          name: c.name,
          orientation: c.orientation === "reversed" ? "逆位" : "正位",
          position: c.positionLabel
        })) : liuYaoLines.map((l, i) => ({
          name: `第${i+1}爻`,
          orientation: (l === 7 || l === 9) ? "阳" : "阴",
          position: l === 6 ? "老阴(变)" : l === 9 ? "老阳(变)" : l === 8 ? "少阴" : "少阳",
        })),
        readingText: data.text,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      });

      playBeep(1300, 0.3);
    } catch (e: any) {
      clearInterval(progressTimer);
      setAiReadingText(`[ESP32 AI 芯片解析失败]\n原因: ${e.message || "网络通讯超时"}\n\n请点击下方 ⚙️ 按键检查扫描或重配 API 秘钥，亦或重试。`);
      setReadingProgress(0);
      playBeep(250, 0.5);
    } finally {
      setIsReadingPending(false);
    }
  };

  // Helper renderer for tarot vector art directly on screen
  const renderCardArt = (type: string, sizeClass = "w-10 h-10") => {
    switch (type) {
      case "sun":
        return (
          <svg className={`${sizeClass} text-amber-400 animate-spin-slow`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
          </svg>
        );
      case "moon":
        return (
          <svg className={`${sizeClass} text-indigo-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
            <path d="M19 3v4M21 5h-4" strokeLinecap="round" />
          </svg>
        );
      case "star":
        return (
          <svg className={`${sizeClass} text-cyan-300 animate-pulse`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" fillOpacity="0.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "key":
        return (
          <svg className={`${sizeClass} text-yellow-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5M14 9l1.5-1.5M16.5 6.5L19 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "wheel":
        return (
          <svg className={`${sizeClass} text-purple-400 rotate-45`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 3v18H12zM3 12h18H3zM5.64 5.64l12.72 12.72M5.64 18.36L18.36 5.64" />
          </svg>
        );
      case "swords":
        return (
          <svg className={`${sizeClass} text-slate-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5M10.1 13.9l10-10m-3.5 13.5l1.5-1.5M6.5 17.5h11l1.5 1.5H8l-1.5-1.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "cup":
        return (
          <svg className={`${sizeClass} text-blue-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3h12v7a6 6 0 0 1-12 0V3zM12 16v5M9 21h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "wand":
        return (
          <svg className={`${sizeClass} text-amber-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 3l3 3M6 15l11-11M3 21l3-3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19.5" cy="4.5" r="1.5" className="animate-pulse" />
          </svg>
        );
      case "pentacle":
        return (
          <svg className={`${sizeClass} text-yellow-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 2.5l2.6 6 6.4.5-4.8 4.2 1.5 6.3-5.7-3.5-5.7 3.5 1.5-6.3-4.8-4.2 6.4-.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "angel":
        return (
          <svg className={`${sizeClass} text-amber-200`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-7.1 8c0-3.3 2.7-6 6.1-6s6.1 2.7 6.1 6v1H4.9v-1zm14.2-9l3.5-3M4.9 11l-3.5-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "crown":
        return (
          <svg className={`${sizeClass} text-yellow-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2.24 19h19.52M5 15l-3-7 5 3 5-7 5 7 5-3-3 7H5z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg className={`${sizeClass} text-emerald-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3v18M3 12h18" />
          </svg>
        );
    }
  };

  // Setup sample simulated battery discharge
  useEffect(() => {
    const batInterval = setInterval(() => {
      setBatteryLevel(b => (b > 10 ? b - 1 : 100));
    }, 45000);
    return () => clearInterval(batInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none gap-4">
      
      {/* 1. PHYSICAL HARDWARE SHELL OF THE CHIC ESP32 AMOLED BADGE PART */}
      <div 
        id="esp32-badge-container"
        ref={badgeContainerRef}
        className="relative group transition-all duration-300 ease-out"
        style={{
          transform: "translate(var(--shift-x, 0px), var(--shift-y, 0px)) rotate(var(--tilt-r, 0deg))"
        }}
      >
        {/* CNC aluminum metal outer ring bezel representing 吧唧 / Badge with custom Sophisticated Dark gold details */}
        <div className="w-[430px] h-[430px] rounded-full bg-[#0a0a0c] p-[12px] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(197,160,89,0.12)] border-2 border-[#c5a059]/30 relative flex items-center justify-center">
          
          {/* Subtle metal reflection effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[#c5a059]/5 to-transparent pointer-events-none rounded-full" />
 
          {/* SENSOR: Dual micro slots on the front representing Dual Microphone array */}
          <div className="absolute top-[32px] left-[150px] w-1.5 h-1.5 rounded-full bg-neutral-900 border border-[#c5a059]/20" title="MEMS MIC A" />
          <div className="absolute top-[32px] right-[150px] w-1.5 h-1.5 rounded-full bg-neutral-900 border border-[#c5a059]/20" title="MEMS MIC B" />
          <div className="absolute top-[18px] text-[8px] font-mono text-[#c5a059]/60 font-bold tracking-widest text-center w-full">
            DUAL MIC ARRAY
          </div>
 
          {/* LED Indicator right in the upper bezel */}
          <div 
            className={`absolute top-[44px] left-1/2 -translate-x-1/2 w-2.5 h-1.5 rounded-full border border-slate-900/60 transition-all duration-300 ${
              ledColor === "green" ? "bg-[#c5a059] shadow-[0_0_12px_#c5a059] animate-pulse" :
              ledColor === "blue" ? "bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-ping" :
              ledColor === "amber" ? "bg-amber-500 shadow-[0_0_12px_#f59e0b] animate-bounce" :
              ledColor === "red" ? "bg-red-600 pulsate-led" : "bg-neutral-800"
            }`}
            title="ESP32 RGB Stat LED"
          />
 
          {/* Brand/Model watermark in lower bezel */}
          <div className="absolute bottom-[28px] text-[7.5px] font-mono tracking-widest text-transparent uppercase font-semibold text-center w-full">
            ESP32-S3R8 / GLASS AMOLED 1.75&quot;
          </div>
 
          {/* PHYSICAL BUTTONS ON THE OUTSIDE FLANGE (with real trigger simulation!) */}
          {/* 1. PWR BUTTON (Right Upper edge as customized gold-border metal bar) */}
          <button 
            id="btn-pwr-hardware"
            onClick={handlePowerButton}
            title="Physical Power Button"
            className="absolute -right-2 top-[120px] w-4 h-12 bg-[#121216] rounded-r-md border-y border-r border-[#c5a059]/40 shadow-md transform origin-left active:translate-x-[-2px] hover:brightness-125 active:brightness-90 transition-all cursor-pointer flex items-center justify-center group-hover:border-[#c5a059]"
          >
            <div className="h-4 w-[2px] bg-[#c5a059] rounded-full" />
          </button>
          <div className="absolute right-3 top-[128px] text-[8px] font-mono text-[#c5a059]/70 uppercase tracking-wider font-bold">
            PWR
          </div>
 
          {/* 2. BOOT BUTTON (Left Upper edge as customized gold-border metal bar) */}
          <button 
            id="btn-boot-hardware"
            onPointerDown={handleBootDown}
            onPointerUp={handleBootUp}
            onPointerLeave={handleBootUp}
            title="Physical BOOT Button (Press to Shuffle/Deal/Action)"
            className="absolute -left-2 top-[120px] w-4 h-12 bg-[#121216] rounded-l-md border-y border-l border-[#c5a059]/40 shadow-md transform origin-right active:translate-x-[2px] hover:brightness-125 active:brightness-90 transition-all cursor-pointer flex items-center justify-center group-hover:border-[#c5a059] touch-none"
          >
            <div className="h-4 w-[2px] bg-[#c5a059] rounded-full" />
          </button>
          <div className="absolute left-3 top-[128px] text-[8px] font-mono text-[#c5a059]/70 uppercase tracking-wider font-bold">
            BOOT
          </div>
 
          {/* 2. IPS SCREEN PORTION (Exactly circular 466x466 style container viewport) */}
          <div className="w-[370px] h-[370px] rounded-full overflow-hidden bg-black border-[3px] border-black relative select-none">
            
            {/* Glossy overlay sheen to look like real AMOLED glass screen covering */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none rounded-full z-20" />
 
            {/* SCREEN OFF STATE */}
            {powerState === "OFF" && (
              <div className="absolute inset-0 bg-[#0a0a0c] flex flex-col items-center justify-center text-center p-8 text-neutral-800 font-mono z-30">
                <div className="w-12 h-12 rounded-full border-2 border-[#c5a059]/20 flex items-center justify-center animate-pulse mb-3">
                  <Cpu className="w-6 h-6 text-[#c5a059]/40" />
                </div>
                <div className="text-[10px] tracking-widest text-[#c5a059]/40 uppercase font-bold">
                  ESP32 DEEP SLEEP
                </div>
                <div className="text-[8px] text-neutral-600 mt-1">
                  按下右侧 [PWR] 物理按钮唤醒 Device
                </div>
              </div>
            )}
 
            {/* SCREEN SLEEP STATE */}
            {powerState === "SLEEP" && (
              <div 
                onClick={handlePowerButton}
                className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-8 z-30 cursor-pointer"
              >
                <div className="text-[#c5a059] font-mono text-xs font-bold uppercase tracking-[0.2em] animate-pulse mb-2">
                  💤 STANDBY
                </div>
                <p className="text-[10px] text-slate-500">点击屏幕或按 PWR 唤醒 ESP32</p>
              </div>
            )}
 
            {/* SCREEN BOOTING STATE */}
            {powerState === "BOOTING" && (
              <div className="absolute inset-0 bg-[#0a0a0c] flex flex-col items-center justify-center p-8 font-mono text-[9px] text-[#c5a059] leading-relaxed z-30">
                <div className="text-center w-full max-w-[200px]">
                  <div className="text-[#c5a059] font-serif tracking-[0.2em] font-bold text-sm mb-2">WAVESHARE</div>
                  <div className="h-[2px] bg-[#c5a059]/20 w-full mb-3 overflow-hidden rounded">
                    <div className="h-full bg-[#c5a059] animate-[loading_1.8s_ease-out_forwards]" style={{ width: '80%' }} />
                  </div>
                  <div className="text-left select-none text-[8px] text-slate-400">
                    <div>&gt; ESP32-S3 CORE: INIT OK</div>
                    <div>&gt; PSRAM: 8MB ADDR OK</div>
                    <div>&gt; IMU QMI8658: ACTIVE</div>
                    <div>&gt; AP MODE: tarot.app</div>
                    <div className="animate-pulse text-[#c5a059] mt-2 text-center">&gt; ARCANE SENSORS LOADED &lt;</div>
                  </div>
                </div>
              </div>
            )}
 
            {/* SCREEN MAIN APP INSTANCE (RUNNING VIEWPORT) */}
            {powerState === "RUNNING" && (
              <div className="absolute inset-0 w-full h-full text-[#e2dcd0] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1d1912] via-[#0a0a0c] to-[#040405] flex flex-col justify-between p-4 relative overflow-hidden font-serif select-none">
                
                {/* 1. TOP HEADER STATUS BAR (ESP32 Smart Wearable style) */}
                <div className="w-full flex items-center justify-between text-[10px] font-sans px-6 pt-2 z-10 text-slate-400">
                  <div className="flex items-center gap-1 font-mono">
                    <Cpu className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span className="text-[9px]">S3</span>
                  </div>
                  <div className="text-[9px] text-[#c5a059]/95 font-bold tracking-[0.2em] uppercase">
                    ARCANE BADGE
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    {wifiConnected ? <Wifi className="w-3 h-3 text-[#c5a059]" /> : <Wifi className="w-3 h-3 text-red-500" />}
                    <div className="flex items-center gap-0.5">
                      <span className="text-[8px]">{batteryLevel}%</span>
                      <Battery className="w-3 h-3.5 text-[#c5a059]" />
                    </div>
                  </div>
                </div>
 
                {/* 2. MAIN SCREEN BODY ROUTER */}
                <div className="flex-1 w-full relative z-10 flex flex-col justify-center items-center mt-1 px-4 overflow-hidden">
                  
                  {/* VIEW A: HOME VIEW */}
                  {activeView === "HOME" && (
                    <div className="flex flex-col items-center justify-center text-center">
                      {/* Rotating Astrological / Cosmic Wheel */}
                      <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#c5a059]/20 animate-spin-slow" />
                        <div className="absolute inset-2 rounded-full border border-double border-[#c5a059]/35 animate-[spin_15s_linear_infinite_reverse]" />
                        {appMode === "SETTINGS" ? (
                          <Settings className="w-10 h-10 text-[#c5a059] animate-spin-slow" />
                        ) : (
                          <Compass className={`w-10 h-10 text-[#c5a059] ${appMode === 'LIUYAO' ? 'animate-spin-slow' : 'animate-pulse'}`} />
                        )}
                      </div>
 
                      <h2 className="text-lg font-bold tracking-[0.1em] font-serif text-[#e2dcd0]">
                        {appMode === "TAROT" ? "阿卡纳灵镜" : appMode === "LIUYAO" ? "灵境六爻" : "系统设置"}
                      </h2>
                      <p className="text-[11px] text-slate-400 font-sans mt-1 max-w-[200px]">
                        {appMode === "TAROT" ? "便携式 ESP32 AMOLED 占卜器" : appMode === "LIUYAO" ? "周易预测 · 古法掷钱起卦模式" : "配网与 API 接口参数"}
                        <br/><span className="text-[9px] opacity-75">(提示: 按右侧 PWR 键切换模式)</span>
                      </p>
 
                      {/* Main action triggers */}
                      <div className="mt-3 flex items-center justify-center gap-3 font-sans w-full px-10">
                        {appMode === "SETTINGS" ? (
                          <button
                            id="btn-go-qr"
                            onClick={() => setActiveView("QR_CONFIG")}
                            className="w-full py-2 px-4 bg-neutral-800 border border-[#c5a059]/50 hover:bg-neutral-700 rounded-full text-[#c5a059] font-bold text-xs tracking-widest hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                          >
                            网络设置
                          </button>
                        ) : (
                          <button
                            id="btn-quick-start"
                            onClick={() => appMode === "TAROT" ? enterChooseSpread() : confirmSpread()}
                            className="w-full py-2 px-4 bg-[#c5a059] hover:bg-[#b08c4a] rounded-full text-neutral-950 font-bold text-xs tracking-wider uppercase hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                          >
                            {appMode === "TAROT" ? "开始启示" : "开始起卦"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* VIEW B: SPREAD CHOOSER */}
                  {activeView === "SPREAD_CHOOSER" && (
                     <div className="flex flex-col items-center justify-between h-full p-2 text-center w-full font-sans">
                      <div className="mt-4">
                        <span className="text-[11px] font-mono text-[#c5a059]/90 block uppercase tracking-[0.2em] mb-1">
                          CHOOSE SPREAD
                        </span>
                        <h3 className="text-[#e2dcd0] text-sm font-bold mt-1 tracking-wider font-serif">
                          选择卡牌牌阵
                        </h3>
                      </div>

                      {/* Sliding carousel inside round screen */}
                      <div className="flex items-center justify-between w-full px-2 my-3">
                        <button 
                          id="btn-spread-prev"
                          onClick={handleSpreadPrev}
                          className="p-2.5 bg-neutral-950 border border-[#c5a059]/30 rounded-full active:scale-95 cursor-pointer hover:bg-neutral-900 text-[#c5a059] transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex-1 px-3">
                          <div className="bg-[#121216] p-4 rounded-xl border border-[#c5a059]/20 shadow-inner w-full min-h-[110px] flex flex-col justify-center">
                            <span className="text-sm font-bold text-slate-100 block mb-1 font-serif">{selectedSpread.name}</span>
                            <span className="text-xs text-slate-400 leading-tight block line-clamp-3">{selectedSpread.description}</span>
                          </div>
                        </div>

                        <button 
                          id="btn-spread-next"
                          onClick={handleSpreadNext}
                          className="p-2.5 bg-neutral-950 border border-[#c5a059]/30 rounded-full active:scale-95 cursor-pointer hover:bg-neutral-900 text-[#c5a059] transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 w-full px-6 mb-3">
                        <button
                          id="btn-spread-cancel"
                          onClick={() => setActiveView("HOME")}
                          className="flex-1 py-2 px-4 border border-[#c5a059]/20 bg-neutral-950/50 rounded-full text-xs text-[#c5a059] hover:bg-neutral-900 cursor-pointer transition-colors"
                        >
                          取消
                        </button>
                        <button
                          id="btn-spread-confirm"
                          onClick={confirmSpread}
                          className="flex-1 py-2 px-4 bg-[#c5a059] hover:bg-[#b08c4a] text-neutral-950 rounded-full text-xs font-bold cursor-pointer shadow-md transition-all font-sans"
                        >
                          下一步
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW C: QUESTION INPUT (Speech/Audio intake) */}
                  {activeView === "QUESTION_INTAKE" && (
                    <div className="w-full h-full pt-2">
                      <AudioVisualizer 
                        onQuestionCompleted={handleVoiceInputFinished}
                        onCancel={() => appMode === "TAROT" ? setActiveView("SPREAD_CHOOSER") : setActiveView("HOME")}
                        initialQuestion={question}
                      />
                    </div>
                  )}

                  {/* VIEW D: SHUFFLING STAGE (Shaking triggers QMI8658 accelerometer!) */}
                  {activeView === "SHUFFLING" && (
                    <div className="flex flex-col items-center justify-between h-full p-2 text-center w-full font-sans">
                      <div className="mt-1">
                        <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest block font-bold animate-pulse">
                          QMI8658 IMU ACTIVE
                        </span>
                        <h3 className="text-slate-200 text-[11px] font-bold mt-1 font-serif">
                          {appMode === "TAROT" ? "洗牌：摇一摇您的设备" : "摇币：摇一摇您的设备"}
                        </h3>
                      </div>

                      {/* Shuffling / Tossing animation */}
                      <div className="flex-1 flex items-center justify-center w-full min-h-[140px]">
                        {appMode === "TAROT" ? (
                          <div className={`relative w-32 h-32 flex items-center justify-center ${isPhysicalShaking ? "animate-[bounce_0.2s_infinite]" : "animate-pulse"}`}>
                            <div className={`absolute inset-0 rounded-full border border-[#c5a059]/30 border-dashed ${isPhysicalShaking ? "animate-spin-fast" : "animate-spin-slow"}`} />
                            
                            <div className="absolute w-12 h-20 bg-[#121216] border border-[#c5a059]/40 rounded-md shadow-md transform rotate-[-15deg] transition-all origin-bottom" />
                            <div className="absolute w-12 h-20 bg-[#0a0a0c] border border-[#c5a059]/40 rounded-md shadow-md transform rotate-[5deg] transition-all origin-bottom" />
                            <div className="absolute w-12 h-20 bg-[#121216] border border-[#c5a059]/45 rounded-md shadow-md transform rotate-[25deg] transition-all origin-bottom" />
                            
                            <Sparkles className="absolute w-6 h-6 text-[#c5a059] animate-bounce" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-1 w-full">
                            <div className={`relative flex items-center justify-center ${isPhysicalShaking ? "animate-[bounce_0.1s_infinite]" : "animate-pulse"}`}>
                              <div className="flex gap-2 relative z-10 transition-transform mt-1">
                                <div className="w-8 h-8 rounded-full border border-[#c5a059] bg-[#121216] flex items-center justify-center text-xs text-[#c5a059] font-bold shadow-[0_0_8px_rgba(197,160,89,0.5)]">通</div>
                                <div className="w-8 h-8 rounded-full border border-[#c5a059] bg-[#121216] flex items-center justify-center text-xs text-[#c5a059] font-bold -mt-2 shadow-[0_0_8px_rgba(197,160,89,0.5)]">宝</div>
                                <div className="w-8 h-8 rounded-full border border-[#c5a059] bg-[#121216] flex items-center justify-center text-xs text-[#c5a059] font-bold shadow-[0_0_8px_rgba(197,160,89,0.5)]">通</div>
                              </div>
                            </div>

                            {/* History of lines already tossed */}
                            <div className="flex flex-col-reverse gap-1.5 items-center justify-center h-16 w-full opacity-80 mt-1">
                              {liuYaoLines.map((val, idx) => {
                                const isYang = val === 7 || val === 9;
                                return (
                                  <div key={idx} className="flex items-center justify-center w-[50px] h-[4px]">
                                    {isYang ? (
                                      <div className="w-full h-full bg-[#c5a059]" />
                                    ) : (
                                      <div className="w-full h-full flex justify-between">
                                        <div className="w-[42%] h-full bg-[#c5a059]" />
                                        <div className="w-[42%] h-full bg-[#c5a059]" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-full px-6 mb-2 flex flex-col gap-1.5">
                        <p className="text-[9px] text-slate-400 leading-tight">
                          可晃动设备或点击下方按钮发起动作
                        </p>
                        <button
                          id="btn-shuffle-simulate"
                          onClick={triggerShakeEffect}
                          disabled={isPhysicalShaking}
                          className="w-full py-2.5 bg-[#c5a059] hover:bg-[#b08c4a] text-neutral-950 text-xs tracking-wider uppercase font-bold hover:scale-105 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          {appMode === "TAROT" 
                            ? (isPhysicalShaking ? "洗牌中..." : "👉 模拟物理摇晃 👈")
                            : (isPhysicalShaking ? "摇币中..." : `👉 模拟投掷 (${liuYaoLines.length}/6) 👈`)}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW E: DRAWING BOARD (Tap on standard position placeholders / LiuYao Hexagram) */}
                  {activeView === "DRAW_BOARD" && (
                    <div className="flex flex-col items-center justify-between h-full p-2 text-center w-full">
                      <div className="mt-1">
                        <span className="text-[11px] font-mono text-[#c5a059] uppercase tracking-widest block font-bold">
                          {appMode === "TAROT" ? "TAP CARDS TO REVEAL" : "HEXAGRAM REVEALED"}
                        </span>
                        <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[240px] font-sans mt-0.5">
                          问: &quot;{question || "未设置问题"}&quot;
                        </p>
                      </div>

                      {appMode === "TAROT" ? (
                        /* TAROT BOARD */
                        <div className="flex-[1] flex items-center justify-center gap-2.5 my-1.5 max-w-[320px] flex-wrap">
                          {drawnCards.map((card, idx) => {
                            const isShortLayout = selectedSpread.count > 3;
                            return (
                              <div 
                                key={idx}
                                onClick={() => handleCardClick(idx)}
                                className={`rounded-xl cursor-pointer transition-all duration-300 relative flex flex-col items-center justify-center overflow-hidden ${
                                  card.isRevealed 
                                    ? `bg-gradient-to-b ${card.bgGradient} border-2 border-[#c5a059]` 
                                    : "bg-[#121216] border-2 border-[#c5a059]/30 hover:border-[#c5a059]/70 shadow-lg"
                                } ${
                                  isShortLayout 
                                    ? "w-[60px] h-[90px]" 
                                    : selectedSpread.count === 1 
                                      ? "w-[120px] h-[180px]" 
                                      : "w-[82px] h-[126px]"
                                }`}
                              >
                                {!card.isRevealed ? (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-b from-[#121216] to-[#0a0a0c]">
                                    <span className="text-xl text-[#c5a059] animate-pulse font-serif">✧</span>
                                    <span className="text-[10px] text-[#c5a059]/70 font-sans mt-1 block font-bold max-w-full truncate px-1">
                                      {card.positionLabel}
                                    </span>
                                  </div>
                                ) : (
                                  <div className={`absolute inset-0 flex flex-col items-center justify-between p-1.5 select-none ${
                                    card.orientation === "reversed" ? "rotate-180" : ""
                                  }`}>
                                    <span className="text-[9px] bg-[#0c0c0e]/80 text-[#c5a059] px-1.5 rounded font-mono font-bold block border border-[#c5a059]/20">
                                      {card.element}
                                    </span>
                                    <div className="my-auto drop-shadow-lg pb-1">
                                      {renderCardArt(card.iconType, isShortLayout ? "w-8 h-8" : selectedSpread.count === 1 ? "w-16 h-16" : "w-10 h-10")}
                                    </div>
                                    <div className="text-center w-full bg-[#0a0a0c]/80 pb-1 pt-0.5 rounded-b-lg border-t border-[#c5a059]/20 shadow-inner">
                                      <span className="text-[11px] text-slate-100 font-bold block truncate font-serif">
                                        {card.name}
                                      </span>
                                      <span className="text-[9px] text-[#c5a059]/80 block line-clamp-1 uppercase tracking-[0.5px] font-sans">
                                        {card.english}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {card.isRevealed && (
                                  <div className="absolute -top-1.5 right-0 z-20">
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm text-neutral-950 bg-[#c5a059]">
                                      {card.orientation === "reversed" ? "逆" : "正"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* LIUYAO BOARD */
                        <div className="flex-[1] flex flex-col-reverse items-center justify-center gap-2 my-2 max-w-[320px]">
                          {liuYaoLines.map((val, idx) => {
                            const isYang = val === 7 || val === 9;
                            const isChanging = val === 6 || val === 9;
                            return (
                              <div key={idx} className="relative flex items-center justify-center min-w-[120px] h-[10px]">
                                {isYang ? (
                                  <div className="w-[100px] h-full bg-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.5)] rounded-sm" />
                                ) : (
                                  <div className="w-[100px] h-full flex justify-between">
                                    <div className="w-[42px] h-full bg-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.5)] rounded-sm" />
                                    <div className="w-[42px] h-full bg-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.5)] rounded-sm" />
                                  </div>
                                )}
                                {isChanging && (
                                  <span className="absolute -right-8 text-sm text-[#c5a059] font-mono font-bold drop-shadow-sm">
                                    {val === 9 ? "O" : "X"}
                                  </span>
                                )}
                                <span className="absolute -left-8 text-[11px] text-[#c5a059]/60 font-sans tracking-wide">
                                  {['初', '二', '三', '四', '五', '上'][idx]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Drawing Status / AI trigger */}
                      <div className="w-full px-6 mb-1">
                        {(appMode === "TAROT" ? drawnCards.every(c => c.isRevealed) : true) ? (
                          <button
                            id="btn-ai-read-trigger"
                            onClick={triggerAiReading}
                            className="w-full py-2.5 text-xs bg-[#c5a059] hover:bg-[#b08c4a] text-neutral-900 rounded-full font-bold uppercase tracking-wider shadow-lg animate-bounce cursor-pointer transition-all"
                          >
                            🔮 AI 深度{appMode === "TAROT" ? "解牌" : "解卦"} 🔮
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-3 font-sans">
                            <span className="text-[10px] text-slate-400 animate-pulse font-medium">
                              请依次翻开每张牌 (双击可看细节)
                            </span>
                            <button
                              id="btn-reveal-all"
                              onClick={() => setDrawnCards(prev => prev.map(c => ({...c, isRevealed: true})))}
                              className="text-[9px] border border-[#c5a059]/30 bg-neutral-950 px-3 py-1 rounded-full text-[#c5a059] font-semibold cursor-pointer hover:bg-neutral-900 transition-all shadow-md"
                            >
                              全部掀开
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* VIEW F: READING RESULT (AI Output stream) */}
                  {activeView === "READING_RESULT" && (
                    <div className="flex flex-col items-center justify-between h-full p-2 text-center w-full">
                      <div className="w-full font-sans">
                        <span className="text-[11px] font-mono text-[#c5a059] uppercase tracking-widest font-bold">
                          {isReadingPending ? "AI CORE LINKED" : "READING COMPLETE"}
                        </span>
                        <h3 className="text-[#e2dcd0] text-[13px] font-bold tracking-wide line-clamp-1 px-4 font-serif mt-0.5">
                          {appMode === "TAROT" ? `灵镜占卜解析: ${selectedSpread.name}` : `灵镜六爻起卦解析`}
                        </h3>
                      </div>

                      {/* Display content or animated loader */}
                      <div className="flex-1 w-full bg-[#0a0a0c] border border-[#c5a059]/20 rounded-xl my-2 overflow-hidden flex flex-col justify-center">
                        {isReadingPending ? (
                          <div className="flex flex-col items-center justify-center p-4 font-sans">
                            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                              <div className="absolute inset-0 rounded-full border-2 border-[#c5a059]/10 border-t-[#c5a059] animate-spin" />
                              <Hourglass className="w-8 h-8 text-[#c5a059] animate-pulse" />
                            </div>
                            <div className="text-xs font-mono text-slate-300">
                              正在调遣 DeepSeek AI 算力...
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 font-mono">
                              处理进度: {readingProgress}%
                            </div>
                          </div>
                        ) : (
                          /* Miniature scrollable reader inside e-badge circular bounds */
                          <div className="h-32 overflow-y-auto px-4 py-2.5 text-left relative scrollbar-thin text-slate-350 select-text">
                            <p className="text-[11.5px] leading-relaxed whitespace-pre-line font-sans tracking-wide">
                              {aiReadingText}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full px-4 mb-2 font-sans">
                        <button
                          id="btn-result-back"
                          onClick={() => setActiveView("DRAW_BOARD")}
                          className="flex-1 py-1.5 px-3 border border-[#c5a059]/20 bg-neutral-950 rounded-full text-[11px] text-slate-400 hover:bg-neutral-900 cursor-pointer"
                        >
                          {appMode === "TAROT" ? "返回牌面" : "返回卦象"}
                        </button>
                        <button
                          id="btn-result-close"
                          onClick={goHome}
                          className="flex-1 py-1.5 px-3 bg-[#c5a059] hover:bg-[#b08c4a] text-neutral-950 rounded-full text-[11px] font-bold cursor-pointer shadow-md"
                        >
                          {appMode === "TAROT" ? "收起卡牌" : "结束起卦"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW G: CONFIG INTEGRATION AND SCANNING HELP */}
                  {activeView === "QR_CONFIG" && (
                    <div className="flex flex-col items-center justify-between h-full p-2 text-center w-full font-sans">
                      <div className="mt-1">
                        <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest block font-bold">
                          SETTINGS PORTAL
                        </span>
                        <h3 className="text-slate-200 text-[10px] font-bold font-serif mt-0.5">
                          扫码或在右侧配置 API 密钥
                        </h3>
                      </div>

                      {/* High fidelity simulated QR Code */}
                      <div className="flex-1 flex flex-col items-center justify-center p-1">
                        <div className="bg-white p-2.5 rounded-lg shadow-md md:hover:scale-105 transition-transform flex items-center justify-center">
                          {/* Beautiful simulated vector QR Code */}
                          <svg className="w-20 h-20 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="2" width="6" height="6" strokeWidth="2" />
                            <rect x="16" y="2" width="6" height="6" strokeWidth="2" />
                            <rect x="2" y="16" width="6" height="6" strokeWidth="2" />
                            <rect x="16" y="16" width="6" height="6" strokeWidth="2" />
                            <path d="M5 5h.01M19 5h.01M5 19h.01M19 19h.01" strokeWidth="3" strokeLinecap="round" />
                            <path d="M12 2v6M12 12h2M2 12h8M19 12h3M12 16v6" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span className="text-[8.5px] font-mono text-slate-400 mt-1.5">
                          Portal: 192.168.4.1 (AP Web Server)
                        </span>
                      </div>

                      <div className="w-full px-4 mb-1">
                        <button
                          id="btn-config-exit"
                          onClick={() => setActiveView("HOME")}
                          className="w-full py-1.5 border border-[#c5a059]/20 bg-neutral-950 rounded-full text-[9px] text-[#c5a059] hover:bg-neutral-900 cursor-pointer transition-colors font-sans"
                        >
                          退出配置
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* 3. BOTTOM VIRTUAL NAV BAR */}
                <div className="w-full h-4 z-10" />

              </div>
            )}

            {/* Simulated circular TFT Bezel Screen shadow inside TFT */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.95)] pointer-events-none z-10" />

          </div>
        </div>
      </div>

      {/* 2. CARD DETAIL INNER LIGHTBOX MODAL */}
      {selectedCardDetail && (
        <div className="absolute inset-0 bg-[#0a0a0c]/98 rounded-full z-40 flex flex-col justify-between p-7 text-center text-slate-350 border-2 border-[#c5a059]/50 shadow-[0_0_50px_rgba(197,160,89,0.25)] font-serif">
          <div className="mt-4 font-sans">
            <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-[0.25em] font-bold block">
              CARD DETAILS / {selectedCardDetail.positionLabel}
            </span>
            <h4 className="text-sm font-bold text-[#e1dbcf] mt-1 font-serif">
              {selectedCardDetail.name} • {selectedCardDetail.english} ({selectedCardDetail.orientation === "reversed" ? "逆位" : "正位"})
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto px-4.5 py-4 my-2.5 bg-[#121216] rounded-xl border border-[#c5a059]/15 text-left scrollbar-thin font-sans">
            <div className="text-[10px] leading-relaxed mb-3">
              <span className="text-[#c5a059] font-bold uppercase text-[9px] tracking-wider block mb-0.5">SYMBOLISM:</span>
              <p className="text-slate-300">{selectedCardDetail.description}</p>
            </div>
            <div className="text-[10px] leading-relaxed">
              <span className="text-[#c5a059] font-bold uppercase text-[9px] tracking-wider block mb-0.5">INTERPRETATION:</span>
              <p className="text-slate-300">{selectedCardDetail.orientation === "reversed" ? selectedCardDetail.reversed : selectedCardDetail.upright}</p>
            </div>
          </div>

          <button
            id="btn-detail-close"
            onClick={() => setSelectedCardDetail(null)}
            className="w-full py-1.5 bg-[#c5a059] hover:bg-[#b08c4a] text-neutral-950 font-sans font-bold text-[10px] rounded-full hover:amber-400 cursor-pointer shadow-md transition-all uppercase tracking-wider"
          >
            返回牌阵
          </button>
        </div>
      )}

      {/* Sound enable control for the e-Badge */}
      <div className="absolute -bottom-1 -right-1 z-30">
        <button
          id="btn-toggle-sound"
          onClick={() => {
            setIsMuted(!isMuted);
            playBeep(1000, 0.05);
          }}
          className="p-1 px-3.5 border border-[#c5a059]/20 bg-neutral-950/90 rounded-full text-[9px] text-[#c5a059] hover:text-white flex items-center gap-1.5 cursor-pointer font-sans"
        >
          {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-[#c5a059]" />}
          <span>{isMuted ? "金铃已哑" : "法音绕梁"}</span>
        </button>
      </div>

    </div>
  );
}
