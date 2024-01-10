const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  products: [
    {
      product:{
        type: Object,
        requird:true
      }
    }
  ],
  user:{
    userId:{
      type:Schema.Types.ObjectId,
      required:true,
      ref:'User'
    },
    name:{
      type:String,
      required:true
    }
  }
})


module.exports = mongoose.model('Order',orderSchema)
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   }
// });

// module.exports = Order;
