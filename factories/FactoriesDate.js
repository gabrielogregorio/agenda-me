
class DataNullFactories {
  Build(data){

    if (data.client == null) {
      data.client = {
        name: 'Usuário Excluido',
        email: '',
        id: ''
      }
    }
    var day = data.date.getDate() + 1;
    var month = data.date.getMonth();
    var year = data.date.getFullYear();
    //var hour = parseInt(data.time.split(':')[0]);
    //var minutes = parseInt(data.time.split(':')[1]);
      
    var dataNova = new Date(year, month, day, 7, 0, 0, 0);
    month = month + 1;
    day = (day.toString().length == 1) ? '0' + day : day
    month = (month.toString().length == 1) ? '0' + month : month

    var appo = {

      id : data.id,
      client: data.client,
      description: data.description,
      date: dataNova,
      data_str_pt: `${day}/${month}/${year}`,
      data_str_js: `${year}-${month}-${day}`,
      timestart: data.timestart,
      timeend: data.timeend,
      finished: data.finished,
      notified: data.notified
    }

    return appo;  

  }
}

module.exports = new DataNullFactories();
