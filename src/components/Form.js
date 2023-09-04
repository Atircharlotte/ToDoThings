import React from 'react';

let nextId = 0;
export default function Form() {
  const [things, setThings] = React.useState(''); //the words that users typed in
  const [toDos, setToDos] = React.useState([]); //contain all missions
  const [complete, setComplete] = React.useState(false); //whether is completed

  //count how many missions are left
  const leftMisstion = toDos.filter((t) => t.complete === false).length;
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
                const newList = toDos.map((t) => {
                  if (t.id === toDo.id) {
                    return {
                      ...t,
                      complete: !t.complete,
                    };
                  } else {
                    return t;
                  }
                });
                setToDos(newList);
                console.log(toDos);
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
      <div className="adjust-bar">
        <button
          onClick={() => {
            if (!things) {
              alert('Please enter something!');
            } else {
              setThings('');
              alert('Add sucessfully!');
              setToDos([
                ...toDos,
                { id: nextId++, thing: things, complete: complete },
              ]);
            }
          }}
        >
          Add Mission
        </button>{' '}
        <div className="encourage">
          <span>{leftMisstion}</span> items left! keep on going! You got it 🆒
        </div>
      </div>
    </form>
  );
}
