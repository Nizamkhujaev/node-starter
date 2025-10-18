const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");

class User {
  constructor(name, email, cart, id) {
    this.name = name
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    return db.collection("users").insertOne(this)
    .catch(err => console.error(err))
  }

  static findById(id) {
    const db = getDb();
    return db.collection("users").findOne({_id: new ObjectId(id)})
    .catch(err => console.error(err))
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product.id
    })

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({productId: new ObjectId(product.id), quantity: newQuantity}); 
    }

    const updatedCart = {items: updatedCartItems} 

    const db =  getDb();
    return db.collection("users").updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart }})
    .catch(err => console.error(err))
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => i.productId);
    return db.collection("products").find({_id: {$in: productIds}}).toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(i => i.productId.toString() === product._id.toString()).quantity
          }
        })
      })
      .catch(err => console.error(err))
  }

  deleteItemFromCart(prodId) {
    const updatedCartItem = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId.toString()
    })

    const db = getDb();
    return db.collection("users").updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: updatedCartItem}}})
    .catch(err => console.error(err))
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
            email: this.email,
          }
        }

        return db.collection("orders").insertOne(order)
      }).then(() => {
        this.cart = {items: []}
        return db.collection("users").updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: []}}})
      }).catch(err => console.error(err))
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({'user._id': new ObjectId(this._id)}).toArray()

  }
}

module.exports = User;
