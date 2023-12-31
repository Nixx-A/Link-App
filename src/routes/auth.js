const { Router } = require('express')
const router = Router()
const passport = require('passport')
const { isLoggedIn } = require('../lib/auth')

router.get('/signin', (req, res) => {
  res.render('auth/signin')
})

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}))

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}))

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile')
})

router.get('/logout', (req, res) => {
  req.logOut(() => {
    res.redirect('/signin');
  });
})
module.exports = router