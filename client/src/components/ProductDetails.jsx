import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import WishlistButton from './WishlistButton';
import ReviewsList from './ReviewsList';
import StarRating from './StarRating';
import styles from './ProductDetails.module.css';
import About from "./About";

// Import all product images
import Bronze_Ring from "../assets/Bronze_Ring.jpg";
import Chain_Pearly_Bracelet from "../assets/Chain+Pearly_Bracelet.jpg";
import ChainDiamond_Bracelet from "../assets/ChainDiamond_Bracelet.jpg";
import Diamond_Bracelet from "../assets/Diamond_Bracelet.jpg";
import Diamond_Heart_Earrings from "../assets/Diamond_Heart_Earrings.jpg";
import Diamond_Ring from "../assets/Diamond_Ring.jpg";
import DiamondStone_GOld_Ring from "../assets/DiamondStone+GOld_Ring.jpg";
import Disntant_Pearly_Bracelet from "../assets/Disntant_Pearly_Bracelet.jpg";
import Flat_Pearls_Bracelet from "../assets/Flat_Pearls_Bracelet.jpg";
import GearDiamond_Gold_Ring from "../assets/GearDiamond+Gold_Ring.jpg";
import GearDiamond_Gold_Ring2 from "../assets/GearDiamond+Gold_Ring2.jpg";
import GearDiamond_Gold_Ring3 from "../assets/GearDiamond+Gold_Ring3.jpg";
import HookedPearl_GoldHeart_Earrings from "../assets/HookedPearl+GoldHeart_Earrings.jpg";
import HeartPearl_Earrings from "../assets/HeartPearl_Earrings.jpg";
import GoldFloral_Earrings from "../assets/GoldFloral_Earrings.jpg";
import GoldChained_Earrings from "../assets/GoldChained_Earrings.jpg";
import Gold_Whitey_Earrings from "../assets/Gold+Whitey_Earrings.jpg";

