import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  Activity, ShieldCheck, RefreshCcw, Loader2, Lock, Unlock, Upload, 
  MessageSquare, ChevronRight, BarChart3, TrendingUp, Target, Zap, Users,
  Globe, Cpu, Landmark, Clock, AlertTriangle, Layers, ArrowUpRight, Search
} from "lucide-react";
import { Component as HorizonHero } from "./components/ui/horizon-hero-section";

function App() {
  const [loading, setLoading] = useState(false);
  const [complianceMode, setComplianceMode] = useState("NO WASH SALE");
  const [auditResult, setAuditResult] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([{ user: null, agent: "Neural Engine Online. Data sync required." }]);
  const [scrollPos, setScrollPos] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMode = () => {
    setComplianceMode(prev => prev === "NO WASH SALE" ? "WASH SALE RISK" : "NO WASH SALE");
    setAuditResult(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post("http://localhost:8000/upload-trades", formData);
      setChatHistory(prev => [...prev, { user: `Uploaded ${file.name}`, agent: `System ingested ${res.data.count || 0} trade records.` }]);
    } catch (err) { console.error(err); }
  };

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/run-audit", { mode: complianceMode });
      setAuditResult(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput("");
    try {
      const res = await axios.post("http://localhost:8000/chat", { message: msg, context: complianceMode });
      setChatHistory(prev => [...prev, { user: msg, agent: res.data.response }]);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-[300vh] bg-[#030303] text-slate-300 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* 1. REFINED VERTICAL TYPOGRAPHY */}
      <div className="fixed left-0 top-0 h-full w-24 z-0 pointer-events-none border-r border-white/5 flex flex-col items-center overflow-hidden">
        <div 
          className="absolute flex flex-col items-center gap-[80vh] pt-[30vh]"
          style={{ 
            transform: `translateY(${-scrollPos * 0.5}px)`,
            transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)'
          }}
        >
          <div className="text-[7rem] font-black tracking-tighter text-white/[0.03] uppercase [writing-mode:vertical-lr] rotate-180">
            Horizon
          </div>
          <div className="text-[7rem] font-black tracking-tighter text-sky-500/[0.05] uppercase [writing-mode:vertical-lr] rotate-180">
            Auditor
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-0 opacity-10">
        <HorizonHero />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-64 ml-32">
        
        {/* === THE STORY (Hero Section) === */}
        <div className="mb-32 space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">Protocol v1.0.4 Ready</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Stop Leaving Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Capital At Risk.</span>
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed font-light">
            Invisible Auditor is a high-frequency compliance engine designed for the modern quant. 
            By analyzing your trade history against 30-day IRS lookback windows, our agentic workflow 
            identifies **Tax Loss Harvesting** opportunities while simultaneously suggesting 
            high-correlation proxies to keep your market exposure constant.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="group border-l border-white/10 pl-6 transition-colors hover:border-sky-500/50">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Target size={14} className="text-sky-500"/> The Purpose
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Eliminate "Tax Drag"—the silent killer of portfolio alpha. We ensure you never trigger a wash sale violation that would defer your losses.
              </p>
            </div>
            <div className="group border-l border-white/10 pl-6 transition-colors hover:border-sky-500/50">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Users size={14} className="text-sky-500"/> Who It's For
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Hedge funds and high-net-worth individuals who require invisible, real-time auditing of trade executions.
              </p>
            </div>
          </div>
        </div>

        {/* === ACTION: SYNC === */}
        <div className="mb-24 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <button 
              onClick={() => fileInputRef.current.click()}
              className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 flex items-center justify-between hover:bg-black/40 transition-all active:scale-[0.99]"
          >
              <div className="flex items-center gap-10">
                  <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      <Upload size={32} strokeWidth={1.5} />
                  </div>
                  <div className="text-left space-y-1">
                      <h3 className="text-3xl text-white font-black tracking-tight">Sync History</h3>
                      <p className="text-sm text-slate-500 font-medium">Upload .CSV to initialize Neural Audit</p>
                  </div>
              </div>
              <ArrowUpRight className="text-slate-700 group-hover:text-white transition-colors" size={48} />
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".csv" />
          </button>
        </div>

        {/* === THE DASHBOARD === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            {/* Main Graph Card */}
            <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="flex justify-between items-start mb-16">
                  <div>
                      <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em]">Potential Recovery</span>
                      <div className="text-6xl font-black text-white mt-2 tracking-tighter">+$2,450.00</div>
                  </div>
                  <button onClick={toggleMode} className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-bold text-white transition-all">
                     {complianceMode}
                  </button>
              </div>
              
              <div className="h-64 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M0 35 Q 20 38, 35 25 T 60 20 T 85 5 T 100 2" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                      <path d="M0 38 Q 20 30, 40 32 T 70 15 T 100 10" fill="none" stroke="#0ea5e9" strokeWidth="1.5" className="drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]" />
                      <circle cx="100" cy="10" r="1" fill="#0ea5e9" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-t border-white/[0.03] w-full" />
                      <div className="border-t border-white/[0.03] w-full" />
                      <div className="border-t border-white/[0.03] w-full" />
                  </div>
              </div>

              <button onClick={runAudit} disabled={loading} className="mt-12 w-full bg-white text-black py-6 rounded-2xl font-black hover:bg-sky-400 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : <Layers size={20}/>} 
                <span className="tracking-widest uppercase text-sm">Execute Neural Audit</span>
              </button>
            </div>

            {/* Violation Timeline (Moved Inside for Flow) */}
            <div className="space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <Clock size={16} className="text-sky-500" /> Wash Sale Lockout Schedule
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[{a: "TSLA", d: 12, s: "Blocked"}, {a: "NVDA", d: 2, s: "Expiring"}, {a: "SHOP", d: 0, s: "Clear"}, {a: "AAPL", d: 28, s: "Blocked"}].map((t, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                            <div className="text-[10px] font-mono text-slate-600 mb-1">{t.s}</div>
                            <div className="text-xl font-black text-white">{t.a}</div>
                            <div className="text-[10px] text-sky-500 font-bold mt-2">{t.d} DAYS LEFT</div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-10">
            <div className={`p-10 rounded-[2.5rem] border transition-all h-80 flex flex-col justify-between ${
                auditResult?.status === 'BLOCKED' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.02] border-white/10'
            }`}>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12}/> Verdict_Engine
                </div>
                {auditResult ? (
                    <div className={`text-6xl font-black tracking-tighter ${auditResult.status === 'BLOCKED' ? 'text-red-500' : 'text-emerald-400'}`}>
                        {auditResult.status}
                    </div>
                ) : <div className="text-slate-800 text-5xl font-black italic">IDLE</div>}
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {auditResult ? auditResult.reason : "Awaiting sync of brokerage API or CSV payload..."}
                </p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Search size={14}/> Proxy Correlations
                </h4>
                <div className="space-y-4">
                    {[{f: "NVDA", t: "AMD", c: "0.94"}, {f: "SPY", t: "VOO", c: "0.99"}, {f: "COIN", t: "MARA", c: "0.82"}].map((p, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-default">
                            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{p.f} → {p.t}</span>
                            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{p.c}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* REFINED CHAT */}
      <div className="fixed bottom-10 right-10 w-96 bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col z-50">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-[.2em]">Auditor Advisor</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
        </div>
        <div className="h-48 overflow-y-auto p-6 space-y-4">
          {chatHistory.map((c, i) => (
            <div key={i} className={`flex ${c.user ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-4 text-[11px] font-medium leading-relaxed rounded-2xl ${
                c.user ? "bg-white text-black" : "bg-white/5 text-slate-400 border border-white/5"
              }`}>{c.user || c.agent}</div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white/[0.02] flex gap-2">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} className="bg-transparent flex-1 text-xs outline-none px-4 text-white" placeholder="Inquire about compliance..." />
          <button onClick={sendChat} className="bg-white p-3 rounded-xl text-black hover:invert transition-all"><ChevronRight size={16} strokeWidth={3} /></button>
        </div>
      </div>
    </div>
  );
}

export default App;