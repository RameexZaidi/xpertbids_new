import { useState, useEffect } from "react";
import { useRouter }        from "next/router";
import Header               from "@/components/Header";
import Footer               from "@/components/Footer";
import { Oval }             from "react-loader-spinner";
import Filter               from "../components/Filter";
import ExploreProducts      from "../components/ExploreProducts";
import AdvancedPagination from '@/components/AdvancedPagination';

export default function Marketplace() {
  const router = useRouter();
  const { category: initialCategory } = router.query;
  const isReady = router.isReady;

  // ── Price state ──
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300000);

  // ── Filter & pagination state ──
  const [categories, setCategories]           = useState([]);
  const [filters, setFilters]                 = useState({
    category: "",     // category ID
    status: [],       // e.g. ["Live Auctions"]
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage]         = useState(1);
  const [totalPages, setTotalPages]           = useState(1);
  const [loading, setLoading]                 = useState(true);

  const itemsPerPage = 12;
 useEffect(() => {
  if (!isReady) return;

  if (initialCategory !== undefined) {
    setFilters(prev => ({
      ...prev,
      category: initialCategory
    }));
    setCurrentPage(1);
  }
}, [isReady, initialCategory]);
  // 1) Load category list
  useEffect(() => {
    fetch("https://admin.xpertbid.com/api/get-all-categories")
      .then(r => r.json())
      .then(data => setCategories(data.category || []))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  // 2) Initialize category filter from URL
useEffect(() => {
  // Wait until Next.js has populated router.query
  if (!isReady) return;

  // If the URL had ?category=123, don’t fetch “all” on first mount:
  // only when filters.category has been updated to initialCategory.
  if (initialCategory !== undefined && filters.category === "") {
    return;
  }else{

  }

  // Build query params from your state
  const params = new URLSearchParams();
  if (filters.category)      params.append("category", filters.category);
  filters.status.forEach(s => params.append("status[]", s));
  params.append("priceMin",  minPrice);
  params.append("priceMax",  maxPrice);
  params.append("page",      currentPage);
  params.append("perPage",   itemsPerPage);

  // Fire the request
  setLoading(true);
  fetch(`https://admin.xpertbid.com/api/products/filter?${params.toString()}`)
    .then(r => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(data => {
      setFilteredProducts(data.items || []);
      setTotalPages(data.totalPages || 1);
    })
    .catch(err => {
      console.error("Filter API error:", err);
      setFilteredProducts([]);
    })
    .finally(() => setLoading(false));
}, [
  // re-run when:
  isReady,             // router readiness
  initialCategory,     // initial ?category= value
  filters,             // any change to category or status
  minPrice,            // slider min
  maxPrice,            // slider max
  currentPage          // pagination click
]);

  // Handler for Filter component
  const handleFilterChange = ({ category, status, price }) => {
    setFilters({ category, status });
    setMinPrice(price[0]);
    setMaxPrice(price[1]);
    setCurrentPage(1);
  };

  // Pagination click handler
  const paginate = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <section className="mkt-hero-section">
            <div className="container-fluid">
                <div className="mkt-hero-parent">
                    <h1 className="mkt-sec">Search Online Businesses for
                        Sale</h1>
                    <p>
XpertBid is more than a marketplace—it is a movement toward smarter, more sustainable business practices. Whether you are looking to buy, sell, or simply explore, we invite you to join us and see how XpertBid can transform the way you do business.
</p>
                </div>
            </div>
        </section>
      <section className="marketplace-product">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 mkt-left">
              <Filter
                categories={categories}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="col-lg-8 mkt-right">
              <div className="mkt-page-plc-hdig">
                <h2 className="ms-4">All Items</h2>
               <AdvancedPagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={paginate}
  />
              </div>
              {loading ? (
                <div className="loader-container">
                  <Oval
                    height={80}
                    width={80}
                    color="#3498db"
                    secondaryColor="#f3f3f3"
                    ariaLabel="loading-indicator"
                  />
                </div>
              ) : filteredProducts.length > 0 ? (
                <ExploreProducts products={filteredProducts} />
              ) : (
                <p>No products match your filters. Please adjust the criteria.</p>
              )}

               {/* bottom pagination controls */}
             
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
