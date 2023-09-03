import React from 'react';

let nextId = 0;
export default function Form() {
  const [things, setThings] = React.useState('');
  const [toDos, setToDos] = React.useState([]);
  const [left, setLeft] = React.useState(false);

  return (
    <form
      className="to-do-things"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        type="text"
        className="myInput"
        placeholder="Add New..."
        value={things}
        onChange={(e) => setThings(e.target.value)}
      />
      <br />
      {toDos.map((toDo) => (
        <div className="mission">
          <label>
            <input
              type="checkbox"
              name="myCheckbox"
              defaultChecked={false}
              onClick={() => {
                setLeft((left) => !left);
              }}
            />{' '}
            {toDo.thing}
          </label>{' '}
          <button
            onClick={() => {
              alert('delete sucessfully!');
              setToDos(toDos.filter((t) => t.id !== toDo.id));
            }}
          >
            Delete
          </button>
        </div>
      ))}

      <br />
      <br />
      <label className="adjust-bar">
        <button
          onClick={() => {
            if (!things) {
              alert('Please enter something!');
            } else {
              setThings('');
              alert('Add sucessfully!');
              setToDos([...toDos, { id: nextId++, thing: things }]);
            }
          }}
        >
          Add Mission
        </button>{' '}
        {!left && toDos.length} items left
      </label>
    </form>
  );
}
