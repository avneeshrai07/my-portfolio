import { useState } from "react";
import {
  ShoppingCart, Code2, TrendingUp, MessageSquare, BookOpen, Link2,
  Zap, Database, ShieldCheck, Play, CodeXml,
  Activity, Box, Calendar, User, LayoutGrid,
} from "lucide-react";

/* ─── NAV ─────────────────────────────────────────────────────────── */
const NAV = [
  { id:"sunakku",    title:"Sunakku",    sub:"Snack ordering platform",     year:"Live", live:true,  Icon:ShoppingCart, iconBg:"#FEF0E6", iconColor:"#E07A2F" },
  { id:"devflow",    title:"DevFlow",    sub:"Developer productivity tool", year:"2025", live:false, Icon:Code2,        iconBg:"#EEECFA", iconColor:"#7C6FCD" },
  { id:"fintrack",   title:"FinTrack",   sub:"Personal finance tracker",    year:"2024", live:false, Icon:TrendingUp,   iconBg:"#E6F5EE", iconColor:"#2D8A4E" },
  { id:"chatsphere", title:"ChatSphere", sub:"Real-time chat application",  year:"2024", live:false, Icon:MessageSquare,iconBg:"#E6F2FB", iconColor:"#2D7DC4" },
  { id:"studyhub",   title:"StudyHub",   sub:"AI-powered study assistant",  year:"2024", live:false, Icon:BookOpen,     iconBg:"#FEF6E6", iconColor:"#C48A1A" },
  { id:"linkshare",  title:"LinkShare",  sub:"File sharing platform",       year:"2023", live:false, Icon:Link2,        iconBg:"#FAE6EA", iconColor:"#C43A58" },
];

