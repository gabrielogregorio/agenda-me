const validator = require('validator');


function validateName(name) {
  name = name.toString();
  if (name.length <=2) {
    return {error: 'O nome não é válido!', value:''}
  }
  
  return {error: '', value:name}
}

function validateCpf(cpf) {
  if (cpf == undefined || cpf == '') {
    return {error: 'Você precisa informar um CPF válido!', value:''}
  }
  cpf = cpf.toString();
  cpf = cpf.trim()
  cpf = cpf.replace('-', '').replace('.', '').replace('.', '');

  if (cpf.length != 11) {
    return {error: 'O CPF não tem 11 digitos!', value:''}
  }
  return {error: '', value:cpf}
}


function validateEmail(email) {
  email = email.toString();
  if(!validator.isEmail(email)) {
    return {error: 'E-mail é inválido!', value:''}
  }
  return {error: '', value:email}
}

module.exports = {validateCpf, validateName, validateEmail}
