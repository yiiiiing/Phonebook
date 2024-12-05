const Filter = ({ filterValue, onFilterChange}) => {
    return (
      <form>
        filter shown with 
        <input value={filterValue} onChange={onFilterChange} />
      </form>
    )
  }

export default Filter
  