import React from "react";

export default function FloatingNumbers() {
    const [numbers, setNumbers] = React.useState<Array<{ id: number; text: string; top: number; left: number; isPositive: boolean }>
    >([]);
  
    React.useEffect(() => {
        const interval = setInterval(() => {
          const newItems = Array.from({ length: 3 }).map(() => {
            const isPositive = Math.random() < 0.5;
            const amount = (Math.random() * 100000).toFixed(4);
            const text = (isPositive ? "+" : "-") + amount;
            return {
              id: Date.now() + Math.random(),
              text,
              top: 30 + Math.random() * 40,
              left: 5 + Math.random() * 90,
              isPositive,
            };
          });
    
          setNumbers((prev) => [...prev, ...newItems]);
    
          newItems.forEach((item) => {
            setTimeout(() => {
              setNumbers((prev) => prev.filter((el) => el.id !== item.id));
            }, 20000);
          });
        }, 2000);
    
        return () => clearInterval(interval);
      }, []);
  
    return (
        <>
        {numbers.map((item) => (
          <span
            key={item.id}
            className={`absolute font-bold text-xs animate-slowFadeInOut ${
              item.isPositive ? "text-green-500" : "text-red-500"
            }`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
            }}
          >
            {item.text}
          </span>
        ))}
      </>
    );
  }
  