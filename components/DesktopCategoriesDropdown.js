import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function DesktopBootstrapCategoriesDropdown() {
  const [categories, setCategories] = useState([]);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  // Fetch root categories
  useEffect(() => {
    axios.get('https://admin.xpertbid.com/api/get-category')
      .then(res => setCategories(
        (res.data.categories || []).map(c => ({ ...c, subcategories: [] }))
      ))
      .catch(err => console.error(err));
  }, []);

  // Lazy-load subcategories on hover
  const loadSubcategories = async slug => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat || cat.subcategories.length) return;
    try {
      const res = await axios.get(
        `https://admin.xpertbid.com/api/get-subcategories/${cat.id}`
      );
      setCategories(prev => prev.map(c =>
        c.id === cat.id
          ? { ...c, subcategories: res.data.subcategories || [] }
          : c
      ));
    } catch (e) {
      console.error(e);
    }
  };

  // Bootstrap event listeners for dropdown open/close
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const handleShow = () => setIsOpen(true);
    const handleHide = () => setIsOpen(false);
    dropdown.addEventListener('show.bs.dropdown', handleShow);
    dropdown.addEventListener('hide.bs.dropdown', handleHide);
    return () => {
      dropdown.removeEventListener('show.bs.dropdown', handleShow);
      dropdown.removeEventListener('hide.bs.dropdown', handleHide);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <a
        className="btn nav-link dropdown-toggle"
        href="#"
        ref={btnRef}
        role="button"
        id="categoriesDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        style={{ border: "none" }}
      >
        Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="ms-1"
        >
          {isOpen ? (
            // UP arrow
            <path
              d="M3.4001 12.5416L8.83344 7.10829C9.4751 6.46663 10.5251 6.46663 11.1668 7.10829L16.6001 12.5416"
              stroke="#606060"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            // DOWN arrow
            <path
              d="M16.5999 7.45837L11.1666 12.8917C10.5249 13.5334 9.4749 13.5334 8.83324 12.8917L3.3999 7.45837"
              stroke="#606060"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </a>

      <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
        {categories.map(cat => (
          <li
            key={cat.slug}
            className={cat.subcategories.length ? 'dropend' : ''}
            onMouseEnter={() => {
              setHoveredCat(cat.slug);
              loadSubcategories(cat.slug);
            }}
            onMouseLeave={() => setHoveredCat(null)}
          >
            <Link
              href={{ pathname: '/marketplace', query: { category: cat.slug } }}
              className="dropdown-item"
            >
              {cat.name}
            </Link>
            {/* Submenu shown on hover */}
            {hoveredCat === cat.slug && cat.subcategories.length > 0 && (
              <ul className="dropdown-menu sub-menu show">
                {cat.subcategories.map(sub => (
                  <li key={sub.slug}>
                    <Link
                      href={{ pathname: '/marketplace', query: { category: sub.slug } }}
                      className="dropdown-item"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
