import React from 'react';

export interface CategoryItem {
  label: string;
  key: string;
}

interface FiltrelerProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (categoryKey: string) => void;
}

const Filtreler: React.FC<FiltrelerProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`
                px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 border
                ${
                  isActive
                    ? 'bg-[#23C8B9] text-white border-[#23C8B9] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#23C8B9] hover:text-[#23C8B9] hover:shadow-sm'
                }
              `}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Filtreler;
