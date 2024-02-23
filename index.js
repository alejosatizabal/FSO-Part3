
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

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

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
})

// Ruta get('/api/persons'
app.get('/api/persons', (request, response, next) => {
  Person.find({})
  .then(result => {
    response.json(result)
  })
  .catch(error => next(error))
})

// Ruta get('/api/persons/:id'
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// Ruta delete('/api/persons/:id'
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.json( {"id":request.params.id} )
    })
    .catch(error => next(error))
})

// Ruta post('/api/persons'
app.post('/api/persons', (request, response, next) => {
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

  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

// este debe ser el último middleware cargado
app.use(errorHandler)

//const PORT = 3001
const PORT = process.env.PORT || 3001 // Para desplegar en Internet
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })