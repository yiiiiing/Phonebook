const Person = ({id, name, number, removeHandle}) => {
  return (
    <div>
      {name} 
      {number} 
      {" "}
      <button onClick={removeHandle}>delete</button>
    </div>
  )
}

const Phonebook = ({persons, filter, removeHandle}) => {
    let showedPersons = persons
    if (filter !== ''){
      // check if name contains filter
      showedPersons = persons.filter((p) => {return p.name.toLowerCase().includes(filter.toLowerCase())})
    }
    const personsComp = showedPersons.map((p)=>{
      return <Person 
              key={p.id} 
              name={p.name} 
              number={p.number} 
              removeHandle={() => {return removeHandle(p.id)}}/>
    })
    return personsComp
  }

  export default Phonebook