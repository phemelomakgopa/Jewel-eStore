// Single source of truth for the catalogue.
// Prices are stored in cents (ZAR) — always format them with formatPrice().
import Bronze_Ring from "../assets/Bronze_Ring.jpg";
import Chain_Pearly_Bracelet from "../assets/Chain+Pearly_Bracelet.jpg";
import ChainDiamond_Bracelet from "../assets/ChainDiamond_Bracelet.jpg";
import Diamond_Bracelet from "../assets/Diamond_Bracelet.jpg";
import Diamond_Heart_Earrings from "../assets/Diamond_Heart_Earrings.jpg";
import Diamond_Ring from "../assets/Diamond_Ring.jpg";
import DiamondStone_Gold_Ring from "../assets/DiamondStone+GOld_Ring.jpg";
import Distant_Pearly_Bracelet from "../assets/Disntant_Pearly_Bracelet.jpg";
import Flat_Pearls_Bracelet from "../assets/Flat_Pearls_Bracelet.jpg";
import GearDiamond_Gold_Ring from "../assets/GearDiamond+Gold_Ring.jpg";
import GearDiamond_Gold_Ring2 from "../assets/GearDiamond+Gold_Ring2.jpg";
import GearDiamond_Gold_Ring3 from "../assets/GearDiamond+Gold_Ring3.jpg";
import HookedPearl_GoldHeart_Earrings from "../assets/HookedPearl+GoldHeart_Earrings.jpg";
import HeartPearl_Earrings from "../assets/HeartPearl_Earrings.jpg";
import GoldFloral_Earrings from "../assets/GoldFloral_Earrings.jpg";
import GoldChained_Earrings from "../assets/GoldChained_Earrings.jpg";
import Gold_Whitey_Earrings from "../assets/Gold+Whitey_Earrings.jpg";
import Gold_Necklaces from "../assets/Gold_Necklaces.jpg";
import Starfish_Pearl_Necklace from "../assets/IMG-20250813-WA0024.jpg";
import Seaside_Charm_Necklaces from "../assets/IMG-20250813-WA0031.jpg";
import Starfish_Choker from "../assets/IMG-20250813-WA0027.jpg";
import Shell_Anklet from "../assets/IMG-20250813-WA0017.jpg";
import Seashell_Pearl_Bracelet from "../assets/IMG-20250813-WA0016.jpg";

export const CATEGORIES = [
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "earrings", label: "Earrings" },
  { slug: "anklets", label: "Anklets" },
];

export const getCategoryLabel = (slug) =>
  CATEGORIES.find((c) => c.slug === slug)?.label || slug;

