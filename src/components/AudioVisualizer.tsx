import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Check, X, Keyboard } from "lucide-react";

interface AudioVisualizerProps {
  onQuestionCompleted: (question: string) => void;
  onCancel: () => void;
  initialQuestion?: string;
}

export default function AudioVisualizer({
  onQuestionCompleted,
  onCancel,
  initialQuestion = ""
}: AudioVisualizerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [questionText, setQuestionText] = useState(initialQuestion);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [statusMessage, setStatusMessage] = useState("等待输入或收音...");
  const [waveScale, setWaveScale] = useState<number[]>(Array(10).fill(1));
  
  const recognitionRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "zh-CN";

      rec.onstart = () => {
        setIsRecording(true);
        setStatusMessage("双麦克风阵列录音中...");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();
        if (combined) {
          setQuestionText(combined);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error", event);
        if (event.error === "not-allowed") {
          setStatusMessage("麦克风权限被拒绝，请手输");
        } else {
          setStatusMessage("识别超时或错误，请手输");
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      setHasSpeechSupport(true);
    } else {
      setStatusMessage("浏览器不支持语音，请键盘输入");
      setHasSpeechSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Audio wave animation
  useEffect(() => {
    if (isRecording) {
      const animateWave = () => {
        setWaveScale(() =>
          Array(10)
            .fill(1)
            .map(() => 1 + Math.random() * 5)
        );
        animationRef.current = requestAnimationFrame(animateWave);
      };
      animateWave();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setWaveScale(Array(10).fill(1));
    }
  }, [isRecording]);

  // Add global event listeners for BOOT button long press (PTT)
  useEffect(() => {
    const handleBootStart = () => handleStartRecording();
    const handleBootStop = () => handleStopRecording();

    window.addEventListener('boot-button-start-recording', handleBootStart);
    window.addEventListener('boot-button-stop-recording', handleBootStop);

    return () => {
      window.removeEventListener('boot-button-start-recording', handleBootStart);
      window.removeEventListener('boot-button-stop-recording', handleBootStop);
    };
  }, []);

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recording start failed", e);
      }
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = () => {
    if (!questionText.trim()) {
      setStatusMessage("请输入或说出一个问题再确认！");
      return;
    }
    onQuestionCompleted(questionText);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-2 pt-3 text-center select-none w-full">
      <div className="w-full shrink-0">
        <h3 className="text-amber-400 text-sm font-mono tracking-wider font-bold uppercase mb-0.5">
          DREAM INTAKE
        </h3>
        <p className="text-[10px] text-gray-400 line-clamp-1">
          {statusMessage}
        </p>
      </div>

      {/* Voice Wave Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[70px]">
        {hasSpeechSupport ? (
          <div className="flex flex-col items-center justify-center gap-1.5 w-full">
            <div className="flex items-center justify-center gap-3">
              {/* Left waves */}
              <div className="flex items-center justify-center gap-1.5 w-12">
                {waveScale.slice(0, 5).map((scale, i) => (
                  <div
                    key={`left-${i}`}
                    className="w-[3px] bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-transform duration-100"
                    style={{
                      height: "12px",
                      transform: `scaleY(${isRecording ? scale : 1})`,
                      transformOrigin: "center",
                      opacity: isRecording ? 0.3 + (i % 3) * 0.23 : 0.4,
                    }}
                  />
                ))}
              </div>

              {isRecording ? (
                <button
                  id="btn-voice-stop"
                  onClick={handleStopRecording}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center glow-blue border border-red-400 cursor-pointer shadow-md shadow-red-500/20 z-10"
                >
                  <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                </button>
              ) : (
                <button
                  id="btn-voice-start"
                  onClick={handleStartRecording}
                  className="w-10 h-10 rounded-full bg-indigo-700 hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center border border-indigo-400 cursor-pointer animate-pulse shadow-md shadow-indigo-500/20 z-10"
                >
                  <Mic className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Right waves */}
              <div className="flex items-center justify-center gap-1.5 w-12">
                {waveScale.slice(5).map((scale, i) => (
                  <div
                    key={`right-${i}`}
                    className="w-[3px] bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-transform duration-100"
                    style={{
                      height: "12px",
                      transform: `scaleY(${isRecording ? scale : 1})`,
                      transformOrigin: "center",
                      opacity: isRecording ? 0.3 + (i % 3) * 0.23 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
            {!isRecording && <div className="text-[8px] text-indigo-300 opacity-60">(可长按左侧 BOOT 键)</div>}
            {isRecording && <div className="text-[8px] text-red-300 opacity-80 animate-pulse">正在聆听...松开结束</div>}
          </div>
        ) : (
          <div className="opacity-50 flex flex-col items-center justify-center gap-1">
             <MicOff className="w-5 h-5 text-slate-500" />
             <span className="text-[9px] text-slate-500">无麦克风阵列</span>
          </div>
        )}
      </div>

      {/* Transcription Output / Keyboard Input */}
      <div className="w-full px-6 mb-2 shrink-0">
        <textarea
          id="txt-question-input"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="在此修改或输入问题"
          className="w-full h-12 text-[11px] p-2 bg-neutral-900 border border-[#c5a059]/30 rounded-lg text-amber-100 placeholder-slate-600 focus:outline-none focus:border-[#c5a059] resize-none font-sans text-center shadow-inner"
          maxLength={150}
        />
      </div>

      {/* Action Keys */}
      <div className="flex items-center justify-between w-full gap-4 px-6 mb-1 shrink-0">
        <button
          id="btn-voice-cancel"
          onClick={onCancel}
          className="flex-1 py-1.5 px-3 border border-slate-800 bg-neutral-900/60 rounded-full text-[10px] text-gray-400 hover:bg-neutral-800/80 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
        >
          <X className="w-3.5 h-3.5" /> 取消
        </button>

        <button
          id="btn-voice-submit"
          onClick={handleSubmit}
          className="flex-1 py-1.5 px-3 bg-[#c5a059] text-neutral-950 font-bold rounded-full text-[10px] hover:bg-[#b08c4a] transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md hover:shadow-amber-500/20"
        >
          <Check className="w-3.5 h-3.5" /> 确定
        </button>
      </div>
    </div>
  );
}
