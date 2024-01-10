

const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb

class User{
  constructor(username,name,email,cart,id){
    this.username = username;
    this.name = name;
    this.email= email;
    this.cart = cart;
    this._id = id;
  }
  save(){
    const db = getDb();
    let dbOp;
    if(this._id){
      dbOp = db.collection('users').updateOne({_id:this._id},{$set:{name:this.name,cart:this.cart}})
    }
    else{
      const existingUserPromise = db.collection('users').findOne({ email: this.email });

      dbOp = existingUserPromise
        .then(existingUser => {
          if (!existingUser) {
            return db.collection('users').insertOne(this);
          }
          return null
        })
        .catch(error => {
          console.log(error)
          throw error
        });
      
    }

    return dbOp.then((result)=>{
      return result;
    }).catch(error=>{
      console.log(error)
    })
  }
  addToCart(product){
    console.log(this.cart)
    const cartProductIndex = this.cart.items.findIndex(cp=>{
      return cp.productId.toString() === product._id.toString();
    })
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]
    
    if (cartProductIndex>=0){
      newQuantity = this.cart.items[cartProductIndex].quantity +1;
      updatedCartItems[cartProductIndex].quantity = newQuantity
    }else{
      updatedCartItems.push({
        productId:new ObjectId(product._id),
        quantity:newQuantity
      })
    }
    const updatedCart = {items:updatedCartItems}
    const db = getDb();

    return db.collection('users').updateOne(
      {_id:new ObjectId(this._id)},{$set:{cart:updatedCart}}
      );

  }
  static findById(userId){
    const db = getDb()
    return db.collection('users')
    .find({_id:new ObjectId(userId)}).
    next().then(user=>{
      return user
    }).catch(error=>{console.log(error)})
  }
}

module.exports = User;
