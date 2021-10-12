// Entra um objeto mais simples
// Retorna um objeto mais complexo
class ConsultationsFactories {
  Build(simpleConsultations){
    if (simpleConsultations.client == null) {
      simpleConsultations.client = {
        name: 'Usuário Excluido',
        email: '',
        id: ''
      }
    }
    // get day and fix bug?
    var day = simpleConsultations.date.getDate() + 1;
    var month = simpleConsultations.date.getMonth();
    var year = simpleConsultations.date.getFullYear();

    var hourStart = parseInt(simpleConsultations.timestart.split(':')[0]);
    var minutesStart = parseInt(simpleConsultations.timestart.split(':')[1]);

    var hourEnd = parseInt(simpleConsultations.timestart.split(':')[0]);
    var minutesEnd = parseInt(simpleConsultations.timeend.split(':')[1]);

    var startDate = new Date(year, month, day, hourStart, minutesStart, 0, 0);
    var endDate = new Date(year, month, day, hourEnd, minutesEnd, 0, 0);

    var appo = {
      id: simpleConsultations.id,
      title: simpleConsultations.client.name + ' - ' + simpleConsultations.description,
      start: startDate,
      end: endDate,
      notified:  simpleConsultations.notified == undefined ? false : simpleConsultations.notified,
      email: simpleConsultations.email
    }

    return appo;  
  }
}

module.exports = new ConsultationsFactories();