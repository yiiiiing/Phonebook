const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// const generateId = () => {
//     const maxId = phonebook.length > 0
//       ? Math.max(...phonebook.map(n => Number(n.id))) //... means transform array to individual numbers
//       : 0
//     return String(maxId + 1)
// }

morgan.token('content', (request, response)=>{ return JSON.stringify(request.body)})
// Middleware before route
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

// Get API

// Get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then( persons => {
    response.json(persons)
  })
})

// Get a person by id
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person)
    {
      response.json(person)
    }else{
      response.statusMessage = `Not Found with id ${id}`
      response.status(404).end()
    }     
  })
  .catch(error => next(error))
})

// Get phonebook info
app.get('/info', (request, response) => {
  Person.find({}).then( persons => {
  const content = `
  <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>
  </div>`
  response.send(content)})   
})

// DELETE

// delete person with id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

// POST

// add a new person
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    // content missing: 400, bad request
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }
    const newPerson = new Person(
      {
        name: body.name,
        number: body.number,
      }
    )

    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  // PUT
  // Update info
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

// Middleware after route

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})