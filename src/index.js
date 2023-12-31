const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const path = require('path')
const flash = require('connect-flash');
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { database } = require('./keys.js');
const passport = require('passport')

// initializations
const app = express()
require('./lib/passport.js')

//settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars.js')
}))
app.set('view engine', '.hbs')

//middlewares
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//global variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user 
  console.log(req.user);
 // console.log(req.user);
  next()
})

//routes
app.use(require('./routes'))
app.use(require('./routes/auth'))
app.use('/links', require('./routes/links'))

// public
app.use(express.static(path.join(__dirname, 'public')))


app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`)
})