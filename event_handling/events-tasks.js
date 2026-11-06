// ЗАДАНИЕ 1: Базовые обработчики событий

function handleBasicClick(event) {
  const output = document.getElementById('basic-output');
  const btn = document.getElementById('basic-btn');
  
  output.textContent = `Событие: ${event.type}. Координаты: X=${event.clientX}, Y=${event.clientY}. Элемент: ${event.target.tagName}`;
  
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 500);
}

function handleMouseEvents(event) {
  const box = document.getElementById('color-box');
  const output = document.getElementById('mouse-output');

  if (event.type === 'mouseenter') {
    box.style.background = '#e74c3c';
  } else if (event.type === 'mouseleave') {
    box.style.background = '#3498db';
  } else if (event.type === 'mousemove') {
    output.textContent = `Координаты мыши: X=${event.offsetX}, Y=${event.offsetY}`;
  }
}

function setupBasicEvents() {
  const btn = document.getElementById('basic-btn');
  const box = document.getElementById('color-box');

  if (btn) btn.addEventListener('click', handleBasicClick);
  if (box) {
    box.addEventListener('mouseenter', handleMouseEvents);
    box.addEventListener('mouseleave', handleMouseEvents);
    box.addEventListener('mousemove', handleMouseEvents);
  }
}


// ЗАДАНИЕ 2: События клавиатуры

function handleKeyEvents(event) {
  const output = document.getElementById('key-output');
  
  // Вывод информации
  output.textContent = `Key: ${event.key} | Code: ${event.code} | Ctrl: ${event.ctrlKey} | Alt: ${event.altKey} | Shift: ${event.shiftKey}`;

  // Обработка специфичных комбинаций
  if (event.ctrlKey && event.key.toLowerCase() === 's') {
    event.preventDefault();
    output.textContent += ' [Перехвачено: Ctrl+S]';
  }
  if (event.altKey && event.key.toLowerCase() === 'c') {
    event.preventDefault();
    output.textContent += ' [Перехвачено: Alt+C]';
  }
  if (event.shiftKey && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    output.textContent += ' [Перехвачено: Shift+A]';
  }
}

function setupKeyboardEvents() {
  const input = document.getElementById('key-input');
  if (input) {
    input.addEventListener('keydown', handleKeyEvents);
    input.addEventListener('keyup', (e) => {
      // Сброс или логгирование, если нужно
      console.log('Клавиша отпущена:', e.key);
    });
  }
}


// ЗАДАНИЕ 3: Делегирование событий

function handleDelegationClick(event) {
  const target = event.target;
  const output = document.getElementById('delegation-output');

  // Клик по кнопке удаления
  if (target.classList.contains('delete')) {
    target.closest('.item').remove();
  } 
  // Клик по самому элементу
  else if (target.classList.contains('item')) {
    target.classList.toggle('selected');
  }

  // Подсчёт выбранных
  const selectedCount = document.querySelectorAll('.item.selected').length;
  output.textContent = `Выбрано элементов: ${selectedCount}`;
}

let itemCounter = 3;

function addNewItem() {
  const list = document.getElementById('item-list');
  if (!list) return;

  itemCounter++;
  const div = document.createElement('div');
  div.className = 'item';
  div.dataset.id = itemCounter;
  div.innerHTML = `Элемент ${itemCounter} <span class="delete">Удалить</span>`;
  
  list.appendChild(div);
}

function setupDelegationEvents() {
  const list = document.getElementById('item-list');
  const addBtn = document.getElementById('add-item-btn');

  // Делегирование: слушаем клик на всём списке
  if (list) list.addEventListener('click', handleDelegationClick);
  if (addBtn) addBtn.addEventListener('click', addNewItem);
}


// ЗАДАНИЕ 4: Предотвращение поведения

function preventLinkDefault(event) {
  event.preventDefault(); // Отменяем переход
  const output = document.getElementById('prevention-output');
  const link = document.getElementById('prevent-link');

  output.textContent = 'Переход по ссылке отменён!';
  
  link.classList.add('shake');
  setTimeout(() => link.classList.remove('shake'), 300);
}

function preventFormSubmit(event) {
  event.preventDefault(); // Отменяем отправку
  const output = document.getElementById('prevention-output');
  const input = document.getElementById('form-input');

  const value = input.value.trim();
  if (!value) {
    output.textContent = 'Ошибка: поле не должно быть пустым!';
    output.style.borderLeftColor = '#e74c3c';
  } else {
    output.textContent = `Форма перехвачена! Введено: "${value}"`;
    output.style.borderLeftColor = '#27ae60';
    input.value = '';
  }
}

function setupPreventionEvents() {
  const link = document.getElementById('prevent-link');
  const form = document.getElementById('prevent-form');

  if (link) link.addEventListener('click', preventLinkDefault);
  if (form) form.addEventListener('submit', preventFormSubmit);
}


// ЗАДАНИЕ 5: Кастомные события

function triggerCustomEvent() {
  // Создаем и запускаем кастомное событие
  const customEvent = new CustomEvent('customAction', {
    detail: { message: 'Привет от кастомного события!', time: new Date().toLocaleTimeString() }
  });
  document.dispatchEvent(customEvent);
}

function handleCustomEvent(event) {
  const output = document.getElementById('custom-output');
  const btn = document.getElementById('trigger-custom');

  if (output) {
    output.textContent = `Получено: "${event.detail.message}" в ${event.detail.time}`;
  }

  if (btn) {
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 500);
  }
}

