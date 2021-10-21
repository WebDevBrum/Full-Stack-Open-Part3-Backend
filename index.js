require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors')
const Person = require("./models/person.js");

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
// app.use(morgan('tiny'));

morgan.token('data', (req, res) => { 
  const {body} = req; //destruct
  
  return JSON.stringify(body);
})



morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    // tokens.data(req, res)
  ].join(' ')
})




app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger);



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(note => note.id === id)
  
//   if (person) {
//     response.json(person)
//   } else {
//     response.status(404).end()
//   }
// })
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


// app.get('/api/info', (request, response) => {
//   const date = new Date();
//   response.send(`
//     <p>Phonebook has info for ${persons.length} people</p>
//     <p>${date}</p>`)
// })


// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(note => note.id === id)
//     persons = persons.filter(person => person.id !== id)

//     //If an entry for the given id is not found, the server has to respond with the appropriate status code *ADDED THIS FROM WRONG TASK BUT IT WORKS SO...
//     if (person) {
//       response.status(204).end()
//     } else {
//       response.status(404).end()
//     }
//   })

//   const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.max(...persons.map(n => n.id))
//       : 0
//     return maxId + 1
//   }
  
  // app.post('/api/persons', (request, response) => {
  //   const body = request.body
  //   //Could improve this with case comparison
  //   const newPerson = persons.find(person => person.name === body.name)
  
  //   if (!body.name || !body.number) {
  //     return response.status(400).json({ 
  //       error: 'information missing' 
  //     })
  //   }

  //   if (newPerson) {
  //     return response.status(400).json({ 
  //       error: 'person already exists' 
  //     })
  //   }
  
  //   const person = {
  //     id: generateId(),
  //     name: body.name,
  //     number: body.number,
  //   }
  
  //   persons = persons.concat(person)
  
  //   response.json(person)
  // })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint);


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})