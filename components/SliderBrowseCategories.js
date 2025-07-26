import { useState, useEffect} from "react";
import { Oval } from "react-loader-spinner"; // Import the loader
import axios from "axios";
import Link from "next/link";
export default function BrowseCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Make API request to fetch categories
        const response = await axios.get("https://admin.xpertbid.com/api/get-category");
       // console.log(response.data.categories);
        setCategories(response.data.categories || []); // Update categories state
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <>
    {loading ? (
                    // Show loader while loading
                    <div className="loader-container">
                      <Oval 
                        height={80}
                        width={80}
                        color="#3498db"
                        secondaryColor="#f3f3f3"
                        ariaLabel="loading-indicator"
                      />
                    </div>
                  ) : (
                <section className="browsecategories">
                  <div className="container-fluid">
                    <div className="row cate-heading-parent d-flex justify-content-between align-items-center">
                      <div className="col-sm-6 cate-heading ">
                        <h2 className="browse-heading ">Browse Categories</h2>
                           
                      </div>
                      <div className="col-sm-6">
                        <div className="ms-auto d-none d-sm-flex " >
                   <div className="pro-bid-btn ms-auto"><Link href="/categories" className="cate-padd">Explore Categories</ Link></div>
                      </div>
                      </div>
                      </div>

                    {/* Display categories */}
                    <div className="row cate-cards-parent">
                      {categories.slice(0, 4).map((cat, i) => (
  <div className="col-xl-3  col-sm-6 cate-card-main px-3" key={i}>
    <div className="cate-card">
      <Link
        href={{ pathname: "/marketplace", query: { category: cat.slug } }}
        className="product-box"
      >
        <div className="row images-portion">
          <div className="col-12 image-1">
            <img
  src={`https://admin.xpertbid.com${
    cat.image?.startsWith("/") ? "" : "/"
  }${cat.image ?? "images/placeholder.png"}`}
  alt={cat.name}
/>
          </div>
        </div>
        <div className="cate-title">
          <h2>{cat.name}</h2>
        </div>
        <div className="cate-lisitng">
          <span>{cat.auctions_count} Listings</span>
        </div>
      </Link>
    </div>
  </div>
))}

                    </div>

                    <div className="row cate-cards-parent">
                     {categories.slice(4, 8).map((cat, i) => (
  <div className="col-xl-3 col-sm-6 cate-card-main" key={i}>
    <div className="cate-card">
      <Link
        href={{ pathname: "/marketplace", query: { category: cat.slug } }}
        className="product-box"
      >
        <div className="row images-portion">
          <div className="col-12 image-1">
           <img
  src={`https://admin.xpertbid.com${
    cat.image?.startsWith("/") ? "" : "/"
  }${cat.image ?? "images/placeholder.png"}`}
  alt={cat.name}
/>
          </div>
        </div>
        <div className="cate-title">
          <h2>{cat.name}</h2>
        </div>
        <div className="cate-lisitng">
          <span>{cat.auctions_count} Listings</span>
        </div>
      </Link>
    </div>
  </div>
))}

                    </div>

                   
                 
                  </div>
                </section>
                )}

                <style jsx>{`
                  .loader-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                  }
                `}</style>
    </>
  );
}