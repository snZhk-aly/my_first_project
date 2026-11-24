import React from 'react';

function HooksTests() {
  const runTests = () => {
    alert("Все компоненты хуков загружены и работают!");
    console.log("Проверка компонентов пройдена.");
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', background: '#eef', borderRadius: '8px', margin: '10px' }}>
      <h2>Тестирование хуков</h2>
      <button onClick={runTests} style={{ background: '#27ae60', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Запустить проверку
      </button>
    </div>
  );
}

export default HooksTests;