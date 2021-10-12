<div align="center">
  <img height="30" alt="NodeJs" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
  <img height="30" alt="ExpressJs" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge">
  <img height="30" alt="MongoDb" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
  <img height="30" alt="Javascript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img height="30" alt="css3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img height="30" alt="html5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
</div>

<h3 align="center">Sistema de agendamento</h3>     

![Tela Principal](images/10.png)       

<p align="center">     
Um sistema de agendamento simples.
<br>
</p>

<h3>Informações gerais</h3>

![GitHub estrelas](https://img.shields.io/github/stars/gabrielogregorio/Sistema-de-Agendamento)
![GitHub last commit](https://img.shields.io/github/last-commit/gabrielogregorio/Sistema-de-Agendamento?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/gabrielogregorio/Sistema-de-Agendamento)
![GitHub language count](https://img.shields.io/github/languages/count/gabrielogregorio/Sistema-de-Agendamento)
![GitHub repo size](https://img.shields.io/github/repo-size/gabrielogregorio/Sistema-de-Agendamento)

### Introdução   
Este projeto se trata de um pequeno sistema de agendamentos com autenticação, onde um usuário pode fazer agendamento de consultas, pode ver os eventos através de um calendário e além disso, o sistema envia um e-mail aos clientes quando o agendamento está se aproximando.   

Esse sistema ainda está em desenvolvimento e conta com vários bugs, instabilidades e mensagens de erros que serão resolvidas ao longo do tempo.

## Configuração obrigatória
A fim de manter as estatisticas do meu github fiéis a minha codificação, removi os arquivos do FullCalendar da pasta 'public/full', e neste novo repositório você precisa extrair o arquivo 'full.zip' na pasta raiz dentro da pasta public.

## Configurando o MongoDb (Windows 10)
1. Instale o mongodb na sua máquina
2. Configure o Path, provavelmente os binários estarão nesse caminho
```shell
C:\Program Files\MongoDB\Server\5.0\bin
```
3. Abra o prompt de comando como administrador e inicie o serviço do mongodb
```
net start mongodb
```
4. acesse o mongo com o comando:
```shell
mongo
```
5. Estando tudo ok, você pode sair com o comando exit.
6. Para parar o serviço basta rodar o comando abaixo
```shell
net stop mongodb
```

## Configurando o mailtrap
Por enquanto o sistema usa o site mailtrap para simular o envio de e-mail

### Senha do sistema por enquanto
login: admin@admin.com
senha: admin

#### Inserção de cliente com mensagem de erro
![Inserir cliente](images/1.png)

#### Listagem de clientes
![Visualização de clientes](images/2.png)

#### Exclusão de cliente
![Excluir cliente](images/3.png)

#### Edição de cliente
![Editar cliente](images/4.png)

#### Inserção de consulta
![Inserir consulta](images/5.png)

#### Conflito de consultas
![Conflito na inserção](images/6.png)

#### Visualização de consulta
![Visualização de consultas](images/7.png)

#### E-mail enviado a um usuário
![E-mail enviado](images/8.png)

#### Listagem de consultas
![Lista de consultas](images/9.png)