/* ─── DATA ────────────────────────────────────────────────────────── */
const DATA = {
  sunakku: {
    name:"Sunakku",
    sub:"Snack ordering platform — queue-based, real-time, high-throughput",
    features:[
      { Icon:ShoppingCart, label:"Queue Based",    desc:"Built on BullMQ" },
      { Icon:Zap,          label:"Real-time",       desc:"Instant updates"  },
      { Icon:Database,     label:"High Throughput", desc:"Built to scale"   },
      { Icon:ShieldCheck,  label:"Reliable",        desc:"Fault tolerant"   },
    ],
    meta:[
      { Icon:Activity, val:"3 Months",   label:"Duration"   },
      { Icon:Box,      val:"Production", label:"Status"     },
      { Icon:Calendar, val:"2025",       label:"Year"       },
      { Icon:User,     val:"Solo",       label:"Role"       },
    ],
    stack:[
      { name:"Next.js",    bg:"#000",    fg:"#fff", sym:"N",  fs:16, fw:700 },
      { name:"Node.js",    bg:"#3C873A", fg:"#fff", sym:"⬡",  fs:22, fw:400 },
      { name:"Express",    bg:"#F5F5F5", fg:"#333", sym:"ex", fs:12, fw:700, italic:true },
      { name:"PostgreSQL", bg:"#336791", fg:"#fff", sym:"🐘",  fs:22, fw:400 },
      { name:"Redis",      bg:"#DC382C", fg:"#fff", sym:"🔴",  fs:20, fw:400 },
      { name:"BullMQ",     bg:"#C57A1E", fg:"#fff", sym:"🐂",  fs:22, fw:400 },
    ],
    extra:2,
    image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80",
    quote:"Built to handle real orders. Built to handle real load.",
  },
  devflow:{
    name:"DevFlow",
    sub:"Developer productivity tool — unified code review, tasks & deploys",
    features:[
      { Icon:Code2,        label:"CI/CD",       desc:"Auto pipelines"  },
      { Icon:Zap,          label:"Task Board",  desc:"Kanban style"    },
      { Icon:ShieldCheck,  label:"Code Review", desc:"Inline comments" },
      { Icon:Database,     label:"Analytics",   desc:"Team insights"   },
    ],
    meta:[
      { Icon:Activity, val:"5 Months",   label:"Duration" },
      { Icon:Box,      val:"Production", label:"Status"   },
      { Icon:Calendar, val:"2025",       label:"Year"     },
      { Icon:User,     val:"Solo",       label:"Role"     },
    ],
    stack:[
      { name:"React",      bg:"#222",    fg:"#61DAFB", sym:"⚛",  fs:20, fw:400 },
      { name:"Node.js",    bg:"#3C873A", fg:"#fff",    sym:"⬡",  fs:22, fw:400 },
      { name:"GitHub",     bg:"#24292F", fg:"#fff",    sym:"G",   fs:16, fw:700 },
      { name:"PostgreSQL", bg:"#336791", fg:"#fff",    sym:"🐘",  fs:22, fw:400 },
      { name:"Redis",      bg:"#DC382C", fg:"#fff",    sym:"R",   fs:16, fw:700 },
      { name:"Docker",     bg:"#2496ED", fg:"#fff",    sym:"🐳",  fs:22, fw:400 },
    ],
    extra:0,
    image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
    quote:"One workspace. Zero context-switching.",
  },
  fintrack:{
    name:"FinTrack",
    sub:"Personal finance tracker — automated categorization & insights",
    features:[
      { Icon:TrendingUp,  label:"Multi-bank",      desc:"Open Banking"    },
      { Icon:Zap,         label:"Auto-categorize", desc:"ML-powered"      },
      { Icon:ShieldCheck, label:"Budgeting",        desc:"Smart limits"   },
      { Icon:Database,    label:"Alerts",           desc:"Threshold alerts"},
    ],
    meta:[
      { Icon:Activity, val:"4 Months", label:"Duration" },
      { Icon:Box,      val:"Shipped",  label:"Status"   },
      { Icon:Calendar, val:"2024",     label:"Year"     },
      { Icon:User,     val:"Solo",     label:"Role"     },
    ],
    stack:[
      { name:"Next.js", bg:"#000",    fg:"#fff", sym:"N",  fs:16, fw:700 },
      { name:"Python",  bg:"#306998", fg:"#fff", sym:"🐍",  fs:22, fw:400 },
      { name:"FastAPI", bg:"#009688", fg:"#fff", sym:"F",   fs:16, fw:700 },
      { name:"Plaid",   bg:"#00A3FF", fg:"#fff", sym:"P",   fs:16, fw:700 },
      { name:"PgSQL",   bg:"#336791", fg:"#fff", sym:"🐘",  fs:22, fw:400 },
      { name:"Celery",  bg:"#A9CC54", fg:"#333", sym:"C",   fs:16, fw:700 },
    ],
    extra:0,
    image:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80",
    quote:"Your money, finally making sense.",
  },
  chatsphere:{
    name:"ChatSphere",
    sub:"Real-time chat application — scalable messaging with E2E encryption",
    features:[
      { Icon:Zap,           label:"Real-time",     desc:"WebSocket core"  },
      { Icon:ShieldCheck,   label:"E2E Encrypted", desc:"Signal protocol" },
      { Icon:MessageSquare, label:"Group Rooms",   desc:"Up to 500"       },
      { Icon:Database,      label:"File Share",    desc:"S3 backed"       },
    ],
    meta:[
      { Icon:Activity, val:"3 Months", label:"Duration" },
      { Icon:Box,      val:"Shipped",  label:"Status"   },
      { Icon:Calendar, val:"2024",     label:"Year"     },
      { Icon:User,     val:"Solo",     label:"Role"     },
    ],
    stack:[
      { name:"Node.js",   bg:"#3C873A", fg:"#fff", sym:"⬡",  fs:22, fw:400 },
      { name:"Socket.io", bg:"#010101", fg:"#fff", sym:"S",   fs:16, fw:700 },
      { name:"Redis",     bg:"#DC382C", fg:"#fff", sym:"R",   fs:16, fw:700 },
      { name:"PgSQL",     bg:"#336791", fg:"#fff", sym:"🐘",  fs:22, fw:400 },
      { name:"AWS S3",    bg:"#FF9900", fg:"#fff", sym:"S3",  fs:11, fw:700 },
      { name:"Docker",    bg:"#2496ED", fg:"#fff", sym:"🐳",  fs:22, fw:400 },
    ],
    extra:0,
    image:"https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=900&q=80",
    quote:"Messages that always arrive. Privacy by default.",
  },
  studyhub:{
    name:"StudyHub",
    sub:"AI-powered study assistant — adaptive quizzes & spaced repetition",
    features:[
      { Icon:BookOpen,    label:"AI Cards",   desc:"Auto-generated" },
      { Icon:Zap,         label:"Spaced Rep", desc:"SM-2 algorithm"  },
      { Icon:Database,    label:"Progress",   desc:"Retention stats" },
      { Icon:ShieldCheck, label:"Audio",      desc:"TTS support"     },
    ],
    meta:[
      { Icon:Activity, val:"6 Months", label:"Duration" },
      { Icon:Box,      val:"Shipped",  label:"Status"   },
      { Icon:Calendar, val:"2024",     label:"Year"     },
      { Icon:User,     val:"Solo",     label:"Role"     },
    ],
    stack:[
      { name:"Next.js",  bg:"#000",    fg:"#fff", sym:"N",  fs:16, fw:700 },
      { name:"OpenAI",   bg:"#10A37F", fg:"#fff", sym:"⬡",  fs:22, fw:400 },
      { name:"PgSQL",    bg:"#336791", fg:"#fff", sym:"🐘",  fs:22, fw:400 },
      { name:"Redis",    bg:"#DC382C", fg:"#fff", sym:"R",   fs:16, fw:700 },
      { name:"Node.js",  bg:"#3C873A", fg:"#fff", sym:"⬡",  fs:22, fw:400 },
      { name:"Tailwind", bg:"#38BDF8", fg:"#fff", sym:"T",   fs:16, fw:700 },
    ],
    extra:0,
    image:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=80",
    quote:"Study smarter. Remember longer.",
  },
  linkshare:{
    name:"LinkShare",
    sub:"File sharing platform — secure, expiring links with analytics",
    features:[
      { Icon:ShieldCheck, label:"Expiring Links", desc:"Auto-expire"   },
      { Icon:Zap,         label:"Password Lock",  desc:"AES-256"       },
      { Icon:Database,    label:"Analytics",      desc:"Link stats"    },
      { Icon:Link2,       label:"Cloud Storage",  desc:"S3 backed"     },
    ],
    meta:[
      { Icon:Activity, val:"2 Months", label:"Duration" },
      { Icon:Box,      val:"Shipped",  label:"Status"   },
      { Icon:Calendar, val:"2023",     label:"Year"     },
      { Icon:User,     val:"Solo",     label:"Role"     },
    ],
    stack:[
      { name:"Express", bg:"#F5F5F5", fg:"#333", sym:"ex", fs:12, fw:700, italic:true },
      { name:"Node.js", bg:"#3C873A", fg:"#fff", sym:"⬡",  fs:22, fw:400 },
      { name:"AWS S3",  bg:"#FF9900", fg:"#fff", sym:"S3", fs:11, fw:700 },
      { name:"PgSQL",   bg:"#336791", fg:"#fff", sym:"🐘",  fs:22, fw:400 },
      { name:"Redis",   bg:"#DC382C", fg:"#fff", sym:"R",   fs:16, fw:700 },
      { name:"JWT",     bg:"#D63AFF", fg:"#fff", sym:"J",   fs:16, fw:700 },
    ],
    extra:0,
    image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80",
    quote:"Share anything. Trust everything.",
  },
};

