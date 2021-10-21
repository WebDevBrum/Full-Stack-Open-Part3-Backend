const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1) //exit status code
// }

// const password = process.argv[2]

// const personNameArg = process.argv[3];

// const personNumberArg = process.argv[4];

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

//GET PERSONS
// if (process.argv.length < 4) {
//   console.log('phonebook:');
//   Person
//     .find({})
//     .then(result => {
//       result.forEach(entry => {
//       console.log(`${entry.name} ${entry.number}`);
//       })
//       mongoose.connection.close()
//   })
// }
// //create person
// // if (process.argv.length >= 4) {
// //   const person = new Person({
// //     name: personNameArg,
// //     number: personNumberArg
// //   })
  
//   person.save().then(result => {
//     console.log(`added ${person.name} ${person.number} to phonebook`);
//     mongoose.connection.close()
//   })
// }
