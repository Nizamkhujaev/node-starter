const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");
class Product {
  constructor(title, price, description, img_url, id, userId)  {
    this.title = title;
    this.price = price;
    this.description = description;
    this.img_url = img_url;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this})
    } else {
      dbOp = db.collection("products")
        .insertOne(this)
    }

    return dbOp
    .catch(err => console.error(err))
  }

  static fetchAll () {
    const db = getDb();
    return db.collection("products").find().toArray()
      .then(products => {
        const result = products.map(product => {
          return {
            ...product,
            id: product._id.toString(),
          }
        })

        return result
      })
      .catch(err => {
        console.error(err)
      })
  }

  static findById (prodId) {
    const db = getDb();

    return db.collection("products").findOne({_id: new ObjectId(prodId)})
      .then(product => {
        product.id = product._id.toString();
        delete product._id;

        return product
      })
      .catch(err => {
        console.error(err)
      })
  }

  static deleteById (prodId) {
    const db = getDb();

    return db.collection("products").deleteOne({_id: new ObjectId(prodId)})
    .catch(err => console.error(err))
  }
}

module.exports = Product;
