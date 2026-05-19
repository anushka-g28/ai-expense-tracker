interface StepItemProps {
  step: string;
  title: string;
  desc: string;
}

export default function StepItem({ step, title, desc }: StepItemProps) {
  return (
    <div className="flex gap-6 items-start">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.55)",
          zIndex: 1,
        }}
      >
        <span className="text-indigo-400 font-bold text-sm">{step}</span>
      </div>
      <div className="pt-4">
        <h3 className="text-white font-semibold text-xl mb-1">{title}</h3>
        <p className="text-gray-400">{desc}</p>
      </div>
    </div>
  );
}