interface ProgressProps {
    value: number;
    color?: string;
    className?: string;
  }
  
  const Progress = ({ value, color = 'bg-emerald-500', className }: ProgressProps) => {
    return (
      <div className={`relative w-full bg-gray-200 rounded ${className}`}>
        <div
          className={`absolute top-0 left-0 h-full ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    );
  };

  export default Progress