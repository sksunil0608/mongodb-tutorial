const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

let _db ;

const mongoConnect = callback=>{
  MongoClient.connect('mongodb+srv://sksunil0608:ZRyNzuFhyO0jJsIr@firstnosql.13dokgm.mongodb.net/shop?retryWrites=true&w=majority')
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

