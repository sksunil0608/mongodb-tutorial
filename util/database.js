const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

const USER_NAME = process.env.USER_NAME
const USER_PASSWORD = process.env.USER_PASSWORD
// console.log("Establishing a Connection.....")
let _db;
const mongoConnect = callback=>{
  MongoClient.connect(`mongodb+srv://${USER_NAME}:${USER_PASSWORD}@firstnosql.13dokgm.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(client => {
      console.log("Connected");
      _db = client.db()
      callback()
    }).catch(error => {
      console.log(error)
      throw error;
    })
}

const getDb = ()=>{
  if (_db){
    return _db
  }
  throw 'NO Database Found'
}

exports.mongoConnect  = mongoConnect
exports.getDb = getDb

