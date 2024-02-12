
// CONFIGURACIÓN: INICIO
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

var morgan = require('morgan')
//app.use(morgan('tiny'))

app.use(express.json())

morgan.token('cuerpo', function(req, res) {
  return JSON.stringify(req.body);
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :cuerpo'))
// CONFIGURACIÓN: FIN

// DATOS: INICIO
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]
// DATOS: FIN

// Ruta get('/'
app.get('/', function (req, res) {
  res.send('hello, world!')
})

// Ruta get('/info'
app.get('/info', (request, response) => {
    const numPersons = persons.length
    const now = new Date();
    const fecha = now.toString()
    
    response.send(
        `<p>La agenda tiene ${numPersons} ${numPersons == 1 ? 'persona' : 'personas'} incluidas</p>
        <p>${fecha}</p>`
        )
})

// Ruta get('/api/persons'
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Ruta get('/api/persons/:id'
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('id :>> ', id);
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
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
      return response.status(400).json({ 
        error: 'Falta el nombre' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'Falta el número' 
        })
    }

    const nombreRepetido = (persons.find(person => person.name == body.name))
    if (nombreRepetido) {
        return response.status(400).json({ 
          error: 'El nombre debe ser unico' 
        })
    }
  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })