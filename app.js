const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
require('dotenv').config()
const app = express();
const User = require('./models/user')
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('659e584b2ad25c50b20c31bc')
//     .then(user => {
//       req.user = new User(user.username,user.name,user.email,user.cart,user._id);
//       next();
//     })
//     .catch(error => {
//       console.log(error)
//     });
  
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@firstnosql.13dokgm.mongodb.net/shop?retryWrites=true&w=majority`
  ).then(()=>{
    app.listen(3000)
  }).catch(error=>{
    throw error
  })