import User from "../models/user.model.js";

// add a product into the cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// get all the products for the cart
export const getCartProducts = async (req, res) => {
  try {
    const products = await Prodcuct.find({ _id: { $in: req.user.cartItems } });

    //add quanitity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItems) => cartItems.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// remove an item from the cart
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// update a cart product's quantity
export const updateQuantity = async (req, res) => {
  try {
    const { id: prodcutId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id !== productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== prodcutId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await User.save();
      res.json(user.cartItems);
    }
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
