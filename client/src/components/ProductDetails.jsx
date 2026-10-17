import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import products, { getProductById, getCategoryLabel } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useReviews } from "../contexts/ReviewsContext";
import { formatPrice } from "../utils/format";
import WishlistButton from "./WishlistButton";
import ReviewsList from "./ReviewsList";
import StarRating from "./StarRating";
import ProductCard from "./ProductCard";
import NotFound from "./NotFound";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { getProductRating } = useReviews();
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(id);

  // Reset quantity when moving between products via "Similar pieces".
  useEffect(() => setQuantity(1), [id]);

  if (!product) return <NotFound />;

  const inCart = items.find((i) => i.id === product.id)?.quantity || 0;
  const available = Math.max(0, product.stock - inCart);
  const soldOut = product.stock <= 0;
  const { average, count } = getProductRating(product.id);

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const buyNow = () => {
    if (addToCart(product, quantity)) navigate("/cart");
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/products?category=${product.category}`}>{getCategoryLabel(product.category)}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className={styles.productMain}>
          <div className={styles.productImage}>
            <img src={product.image} alt={product.name} />
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.name}</h1>

            {count > 0 && (
              <a href="#reviews" className={styles.ratingLink}>
                <StarRating rating={average} size="small" readonly />
                <span>
                  {average.toFixed(1)} ({count} review{count !== 1 ? "s" : ""})
                </span>
              </a>
            )}

            <p className={styles.productPrice}>{formatPrice(product.price)}</p>
            <p className={styles.productDescription}>{product.description}</p>

            <dl className={styles.productMeta}>
              <div>
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{product.weight}</dd>
              </div>
            </dl>

            <p className={`${styles.stock} ${soldOut ? styles.stockOut : product.stock <= 5 ? styles.stockLow : ""}`}>
              <span className={styles.stockDot} aria-hidden="true"></span>
              {soldOut ? "Sold out" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock, ready to ship"}
            </p>

            {!soldOut && (
              <div className={styles.purchase}>
                <div className={styles.quantityControls} role="group" aria-label="Quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= available}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.addToCartBtn}
                  onClick={() => addToCart(product, quantity)}
                  disabled={available <= 0}
                >
                  {available <= 0 ? "All in your cart" : "Add to cart"}
                </button>
              </div>
            )}

            <div className={styles.secondaryActions}>
              {!soldOut && available > 0 && (
                <button type="button" className="btn btn-secondary" onClick={buyNow}>
                  Buy now
                </button>
              )}
              <WishlistButton product={product} size="large" showText />
            </div>

            {inCart > 0 && (
              <p className={styles.inCartNote}>
                {inCart} already in your <Link to="/cart">cart</Link>.
              </p>
            )}

            <ul className={styles.assurances}>
              <li>R60 flat-rate delivery across South Africa, 3–5 working days</li>
              <li>Free delivery with code FREESHIP on orders over R50</li>
            </ul>
          </div>
        </div>

        <section id="reviews" className={styles.reviewsBlock} aria-labelledby="reviews-heading">
          <div className={styles.sectionDivider}>
            <h2 id="reviews-heading">Reviews</h2>
          </div>
          <ReviewsList productId={product.id} />
        </section>

        {similar.length > 0 && (
          <section aria-labelledby="similar-heading">
            <div className={styles.sectionDivider}>
              <h2 id="similar-heading">More {getCategoryLabel(product.category).toLowerCase()}</h2>
            </div>
            <div className={styles.similarItems}>
              {similar.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
