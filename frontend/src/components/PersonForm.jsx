const PersonForm = ({onSubmit, personName, onNameChange, personNumber, onNumberChange}) => {
    return (
        <form onSubmit={onSubmit}>
        <div>
            name:
            <input value={personName} onChange={onNameChange} />
        </div>
        <div>
            number:
            <input value={personNumber} onChange={onNumberChange} />
        </div>
        <button type="submit">add</button>
        </form>
    )   
}

export default PersonForm