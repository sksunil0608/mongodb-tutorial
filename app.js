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
  User.findById('659d296fae3ceea1263cbeb4')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error)
      next();
    });
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=>{
  const user = new User('sk','Sunil','sksunil@gmail.com')
  user.save().then(user=>{
    return user
  })
  app.listen(3000)
})