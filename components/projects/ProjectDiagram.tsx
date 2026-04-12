'use client'

type DiagramType = 'sunakku' | 'velox' | 'gatekeeper'

interface Props {
  type: DiagramType
}

/* ── shared node colours ──────────────────────────────────────────────── */
const N = {
  sand:   { fill: '#EDE0CC', stroke: '#C8A870' },
  bark:   { fill: '#7A4A28', stroke: '#C4694A' },
  moss:   { fill: '#D4EBC4', stroke: '#8AB870' },
}

/* ── tiny helpers ─────────────────────────────────────────────────────── */
function Node({
  x, y, w = 110, h = 38, title, sub, theme = 'sand',
}: {
  x: number; y: number; w?: number; h?: number
  title: string; sub: string; theme?: keyof typeof N
}) {
  const { fill, stroke } = N[theme]
  const titleColor  = theme === 'bark' ? '#F5DCC0' : theme === 'moss' ? '#2A5010' : '#1E0E04'
  const subColor    = theme === 'bark' ? '#C8956A' : theme === 'moss' ? '#5A8040' : '#8A6A4A'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={0.8} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle"
        style={{ fontSize: 10, fontWeight: 700, fill: titleColor, fontFamily: 'monospace' }}>
        {title}
      </text>
      <text x={x + w / 2} y={y + 28} textAnchor="middle"
        style={{ fontSize: 8, fill: subColor, fontFamily: 'monospace' }}>
        {sub}
      </text>
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, label }: { x1:number; y1:number; x2:number; y2:number; label?: string }) {
  const id = `arr-${x1}-${y1}-${x2}-${y2}`
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return (
    <>
      <defs>
        <marker id={id} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L0,6 L6,3z" fill="#C8A870" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#C8A870" strokeWidth={0.9} markerEnd={`url(#${id})`} />
      {label && (
        <text x={mx + 3} y={my - 3}
          style={{ fontSize: 7, fill: '#B89A78', fontFamily: 'monospace' }}>
          {label}
        </text>
      )}
    </>
  )
}

/* ── Sunakku diagram ──────────────────────────────────────────────────── */
function SunakkuDiagram() {
  return (
    <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <Node x={90}  y={8}   w={120} title="Web App"      sub="Next.js"       theme="sand" />
      <Node x={6}   y={84}  w={90}  title="Auth"         sub="JWT / Glauth"  theme="sand" />
      <Node x={104} y={84}  w={106} title="REST API"     sub="Express"       theme="bark" />
      <Node x={218} y={84}  w={78}  title="Redis Cache"  sub="TTL 80s"       theme="moss" />
      <Node x={104} y={168} w={106} title="Order Queue"  sub="BullMQ"        theme="sand" />
      <Node x={218} y={168} w={78}  title="PostgreSQL"   sub="Prisma ORM"    theme="sand" />

      <Arrow x1={150} y1={46}  x2={150} y2={82}  label="http"    />
      <Arrow x1={128} y1={46}  x2={70}  y2={82}               />
      <Arrow x1={157} y1={122} x2={157} y2={166} label="enqueue" />
      <Arrow x1={210} y1={103} x2={218} y2={103} label="read"    />
      <Arrow x1={210} y1={122} x2={244} y2={166} label="persist" />
      <Arrow x1={210} y1={187} x2={218} y2={187}               />
    </svg>
  )
}

/* ── Velox diagram ────────────────────────────────────────────────────── */
function VeloxDiagram() {
  return (
    <svg viewBox="0 0 300 230" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <Node x={90}  y={8}   w={120} title="Upstream Services" sub="any service"      theme="sand" />
      <Node x={80}  y={84}  w={140} title="Event Router"      sub="Kafka · Node.js"  theme="bark" />
      <Node x={6}   y={168} w={86}  title="Email"             sub="SendGrid · Go"    theme="moss" />
      <Node x={108} y={168} w={86}  title="SMS"               sub="Twilio · Go"      theme="moss" />
      <Node x={210} y={168} w={86}  title="Push"              sub="FCM / APNs"       theme="moss" />

      <Arrow x1={150} y1={46}  x2={150} y2={82}  label="emit event" />
      <Arrow x1={126} y1={122} x2={62}  y2={166}                    />
      <Arrow x1={150} y1={122} x2={150} y2={166} label="fan-out"    />
      <Arrow x1={174} y1={122} x2={238} y2={166}                    />
    </svg>
  )
}

/* ── Gatekeeper diagram ───────────────────────────────────────────────── */
function GatekeeperDiagram() {
  return (
    <svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <Node x={80}  y={8}   w={140} title="Client"           sub="API / browser / mobile"  theme="sand" />
      <Node x={65}  y={84}  w={170} title="Gatekeeper Core"  sub="Go · OAuth2 · Casbin"    theme="bark" />
      <Node x={6}   y={168} w={88}  title="Tokens"           sub="Redis 60s"               theme="sand" />
      <Node x={108} y={168} w={88}  title="Policy Engine"    sub="Casbin RBAC"             theme="sand" />
      <Node x={210} y={168} w={84}  title="Audit Log"        sub="PostgreSQL"              theme="sand" />
      <Node x={80}  y={232} w={140} title="Downstream"       sub="gRPC sidecar · verified" theme="moss" />

      <Arrow x1={150} y1={46}  x2={150} y2={82}  label="verify"     />
      <Arrow x1={126} y1={122} x2={62}  y2={166}                     />
      <Arrow x1={150} y1={122} x2={150} y2={166} label="delegate"   />
      <Arrow x1={174} y1={122} x2={246} y2={166}                     />
      <Arrow x1={150} y1={206} x2={150} y2={230} label="allow/deny" />
    </svg>
  )
}

export default function ProjectDiagram({ type }: Props) {
  return (
    <div
      className="rounded-md p-4"
      style={{
        background: 'var(--proj-cream)',
        border: '1px solid var(--proj-border)',
      }}
    >
      {type === 'sunakku'    && <SunakkuDiagram />}
      {type === 'velox'      && <VeloxDiagram />}
      {type === 'gatekeeper' && <GatekeeperDiagram />}
    </div>
  )
}
