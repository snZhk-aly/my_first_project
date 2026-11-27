import React, { useState } from 'react';

function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    subscribe: false,
    age: '',
    about: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Данные собраны! Проверьте консоль.");
    console.log("Данные формы:", formData);
  };

  const formStyle = { maxWidth: '400px', margin: '20px auto', textAlign: 'left', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' };
  const rowStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
  const inputStyle = { padding: '8px', marginTop: '5px' };

  return (
    <div style={formStyle}>
      <h2>Регистрация (Управляемая)</h2>
      <form onSubmit={handleSubmit}>

        <div style={rowStyle}>
          <label>Имя:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={rowStyle}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={rowStyle}>
          <label>Пароль:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={rowStyle}>
          <label>Подтверждение пароля:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={rowStyle}>
          <label>Пол:</label>
          <div>
            <label><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Мужской</label>
            <label style={{ marginLeft: '15px' }}><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Женский</label>
          </div>
        </div>

        <div style={rowStyle}>
          <label>Возраст:</label>
          <select name="age" value={formData.age} onChange={handleChange} style={inputStyle}>
            <option value="">Выберите возраст</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="45+">45+</option>
          </select>
        </div>

        <div style={rowStyle}>
          <label>О себе:</label>
          <textarea name="about" value={formData.about} onChange={handleChange} style={inputStyle} rows="3" />
        </div>

        <div style={{ ...rowStyle, flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" name="subscribe" checked={formData.subscribe} onChange={handleChange} />
          <label>Подписаться на рассылку</label>
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Отправить
        </button>
      </form>
    </div>
  );
}

export default UserRegistrationForm;