// Enhanced products array with detailed descriptions
const products = [
  { 
    id: 1, 
    name: "Bronze Ring", 
    image: Bronze_Ring, 
    price: 1999, 
    category: "rings",
    description: "A stunning bronze ring crafted with precision and care. This elegant piece features a smooth, polished finish that complements any outfit. Perfect for everyday wear or special occasions, this ring combines durability with timeless style.",
    material: "Bronze",
    weight: "8g",
    stock: 15
  },
  { 
    id: 2, 
    name: "Chain & Pearly Bracelet", 
    image: Chain_Pearly_Bracelet, 
    price: 4599, 
    category: "bracelets",
    description: "An exquisite bracelet featuring delicate pearls interwoven with a fine chain. This sophisticated piece adds elegance to any ensemble, perfect for both casual and formal occasions. The lustrous pearls catch the light beautifully.",
    material: "Sterling Silver, Freshwater Pearls",
    weight: "12g",
    stock: 8
  },
  { 
    id: 3, 
    name: "Chain Diamond Bracelet", 
    image: ChainDiamond_Bracelet, 
    price: 7999, 
    category: "bracelets",
    description: "A luxurious diamond bracelet that sparkles with every movement. Featuring carefully selected diamonds set in a premium chain, this piece is the epitome of elegance and sophistication. A perfect statement piece for special occasions.",
    material: "18K Gold, Diamonds",
    weight: "15g",
    stock: 5
  },
  { 
    id: 4, 
    name: "Diamond Bracelet", 
    image: Diamond_Bracelet, 
    price: 9999, 
    category: "bracelets",
    description: "An extraordinary diamond bracelet showcasing brilliant-cut diamonds in a stunning arrangement. Each diamond is carefully selected for its clarity and brilliance, creating a piece that radiates luxury and refinement.",
    material: "18K White Gold, Premium Diamonds",
    weight: "18g",
    stock: 3
  },
  { 
    id: 5, 
    name: "Diamond Heart Earrings", 
    image: Diamond_Heart_Earrings, 
    price: 5999, 
    category: "earrings",
    description: "Romantic heart-shaped earrings adorned with sparkling diamonds. These charming earrings are perfect for expressing love and affection, featuring a delicate design that captures hearts and compliments beautifully.",
    material: "18K Rose Gold, Diamonds",
    weight: "6g",
    stock: 12
  },
  { 
    id: 6, 
    name: "Diamond Ring", 
    image: Diamond_Ring, 
    price: 8999, 
    category: "rings",
    description: "A magnificent diamond ring featuring a brilliant center stone surrounded by smaller diamonds. This classic design represents eternal love and commitment, crafted with the finest materials and attention to detail.",
    material: "Platinum, Premium Diamonds",
    weight: "10g",
    stock: 6
  },
  { 
    id: 7, 
    name: "Diamond Stone and Gold Ring", 
    image: DiamondStone_GOld_Ring, 
    price: 7550, 
    category: "rings",
    description: "A sophisticated ring combining the brilliance of diamonds with the warmth of gold. This unique piece features a stunning diamond centerpiece complemented by intricate gold detailing, perfect for those who appreciate fine craftsmanship.",
    material: "18K Yellow Gold, Diamond",
    weight: "9g",
    stock: 7
  },
  { 
    id: 8, 
    name: "Distant Pearly Bracelet", 
    image: Disntant_Pearly_Bracelet, 
    price: 2999, 
    category: "bracelets",
    description: "An elegant bracelet featuring pearls spaced along a delicate chain, creating a sophisticated and understated look. Perfect for adding a touch of refinement to any outfit, this piece embodies timeless elegance.",
    material: "Sterling Silver, Cultured Pearls",
    weight: "10g",
    stock: 20
  },
  { 
    id: 9, 
    name: "Flat Pearls Bracelet", 
    image: Flat_Pearls_Bracelet, 
    price: 3499, 
    category: "bracelets",
    description: "A modern take on the classic pearl bracelet, featuring unique flat pearls that create an contemporary aesthetic. This stylish piece offers versatility and elegance, perfect for the modern woman.",
    material: "Sterling Silver, Flat Cultured Pearls",
    weight: "11g",
    stock: 14
  },
  { 
    id: 10, 
    name: "Gear Diamond & Gold Ring", 
    image: GearDiamond_Gold_Ring, 
    price: 6999, 
    category: "rings",
    description: "An innovative ring design featuring gear-inspired elements with diamonds and gold. This unique piece combines industrial aesthetics with luxury materials, perfect for those who appreciate unconventional beauty.",
    material: "18K Gold, Diamonds",
    weight: "11g",
    stock: 9
  },
  { 
    id: 11, 
    name: "Gear Diamond & Gold Ring 2", 
    image: GearDiamond_Gold_Ring2, 
    price: 7499, 
    category: "rings",
    description: "The second iteration of our popular gear-inspired design, featuring enhanced diamond placement and refined gold work. This statement piece showcases innovative design while maintaining elegance and sophistication.",
    material: "18K Gold, Premium Diamonds",
    weight: "12g",
    stock: 6
  },
  { 
    id: 12, 
    name: "Gear Diamond & Gold Ring 3", 
    image: GearDiamond_Gold_Ring3, 
    price: 6500, 
    category: "rings",
    description: "The latest in our gear-inspired collection, this ring features a more subtle approach to the mechanical aesthetic while maintaining the luxury of diamonds and gold. Perfect for everyday elegance with a unique twist.",
    material: "18K Gold, Diamonds",
    weight: "10g",
    stock: 8
  },
  { 
    id: 13, 
    name: "Hooked Pearl & Gold Heart Earrings", 
    image: HookedPearl_GoldHeart_Earrings, 
    price: 4999, 
    category: "earrings",
    description: "Romantic earrings combining the elegance of pearls with gold heart motifs. These charming pieces feature a unique hook design that adds movement and grace, perfect for romantic occasions or everyday elegance.",
    material: "18K Gold, Cultured Pearls",
    weight: "7g",
    stock: 11
  },
  { 
    id: 14, 
    name: "Heart Pearl Earrings", 
    image: HeartPearl_Earrings, 
    price: 3950, 
    category: "earrings",
    description: "Delicate heart-shaped earrings adorned with lustrous pearls. These romantic pieces combine classic pearl elegance with a playful heart design, perfect for expressing your feminine side with sophistication.",
    material: "Sterling Silver, Cultured Pearls",
    weight: "5g",
    stock: 16
  },
  { 
    id: 15, 
    name: "Gold Floral Earrings", 
    image: GoldFloral_Earrings, 
    price: 5599, 
    category: "earrings",
    description: "Exquisite floral-inspired earrings crafted in gold, featuring intricate petals and botanical details. These nature-inspired pieces bring organic beauty and elegance to any look, perfect for garden parties or elegant evenings.",
    material: "18K Yellow Gold",
    weight: "8g",
    stock: 10
  },
  { 
    id: 16, 
    name: "Gold Chained Earrings", 
    image: GoldChained_Earrings, 
    price: 4299, 
    category: "earrings",
    description: "Modern chain-style earrings in lustrous gold, featuring a contemporary design that moves beautifully with every turn. These versatile pieces add a touch of modern sophistication to any outfit.",
    material: "18K Gold",
    weight: "6g",
    stock: 13
  },
  { 
    id: 17, 
    name: "Gold & Whitey Earrings", 
    image: Gold_Whitey_Earrings, 
    price: 3200, 
    category: "earrings",
    description: "Elegant earrings combining warm gold tones with crisp white accents. This sophisticated color combination creates a versatile piece that complements both casual and formal attire with timeless appeal.",
    material: "18K Gold, White Enamel",
    weight: "5g",
    stock: 18
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => setAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [added]);

  if (!product) {
    return (
      <div className={styles.productPage}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/products')} className={styles.backBtn}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price / 100, // Convert from cents to rands for cart
          image: product.image,
          category: product.category
        },
        quantity
      );
      
      setAdded(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span onClick={() => navigate('/')} className={styles.breadcrumbLink}>Home</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span onClick={() => navigate('/products')} className={styles.breadcrumbLink}>Products</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>

        {/* Product Section */}
        <div className={styles.productMain}>
          <div className={styles.productImage}>
            <img src={product.image} alt={product.name} />
          </div>

          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              <h1 className={styles.productName}>{product.name}</h1>
              <WishlistButton 
                product={product} 
                size="large" 
                showText={true}
              />
            </div>
            <p className={styles.productPrice}>R{(product.price / 100).toFixed(2)}</p>
            
            <div className={styles.productMeta}>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Material:</strong> {product.material}</p>
              <p><strong>Weight:</strong> {product.weight}</p>
            </div>

            <p className={styles.productDescription}>{product.description}</p>
            
            <p className={styles.stock}>
              <span className={styles.stockDot}></span>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            {product.stock > 0 && (
              <>
                <div className={styles.quantityContainer}>
                  <label>Quantity</label>
                  <div className={styles.quantityControls}>
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  className={`${styles.addToCartBtn} ${loading ? styles.loading : ''} ${added ? styles.added : ''}`}
                  onClick={handleAddToCart}
                  disabled={loading || product.stock === 0}
                >
                  {loading ? 'Adding...' : added ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </>
            )}

            <button 
              className={styles.backBtn}
              onClick={() => navigate('/products')}
            >
              ← Back to Products
            </button>
          </div>
        </div>

        {/* Similar Items */}
        {similarProducts.length > 0 && (
          <>
            <div className={styles.sectionDivider}>
              <span>Similar Items</span>
            </div>

            <div className={styles.similarItems}>
              {similarProducts.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.similarCard}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img src={item.image} alt={item.name} />
                  <p className={styles.similarName}>{item.name}</p>
                  <p className={styles.similarPrice}>R{(item.price / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* About Section */}
        <About />
      </div>
    </div>
  );
};

export default ProductDetails;
