import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router'; // <- Ye import add karein
export default function Filter({ categories = [], onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(["Live Auctions"]);
  const [price, setPrice] = useState(300000);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const isInitialMount = useRef(true);
    const router = useRouter();
   const { category } = router.query; // URL se category ID nikalein

  // Ref to track initial mount
  // 1) Pehle selectedCategory & expand logic
useEffect(() => {
  if (!category || categories.length === 0) return;

  const catId = String(category);
  setSelectedCategory(String(catId));

  // 2) Top-level category check
  const topCat = categories.find(c => c.slug === catId);
  if (topCat) {
    setExpandedCategory(topCat.slug);
    setExpandedSubCategory(null);
    return;
  }

  // 3) Sub-category & child-category check
  let parentId = null;
  let subId = null;

  categories.forEach(c => {
    // sub-categories
    c.sub_categories?.forEach(sub => {
      if (sub.slug  === catId) {
        parentId = c.slug;
         subId = sub.slug;
      }
      // child-categories
      sub.child_categories?.forEach(child => {
        if (child.id === catId) {
          parentId = c.slug;
          subId = sub.slug;
        }
      });
    });
  });

  if (parentId !== null) {
    setExpandedCategory(parentId);
    setExpandedSubCategory(subId);
  }
}, [category, categories]); // Jab URL change ho tab chalega
  // Notify parent only when user actually changes a filter,
  // not on first render.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onFilterChange({
        category: selectedCategory,
        status: selectedStatus,
       price: [0, price] ,
      });
    }
  }, [selectedCategory, selectedStatus, price]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(prev => (prev === slug ? "" : slug));
  };

  const toggleCategoryExpand = (slug) => {
    setExpandedCategory(prev => (prev === slug ? null : slug));
  };

  const toggleSubCategoryExpand = (slug) => {
    setExpandedSubCategory(prev => (prev === slug ? null : slug));
  };

  const toggleStatus = (stat) => {
    setSelectedStatus(prev =>
      prev.includes(stat) ? prev.filter(s => s !== stat) : [...prev, stat]
    );
  };

  return (
    <aside className="static-filter-sidebar p-5 bg-white">
      {/* Category */}
      <div className="filter-group mb-5">
        <h4 className="fw-bold mb-3">Category</h4>
        <ul className="list-unstyled">
          <li className="mb-2">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={selectedCategory === "all"}
                onChange={() => handleCategoryChange("all")}
              />
              <span className="checkmark"></span>
              Any Category
            </label>
          </li>

          {categories.map(cat => (
            <li key={cat.slug} className="mb-2">
              <label className="custom-checkbox d-flex align-items-center justify-content-between">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedCategory === String(cat.slug)}
                    onChange={() => handleCategoryChange(String(cat.slug))}
                  />
                  <span className="checkmark"></span>
                  {cat.name}
                </div>
                {cat.sub_categories?.length > 0 && (
                  <button 
                  
                  type="button" onClick={() => toggleCategoryExpand(cat.slug)}>
                  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  style={{
    transform: expandedCategory === cat.slug ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
  }}
>
  <path
    d="M4.07998 8.94998L10.6 15.47C11.37 16.24 12.63 16.24 13.4 15.47L19.92 8.94999"
    stroke="#606060"
    strokeWidth="1.5"
    strokeMiterlimit="10"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

                  </button>
                )}
              </label>

              {/* Sub Categories */}
              {expandedCategory === cat.slug && (
                <ul className="">
                  {cat.sub_categories.map(sub => (
                    <li key={sub.slug} className="mb-2">
                       <label className="custom-checkbox mb-0  d-flex align-items-center justify-content-between">
                         <div>
                          <input
                            type="checkbox"
                            checked={selectedCategory === String(sub.slug)}
                            onChange={() => handleCategoryChange(String(sub.slug))}
                          />
                          <span className="checkmark"></span>
                          {sub.name}
                          </div>

                                                  {sub.child_categories?.length > 0 && (
                          <button type="button" onClick={() => toggleSubCategoryExpand(sub.slug)}>
                             <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      transform: expandedSubCategory === sub.slug ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    }}
  >
    <path
      d="M4.07998 8.94998L10.6 15.47C11.37 16.24 12.63 16.24 13.4 15.47L19.92 8.94999"
      stroke="#606060"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
                          </button>
                        )}
                        </label>   

                      {/* Child Categories */}
                      {expandedSubCategory === sub.slug && (
                        <ul className="ms-4">
                          {sub.child_categories.map(child => (
                            <li key={child.slug} className="mb-1">
                              <label className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedCategory === String(child.slug)}
                                  onChange={() => handleCategoryChange(String(child.slug))}
                                />
                                <span className="checkmark"></span>
                                {child.name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      




      {/* Status */}
      <div className="filter-group mb-5">
        <h4 className="fw-bold mb-3">Status</h4>
        <ul className="list-unstyled">
          {["Live Auctions", "Ending Soon", "Recent Listings"].map(stat => (
            <li className="mb-2" key={stat}>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(stat)}
                  onChange={() => toggleStatus(stat)}
                />
                <span className="checkmark"></span>
                {stat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="filter-group">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-3">Price</h4>
          <div className="d-flex align-items-center mb-3">
            <div className="select-wrapper position-relative w-auto">
              <select className="form-select custom-select w-auto">
                <option value="USD">USD</option>
              </select>
              <div className="select-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 13.75C9.8402 13.75 9.6802 13.6889 9.55816 13.5669L3.30816 7.31691C3.06395 7.0727 3.06395 6.67723 3.30816 6.43316C3.55238 6.1891 3.94785 6.18895 4.19191 6.43316L10 12.2413L15.8082 6.43316C16.0524 6.18895 16.4479 6.18895 16.6919 6.43316C16.936 6.67738 16.9361 7.07285 16.6919 7.31691L10.4419 13.5669C10.3199 13.6889 10.1599 13.75 10 13.75Z"
                    fill="#24282B"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2">
          <input
            type="number"
            className="form-control text-center"
            value={price}
            onChange={(e) => setPrice(Math.min(300000, Math.max(0, Number(e.target.value))))}
          />
        </div>
        <input
          type="range"
          min="0"
          max="300000"
          value={price}
           step="100" // Yeh line add karein
          className="form-range"
          onChange={e => setPrice(Number(e.target.value))}
        />
        <div className="d-flex justify-content-between">
          <small>0</small>
          <small>300,000</small>
        </div>
      </div>
    </aside>
  );
}
