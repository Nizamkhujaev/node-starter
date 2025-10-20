const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((result) => {
      const product = result;

      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products || [],
        pageTitle: "All Products",
        path: "/",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
      })
    })
    .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    }).then(result => {
      res.redirect("/cart");
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postOrder = (req, res, next) => {
  req.user.populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map(item => {
        return { quantity: item.quantity, product: item.productId._doc }
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products
      })

      return order.save()
    })
    .then(() => {
      return req.user.clearCart()
    }).then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.error(err));
};
