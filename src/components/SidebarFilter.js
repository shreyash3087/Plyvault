import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const SidebarFilter = ({ brands, onFilterChange }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [discountRange, setDiscountRange] = useState([0, 100]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    onFilterChange({
      priceRange: range,
      brands: selectedBrands,
      discountRange,
    });
  };

  const handleDiscountChange = (range) => {
    setDiscountRange(range);
    onFilterChange({
      priceRange,
      brands: selectedBrands,
      discountRange: range,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Filters</h2>
      <hr className="mb-2" />
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Brands</h3>
        <div className="flex flex-col space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                value={brand}
                onChange={() => handleBrandChange(brand)}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Price Range
        </h3>
        <Slider
          range
          min={0}
          max={100000}
          step={1000}
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Discount Range
        </h3>
        <Slider
          range
          min={0}
          max={100}
          step={1}
          value={discountRange}
          onChange={handleDiscountChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{discountRange[0]}% OFF</span>
          <span>{discountRange[1]}% OFF</span>
        </div>
      </div>
    </div>
  );
};


export default SidebarFilter;