import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "./../lib/cloudinary.js";

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
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = res.body;

    let cloudinaryResponse = null;
    if (image) {
      await cloudinary.uploader.upload(image, { folder: "products" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json({ product });
  } catch (error) {}
};

//delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    //delete img from cloudinary bucket
    if (product.image) {
      const publidId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publidId}`);
        console.log("deleted image from cloudinary.");
      } catch (error) {
        console.log("error while deleting image from cloudinary", error);
      }
    }
    //end of deleting img from cloudinary
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//getRecommendedProducts controller
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller.", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//getProductsByCategory controller
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.log("Error in getProductsByCategory controller.", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//toggleFeaturedProduct controller
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeaturedProductCache();

      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// this will update the cache as the featured products are stored in the cache
async function updateFeaturedProductCache() {
  try {
    // the lean() returns plain JS objs. instead of FUll mongoDB docs. Which improves performance.
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updateFeaturedProductCache function.");
  }
}
