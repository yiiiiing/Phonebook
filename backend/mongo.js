const mongoose = require('mongoose')
require('dotenv').config({ path:__dirname+'/.env' })
// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://dinosaur:${password}@cluster0.vx8ie.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const url = process.env.MONGODB_URI
console.log(url)
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Persons', personSchema)


// print all persons
if (process.argv.length < 4){
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

