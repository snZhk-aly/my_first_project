import React, { useState, useEffect } from 'react';

// Кастомный хук для localStorage
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Кастомный хук для fetch
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('username', 'Гость');
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Хук useLocalStorage</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Привет, {name}! (Обновите страницу, значение сохранится)</p>
    </div>
  );
}

function FetchDemo() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Хук useFetch</h3>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>}
    </div>
  );
}

function CustomHooks() {
  return (
    <div style={{ padding: '20px', border: '2px solid orange', margin: '10px', borderRadius: '8px' }}>
      <h2>Кастомные хуки</h2>
      <LocalStorageDemo />
      <FetchDemo />
    </div>
  );
}

export default CustomHooks;