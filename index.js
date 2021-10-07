const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'));



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
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    persons = persons.filter(person => person.id !== id)

    //If an entry for the given id is not found, the server has to respond with the appropriate status code *ADDED THIS FROM WRONG TASK BUT IT WORKS SO...
    if (person) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    //Could improve this with case comparison
    const newPerson = persons.find(person => person.name === body.name)
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'information missing' 
      })
    }

    if (newPerson) {
      return response.status(400).json({ 
        error: 'person already exists' 
      })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})