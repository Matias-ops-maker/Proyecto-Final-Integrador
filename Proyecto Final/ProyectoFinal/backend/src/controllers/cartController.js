import { Cart, CartItem, Product, Category, Brand } from "../models/index.js";

export async function getCart(req, res) {
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.user.id },
            include: {
                model: CartItem,
                include: {
                    model: Product,
                    include: [
                        { model: Category, attributes: ['id', 'nombre'] },
                        { model: Brand, attributes: ['id', 'nombre'] }
                    ]
                }
            }
        });

        if (!cart) {
            const newCart = await Cart.create({ user_id: req.user.id });
            return res.json({ 
                id: newCart.id,
                user_id: newCart.user_id,
                CartItems: [],
                total: 0,
                totalItems: 0
            });
        }

        let total = 0;
        let totalItems = 0;
        
        if (cart.CartItems) {
            cart.CartItems.forEach(item => {
                total += item.cantidad * item.Product.precio;
                totalItems += item.cantidad;
            });
        }

        res.json({
            ...cart.toJSON(),
            total,
            totalItems
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function addToCart(req, res) {
    try {
        const { product_id, cantidad = 1 } = req.body;

        if (!product_id || cantidad <= 0) {
            return res.status(400).json({ error: "Product ID y cantidad válida son requeridos" });
        }

        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ error: "Producto no existe" });
        
        if (product.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        let cart = await Cart.findOne({ where: { user_id: req.user.id } });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id });
        }

        let cartItem = await CartItem.findOne({ 
            where: { 
                cart_id: cart.id, 
                product_id 
            } 
        });

        if (cartItem) {
            const newQuantity = cartItem.cantidad + cantidad;
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: "Stock insuficiente" });
            }
            cartItem.cantidad = newQuantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ 
                cart_id: cart.id, 
                product_id, 
                cantidad 
            });
        }

        cart.actualizado_en = new Date();
        await cart.save();

        const updatedItem = await CartItem.findByPk(cartItem.id, {
            include: {
                model: Product,
                include: [
                    { model: Category, attributes: ['id', 'nombre'] },
                    { model: Brand, attributes: ['id', 'nombre'] }
                ]
            }
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function updateCartItem(req, res) {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: "Cantidad válida es requerida" });
        }

        const cartItem = await CartItem.findByPk(id, {
            include: [
                { model: Product },
                { 
                    model: Cart, 
                    where: { user_id: req.user.id } 
                }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({ error: "Item del carrito no encontrado" });
        }

        if (cartItem.Product.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        cartItem.cantidad = cantidad;
        await cartItem.save();

        cartItem.Cart.actualizado_en = new Date();
        await cartItem.Cart.save();

        const updatedItem = await CartItem.findByPk(cartItem.id, {
            include: {
                model: Product,
                include: [
                    { model: Category, attributes: ['id', 'nombre'] },
                    { model: Brand, attributes: ['id', 'nombre'] }
                ]
            }
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function removeCartItem(req, res) {
    try {
        const { id } = req.params;

        const cartItem = await CartItem.findByPk(id, {
            include: { 
                model: Cart, 
                where: { user_id: req.user.id } 
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: "Item del carrito no encontrado" });
        }

        await cartItem.destroy();

        cartItem.Cart.actualizado_en = new Date();
        await cartItem.Cart.save();

        res.json({ msg: "Item eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function clearCart(req, res) {
    try {
        const cart = await Cart.findOne({ where: { user_id: req.user.id } });
        
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        await CartItem.destroy({ where: { cart_id: cart.id } });

        cart.actualizado_en = new Date();
        await cart.save();

        res.json({ msg: "Carrito vaciado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

