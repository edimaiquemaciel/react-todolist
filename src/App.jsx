import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import "./App.css";

const API = "https://server-listdo.onrender.com";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load todo on page load
  useEffect(() => {

    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));


      setLoading(false);
      setTodos(res);
    }

    loadData();

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
        title,
        time,
        done: false,
    };

    const response = await fetch(API + "/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    });

    const newTodo = await response.json(); //Obtém o novo todo com o ID gerado pelo json-server
    setTodos((prevState) => [...prevState, newTodo]);

    setTitle("");
    setTime("");
};

  const handleDelete = async (id) => {
    
    try {
        const response = await fetch(`${API}/todos/${id}`, { // Use template literals para melhor legibilidade
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();// Tenta obter informações de erro do servidor
            throw new Error(`Erro ao deletar a tarefa: ${response.status} - ${response.statusText} - ${errorData?.message || 'Sem detalhes adicionais'}`);
        }

        setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    } catch (error) {
        console.error('Erro:', error);
        alert(`Ocorreu um erro ao deletar a tarefa: ${error.message}`); // Exibe um alerta mais informativo para o usuário
    }
};

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {  
        "Content-Type": "application/json",
      },          
    });

    setTodos((prevState) => prevState.map((t)=> t.id === data.id ? (t= data) : t));  
  }

  if(loading){
    return <p>Carregando...</p>
  }
  return (
    <div className="App">
      <div className="todo-header">
        <h1>React ToDo</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que voçê vai fazer?</label>
            <input type="text" 
              name="title" 
              placeholder="Título da tarefa" 
              onChange={(e)=> setTitle(e.target.value)} 
              value={title  || ""} 
              required 
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input type="text" 
              name="time" 
              placeholder="Tempo estimado(em horas)" 
              onChange={(e)=> setTime(e.target.value)} 
              value={time  || ""} 
              required 
            />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time} {todo.time > 1 ? "horas" : "hora"}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
