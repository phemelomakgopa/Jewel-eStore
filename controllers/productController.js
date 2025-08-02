const { db } = require("../config/firebaseConfig");

// GET /products
const getAllProducts = async (req, res) => {
    try
    {
        const snapshot = await db.collection("products").get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(products);
    }
    catch (error)
    {
        console.error("Error getting products: ", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// GET /products/:id
const getProductById = async (req, res) => {
    const { id } = req.params;
    try
    {
        const doc = await db.collection("products").doc(id).get();
        if (!doc.exists)
        {
            return res.status(404).json({ error: "Product not found "});
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    }
    catch (error)
    {
        console.error("Error getting product: ", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

module.exports = { getAllProducts, getProductById };