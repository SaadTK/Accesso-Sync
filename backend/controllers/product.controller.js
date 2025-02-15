import Product from "../models/product.model";

// return all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //gets all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// gets the featured products. these products will be stored in redis as cache product
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not on redis take it from mongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    //lean() will return a js obj. instead of a mongoDB doc.
    //which is good for performance

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured Productes found" });
    }

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// create and post a product
export const createProduct = async (req, res) => {};
