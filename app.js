const path = require("path");
const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("68f527faab2fbeb8e8ea1dfb")
    .then((user) => {
      req.user = user; 
      next(); 
    })
    .catch((err) => console.error(err));
 });

app.use("/admin", adminRoutes);
app.use(shopRoutes); 

app.use(errorController.get404);

mongoose.connect("imaginary_url")
 .then(result => {
  User.findOne()
    .then(user => {
      if (!user) {
        const user = new User({
          name: "Sean",
          email: "sean@gmail.com",
          cart: {
            items: []
          }
        })
        return user.save()
      }
      return user
    })
  app.listen(3000)
 }).catch(err => {
  console.error(err)
 })