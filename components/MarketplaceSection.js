// components/MarketplaceSection.js
import Link from "next/link";
import CountdownTimer from "./countdown";
export default function MarketplaceSection({ products }) {
    return (
      <section className="marketplace">
        <div className="container-fluid">
          <div className="mkt-plc-hdig">
            <h2>Explore Marketplace</h2>
          </div>
          <div className="row makt-parent mx-auto">
            {products.length > 0 ? (
              products.map((product) => (
              <div className="col-lg-4 col-sm-6  mkt-child px-sm-3" key={product.id}>
                <div className="market-card">
                
                  <div className="mkt-img">
                  <Link href={`/product/${product.slug}`} className="product-box">
                  <img
                    src={`https://admin.xpertbid.com${JSON.parse(product.album)[0]}`}
                    alt={product.name}
                  />
                  </Link>
                  <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
                  </div>
                  <div className="mkt-body">
                    <div className="mkt-pro-head">
                      <h3><Link href={`/product/${product.slug}`}>{product.title}</Link></h3>
                    </div>
                    <div className="mkt-detail">
                      <div className="mkt-crt-bid">
                        <span className="crnt-bid">Current Bid</span>
                        <div className="mkt-bid-price">
                          
                          <span className="price">{product.bids_max_bid_amount}</span> PKR
                        </div>
                      </div>
                      <div className="mkt-bid-btn">
                        <Link href={`/product/${product.slug}`}>Place Bid</Link>
                      </div>
                    </div>
                  </div>
                
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
          </div>
        </div>
      </section>
    );
  }