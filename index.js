
// CONFIGURACIÓN: INICIO
require('dotenv').config()
const express = require('express')
const app = express()

const Person = require('./models/person')

const cors = require('cors')
app.use(cors())

var morgan = require('morgan')
//app.use(morgan('tiny'))

app.use(express.json())

app.use(express.static('dist')) // Para que el BackEnd redireccione a 'dist', el Front build

morgan.token('cuerpo', function(req, res) {
  return JSON.stringify(req.body);
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :cuerpo'))
// CONFIGURACIÓN: FIN

// Ruta get('/'
app.get('/', function (req, res) {
  res.send('hello, world!')
})

// Ruta get('/info'
app.get('/info', (request, response) => {
  const now = new Date();
  const fecha = now.toString()
  Person.find({}).then(persons => {
    console.log('persons :>> ', persons);
    const numPersons = persons.length
    response.send(
      `<p>La agenda tiene ${numPersons} ${numPersons == 1 ? 'persona' : 'personas'} incluidas</p>
      <p>${fecha}</p>`
      )
  })
    
  // response.send(
  //     `<p>La agenda tiene ${numPersons} ${numPersons == 1 ? 'persona' : 'personas'} incluidas</p>
  //     <p>${fecha}</p>`
  //     )
})

// Ruta get('/api/persons'
app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    console.log('result :>> ', result);
    response.json(result)
  })
})

// Ruta get('/api/persons/:id'
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  
    
  })

// Ruta delete('/api/persons/:id'
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personaEliminada = persons.find(person => person.id == id)
    persons = persons.filter(person => person.id !== id)
  
    console.log('personaEliminada BackEnd :>> ', personaEliminada);
    //response.status(204).end() // Respuesta sin conectar al con el FrontEnd
    response.json(personaEliminada) // Respuesta conectando con el FrontEnd
})

const generateId = () => {
    return Math.floor(Math.random()*1000)+1
  }

// Ruta post('/api/persons'
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

//const PORT = 3001
const PORT = process.env.PORT || 3001 // Para desplegar en Internet
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })