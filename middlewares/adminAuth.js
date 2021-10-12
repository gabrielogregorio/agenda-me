function adminAuth(req, res, next) {
  if(req.session.logged == true) {
    next();
  } else {
    console.log('Usuário não autenticado')
    res.redirect('/auth');
  }
}

module.exports = adminAuth;
