import Bronze_Ring from "../assets/Bronze_Ring.jpg";
import Chain_Pearly_Bracelet from "../assets/Chain+Pearly_Bracelet.jpg";
import ChainDiamond_Bracelet from "../assets/ChainDiamond_Bracelet.jpg";

const products = [
    {
      id: 1,
      name: "Bronze Ring",
      price: 19.99,
      description: "A beautiful bronze ring for everyday wear.",
      image: Bronze_Ring,
      images: [
        "../assets/Bronze_Ring.jpg",
        "../assets/Gold+Diamond_Ring.jpg"
      ],
      category: "Rings",
      stock: 12,
      material: "Bronze",
      weight: "5g",
    },
    {
      id: 2,
      name: "Diamond Bracelet",
      price: 99.99,
      description: "A luxury diamond bracelet to add elegance to your outfit.",
      image: ChainDiamond_Bracelet,
      images: [
        Chain_Pearly_Bracelet,
        "../assets/ChainDiamond_Bracelet.jpg"
      ],
      category: "Bracelets",
      stock: 5,
      material: "Gold, Diamond",
      weight: "10g",
    },
    // ...more products
  ];
  
  export default products;
  