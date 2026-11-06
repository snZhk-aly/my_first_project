// ЗАДАНИЕ 1: Создание и вставка элементов

function createCard(title, content) {
  const target = document.getElementById('target1');
  if (!target) return;

  const card = document.createElement('div');
  card.className = 'card';

  const h4 = document.createElement('h4');
  h4.textContent = title;

  const p = document.createElement('p');
  p.textContent = content;

  card.append(h4, p);
  target.appendChild(card);
}

function createList(items) {
  const target = document.getElementById('target1');
  if (!target || !Array.isArray(items)) return;

  const ol = document.createElement('ol');
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ol.appendChild(li);
  });

  target.appendChild(ol);
}


// ЗАДАНИЕ 2: Навигация по DOM

function countChildren() {
  const parent = document.getElementById('parent-element');
  if (!parent) return 0;
  
  // Считаем только элементы, игнорируя текст
  return parent.children.length;
}

function findSpecialChild() {
  const parent = document.getElementById('parent-element');
  if (!parent) return null;
  
  const special = parent.querySelector('.special');
  return special ? special.textContent.trim() : null;
}

function getParentBackground() {
  const child = document.querySelector('.child');
  if (!child) return '';
  
  // Поднимаемся к родителю и берем цвет фона
  return window.getComputedStyle(child.parentElement).backgroundColor;
}


// ЗАДАНИЕ 3: Работа с классами и стилями

function setupStyleToggle() {
  const btn = document.getElementById('toggle-style');
  const target = document.getElementById('style-target');
  if (!btn || !target) return;

  btn.addEventListener('click', () => {
    target.classList.toggle('active-style');
  });
}

function changeHeaderColor() {
  const header = document.getElementById('main-header');
  if (!header) return;
  
  // Генерируем случайный цвет в HEX формате
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  header.style.backgroundColor = randomColor;
}

function animateElement() {
  const target = document.getElementById('style-target');
  if (!target) return;

  // Плавно уменьшаем прозрачность и масштаб на секунду
  target.style.transition = 'all 0.5s ease';
  target.style.opacity = '0.5';
  target.style.transform = 'scale(0.9)';

  // Возвращаем обратно через 500 мс
  setTimeout(() => {
    target.style.opacity = '1';
    target.style.transform = 'scale(1)';
  }, 500);
}


// ЗАДАНИЕ 4: Обработка событий

function setupClickCounter() {
  const btn = document.getElementById('click-btn');
  const display = document.getElementById('click-counter');
  if (!btn || !display) return;

  let count = 0;
  btn.addEventListener('click', () => {
    count++;
    display.textContent = count;
  });
}

function setupInputDisplay() {
  const input = document.getElementById('text-input');
  const display = document.getElementById('input-display');
  if (!input || !display) return;

  input.addEventListener('input', (e) => {
    display.textContent = e.target.value || 'Здесь появится ваш текст';
  });
}

function setupKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    console.log(`Нажата клавиша: ${e.key}, Код: ${e.code}`);
  });
}


// ЗАДАНИЕ 5: Динамические списки

function addListItem() {
  const input = document.getElementById('item-input');
  const list = document.getElementById('dynamic-list');
  if (!input || !list) return;

  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  li.className = 'list-item';

  const span = document.createElement('span');
  span.textContent = text;

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.textContent = 'Удалить';

  li.append(span, btn);
  list.appendChild(li);

  input.value = ''; // очищаем поле
}

function removeListItem(event) {
  // Проверяем, что клик пришёл именно по кнопке удаления
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('delete-btn')) {
    const li = event.target.closest('.list-item');
    if (li) li.remove();
  }
}

function clearList() {
  const list = document.getElementById('dynamic-list');
  if (list) list.innerHTML = '';
}

function setupListEvents() {
  const addBtn = document.getElementById('add-btn');
  const clearBtn = document.getElementById('clear-btn');
  const list = document.getElementById('dynamic-list');
  
  if (addBtn) addBtn.addEventListener('click', addListItem);
  if (clearBtn) clearBtn.addEventListener('click', clearList);
  // Делегирование событий: вешаем один обработчик на весь список
  if (list) list.addEventListener('click', removeListItem);
}


// ЗАДАНИЕ 6: Работа с формами

function validateForm(formData) {
  const errors = {};

  // Проверка имени
  const name = formData.get('username').trim();
  if (!name) {
    errors.username = 'Имя не может быть пустым';
  } else if (name.length < 2) {
    errors.username = 'Имя должно быть минимум 2 символа';
  }

  // Проверка email
  const email = formData.get('email').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email не может быть пустым';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Некорректный формат email';
  }

  // Проверка возраста
  const ageStr = formData.get('age');
  const age = Number(ageStr);
  if (!ageStr || Number.isNaN(age) || age < 1 || age > 120) {
    errors.age = 'Возраст должен быть от 1 до 120';
  }

  // Если ошибок нет, возвращаем null
  return Object.keys(errors).length > 0 ? errors : null;
}

function displayFormErrors(errors) {
  const output = document.getElementById('form-output');
  if (!output) return;

  output.innerHTML = ''; // очищаем вывод
  output.className = 'form-output error-message';

  const ul = document.createElement('ul');
  for (const key in errors) {
    const li = document.createElement('li');
    li.textContent = errors[key];
    ul.appendChild(li);
  }
  output.appendChild(ul);
}

function displayFormSuccess(userData) {
  const output = document.getElementById('form-output');
  if (!output) return;

  output.className = 'form-output success-message';
  output.innerHTML = `
    <strong>Успешно!</strong><br>
    Имя: ${userData.get('username')}<br>
    Email: ${userData.get('email')}<br>
    Возраст: ${userData.get('age')}
  `;
}

function handleFormSubmit(event) {
  // Отменяем перезагрузку страницы
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Валидация
  const errors = validateForm(formData);
  if (errors) {
    displayFormErrors(errors);
  } else {
    displayFormSuccess(formData);
    form.reset(); // очищаем форму после успеха
  }
}

function setupForm() {
  const form = document.getElementById('user-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}


// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ

function initializeApp() {
  // Настройка обработчиков
  setupStyleToggle();
  setupClickCounter();
  setupInputDisplay();
  setupKeyboardEvents();
  setupListEvents();
  setupForm();

  // Добавляем доп. кнопки
  const headerBtn = document.createElement('button');
  headerBtn.textContent = 'Сменить цвет шапки';
  headerBtn.onclick = changeHeaderColor;
  document.getElementById('main-header').appendChild(headerBtn);

  const animateBtn = document.getElementById('animate-btn');
  if (animateBtn) animateBtn.addEventListener('click', animateElement);

  // Демонстрационные вызовы
  createCard('Пример карточки', 'Это содержимое карточки');
  createList(['Первый элемент', 'Второй элемент', 'Третий элемент']);

  console.log('Приложение инициализировано!');
}

document.addEventListener('DOMContentLoaded', initializeApp);