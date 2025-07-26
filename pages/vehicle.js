// pages/index.js
import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleSlider from '../components/VehicleSlider'; // Adjust path if necessary
import VehicleFeature from '../components/VehicleFeature';
import TopBid from "../components/TopBid";
import FilteredCategories from "../components/FilteredCategories";
import Vehicle from "../components/vehicle";
import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://admin.xpertbid.com/api/get-products"
        );
        const data = await response.json();
        setProducts(data.product || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
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
      ) : (
        <>
          <Header />
          <VehicleSlider />
          <VehicleFeature />
          <TopBid />
          {/* Render vehicle categories */}
          <FilteredCategories />
          <Vehicle products={products} />
          <Footer />
        </>
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
