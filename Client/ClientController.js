var mongoose = require('mongoose');

const Client = require('./Client');
const express = require('express');
const adminAuth = require('../middlewares/adminAuth');
const {validateCpf, validateName, validateEmail} = require('../services/validateInput')
require('dotenv/config');
const router = express.Router();


router.get('/clients/views', adminAuth, async (req, res) => {
   var clients = await Client.find().sort({'_id': 'desc'})
  res.render('clients/views', {clients});
})

router.get('/client/edit/:id', adminAuth, async (req, res) => {
  var item = await Client.findOne({'_id': req.params.id})

  var cpf_error = req.flash('cpf_error')
  var name_error = req.flash('name_error')
  var email_error = req.flash('email_error')

  cpf_error = (cpf_error.length == 0) ? '' : cpf_error;
  name_error = (name_error.length == 0) ? '' : name_error;
  email_error = (email_error.length == 0) ? '' : email_error;

  try {
    res.render("clients/edit", {cpf_error, email_error, name_error, item:item});
  } catch(error) {
    console.log(error)
    res.render("clients/views", []);
  }
})

router.post('/client/update/', adminAuth, async (req, res) => {
  var {name, email, cpf, id} = req.body;

  cpf = validateCpf(cpf)
  name = validateName(name)
  email = validateEmail(email)

  if (cpf.error) req.flash("cpf_error", cpf.error)
  if (name.error) req.flash("name_error", name.error)
  if (email.error) req.flash("email_error", email.error)

  if (email.error || name.error || cpf.error) return res.redirect(`/client/edit/${id}`)
  
  cpf =  cpf.value;
  name =  name.value;
  email =  email.value;


  try {
      await Client.findByIdAndUpdate(id, {name, email, cpf})
      res.redirect('/clients/views')
    } catch(error)  {
      console.log(error);
      res.send('algum erro2')
  }

})

router.get('/client/remove/:id', adminAuth, async (req, res) => {
  try {
    var item = await Client.findOne({'_id': req.params.id})
    res.render('clients/delete', {item})
  } catch(error) {
    console.log(error)
    res.send('erro')
  }
})



router.get('/client/remove/confirm/:id', adminAuth, async (req, res) => {
  try {
    await Client.findByIdAndRemove(req.params.id);
    res.redirect('/clients/views')
  } catch(error)  {
    console.log(error);
    res.send('Erro3')
  }
})

router.get('/client/new', adminAuth, async (req, res) => {
  var cpf_error = req.flash('cpf_error')
  var name_error = req.flash('name_error')
  var email_error = req.flash('email_error')
  var name = req.flash('name')
  var email = req.flash('email')
  var cpf = req.flash('cpf')

  cpf_error = (cpf_error.length == 0) ? '' : cpf_error;
  name_error = (name_error.length == 0) ? '' : name_error;
  email_error = (email_error.length == 0) ? '' : email_error;
  name = (name.length == 0) ? '' : name;
  email = (email.length == 0) ? '' :email;
  cpf = (cpf.length == 0) ? '' : cpf;
  
  res.render('clients/new', {cpf_error, email_error, name_error, name, email, cpf});
})

router.post('/client/new', adminAuth, async (req, res) => {
  var {name, email, cpf} = req.body;

  req.flash("name", name);
  req.flash("email", email);
  req.flash("cpf", cpf);

  cpf = validateCpf(cpf)
  name = validateName(name)
  email = validateEmail(email)

  if (cpf.error) req.flash("cpf_error", cpf.error)
  if (name.error) req.flash("name_error", name.error)
  if (email.error) req.flash("email_error", email.error)

  if (email.error || name.error || cpf.error) return res.redirect('/client/new')
  
  cpf =  cpf.value;
  name =  name.value;
  email =  email.value;

  var newClient = new Client({ name, email, cpf });

  try {
    await newClient.save();
    res.redirect("/clients/views");
  } catch(error) {
    console.log(error);
    res.send('Algum erro');
  }
})

module.exports = router;