const Consultation = require('./Consultation');
const Client = require('../Client/Client');
var mongoose = require('mongoose');
var ConsultationsFactories = require('../factories/ConsultationsFactories');
var FactoriesData = require('../factories/FactoriesDate');
const express = require('express');
const adminAuth = require('../middlewares/adminAuth');
require('dotenv/config');

const router = express.Router();

async function getAll(showFinshed) {
  if (showFinshed) {
    var appos = await Consultation.find().sort({'_id': 'desc'}).populate('client')

    var appointments = [];
    appos.forEach(appo => {
      if (appo.date != undefined) {
        appointments.push(FactoriesData.Build(appo))
      }
    })
    return appointments;
  }  else {
    var appos = await Consultation.find({finished: false}).populate('client').sort({'_id': 'desc'})
    var appointments = [];
    appos.forEach(appo => {
      if (appo.date != undefined) {
        appointments.push(ConsultationsFactories.Build(appo))
      }
    })
    return appointments;
  }
} 

router.get('/consultations/views', adminAuth, async (req, res) => {
  var consultations = await getAll(true);
  res.render('consultation/views', {consultations});
})




router.get('/consultation/new', adminAuth, async (req, res) => {
  var clients = await Client.find().sort({'_id': 'desc'})

  var clientIdError = req.flash('clientIdError')
  var description = req.flash('description')
  var date = req.flash('date')
  var timestart = req.flash('timestart')
  var timeend = req.flash('timeend')
  var erro = req.flash('erro')
  var listaConflitos = req.flash('listaConflitos')

  clientIdError = (clientIdError.length == 0) ? '' : clientIdError;
  description = (description.length == 0) ? '' : description;
  date = (date.length == 0) ? '' : date;
  timestart = (timestart.length == 0) ? '' : timestart;
  timeend = (timeend.length == 0) ? '' : timeend;
  erro = (erro.length == 0) ? '' : erro;
  listaConflitos = (listaConflitos.length == 0) ? [] : listaConflitos;

  if (req.query.id != undefined) {
    var client = await Client.findOne({'_id': req.query.id})
  } else {
    if (clientIdError != '' ){
      var client = await Client.findOne({'_id': clientIdError})
    } else {
      var client = {}
    }
  }
  res.render('consultation/new', {
    clients,
    errors: { description, date, timestart, timeend, erro, listaConflitos },
    clientId: {
      id:client.id,
      name: client.name
    }});
})

router.post('/consultation/new', adminAuth, async (req, res) => {
  var {client, description, date, timestart, timeend} = req.body;
  req.flash("clientIdError", client);
  req.flash("description", description);
  req.flash("date", date);
  req.flash("timestart", timestart);
  req.flash("timeend", timeend);


  // Validações só para teste do flash
  if (
    (client == undefined || description == undefined || date == undefined || date == undefined || timestart == undefined || timeend == undefined) ||
    (client == '' || description == '' || date == '' || timestart == ''  || timeend == '') ||
    (client.length < 2 || description.length < 2 || date.length < 2 || timestart.length != 5 || timeend.length != 5)
    ) {
      req.flash("erro", 'Campos inválidos, preencha todos os campos!');
      return res.redirect("/consultation/new");
    }

  var listaConflitos = await verificarConflitor(date, timestart, timeend, id="")

  // Consulta pode ser agendada
  if (listaConflitos.length == 0) {
    var newAppointment = new Consultation({client, description, date, timestart, timeend, finished: false, notified: false});
    try {
      await newAppointment.save();
      return res.redirect("/");
    } catch(error) {
      console.log(error);
      return res.send('Algum erro');
    }
  } else {
    console.log(listaConflitos)
    req.flash("erro", '');
    req.flash("listaConflitos", listaConflitos)
    return res.redirect("/consultation/new");
  }
})


router.get('/consultation/edit', adminAuth, async(req, res) => {

  
  var clientIdError = req.flash('clientIdError')
  var description = req.flash('description')
  var date = req.flash('date')
  var timestart = req.flash('timestart')
  var timeend = req.flash('timeend')
  var erro = req.flash('erro')
  var listaConflitos = req.flash('listaConflitos')

  clientIdError = (clientIdError.length == 0) ? '' : clientIdError;
  description = (description.length == 0) ? '' : description;
  date = (date.length == 0) ? '' : date;
  timestart = (timestart.length == 0) ? '' : timestart;
  timeend = (timeend.length == 0) ? '' : timeend;
  erro = (erro.length == 0) ? '' : erro;
  listaConflitos = (listaConflitos.length == 0) ? [] : listaConflitos;



  try {
    if (req.query.id != undefined) {
      var item = await Consultation.findOne({'_id': req.query.id}).populate('client')
    } else {
      var item = await Consultation.findOne({'_id': clientIdError}).populate('client')
    }
    
    item = FactoriesData.Build(item)
    var clients = await Client.find()
    var client = await Client.findOne({'_id': item.client.id})
    if (client === null) { client = {id: '', name: ''} }

    res.render("consultation/edit", {
      item:item,
      errors: { description, date, timestart, timeend, erro, listaConflitos },
      clientId: { id:client.id, name: client.name },
      clients,
      clientId:{id:client.id, name: client.name}}
    );
  } catch(error) {
    console.log(error)
  }
})







