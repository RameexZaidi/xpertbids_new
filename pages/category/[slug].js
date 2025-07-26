import DisplayProducts from "../../components/DisplayProducts";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Oval } from "react-loader-spinner"; // Import the loader
const Categories = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { slug } = router.query; 
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (!slug) return;
  
          // Fetch subcategories
          // const subcategoryResponse = await axios.get(
          //   `https://admin.xpertbid.com/api/get-childern/${id}`
          // );
          // setSubcategories(subcategoryResponse.data.subcategories || []);
  
          // Fetch products for the category
          const productResponse = await axios.get(
            `https://admin.xpertbid.com/api/get-category-product/${slug}`
          );
          setProducts(productResponse.data.product || []);
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
      <Header />
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
              ) : products.length > 0 ? (
                <DisplayProducts products={products} />
              ) : (
                <p className="p-5 text-center">No products match your filters. Please adjust the criteria.</p>
              )}      <Footer />
    </>
  );
};

export default Categories;
