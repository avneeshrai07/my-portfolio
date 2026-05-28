import StackIcon from 'tech-stack-icons';

interface TechCardProps {
  name: string;
  iconName: string;
  bubbleColor?: string;
}

export default function TechCard({ name, iconName, bubbleColor = '#1a3a6a' }: TechCardProps) {
  return (
    <div className="cursor-pointer group overflow-hidden relative w-32 h-32 bg-neutral-800 rounded-xl">
      {/* bubbles */}
      <div className="absolute rounded-full bg-transparent transition-transform duration-1000 group-hover:scale-150"
        style={{ width:'70%', height:'70%', top:'-20%', left:'-20%', boxShadow:`inset 0 0 22px ${bubbleColor}` }} />
      <div className="absolute rounded-full bg-transparent transition-transform duration-1000 group-hover:scale-150"
        style={{ width:'55%', height:'55%', top:'60%', left:'25%', boxShadow:`inset 0 0 18px ${bubbleColor}` }} />
      <div className="absolute rounded-full bg-transparent transition-transform duration-1000 group-hover:scale-150"
        style={{ width:'75%', height:'75%', top:'25%', left:'55%', boxShadow:`inset 0 0 20px ${bubbleColor}` }} />

      {/* card face */}
      <div className="relative z-10 w-full h-full bg-neutral-600/80 rounded-xl flex flex-col items-center justify-center gap-2 p-3">
        <StackIcon name={iconName} className="w-12 h-12" />
        <span className="text-neutral-50 font-medium text-xs text-center">{name}</span>
      </div>
    </div>
  );
}