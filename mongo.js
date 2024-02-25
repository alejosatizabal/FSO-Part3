/* eslint-disable no-undef */
/*
    Se hace la conexión de la siguiente manera desde la terminal de este proyecto
        node mongo.js 0GzKyVBkn3xfruvQ

        donde '0GzKyVBkn3xfruvQ' es la contraseña de la colección 'alejandrosatizabal'
*/

const mongoose = require('mongoose')

let password = process.argv[2]
let nombre = process.argv[3]
let telefono = process.argv[4]
let opcion = 0

if (process.argv.length<3) {
  console.log('ingresar al menos el password')
  process.exit(1)
}else if(process.argv.length === 3){
  password = process.argv[2]
  opcion = 1
}
else if(process.argv.length === 5){
  password = process.argv[2]
  nombre = process.argv[3]
  telefono = process.argv[4]
  opcion = 2
}

// const password = process.argv[2]
// const nombre = process.argv[3]
// const telefono = process.argv[4]

const url =
  // Crea colección con nombre 'phonebookApp'
  `mongodb+srv://alejosatizabal:${password}@clusterphonebook.8cpeyjp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: nombre,
  number: telefono,
})

if(opcion === 1){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}

if(opcion === 2){
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

/* Encuentra todas las notas donde 'important' es 'true' */
// Note.find({ important: true }).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

// https://cloud.mongodb.com/v2/65d2931fc6c9a87766516ad0#/metrics/replicaSet/65d2938e6283740749635bb6/explorer/phonebookApp/people/find