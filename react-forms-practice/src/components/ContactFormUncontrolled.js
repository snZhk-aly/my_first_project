import React, { useRef } from 'react';

function ContactFormUncontrolled() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Собираем данные прямо из DOM
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value
    };

    if (!data.name || !data.email || !data.message) {
      alert("Заполните все поля!");
      return;
    }

    alert("Сообщение отправлено!");
    console.log("Данные из неуправляемой формы:", data);

    // Очищаем форму
    e.target.reset();
  };

  const formStyle = { maxWidth: '400px', margin: '20px auto', textAlign: 'left', padding: '20px', border: '2px solid #e67e22', borderRadius: '8px', background: '#fffaf0' };
  const rowStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
  const inputStyle = { padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' };

  return (
    <div style={formStyle}>
      <h2>Обратная связь (Неуправляемая)</h2>
      <form onSubmit={handleSubmit}>

        <div style={rowStyle}>
          <label>Имя:</label>
          <input type="text" ref={nameRef} style={inputStyle} placeholder="Ваше имя" />
        </div>

        <div style={rowStyle}>
          <label>Email:</label>
          <input type="email" ref={emailRef} style={inputStyle} placeholder="Ваш email" />
        </div>

        <div style={rowStyle}>
          <label>Сообщение:</label>
          <textarea ref={messageRef} style={inputStyle} rows="4" placeholder="Ваше сообщение..." />
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Отправить
        </button>
      </form>
    </div>
  );
}

export default ContactFormUncontrolled;