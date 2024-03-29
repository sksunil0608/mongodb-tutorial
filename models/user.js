const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        cart_products: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.cart_products.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      cart_products: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart
  return this.save();
};

userSchema.methods.deleteItemFromCart= function(productId){
  const updatedCartItems = this.cart.items.filter(item => {
    return item.cart_products.toString() !== productId.toString();
  });
    
    this.cart.items = updatedCartItems
    return this.save()
  }

userSchema.methods.clearCart = function(){
  this.cart = {items:[]}
  return this.save()
}

module.exports = mongoose.model("User", userSchema);
// const ObjectId = require('mongodb').ObjectId
// const getDb = require('../util/database').getDb

// class User{
//   constructor(username,name,email,cart,id){
//     this.username = username;
//     this.name = name;
//     this.email= email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save(){
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//       dbOp = db.collection('users').updateOne({_id:this._id},{$set:{name:this.name,cart:this.cart}})
//     }
//     else{
//       const existingUserPromise = db.collection('users').findOne({ email: this.email });

//       dbOp = existingUserPromise
//         .then(existingUser => {
//           if (!existingUser) {
//             return db.collection('users').insertOne(this);
//           }
//           return null
//         })
//         .catch(error => {
//           console.log(error)
//           throw error
//         });

//     }

//     return dbOp.then((result)=>{
//       return result;
//     }).catch(error=>{
//       console.log(error)
//     })
//   }
//   addToCart(product){
//     console.log(this.cart)
//     const cartProductIndex = this.cart.items.findIndex(cp=>{
//       return cp.productId.toString() === product._id.toString();
//     })
//     let newQuantity = 1
//     const updatedCartItems = [...this.cart.items]

//     if (cartProductIndex>=0){
//       newQuantity = this.cart.items[cartProductIndex].quantity +1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity
//     }else{
//       updatedCartItems.push({
//         productId:new ObjectId(product._id),
//         quantity:newQuantity
//       })
//     }
//     const updatedCart = {items:updatedCartItems}
//     const db = getDb();

//     return db.collection('users').updateOne(
//       {_id:new ObjectId(this._id)},{$set:{cart:updatedCart}}
//       );

//   }

//   getCart(){
//     const db = getDb();
//     const productIds = this.cart.items.map(i=>{
//       return i.productId;
//     });
//     return db.collection('products')
//     .find({_id:{$in:productIds}})
//     .toArray().then(products=>{
//       return products.map(product=>{
//         return  {
//           ...product,
//           quantity:this.cart.items.find(i=>{
//             return i.productId.toString()=== product._id.toString()
//           }).quantity
//         };
//       });
//     });
//   }



//   addOrder(){
//     const db = getDb();
//     return this.getCart().then(products=>{
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name:this.name
//         }
//       }
//       return db.collection('orders').insertOne(order)
//     }).then(result=>{
//       this.cart = {items:[]}

//       return db.collection('users')
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         )
//     })
//   }
//   getOrders(){
//     const db = getDb();
//     console.log(this._id)
//     return db.collection('orders').find({'user._id':new ObjectId(this._id)}).toArray()
//     .then(orders=>{
//       return orders
//     }).catch(error=>{console.log(error)})
//   }

//   static findById(userId){
//     const db = getDb();
//     return db.collection('users')
//     .find({_id:new ObjectId(userId)}).
//     next().then(user=>{
//       return user
//     }).catch(error=>{console.log(error)});
//   }
// }

// module.exports = User;