/* ─── COMPONENT ───────────────────────────────────────────────────── */
export default function PortfolioShowcase() {
  const [activeId, setActiveId] = useState("sunakku");
  const [fading,   setFading]   = useState(false);
  const proj = DATA[activeId];

  const go = (id) => {
    if (id === activeId) return;
    setFading(true);
    setTimeout(() => { setActiveId(id); setFading(false); }, 150);
  };

  /* ── shared tokens ──────────────────────────────────────── */
  const C = {
    bg:     "#F0EBE3",
    card:   "#FFFFFF",
    border: "#EDE5D8",
    border2:"#DDD5C8",
    text:   "#1A0D06",
    muted:  "#9A8C7E",
    live:   "#1A6E3A",
    liveDot:"#2EB66A",
    orange: "#D4651A",
    navAct: "#E8A96A",
  };

  return (
    <div style={{
      height:"80vh",            /* ← locked to 80vh */
      minHeight:560,
      background: C.bg,
      display:"flex",
      padding:"14px",
      boxSizing:"border-box",
      fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
      gap:14,
    }}>

      {/* ════════ LEFT SIDEBAR ════════ */}
      <aside style={{
        width:228, flexShrink:0,
        display:"flex", flexDirection:"column",
        overflow:"hidden",
      }}>
        {/* header */}
        <div style={{ paddingBottom:10, flexShrink:0 }}>
          <div style={{ fontSize:18, fontWeight:700, color:C.text, letterSpacing:"-0.02em", marginBottom:2 }}>
            My Projects
          </div>
          <div style={{ fontSize:11, color:C.muted }}>
            Exploring ideas. Building systems.
          </div>
        </div>

        {/* nav list */}
        <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", display:"flex", flexDirection:"column", gap:2 }}>
          {NAV.map((n) => {
            const active = n.id === activeId;
            const Icon = n.Icon;
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"8px 10px", borderRadius:12,
                  border: active ? `1.5px solid ${C.navAct}` : "1.5px solid transparent",
                  background: active ? C.card : "transparent",
                  boxShadow: active ? "0 2px 10px rgba(0,0,0,0.07)" : "none",
                  cursor:"pointer", textAlign:"left",
                  transition:"all 0.14s ease",
                  flexShrink:0,
                }}
              >
                <div style={{
                  width:34, height:34, borderRadius:9, flexShrink:0,
                  background:n.iconBg, color:n.iconColor,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Icon size={15} />
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {n.sub}
                  </div>
                  {n.live ? (
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:3, marginTop:4,
                      fontSize:9.5, fontWeight:600, color:C.live,
                      background:"#E6F5EE", border:"1px solid #8DCFAB",
                      padding:"1.5px 7px", borderRadius:99,
                    }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:C.liveDot, display:"inline-block" }}/>
                      Live
                    </span>
                  ) : (
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{n.year}</div>
                  )}
                </div>

                {active && (
                  <div style={{ width:7, height:7, borderRadius:"50%", background:C.orange, flexShrink:0 }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* view all */}
        <button style={{
          display:"flex", alignItems:"center", gap:7, marginTop:8,
          padding:"6px 2px", background:"none", border:"none",
          fontSize:11.5, color:C.muted, cursor:"pointer", fontFamily:"inherit", flexShrink:0,
        }}>
          <LayoutGrid size={13} />
          View All Projects
        </button>
      </aside>

      {/* ════════ RIGHT WHITE CARD ════════ */}
      <div style={{
        flex:1,
        background: C.card,
        borderRadius:18, border:`1px solid ${C.border}`,
        boxShadow:"0 2px 20px rgba(0,0,0,0.055)",
        display:"flex", flexDirection:"column",
        overflow:"hidden", minWidth:0,
      }}>

        {/* TOP: content-left + image-right */}
        <div style={{ display:"flex", flex:1, minHeight:0 }}>

          {/* ── content pane ── */}
          <div
            style={{
              flex:"0 0 44%", padding:"20px 24px 16px",
              display:"flex", flexDirection:"column",
              overflowY:"auto", scrollbarWidth:"none",
              opacity: fading ? 0 : 1,
              transform: fading ? "translateY(4px)" : "translateY(0)",
              transition:"opacity 0.15s, transform 0.15s",
            }}
          >
            {/* live badge */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, fontSize:10, fontWeight:700, letterSpacing:"0.13em", color:C.live, flexShrink:0 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:C.liveDot, display:"inline-block", animation:"pf-pulse 2s ease-in-out infinite" }}/>
              LIVE PROJECT
            </div>

            {/* title */}
            <h1 style={{ fontSize:"clamp(36px,4.2vw,52px)", fontWeight:800, letterSpacing:"-0.04em", color:C.text, lineHeight:1, margin:"0 0 6px", flexShrink:0 }}>
              {proj.name}<span style={{ color:C.orange }}>·</span>
            </h1>

            {/* subtitle */}
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.55, marginBottom:16, flexShrink:0 }}>
              {proj.sub}
            </p>

            {/* features — 4 col, icon above, no border boxes */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:16, flexShrink:0 }}>
              {proj.features.map(({ Icon, label, desc }) => (
                <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"9px 4px" }}>
                  <Icon size={17} color="#6B5744" strokeWidth={1.5} style={{ marginBottom:6 }}/>
                  <div style={{ fontSize:10.5, fontWeight:600, color:C.text }}>{label}</div>
                  <div style={{ fontSize:9.5, color:C.muted, marginTop:1 }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display:"flex", gap:10, marginBottom:16, flexShrink:0 }}>
              <button style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"9px 18px", borderRadius:9,
                background:C.text, color:"#fff",
                border:"none", fontSize:12, fontWeight:600,
                cursor:"pointer", fontFamily:"inherit",
                boxShadow:"0 3px 12px rgba(26,13,6,0.2)",
              }}>
                <Play size={11} fill="#fff"/>
                View Project
              </button>
              <button style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"9px 18px", borderRadius:9,
                background:"#fff", color:C.text,
                border:`1px solid ${C.border2}`, fontSize:12, fontWeight:600,
                cursor:"pointer", fontFamily:"inherit",
              }}>
                <CodeXml size={13}/>
                View Code
              </button>
            </div>

            {/* meta strip */}
            <div style={{
              display:"grid", gridTemplateColumns:"repeat(4,1fr)",
              background:"#FAF7F3", border:`1px solid ${C.border}`,
              borderRadius:11, overflow:"hidden", flexShrink:0,
            }}>
              {proj.meta.map(({ Icon, val, label }, i) => (
                <div key={label} style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  padding:"10px 6px",
                  borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                  gap:3,
                }}>
                  <div style={{
                    width:22, height:22, borderRadius:"50%",
                    border:`1px solid ${C.border2}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:C.muted, marginBottom:2,
                  }}>
                    <Icon size={10} strokeWidth={1.5}/>
                  </div>
                  <div style={{ fontSize:11.5, fontWeight:700, color:C.text, textAlign:"center", lineHeight:1.2 }}>{val}</div>
                  <div style={{ fontSize:9, color:C.muted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── image pane ── */}
          <div style={{ flex:1, padding:"14px 14px 14px 0", minHeight:0 }}>
            <div style={{ height:"100%", borderRadius:13, overflow:"hidden" }}>
              <img
                key={activeId}
                src={proj.image}
                alt={proj.name}
                style={{
                  width:"100%", height:"100%", objectFit:"cover", display:"block",
                  opacity: fading ? 0 : 1,
                  transition:"opacity 0.22s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM: Built With + quote */}
        <div style={{
          borderTop:`1px solid ${C.border}`,
          padding:"14px 24px 12px",
          flexShrink:0,
          opacity: fading ? 0 : 1,
          transition:"opacity 0.15s",
        }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:10 }}>
            Built With
          </div>

          {/* stack logos */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:18, flexWrap:"wrap", marginBottom:12 }}>
            {proj.stack.map((s) => (
              <div key={s.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{
                  width:46, height:46, borderRadius:12,
                  background:s.bg, color:s.fg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:s.fs, fontWeight:s.fw,
                  fontStyle: s.italic ? "italic" : "normal",
                  fontFamily: s.italic ? "Georgia,serif" : "inherit",
                  border:"1px solid rgba(0,0,0,0.06)",
                  boxShadow:"0 1px 6px rgba(0,0,0,0.08)",
                }}>
                  {s.sym}
                </div>
                <div style={{ fontSize:9.5, color:C.muted, textAlign:"center" }}>{s.name}</div>
              </div>
            ))}
            {proj.extra > 0 && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{
                  width:46, height:46, borderRadius:12,
                  background:"#F0EBE3", border:`1px solid ${C.border2}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700, color:"#7A6655",
                }}>
                  +{proj.extra}
                </div>
                <div style={{ fontSize:9.5, color:C.muted }}>more</div>
              </div>
            )}
          </div>

          {/* quote */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <span style={{ fontSize:28, color:"#D8CFC4", lineHeight:1, fontFamily:"Georgia,serif", userSelect:"none" }}>"</span>
            <span style={{ fontSize:12, color:"#B0A494", fontStyle:"italic" }}>{proj.quote}</span>
            <span style={{ fontSize:28, color:"#D8CFC4", lineHeight:1, fontFamily:"Georgia,serif", userSelect:"none" }}>"</span>
          </div>
        </div>

      </div>{/* end white card */}

      <style>{`
        @keyframes pf-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        *::-webkit-scrollbar { display:none }
      `}</style>
    </div>
  );
}