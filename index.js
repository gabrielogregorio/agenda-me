const express = require('express');
const mailer = require('nodemailer');
const app = express()
const mongoose = require('mongoose');
const session = require('express-session');
const adminAuth = require('./middlewares/adminAuth');
const clientController = require('./Client/ClientController')
const consultationsController = require('./Consultation/ConsultationsController')
const Consultation = require('./Consultation/Consultation');
var ConsultationsFactories = require('./factories/ConsultationsFactories');
const cookieParser = require('cookie-parser')
const flash = require('express-flash');
const validator = require('validator');
require('dotenv/config');

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(cookieParser(process.env.COOKIE_PARSER_KEY))
app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SECRET_KEY,
  cookie: {maxAge: 1000 * 60 * 60 * 24 *30},
  resave: true,
  saveUninitialized: true
}))

var host = process.env.HOST;
var port = process.env.PORT;

mongoose.connect(`mongodb://${host}:${port}/agendamentosdb`, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);


app.use(flash())


app.use('/', consultationsController);
app.use('/', clientController);


app.get('/', adminAuth, (req, res) => {
  res.render('index');
})

app.get("/getcalendar", adminAuth, async (req, res) => {
  var appos =  await Consultation.find({finished: false}).populate('client').sort({'_id': 'desc'})
  var appointments = [];
  appos.forEach(appo => {
    if (appo.date != undefined) {
      appointments.push(ConsultationsFactories.Build(appo))
    }
  })
  res.json(appointments);
})

app.get('/logoff', async (req, res) => {
  req.session.logged = false
  res.redirect('auth');
})

app.get('/auth', async (req, res) => {
    res.render('auth');
})

app.post('/auth', async (req, res) => {
  if (req.body.email == 'admin@admin.com' && req.body.password == 'admin') {
    req.session.logged = true
    res.redirect('/');
  } else {
    res.redirect('/auth');
  }
})


async function getHour(time) {
  return await parseInt(time.split(':')[0])
}

async function getMinute(time) {
  return await  parseInt(time.split(':')[1])
}

async function SendNotification() {

  // transporter para enviar o e-mail
  var transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Obter a data atual
  var dateNow = new Date();

  // Dia, mes e ano atual para obter apenas consultas marcadas para hoje
  var dataYearMonthDayNow = new Date(dateNow.getFullYear(),  dateNow.getMonth(), dateNow.getDate(), 0, 0, 0, 0);
  dataYearMonthDayNow.setUTCHours(0)

  // Busca no DB para obter somente consultas que não foram finalizadas e estão marcadas para hoje e não foram notificadas
  var consultations = await Consultation.find(
    {
      finished: false,
      date: dataYearMonthDayNow,
      notified:false
    }
  ).populate('client').sort({'_id': 'desc'})

  // Loop por todas as consultas disponíveis hoje e que precisam ser notificadas
  consultations.forEach(async consultation => {
    // Separar a hora, minuto e segundo em datas para análise posterior
    var startHour = await getHour(consultation.timestart)
    var startMinute = await getMinute(consultation.timestart)
    var endHour = await getHour(consultation.timeend)
    var endMinute = await getMinute(consultation.timeend)

    // Obtendo as datas COM HORARIOS de inicio e fim da consulta. 
    var dateStartAnalitic = new Date(dateNow.getFullYear(),  dateNow.getMonth(), dateNow.getDate(), startHour, startMinute, 0, 0);
    var dateEndAnalitic = new Date(dateNow.getFullYear(),  dateNow.getMonth(), dateNow.getDate(), endHour, endMinute, 0, 0);

    // Data de inicio e fim da consulta como número
    var timeStartConsultation = dateStartAnalitic.getTime();
    var timeEndConsultation = dateEndAnalitic.getTime();

    // 1 hora em milisegundos
    var hour = 1000 * 60 * 60;

    // Data de inicio da consulta - Data atual
    var gap = timeStartConsultation - Date.now();

    // Daqui a 1h a consulta será iniciada
    if (gap <= hour) {
        console.log('Consulta em análise => ', consultation.id)

        // Cliente não foi excluido
        if (consultation.client != undefined) {

          // Notificação do cliente
          var notificar = true;
          var msg = '';

          // Data atual é MAIOR ou IGUAL a data de inicio da consulta
          if (dateNow >= timeStartConsultation) {

            // Data atual é MAIOR ou IGUAL a data final da consulta
            if (dateNow >= timeEndConsultation) {

              // Não notificar usuário
              notificar = false;
              console.log('Consulta já finalizou e o usuário não foi avisado')
            } else {
              msg = 'Sua consulta ja iniciou!';
            }
          } else {
            msg = 'Sua consulta vai iniciar';
          }

          // Atendeu aos critério para notificar o usuário
          if (notificar) {

            // Atualiza no db que o usuário foi notificado!
            await Consultation.findByIdAndUpdate(consultation.id,  {notified: true});

            // Envio do e-mail ao cliente
            console.log(`Descrição: ${consultation.description}\nInicio: ${consultation.timestart}\nFim: ${consultation.timeend}\n`)
            transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: consultation.client.email,
              subject: `${consultation.client.name} - ${msg}`,
              text: `Descrição: ${consultation.description}\nInicio: ${consultation.timestart}\nFim: ${consultation.timeend}\n`
            }).then(() => {}).catch(error => {console.log(error)})
          }
        } else {
          console.log('Cliente foi excluido e portanto não será avisado!')
        }
      }
  })
}

// Tasks interval. A cada x tempo verifica se uma consulta esta perto
// e dispara um e-mail ao usuário. Isso é o pooling
setInterval(async () => {
  await SendNotification();
}, 1000 * 60 * 5) // 1s * 60s => 1 min * 5 => 5 min


app.listen(3333, () => {
  console.log('Server is running');
})
