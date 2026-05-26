import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { HttpError } from '../middleware/error.js';

async function loadCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function priceForVariant(product, variantLabel) {
  if (variantLabel && product.variants?.length) {
    const v = product.variants.find((x) => x.label === variantLabel);
    if (!v) throw new HttpError(400, `Unknown variant: ${variantLabel}`);
    return v.price;
  }
  return product.price;
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await loadCart(req.user._id);
  res.json({ cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, variantLabel = null, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new HttpError(404, 'Product not found');

  const cart = await loadCart(req.user._id);
  const existing = cart.items.find(
    (i) => i.product._id.toString() === productId && i.variantLabel === variantLabel
  );
  const unitPrice = priceForVariant(product, variantLabel);

  if (existing) {
    existing.quantity += quantity;
    existing.unitPrice = unitPrice;
  } else {
    cart.items.push({ product: product._id, variantLabel, quantity, unitPrice });
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.status(201).json({ cart: populated });
});

export const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await loadCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new HttpError(404, 'Item not in cart');
  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json({ cart: populated });
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await loadCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new HttpError(404, 'Item not in cart');
  item.deleteOne();
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json({ cart: populated });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await loadCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart });
});
