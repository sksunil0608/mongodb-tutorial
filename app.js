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

app.use((req, res, next) => {
  User.findById('659ee708db9581257f29c19d')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error)
    });
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@firstnosql.13dokgm.mongodb.net/shop?retryWrites=true&w=majority`
  ).then(()=>{
    User.findOne().then(user=>{
      if(!user){
        const user = new User({
          username: 'sk',
          name: 'Sunil Kumar',
          email: 'sksunil@gmail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
  }).then(()=>{
    app.listen(3000)
  }).catch(error=>{
    throw error
  })