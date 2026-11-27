import React, { useState, useEffect } from 'react';

// ЗАДАНИЕ 1: useState
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Счетчик: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Сброс</button>
    </div>
  );
}

function UserForm() {
  const [user, setUser] = useState({ name: '', email: '', age: '' });
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Форма пользователя</h3>
      <input name="name" placeholder="Имя" value={user.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={user.email} onChange={handleChange} />
      <input name="age" placeholder="Возраст" value={user.age} onChange={handleChange} />
      <div>
        <strong>Текущие значения:</strong>
        <div>Имя: {user.name}</div>
        <div>Email: {user.email}</div>
        <div>Возраст: {user.age}</div>
      </div>
    </div>
  );
}

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Список задач</h3>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Новая задача" />
      <button onClick={addTodo}>Добавить</button>
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter('all')}>Все</button>
        <button onClick={() => setFilter('active')}>Активные</button>
        <button onClick={() => setFilter('completed')}>Завершенные</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer', padding: '5px', borderBottom: '1px solid #eee' }}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ЗАДАНИЕ 2: useEffect
function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Таймер: {time} сек.</h3>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Пауза' : 'Старт'}</button>
      <button onClick={() => { setTime(0); setIsRunning(false); }}>Сброс</button>
    </div>
  );
}

function WindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Размер окна</h3>
      <div>Ширина: {size.width}px</div>
      <div>Высота: {size.height}px</div>
    </div>
  );
}

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Загрузка данных</h3>
      {loading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && (
        <div>
          <div>Имя: {data.name}</div>
          <div>Email: {data.email}</div>
          <div>Телефон: {data.phone}</div>
        </div>
      )}
    </div>
  );
}

function BasicHooks() {
  return (
    <div style={{ padding: '20px', border: '2px solid blue', margin: '10px', borderRadius: '8px' }}>
      <h2>Базовые хуки: useState и useEffect</h2>
      <h3>Задание 1: useState</h3>
      <Counter />
      <UserForm />
      <TodoList />
      <h3>Задание 2: useEffect</h3>
      <Timer />
      <WindowSize />
      <DataFetcher />
    </div>
  );
}

export default BasicHooks;