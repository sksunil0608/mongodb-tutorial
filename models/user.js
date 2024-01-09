const { findById } = require('./product');

const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb

class User{
  constructor(username,name,email){
    this.username = username;
    this.name = name;
    this.email= email
  }
  save(){
    const db = getDb();
    let dbOp;
    if(this._id){
      dbOp = db.collection('users').updateOne({_id:this._id},{$set:{name:this.name}})
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
