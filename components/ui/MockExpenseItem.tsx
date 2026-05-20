interface MockExpenseItemProps {
    category: string;
    amount: string;
    note:string;
    color:string;
}
export default function MockExpenseItem ({
    category,
    amount,
    note,
    color
}: MockExpenseItemProps) {
    return (
     <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-white text-xs font-bold">
            {category.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-medium">{category}</p>
          <p className="text-gray-500 text-xs">{note}</p>
        </div>
      </div>
      <span className="text-white font-semibold text-sm">{amount}</span>
    </div>   
    )
}