import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Phonebook from './components/Phonebook'
import PersonForm from './components/PersonForm'
import phonebookservice from './services/phonebook'
import Notification from './components/Notification'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [Message, setMessage] = useState({content: null, type: null})

  const addPerson = (event) =>{
    event.preventDefault()
    if (newName === '' || newNumber === ''){
      alert("name and number cannot be empty")
      return
    }

    const existPerson = persons.find(p => p.name === newName)
    if (existPerson) {
      const confirmRes = confirm(`${existPerson.name} is already added to the phonebook, replace the old number with a new one?`)
      if (confirmRes){
         // update number
        const updatePerson = {...existPerson, number:newNumber}
        const id = existPerson.id
        phonebookservice
        .update(updatePerson.id, updatePerson)
        .then((newPerson) => {
          console.log(`Update person's number with ${id}`)
          setPersons(persons.map(p => p.id === id ? newPerson : p))
          setMessage({content:`Updated number of ${newPerson.name}`, type:'info'})
        })
        .catch((error) => {
          setMessage({content:`${updatePerson.name} was already removed from server`, type:'error'})
          setPersons(persons.filter(p => p.id !== id))}
        )
      }     
    }else{
      phonebookservice
      .create({name: newName, number:newNumber})
      .then( createdPerson => {
      setPersons(persons.concat(createdPerson))
      setMessage({content:`Added ${createdPerson.name}`, type:'info'})
      })
    }
    setTimeout(() => { setMessage({content:null, type:null})}, 5000)
    setNewName('')
    setNewNumber('')
  }
  
  const handelNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handelNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handelFilterChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
  }

  const removePerson = (id) => {
    phonebookservice.remove(id).then(
      (response) => {
        console.log(`Deleted person with ID ${id}`)
        setPersons(persons.filter(p => p.id !== id))
      }
    )
  }

  useEffect(() => {
    phonebookservice.getAll()
      .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={Message} />
      <Filter filterValue={filter} onFilterChange={handelFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        onSubmit={addPerson} 
        personName={newName} 
        onNameChange={handelNameChange} 
        personNumber={newNumber} 
        onNumberChange={handelNumberChange}
      />
      <h2>Numbers</h2>
      <Phonebook persons={persons} filter={filter} removeHandle={removePerson}/>
    </div>
  )
}

export default App