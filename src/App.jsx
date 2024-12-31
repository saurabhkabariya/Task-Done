import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import Navbar from './components/navbar';
import './App.css';

function App() {
  const [todo, settodo] = useState('');
  const [todos, settodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      settodos(storedTodos);
    }
  }, []);

  const saveToLS = (todosToSave) => {
    localStorage.setItem('todos', JSON.stringify(todosToSave));
  };

  const handleEdit = (e, id) => {
    const t = todos.find((i) => i.id === id);
    settodo(t.todo);
    const newTodos = todos.filter((item) => item.id !== id);
    settodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    if(confirm("Are you sure you want to delete this task?")){
    const newTodos = todos.filter((item) => item.id !== id);
    settodos(newTodos);
    saveToLS(newTodos); 
    }
  };

  const handleAdd = () => {
    if (todo.trim() === '') return;
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    const updatedTodos = [...todos, newTodo];
    settodos(updatedTodos);
    settodo('');
    saveToLS(updatedTodos);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && todo.length>3) {
      handleAdd();
    }
  };
  const handleChange = (e) => {
    settodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    settodos(newTodos);
    saveToLS(newTodos); 
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-gray-700 min-h-[80vh] md:w-1/2">
          <h1 className="font-bold text-lg text-center">Task Done - Keep your tasks checked</h1>
          <div className="addtodo my-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold my-2">Add a Todo</h2>
            <div className="flex">
              <input
                onChange={handleChange}
                value={todo}
                className="w-full p-1 rounded-md text-black"
                type="text"
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleAdd}
                disabled={todo.length <= 3}
                className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold cursor-pointer text-white rounded-md mx-5 disabled:bg-violet-500"
              >
                Save
              </button>
            </div>
          </div>
          <input
            className="my-4"
            type="checkbox"
            onChange={toggleFinished}
            checked={showFinished}
          />
          Show Finished Tasks
          <h2 className="text-lg font-bold mt-2 mx-auto text-center">Your Todos</h2>
          <div className="todos">
            {todos.length === 0 && <div className="m-5">Hurrah! You are free currently.</div>}
            {todos.map((item) => {
              return (
                (showFinished || !item.isCompleted) && (
                  <div key={item.id} className="todo flex justify-between mx-auto my-2">
                    <div className="flex gap-5 flex-nowrap">
                      <input
                        onChange={handleCheckbox}
                        type="checkbox"
                        checked={item.isCompleted}
                        name={item.id}
                      />
                      <div className={item.isCompleted ? 'line-through' : ''}>
                        {item.todo}
                      </div>
                    </div>
                    <div className="btns flex h-full">
                      <button
                        onClick={(e) => handleEdit(e, item.id)}
                        className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold cursor-pointer text-white rounded-md mx-1"
                      >
                        <CiEdit />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold cursor-pointer text-white rounded-md mx-1"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