router.post('/consultation/edit', adminAuth, async(req, res) => {
  var {client, description, date, timestart, timeend, id, status} = req.body;
  req.flash("clientIdError", client);
  req.flash("description", description);
  req.flash("date", date);
  req.flash("timestart", timestart);
  req.flash("timeend", timeend);

  var finished = (status === "1") ? false : true

  // Validações só para teste do flash
  if (
    (client == undefined || description == undefined || date == undefined || date == undefined || timestart == undefined || timeend == undefined) ||
    (client == '' || description == '' || date == '' || timestart == ''  || timeend == '') ||
    (client.length < 2 || description.length < 2 || date.length < 2 || timestart.length != 5 || timeend.length != 5)
    ) {
      req.flash("erro", 'Campos inválidos, preencha todos os campos!');
      return res.redirect(`/consultation/edit?id=${id}`);
    }

  var listaConflitos = await verificarConflitor(date, timestart, timeend, id)


  // Consulta pode ser agendada
  if (listaConflitos.length == 0) {
    try {
      if (client == undefined || client == '') {
        await Consultation.findByIdAndUpdate(id, {description, date, timestart, timeend, finished, notified:false})
      } else {
        await Consultation.findByIdAndUpdate(id, {description, date, timestart, timeend, client, finished, notified:false})
      }
      res.redirect("/consultations/views");
    } catch(error)  {
      console.log(error);
      res.send('Algum erro');
    }
  } else {
    req.flash("erro", '');
    req.flash("listaConflitos", listaConflitos)
    return res.redirect(`/consultation/edit?id=${id}`);
  }
})














router.get('/consultation/view/:id', adminAuth, async (req, res) => {
  try {
    var itemEdit = await Consultation.findOne({'_id': req.params.id}).populate('client')
    itemEdit = FactoriesData.Build(itemEdit)
    var client = await Client.findOne({'_id': itemEdit.client.id})
    if (client === null) {
      client = {
        id: '',
        name: ''
      }
    }
    res.render("consultation/view", {itemEdit, clientId:{id:client.id, name: client.name}});
  } catch(error) {
    console.log(error)
  }
})

router.post('/finish', adminAuth, async (req, res) => {
  var id = req.body.id;

  try {
    await Consultation.findByIdAndUpdate(id, {finished: true})
    res.redirect("/");
  } catch(error)  {
    console.log(error);
  }
})
 
router.get('/search', adminAuth, async (req, res) => {
  var search = req.query.search;
  if (search == '' || search == undefined) {
    return res.redirect('/consultations/views')
  }

  try {
    var returnConsultations = await Consultation.find().sort({'_id': 'desc'}).populate('client');

    var arrayItens = []
    returnConsultations.filter(item => {
      var cpf = item.client.cpf;
      cpf = cpf.replace('.', '');
      cpf = cpf.replace('.', '');
      cpf = cpf.replace('-', '');
      if (search == cpf || search == item.client.email) {
        arrayItens.push(item)
      }
    }) 

    var consultations = [];
    arrayItens.forEach(arr => {
      if (arr.date != undefined) {
        consultations.push(FactoriesData.Build(arr))
      }
    })

    res.render('consultation/views', {consultations});

  } catch(error) {
    console.log(error)
    res.render('consultation/views', {});
  }
})



async function verificarConflitor( date, timestart, timeend, id){
  var listaConflitos = []
  var itemsMesmoDias = await Consultation.find({date: date});
  itemsMesmoDias.forEach(async itemMesmoDia => {
    if (itemMesmoDia.id != id) {
      var startHourBase = parseInt(itemMesmoDia.timestart.split(':')[0])
      var startMinuteBase = parseInt(itemMesmoDia.timestart.split(':')[1])
      var endHourBase = parseInt(itemMesmoDia.timeend.split(':')[0])
      var endMinuteBase = parseInt(itemMesmoDia.timeend.split(':')[1])
  
      var startHourNew = parseInt(timestart.split(':')[0])
      var startMinuteNew = parseInt(timestart.split(':')[1])
      var endHourNew = parseInt(timeend.split(':')[0])
      var endMinuteNew = parseInt(timeend.split(':')[1])
  
      var consultaInicio = new Date(2020, 8, 3, startHourBase, startMinuteBase, 0);
      var consultaFim =  new Date(2020, 8, 3, endHourBase, endMinuteBase, 0);
      var inicioOutraConsulta = new Date(2020, 8, 3, startHourNew, startMinuteNew , 0);
      var fimOutraConsulta =   new Date(2020, 8, 3, endHourNew, endMinuteNew, 0);
  
      if(
       inicioOutraConsulta.getTime() >= consultaFim.getTime() ||
       fimOutraConsulta.getTime() <= consultaInicio.getTime() 
       ) {
      } else {
        listaConflitos.push(itemMesmoDia )
      }  
    }
  })

  return listaConflitos;
}





module.exports = router;
