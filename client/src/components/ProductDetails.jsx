import React from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import products from "../data/products"; // import shared products array
import About from "./About";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products[id - 1];

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        {/* Product Section */}
        <div className={styles.productMain}>
          <div className={styles.productImage}>
            <img src={product.image} alt={product.name} />
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>R{product.price.toFixed(2)}</p>
            <p className={styles.productDescription}>
              {product.description ||
                "Description of the product in a very detailed manner, to give the customer a clear picture of the desired product."}
            </p>
            <p className={styles.stock}>
              <span className={styles.stockDot}></span>
              In stock
            </p>

            <div className={styles.quantityContainer}>
              <label>Quantity</label>
              <div className={styles.quantityControls}>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>

            <button className={styles.addToCartBtn}>Add to cart</button>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.sectionDivider}>
          <span>Similar Items</span>
        </div>

        {/* Similar Items */}
        <div className={styles.similarItems}>
          {products.slice(0, 6).map((item, idx) => (
            <div key={idx} className={styles.similarCard}>
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <About />
      </div>
    </div>
  );
};

export default ProductDetails;
