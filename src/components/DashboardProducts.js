import { useEffect, useState } from "react";
import Link from "next/link";
import { FaList, FaThLarge, FaFilter } from "react-icons/fa";
import SidebarFilter from "./SidebarFilter";

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brands: [],
    discountRange: [0, 100],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
        const uniqueBrands = [...new Set(data.products.map((p) => p.company))];
        setBrands(uniqueBrands);
        setSortedProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterAndSortProducts(query, sortOption, filters);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortOption(sort);
    filterAndSortProducts(searchQuery, sort, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    filterAndSortProducts(searchQuery, sortOption, newFilters);
  };

  const filterAndSortProducts = (query, sort, filters) => {
    let filtered = products;

    // Search logic
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filter logic
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.company)
      );
    }
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1] &&
        product.discount >= filters.discountRange[0] &&
        product.discount <= filters.discountRange[1]
    );

    // Sort logic
    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setSortedProducts(filtered);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "card" ? "list" : "card");
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div>
      <div className="min-h-screen pb-10 bg-gray-100">
        <div className="flex flex-col lg:flex-row">
   
          <div className="hidden lg:block w-1/4 p-4">
            <SidebarFilter
              brands={brands}
              onFilterChange={handleFilterChange}
            />
          </div>

   
          <div className="w-full lg:w-3/4 p-4">
            <div className="max-w-7xl mx-auto">
         
              <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full lg:w-1/3 px-4 py-2 border rounded-lg shadow-sm mb-4 lg:mb-0"
                  />
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="w-full lg:w-1/3 px-4 py-2 border rounded-lg shadow-sm mb-4 lg:mb-0"
                  >
                    <option value="none">Sort By</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                  <div className="flex space-between gap-4">
                    <button
                      onClick={toggleViewMode}
                      className="px-4 py-2 w-full bg-gray-700 text-white rounded-lg shadow-md flex items-center hover:bg-gray-800 transition duration-300"
                    >
                      {viewMode === "card" ? (
                        <FaList className="mr-2" />
                      ) : (
                        <FaThLarge className="mr-2" />
                      )}
                      {viewMode === "card" ? "List View" : "Card View"}
                    </button>
                    <button
                      onClick={toggleFilterDropdown}
                      className="lg:hidden px-4 py-2 w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-md"
                    >
                      <FaFilter className="inline-block mr-2" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>

              {isFilterOpen && (
                <div className="lg:hidden shadow-lg rounded-lg mb-4">
                  <SidebarFilter
                    brands={brands}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
       
              {sortedProducts.length > 0 ? (
                viewMode === "card" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                      >
                        <Link href={`/products/${product._id}`}>
                          <div className="cursor-pointer">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4 relative">
                              {product.discount &&
                                product.originalPrice > product.price && (
                                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                                    {product.discount}% OFF
                                  </div>
                                )}
                              <h2 className="text-xl font-semibold text-gray-800">
                                {product.title}
                              </h2>
                              <p className="text-gray-600 mt-2">
                                {product.description}
                              </p>
                              <div className="flex items-baseline mt-4">
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through mr-4">
                                    ₹{product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                                <span className="text-lg font-bold text-gray-800">
                                  ₹{product.price.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <button className="text-white bg-[#178573] hover:bg-[#6cb5a9] font-semibold py-2 px-4 rounded">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {sortedProducts.map((product) => (
                      <li
                        key={product._id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden p-4 flex items-center"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-24 h-24 object-cover mr-4"
                        />
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold text-gray-800">
                            {product.title}
                          </h2>
                          <p className="text-gray-600 mt-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          {product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through mb-2">
                              ₹{product.originalPrice.toFixed(2)}
                            </div>
                          )}
                          <span className="text-lg font-bold text-gray-800 mb-2">
                            ₹{product.price.toFixed(2)}
                          </span>
                          <Link
                            href={`/products/${product._id}`}
                            className="text-white bg-[#178573] hover:bg-[#6cb5a9] font-semibold py-2 px-4 rounded"
                          >
                            View
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <p className="text-center text-gray-600">
                  No products available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;
