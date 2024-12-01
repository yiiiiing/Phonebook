const express = require('express')
const app = express()
app.use(express.json())


const generateId = () => {
    const maxId = phonebook.length > 0
      ? Math.max(...phonebook.map(n => Number(n.id))) //... means transform array to individual numbers
      : 0
    return String(maxId + 1)
}
  


let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Get API

// Get all persons
app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

// Get a person by id
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)
    if (person) {
        response.json(person)
      } else {
        response.statusMessage = `Not Found with id ${id}`
        response.status(404).end()
      }
})

// Get phonebook info
app.get('/info', (request, response) => {
    const content = `
        <div>
            <p>Phonebook has info for ${phonebook.length} people</p>
            <p>${Date()}</p>
        </div>
    `
    response.send(content)
})

// DELETE

// delete person with id
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id)

    response.status(204).end()
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

    const person = phonebook.find(p => p.name === body.name)

    if(person){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
  
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    phonebook = phonebook.concat(newPerson)
  
    response.json(newPerson)
  })
  

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})