const products = [
  {
    id: 1,
    name: "Bronze Ring",
    image: Bronze_Ring,
    price: 1999,
    category: "rings",
    material: "Bronze",
    weight: "8g",
    stock: 15,
    createdAt: "2024-01-15",
    description:
      "A bronze band with a smooth, polished finish. Sturdy enough for everyday wear and simple enough to stack with other rings.",
  },
  {
    id: 2,
    name: "Chain & Pearly Bracelet",
    image: Chain_Pearly_Bracelet,
    price: 4599,
    category: "bracelets",
    material: "Sterling Silver, Freshwater Pearls",
    weight: "12g",
    stock: 8,
    createdAt: "2024-02-01",
    description:
      "Freshwater pearls threaded along a fine silver chain. Light on the wrist and easy to dress up or down.",
  },
  {
    id: 3,
    name: "Chain Diamond Bracelet",
    image: ChainDiamond_Bracelet,
    price: 7999,
    category: "bracelets",
    material: "18K Gold, Diamonds",
    weight: "15g",
    stock: 5,
    createdAt: "2024-02-15",
    description:
      "Small diamonds set into an 18K gold chain so the bracelet catches the light as you move.",
  },
  {
    id: 4,
    name: "Diamond Bracelet",
    image: Diamond_Bracelet,
    price: 9999,
    category: "bracelets",
    material: "18K White Gold, Premium Diamonds",
    weight: "18g",
    stock: 3,
    createdAt: "2024-03-01",
    description:
      "A continuous line of brilliant-cut diamonds in white gold. Our statement piece for evenings and occasions.",
  },
  {
    id: 5,
    name: "Diamond Heart Earrings",
    image: Diamond_Heart_Earrings,
    price: 5999,
    category: "earrings",
    material: "18K Rose Gold, Diamonds",
    weight: "6g",
    stock: 12,
    createdAt: "2024-03-15",
    description:
      "Heart-shaped studs in rose gold, edged with small diamonds. A popular gift.",
  },
  {
    id: 6,
    name: "Diamond Ring",
    image: Diamond_Ring,
    price: 8999,
    category: "rings",
    material: "Platinum, Premium Diamonds",
    weight: "10g",
    stock: 6,
    createdAt: "2024-04-01",
    description:
      "A brilliant centre stone framed by smaller diamonds on a platinum band. A classic engagement setting.",
  },
  {
    id: 7,
    name: "Diamond Stone and Gold Ring",
    image: DiamondStone_Gold_Ring,
    price: 7550,
    category: "rings",
    material: "18K Yellow Gold, Diamond",
    weight: "9g",
    stock: 7,
    createdAt: "2024-04-15",
    description:
      "A single diamond held in yellow gold with fine detailing along the shoulders of the band.",
  },
  {
    id: 8,
    name: "Distant Pearly Bracelet",
    image: Distant_Pearly_Bracelet,
    price: 2999,
    category: "bracelets",
    material: "Sterling Silver, Cultured Pearls",
    weight: "10g",
    stock: 20,
    createdAt: "2024-05-01",
    description:
      "Cultured pearls spaced out along a delicate silver chain. Understated and easy to layer.",
  },
  {
    id: 9,
    name: "Flat Pearls Bracelet",
    image: Flat_Pearls_Bracelet,
    price: 3499,
    category: "bracelets",
    material: "Sterling Silver, Flat Cultured Pearls",
    weight: "11g",
    stock: 14,
    createdAt: "2024-05-15",
    description:
      "Flat, baroque-style pearls give this bracelet a more modern outline than a classic strand.",
  },
  {
    id: 10,
    name: "Gear Diamond & Gold Ring",
    image: GearDiamond_Gold_Ring,
    price: 6999,
    category: "rings",
    material: "18K Gold, Diamonds",
    weight: "11g",
    stock: 9,
    createdAt: "2024-06-01",
    description:
      "A gold band with a gear-like notched edge and a row of set diamonds.",
  },
  {
    id: 11,
    name: "Gear Diamond & Gold Ring 2",
    image: GearDiamond_Gold_Ring2,
    price: 7499,
    category: "rings",
    material: "18K Gold, Premium Diamonds",
    weight: "12g",
    stock: 6,
    createdAt: "2024-06-15",
    description:
      "The gear design with a wider band and more diamonds set around the face.",
  },
  {
    id: 12,
    name: "Gear Diamond & Gold Ring 3",
    image: GearDiamond_Gold_Ring3,
    price: 6500,
    category: "rings",
    material: "18K Gold, Diamonds",
    weight: "10g",
    stock: 8,
    createdAt: "2024-07-01",
    description:
      "A slimmer take on the gear design, made to be worn every day.",
  },
  {
    id: 13,
    name: "Hooked Pearl & Gold Heart Earrings",
    image: HookedPearl_GoldHeart_Earrings,
    price: 4999,
    category: "earrings",
    material: "18K Gold, Cultured Pearls",
    weight: "7g",
    stock: 11,
    createdAt: "2024-07-15",
    description:
      "A pearl and a small gold heart hang from each hook, so the earrings move as you do.",
  },
  {
    id: 14,
    name: "Heart Pearl Earrings",
    image: HeartPearl_Earrings,
    price: 3950,
    category: "earrings",
    material: "Sterling Silver, Cultured Pearls",
    weight: "5g",
    stock: 16,
    createdAt: "2024-08-01",
    description:
      "Silver hearts set with lustrous cultured pearls. Small enough for every day.",
  },
  {
    id: 15,
    name: "Gold Floral Earrings",
    image: GoldFloral_Earrings,
    price: 5599,
    category: "earrings",
    material: "18K Yellow Gold",
    weight: "8g",
    stock: 10,
    createdAt: "2024-08-15",
    description:
      "Yellow-gold flowers with finely worked petals and a textured centre.",
  },
  {
    id: 16,
    name: "Gold Chained Earrings",
    image: GoldChained_Earrings,
    price: 4299,
    category: "earrings",
    material: "18K Gold",
    weight: "6g",
    stock: 13,
    createdAt: "2024-09-01",
    description:
      "Short lengths of gold chain that swing freely. Modern and light to wear.",
  },
  {
    id: 17,
    name: "Gold & Whitey Earrings",
    image: Gold_Whitey_Earrings,
    price: 3200,
    category: "earrings",
    material: "18K Gold, White Enamel",
    weight: "5g",
    stock: 18,
    createdAt: "2024-09-15",
    description:
      "Warm gold paired with crisp white enamel. Works with both casual and formal outfits.",
  },
  {
    id: 18,
    name: "Opal Pendant Necklace",
    image: Gold_Necklaces,
    price: 5499,
    category: "necklaces",
    material: "18K Gold Plated, Opal Glass",
    weight: "9g",
    stock: 10,
    createdAt: "2024-10-01",
    description:
      "A milky opal-glass stone in a hammered gold frame, on a fine satellite chain. Sold individually.",
  },
  {
    id: 19,
    name: "Starfish & Pearl Charm Necklace",
    image: Starfish_Pearl_Necklace,
    price: 3299,
    category: "necklaces",
    material: "18K Gold Plated, Freshwater Pearl",
    weight: "4g",
    stock: 14,
    createdAt: "2024-10-10",
    description:
      "A tiny gold starfish and a single freshwater pearl on a dotted chain. Sits just below the collarbone.",
  },
  {
    id: 20,
    name: "Seaside Charm Necklace",
    image: Seaside_Charm_Necklaces,
    price: 4799,
    category: "necklaces",
    material: "Gold-Tone Stainless Steel",
    weight: "11g",
    stock: 9,
    createdAt: "2024-10-20",
    description:
      "Choose from shell, sun, spiral or starfish pendants on rope and ball chains. Tarnish-resistant steel.",
  },
  {
    id: 21,
    name: "Starfish Beaded Choker",
    image: Starfish_Choker,
    price: 2499,
    category: "necklaces",
    material: "Glass Seed Beads, Gold-Tone Charms",
    weight: "6g",
    stock: 22,
    createdAt: "2024-11-01",
    description:
      "Amber and white seed beads with three gold starfish charms. Adjustable to fit close to the neck.",
  },
  {
    id: 22,
    name: "Shell & Pearl Layered Anklet",
    image: Shell_Anklet,
    price: 2299,
    category: "anklets",
    material: "Cowrie Shells, Seed Beads, Gold-Tone Chain",
    weight: "7g",
    stock: 16,
    createdAt: "2024-11-10",
    description:
      "Three layers in one: a beaded strand, a cowrie-shell cord and a fine chain with a gold shell charm.",
  },
  {
    id: 23,
    name: "Seashell Pearl Charm Bracelet",
    image: Seashell_Pearl_Bracelet,
    price: 3899,
    category: "bracelets",
    material: "Glass Pearls, 18K Gold Plated Charms",
    weight: "13g",
    stock: 11,
    createdAt: "2024-11-20",
    description:
      "Oval pearls with gold shell, cowrie and starfish charms, finished with an adjustable chain.",
  },
];

export const getProductById = (id) =>
  products.find((p) => p.id === Number(id)) || null;

export default products;
