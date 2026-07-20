import React, { useState } from 'react';

export const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

interface MobileSliderProps {
  data: any[];
  renderCard: (item: any, idx: number) => React.ReactNode;
  chunkSize?: number;
}

export const MobileSlider = ({ data, renderCard, chunkSize = 3 }: MobileSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const chunks = chunkArray(data, chunkSize);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const clientWidth = e.currentTarget.clientWidth;
    const index = Math.round(scrollLeft / clientWidth);
    if (index >= 0 && index < chunks.length) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-2 -mx-6 px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {chunks.map((chunk, chunkIdx) => (
          <div key={chunkIdx} className="w-full shrink-0 snap-center flex flex-col gap-4">
            {chunk.map((item, idx) => renderCard(item, chunkIdx * chunkSize + idx))}
          </div>
        ))}
      </div>
      
      {chunks.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-2 mt-2">
          {chunks.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-4 bg-accent' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
