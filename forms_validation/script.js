// Своя клиентская валидация формы регистрации.
// Браузерная валидация отключена через novalidate в HTML.

const form = document.getElementById('signupForm');
const successMsg = document.getElementById('form-success');
const bioInput = document.getElementById('bio');
const bioCount = document.getElementById('bio-count');
const strengthBar = document.getElementById('strength-bar');

// Описание всех полей формы
const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('name-error'),
    validate: (v) => {
      if (!v.trim()) return 'Введите имя.';
      if (v.trim().length < 2) return 'Имя должно быть не короче 2 символов.';
      return '';
    },
  },
  birthdate: {
    input: document.getElementById('birthdate'),
    error: document.getElementById('birthdate-error'),
    validate: (v) => {
      if (!v) return 'Укажите дату рождения.';
      const birth = new Date(v);
      if (Number.isNaN(birth.getTime())) return 'Некорректная дата.';
      if (birth > new Date()) return 'Дата не может быть в будущем.';
      const age = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) return 'Регистрация доступна с 18 лет.';
      return '';
    },
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('email-error'),
    validate: (v) => {
      if (!v.trim()) return 'Введите email.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(v.trim())) return 'Введите корректный email.';
      return '';
    },
  },
  phone: {
    input: document.getElementById('phone'),
    error: document.getElementById('phone-error'),
    validate: (v) => {
      if (!v.trim()) return 'Введите телефон.';
      const re = /^\+?[0-9\s\-()]{10,18}$/;
      if (!re.test(v.trim())) return 'Телефон указан неверно.';
      return '';
    },
  },
  site: {
    input: document.getElementById('site'),
    error: document.getElementById('site-error'),
    validate: (v) => {
      if (!v.trim()) return ''; // необязательное
      const re = /^https?:\/\/[^\s]+\.[^\s]{2,}$/i;
      if (!re.test(v.trim())) return 'Введите полный адрес, начиная с https://';
      return '';
    },
  },
  city: {
    input: document.getElementById('city'),
    error: document.getElementById('city-error'),
    validate: (v) => {
      if (!v) return 'Выберите город.';
      return '';
    },
  },
  gender: {
    // Radio-группа: input ищем по name
    input: document.querySelector('input[name="gender"]'),
    error: document.getElementById('gender-error'),
    isRadio: true,
    validate: () => {
      const checked = document.querySelector('input[name="gender"]:checked');
      if (!checked) return 'Выберите пол.';
      return '';
    },
  },
  bio: {
    input: bioInput,
    error: document.getElementById('bio-error'),
    optional: true,
    validate: (v) => {
      if (v.length > 200) return 'Не больше 200 символов.';
      return '';
    },
  },
  avatar: {
    input: document.getElementById('avatar'),
    error: document.getElementById('avatar-error'),
    optional: true,
    validate: (_, input) => {
      const file = input.files[0];
      if (!file) return '';
      if (!/image\/(png|jpeg)/.test(file.type)) {
        return 'Только PNG или JPG.';
      }
      if (file.size > 2 * 1024 * 1024) {
        return 'Файл больше 2 МБ.';
      }
      return '';
    },
  },
  password: {
    input: document.getElementById('password'),
    error: document.getElementById('password-error'),
    validate: (v) => {
      if (!v) return 'Введите пароль.';
      if (v.length < 8) return 'Пароль должен быть не короче 8 символов.';
      if (!/[A-Za-zА-Яа-я]/.test(v)) return 'Пароль должен содержать хотя бы одну букву.';
      if (!/\d/.test(v)) return 'Пароль должен содержать хотя бы одну цифру.';
      return '';
    },
  },
  confirm: {
    input: document.getElementById('confirm'),
    error: document.getElementById('confirm-error'),
    validate: (v) => {
      if (!v) return 'Повторите пароль.';
      if (v !== fields.password.input.value) return 'Пароли не совпадают.';
      return '';
    },
  },
  agree: {
    input: document.getElementById('agree'),
    error: document.getElementById('agree-error'),
    validate: (_, input) => {
      if (!input.checked) return 'Нужно согласие на обработку данных.';
      return '';
    },
  },
};

// Показать/скрыть сообщение об ошибке
function setError(field, message) {
  const { input, error, isRadio } = field;
  error.textContent = message;

  if (isRadio) {
    // Для radio-группы классы вешаем на сами radio
    document.querySelectorAll('input[name="gender"]').forEach((r) => {
      r.classList.toggle('invalid', !!message);
    });
    return;
  }

  if (message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.classList.remove('invalid');
    input.classList.add('valid');
    input.setAttribute('aria-invalid', 'false');
  }
}

// Проверка одного поля
function validateField(field) {
  const { input, validate, isRadio } = field;
  const value = isRadio ? '' : input.value;
  const message = validate(value, input);
  setError(field, message);
  return !message;
}

// Проверка всей формы
function validateAll() {
  let ok = true;
  for (const key in fields) {
    if (!validateField(fields[key])) ok = false;
  }
  return ok;
}

// Валидация в реальном времени
for (const key in fields) {
  const field = fields[key];

  if (field.isRadio) {
    document.querySelectorAll('input[name="gender"]').forEach((radio) => {
      radio.addEventListener('change', () => validateField(field));
    });
    continue;
  }

  const { input } = field;

  input.addEventListener('input', () => {
    if (input.classList.contains('invalid') || input.value.trim() !== '') {
      validateField(field);
    }
  });

  input.addEventListener('blur', () => validateField(field));

  input.addEventListener('change', () => {
    if (input.type === 'checkbox' || input.type === 'file' || input.tagName === 'SELECT') {
      validateField(field);
    }
  });
}

// Перепроверка confirm при изменении password
fields.password.input.addEventListener('input', () => {
  if (fields.confirm.input.value !== '') {
    validateField(fields.confirm);
  }
  updateStrength(fields.password.input.value);
});

// Показ/скрытие пароля
document.querySelectorAll('.toggle-pass').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
    btn.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
  });
});

// Счётчик символов в textarea
bioInput.addEventListener('input', () => {
  bioCount.textContent = bioInput.value.length;
  validateField(fields.bio);
});

// Индикатор надёжности пароля
function updateStrength(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  let cls = 'weak';
  let width = 20;
  if (score >= 4) { cls = 'strong'; width = 100; }
  else if (score >= 3) { cls = 'medium'; width = 60; }
  else if (score >= 2) { cls = 'weak'; width = 40; }
  else { cls = 'weak'; width = 20; }

  strengthBar.className = 'strength-bar ' + cls;
  strengthBar.style.width = width + '%';
}

// Отправка формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  successMsg.hidden = true;

  if (!validateAll()) {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  successMsg.hidden = false;
  form.reset();
  resetVisualState();
});

// Очистка формы — сбрасываем всё визуальное
form.addEventListener('reset', () => {
  successMsg.hidden = true;
  resetVisualState();
});

function resetVisualState() {
  for (const key in fields) {
    const { input, error, isRadio } = fields[key];
    if (isRadio) {
      document.querySelectorAll('input[name="gender"]').forEach((r) => {
        r.classList.remove('invalid', 'valid');
      });
    } else {
      input.classList.remove('valid', 'invalid');
      input.removeAttribute('aria-invalid');
    }
    error.textContent = '';
  }
  bioCount.textContent = '0';
  strengthBar.className = 'strength-bar';
  strengthBar.style.width = '0';
}