function setupMultipleListeners() {
  // Добавляем несколько разных слушателей на одно и то же событие
  document.addEventListener('customAction', (e) => console.log('Слушатель 1:', e.detail.message));
  document.addEventListener('customAction', (e) => console.log('Слушатель 2 получил:', e.detail.time));
  document.addEventListener('customAction', () => console.log('Слушатель 3: Событие обработано.'));
  
  const output = document.getElementById('custom-output');
  if (output) output.textContent = 'Добавлено 3 обработчика. Нажмите "Запустить".';
}

function setupCustomEvents() {
  const triggerBtn = document.getElementById('trigger-custom');
  const multipleBtn = document.getElementById('multiple-listeners');

  // Подписываемся на кастомное событие на уровне документа
  document.addEventListener('customAction', handleCustomEvent);

  if (triggerBtn) triggerBtn.addEventListener('click', triggerCustomEvent);
  if (multipleBtn) multipleBtn.addEventListener('click', setupMultipleListeners);
}


// ЗАДАНИЕ 6: События загрузки изображений

function loadImageWithEvents() {
  const container = document.getElementById('image-container');
  const output = document.getElementById('loading-output');
  
  if (!container || !output) return;

  // Очищаем контейнер
  container.innerHTML = '';
  container.className = 'image-container loading';
  output.textContent = 'Статус загрузки: Начало...';

  const img = new Image();

  img.addEventListener('loadstart', () => {
    output.textContent = 'Статус загрузки: Загрузка...';
  });

  img.addEventListener('load', () => {
    container.className = 'image-container success';
    output.textContent = 'Статус загрузки: Успешно загружено!';
  });

  img.addEventListener('error', () => {
    container.className = 'image-container error';
    output.textContent = 'Статус загрузки: Ошибка загрузки!';
    container.textContent = 'Не удалось загрузить';
  });

  img.addEventListener('loadend', () => {
    console.log('Событие loadend: загрузка завершена (успех или ошибка).');
  });

  // Для демонстрации используем случайную картинку
  img.src = 'https://picsum.photos/300/200?random=' + Math.random();
  container.appendChild(img);
}

function simulateLoadError() {
  const container = document.getElementById('image-container');
  const output = document.getElementById('loading-output');
  
  if (!container || !output) return;

  container.innerHTML = '';
  container.className = 'image-container loading';
  output.textContent = 'Статус загрузки: Попытка загрузки битой ссылки...';

  const img = new Image();

  img.addEventListener('error', () => {
    container.className = 'image-container error';
    output.textContent = 'Статус загрузки: Ошибка (URL не существует)!';
    container.textContent = 'Ошибка 404';
  });

  // Заведомо неверный URL
  img.src = 'https://this-domain-does-not-exist-12345.com/image.jpg';
  container.appendChild(img);
}

function setupLoadingEvents() {
  const loadBtn = document.getElementById('load-image');
  const errorBtn = document.getElementById('load-error');

  if (loadBtn) loadBtn.addEventListener('click', loadImageWithEvents);
  if (errorBtn) errorBtn.addEventListener('click', simulateLoadError);
}


// ЗАДАНИЕ 7: Таймеры и асинхронные события

let timerInterval = null;
let timerValue = 0;

function startTimer() {
  if (timerInterval) return; // Уже запущен

  const output = document.getElementById('timer-output');
  timerValue = 0;

  timerInterval = setInterval(() => {
    timerValue++;
    if (output) output.textContent = `Таймер: ${timerValue}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const output = document.getElementById('timer-output');
  if (output) output.textContent = `Таймер остановлен на: ${timerValue}`;
  timerValue = 0;
}

// Функция debounce
function createDebounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Функция throttle
function createThrottle(func, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

function testDebounce() {
  const output = document.getElementById('async-output');
  if (output) output.textContent = 'Debounce: ждем 1 секунду после кликов...';

  // Обычная функция вывода
  const logAction = (msg) => {
    console.log(msg);
    if (output) output.textContent = msg;
  };

  // Обернутая в debounce
  const debouncedLog = createDebounce(() => {
    logAction('Debounce: выполнено (прошла 1 секунда тишины)');
  }, 1000);

  // Имитация быстрых кликов
  let clicks = 0;
  const clickHandler = () => {
    clicks++;
    if (output) output.textContent = `Debounce: клик №${clicks} (ждем затишья)`;
    debouncedLog();
  };

  // Запускаем 5 быстрых кликов программно
  let count = 0;
  const interval = setInterval(() => {
    clickHandler();
    count++;
    if (count >= 5) clearInterval(interval);
  }, 100);
}

function testThrottle() {
  const output = document.getElementById('async-output');
  if (output) output.textContent = 'Throttle: выполняем не чаще 1 раза в секунду...';

  const throttledLog = createThrottle((msg) => {
    console.log(msg);
    if (output) output.textContent = msg;
  }, 1000);

  // Имитация частых событий (например, скролл)
  let count = 0;
  const interval = setInterval(() => {
    throttledLog(`Throttle: выполнено на шаге ${count}`);
    count++;
    if (count >= 5) clearInterval(interval);
  }, 200); // Каждые 200мс (быстрее, чем throttle)
}

function setupTimerEvents() {
  const startBtn = document.getElementById('start-timer');
  const stopBtn = document.getElementById('stop-timer');
  const debounceBtn = document.getElementById('debounce-btn');
  const throttleBtn = document.getElementById('throttle-btn');

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (stopBtn) stopBtn.addEventListener('click', stopTimer);
  if (debounceBtn) debounceBtn.addEventListener('click', testDebounce);
  if (throttleBtn) throttleBtn.addEventListener('click', testThrottle);
}


// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ

function initializeEventHandler() {
  setupBasicEvents();
  setupKeyboardEvents();
  setupDelegationEvents();
  setupPreventionEvents();
  setupCustomEvents();
  setupLoadingEvents();
  setupTimerEvents();

  console.log('Все обработчики событий инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeEventHandler);