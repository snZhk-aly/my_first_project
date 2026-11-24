import React, { useState } from 'react';

function UserRegistrationFormWithValidation() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', gender: '', subscribe: false, age: '', about: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Сбрасываем ошибку при вводе
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Имя обязательно';
    if (!formData.email.trim()) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 8) newErrors.password = 'Минимум 8 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!formData.gender) newErrors.gender = 'Выберите пол';
    if (!formData.age) newErrors.age = 'Выберите возраст';
    if (!formData.about.trim()) newErrors.about = 'Расскажите о себе';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Форма успешно отправлена!");
      console.log("Отправленные данные:", formData);
    }
  };

  const formStyle = { maxWidth: '400px', margin: '20px auto', textAlign: 'left', padding: '20px', border: '2px solid #27ae60', borderRadius: '8px' };
  const rowStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
  const inputStyle = { padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' };
  const errorStyle = { color: 'red', fontSize: '12px', marginTop: '5px' };

  return (
    <div style={formStyle}>
      <h2>Регистрация (С валидацией)</h2>
      <form onSubmit={handleSubmit}>

        <div style={rowStyle}>
          <label>Имя:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
          {errors.name && <span style={errorStyle}>{errors.name}</span>}
        </div>

        <div style={rowStyle}>
          <label>Email:</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
          {errors.email && <span style={errorStyle}>{errors.email}</span>}
        </div>

        <div style={rowStyle}>
          <label>Пароль:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
          {errors.password && <span style={errorStyle}>{errors.password}</span>}
        </div>

        <div style={rowStyle}>
          <label>Подтверждение пароля:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
          {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
        </div>

        <div style={rowStyle}>
          <label>Пол:</label>
          <div>
            <label><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Мужской</label>
            <label style={{ marginLeft: '15px' }}><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Женский</label>
          </div>
          {errors.gender && <span style={errorStyle}>{errors.gender}</span>}
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
          {errors.age && <span style={errorStyle}>{errors.age}</span>}
        </div>

        <div style={rowStyle}>
          <label>О себе:</label>
          <textarea name="about" value={formData.about} onChange={handleChange} style={inputStyle} rows="3" />
          {errors.about && <span style={errorStyle}>{errors.about}</span>}
        </div>

        <div style={{ ...rowStyle, flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" name="subscribe" checked={formData.subscribe} onChange={handleChange} />
          <label>Подписаться на рассылку</label>
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default UserRegistrationFormWithValidation;