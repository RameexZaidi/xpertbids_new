import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Oval } from "react-loader-spinner";

export default function ChildCategories() {
  //const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Get category ID from URL
  // console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        // Fetch subcategories
        const subcategoryResponse = await axios.get(
          `https://admin.xpertbid.com/api/get-childern/${id}`
        );
        setSubcategories(subcategoryResponse.data.subcategories || []);

        // Fetch products for the category
        // const productResponse = await axios.get(
        //   `https://admin.xpertbid.com/api/get-category-product/${id}`
        // );
        // setProducts(productResponse.data.product || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Oval height={80} width={80} color="#3498db" secondaryColor="#f3f3f3" ariaLabel="loading-indicator" />
        </div>
      ) : (
        <section className="browsecategories">
          <div className="container-fluid">
            <div className="row cate-heading-parent">
              <div className="col-md-6 cate-heading">
                <h2 className="browse-heading">{id}</h2>
              </div>
            </div>

            {/* Display subcategories */}
            {subcategories.length > 0 && (
              <div className="row cate-cards-parent">
                {subcategories.map((subcategory) => (
                  
                  <div className="col-lg-3 col-md-6 cate-card-main" key={subcategory.id}>
                      <div className="cate-card">
                        <Link href={`/category/${subcategory.name}`} className="product-box">
                        <div className="row images-portion">
                              <div className="col-12 image-1">
                            <img
                              src={`https://admin.xpertbid.com/${subcategory.image}`}
                              alt={subcategory.name}
                              
                            />
                          </div>
                          </div>
                          <div className="cate-title">
                              <h2>{subcategory.name}</h2>
                            {/* <h4>{subcategory.name}</h4> */}
                          </div>
                          
                        </Link>
                      </div>
                  </div>
                

                  

                ))}
              </div>
            )}

            {/* Display products */}
            {/* <div className="row makt-parent">
              {products.length > 0 ? (
                products.map((product) => (
                  <div className="col-sm-3 mkt-child" key={product.id}>
                    <div className="market-card">
                      <Link href={`/product/${product.id}`} className="product-box">
                        <div className="mkt-img">
                          <img
                            src={`https://admin.xpertbid.com/${product.image}`}
                            alt={product.title}
                          />
                        </div>
                        <div className="mkt-body">
                          <div className="mkt-pro-head">
                            <h3>{product.title}</h3>
                          </div>
                          <div className="mkt-detail">
                            <div className="mkt-crt-bid">
                              <span className="crnt-bid">Current Bid</span>
                              <div className="mkt-bid-price">
                                <i className="fa-solid fa-dollar-sign"></i>
                                <span className="price">{product.currentBid}</span> USD
                              </div>
                            </div>
                            <div className="mkt-bid-btn">
                              <Link href={`/product/${product.id}`}>Place Bid</Link>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div> */}
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
        .subcategories-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }
        .subcategory-child {
          text-align: center;
          margin: 10px;
        }
        .subcategory-box {
          text-decoration: none;
          color: #333;
        }
        .subcategory-card {
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: 0.3s;
        }
        .subcategory-card:hover {
          transform: scale(1.05);
        }
        .subcategory-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}
