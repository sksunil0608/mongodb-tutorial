const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect
const app = express();
const User = require('./models/user')
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('659e584b2ad25c50b20c31bc')
    .then(user => {
      req.user = new User(user.username,user.name,user.email,user.cart,user._id);
      next();
    })
    .catch(error => {
      console.log(error)
    });
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=>{
  const user = new User('sk', 'Sunil', 'sksunil@gmail.com', { items: [] })
  user.save().then(user=>{
    return user
  })
  app.listen(3000)
})