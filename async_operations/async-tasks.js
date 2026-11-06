// Вспомогательные функции для вывода

function displayOutput(elementId, data, isError = false) {
  const output = document.getElementById(elementId);
  if (!output) return;
  const timestamp = new Date().toLocaleTimeString();
  const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
  output.textContent = `[${timestamp}] ${content}`;
  output.className = `output ${isError ? 'error' : 'success'}`;
}

function setLoadingState(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="spinner"></span> Загрузка...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}


// ЗАДАНИЕ 1: Основы промисов

function createBasicPromise(shouldResolve = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve("Успех!");
      } else {
        reject(new Error("Ошибка!"));
      }
    }, 1000);
  });
}

function handleBasicPromise() {
  displayOutput('promise-output', 'Запуск промиса...');
  createBasicPromise(true)
    .then(result => displayOutput('promise-output', result))
    .catch(error => displayOutput('promise-output', error.message, true));
}

function createPromiseChain() {
  displayOutput('promise-output', 'Запуск цепочки промисов...');
  createBasicPromise(true)
    .then(res1 => {
      displayOutput('promise-output', `Шаг 1: ${res1}`);
      return new Promise(r => setTimeout(() => r("Шаг 2 завершен"), 500));
    })
    .then(res2 => {
      displayOutput('promise-output', `Шаг 2: ${res2}`);
      return new Promise(r => setTimeout(() => r("Шаг 3 завершен"), 500));
    })
    .then(res3 => displayOutput('promise-output', `Цепочка завершена: ${res3}`))
    .catch(err => displayOutput('promise-output', err.message, true));
}

function handlePromiseError() {
  displayOutput('promise-output', 'Запуск промиса с ошибкой...');
  createBasicPromise(false)
    .then(result => displayOutput('promise-output', result))
    .catch(error => displayOutput('promise-output', `Пойманная ошибка: ${error.message}`, true));
}

function setupPromiseEvents() {
  document.getElementById('basic-promise')?.addEventListener('click', handleBasicPromise);
  document.getElementById('promise-chain')?.addEventListener('click', createPromiseChain);
  document.getElementById('promise-error')?.addEventListener('click', handlePromiseError);
}


// ЗАДАНИЕ 2: Async/Await

async function basicAsyncAwait() {
  displayOutput('async-output', 'Ожидание...');
  try {
    const result = await createBasicPromise(true);
    displayOutput('async-output', `Результат: ${result}`);
  } catch (e) {
    displayOutput('async-output', e.message, true);
  }
}

async function handleAsyncError() {
  displayOutput('async-output', 'Ожидание ошибки...');
  try {
    await createBasicPromise(false);
  } catch (error) {
    displayOutput('async-output', `Поймано через try/catch: ${error.message}`, true);
  }
}

async function parallelAsyncExecution() {
  displayOutput('async-output', 'Запуск 3 промисов параллельно...');
  const start = Date.now();
  
  try {
    // Все три выполняются одновременно
    const results = await Promise.all([
      new Promise(r => setTimeout(() => r("Промис 1"), 1000)),
      new Promise(r => setTimeout(() => r("Промис 2"), 1500)),
      new Promise(r => setTimeout(() => r("Промис 3"), 800))
    ]);
    
    const end = Date.now();
    displayOutput('async-output', `Результаты: ${results.join(', ')}\nВремя выполнения: ${end - start}мс`);
  } catch (e) {
    displayOutput('async-output', e.message, true);
  }
}

function setupAsyncEvents() {
  document.getElementById('basic-async')?.addEventListener('click', basicAsyncAwait);
  document.getElementById('async-error')?.addEventListener('click', handleAsyncError);
  document.getElementById('async-parallel')?.addEventListener('click', parallelAsyncExecution);
}


// ЗАДАНИЕ 3: API запросы

async function fetchUsers() {
  setLoadingState('fetch-users', true);
  displayOutput('api-output', 'Запрос к API...');
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    displayOutput('api-output', `Загружено пользователей: ${data.length}\nПервый: ${data[0].name}`);
  } catch (error) {
    displayOutput('api-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-users', false);
  }
}

async function createPost() {
  setLoadingState('fetch-post', true);
  displayOutput('api-output', 'Отправка данных...');
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Новый пост',
        body: 'Текст поста',
        userId: 1,
      }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    displayOutput('api-output', `Пост создан, ID: ${data.id}`);
  } catch (error) {
    displayOutput('api-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-post', false);
  }
}

async function testApiError() {
  displayOutput('api-output', 'Проверка обработки ошибки (404)...');
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/nonexistent-url');
    if (!response.ok) throw new Error(`Ресурс не найден (Статус: ${response.status})`);
  } catch (error) {
    // Ошибка "Failed to fetch" (сеть) или кастомная ошибка 404
    displayOutput('api-output', `Перехвачено: ${error.message}`, true);
  }
}

function setupApiEvents() {
  document.getElementById('fetch-users')?.addEventListener('click', fetchUsers);
  document.getElementById('fetch-post')?.addEventListener('click', createPost);
  document.getElementById('fetch-error')?.addEventListener('click', testApiError);
}


// ЗАДАНИЕ 4: Асинхронные таймеры

let intervalId = null;
let intervalCount = 0;

function startAsyncInterval() {
  if (intervalId) return; // Уже запущен
  intervalCount = 0;
  
  intervalId = setInterval(async () => {
    intervalCount++;
    const output = document.getElementById('interval-output');
    if (output) output.textContent = `Интервал: ${intervalCount}`;
    
    // Имитация асинхронной работы внутри интервала
    if (intervalCount % 3 === 0) {
      await new Promise(r => setTimeout(r, 300));
    }
  }, 1000);
}

function stopAsyncInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    const output = document.getElementById('interval-output');
    if (output) output.textContent = `Интервал остановлен. Итого: ${intervalCount}`;
  }
}

function delayWithPromise(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testDelay() {
  const output = document.getElementById('timer-output');
  if (output) output.textContent = 'Запуск последовательных задержек...';
  
  try {
    await delayWithPromise(1000);
    if (output) output.textContent = 'Прошла 1 секунда...';
    await delayWithPromise(1000);
    if (output) output.textContent = 'Прошло 2 секунды...';
    await delayWithPromise(1000);
    if (output) output.textContent = 'Прошло 3 секунды. Готово!';
  } catch (e) {
    if (output) output.textContent = 'Ошибка задержки';
  }
}

function setupTimerEvents() {
  document.getElementById('start-interval')?.addEventListener('click', startAsyncInterval);
  document.getElementById('stop-interval')?.addEventListener('click', stopAsyncInterval);
  document.getElementById('delay-promise')?.addEventListener('click', testDelay);
}


// ЗАДАНИЕ 5: Обработка ошибок

async function asyncTryCatch() {
  displayOutput('error-output', 'Старт вложенных try/catch...');
  
  try {
    // Внешний блок
    await delayWithPromise(500);
    
    try {
      // Внутренний блок
      throw new Error("Внутренняя ошибка");
    } catch (innerError) {
      displayOutput('error-output', `Поймано внутри: ${innerError.message}`, true);
      // Пробрасываем ошибку дальше
      throw new Error("Внешняя ошибка после обработки внутренней");
    }
    
  } catch (outerError) {
    displayOutput('error-output', `Поймано снаружи: ${outerError.message}`, true);
  }
}

async function handleMultipleErrors() {
  displayOutput('error-output', 'Запуск Promise.allSettled...');
  
  const promises = [
    Promise.resolve("Успех 1"),
    Promise.reject(new Error("Ошибка 2")),
    Promise.resolve("Успех 3"),
    Promise.reject(new Error("Ошибка 4"))
  ];

  try {
    const results = await Promise.allSettled(promises);
    
    let successCount = 0;
    let failCount = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') successCount++;
      if (result.status === 'rejected') failCount++;
    });
    
    displayOutput('error-output', `Всего: ${results.length}\nУспешно: ${successCount}\nОшибок: ${failCount}\nДетали в консоли`);
    console.log("AllSettled results:", results);
  } catch (e) {
    displayOutput('error-output', `Критическая ошибка: ${e.message}`, true);
  }
}

async function retryWithBackoff(operation, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;
      
      // Экспоненциальная задержка: 500ms, 1000ms, 2000ms...
      const delay = Math.pow(2, attempt) * 250; 
      displayOutput('error-output', `Попытка ${attempt} упала. Ждём ${delay}мс...`, true);
      await delayWithPromise(delay);
    }
  }
  
  throw new Error(`Не удалось выполнить после ${maxRetries} попыток. Последняя: ${lastError.message}`);
}

async function testRetryPattern() {
  displayOutput('error-output', 'Запуск retry-паттерна...');
  
  let attempts = 0;
  // Имитация операции, которая падает 2 раза, а на 3-й проходит
  const flakyOperation = async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error("Сервер временно недоступен");
    }
    return `Успех с попытки №${attempts}`;
  };

  try {
    const result = await retryWithBackoff(flakyOperation, 3);
    displayOutput('error-output', result);
  } catch (error) {
    displayOutput('error-output', error.message, true);
  }
}

function setupErrorEvents() {
  document.getElementById('try-catch')?.addEventListener('click', asyncTryCatch);
  document.getElementById('multiple-errors')?.addEventListener('click', handleMultipleErrors);
  document.getElementById('retry-pattern')?.addEventListener('click', testRetryPattern);
}


// ЗАДАНИЕ 6: Параллельные операции

async function demonstratePromiseAll() {
  displayOutput('parallel-output', 'Запуск Promise.all (ждут все)...');
  const start = Date.now();
  
  try {
    const results = await Promise.all([
      delayWithPromise(1000).then(() => "A"),
      delayWithPromise(2000).then(() => "B"),
      delayWithPromise(500).then(() => "C")
    ]);
    
    const time = Date.now() - start;
    displayOutput('parallel-output', `Promise.all: [${results.join(', ')}]\nВремя: ${time}мс`);
  } catch (e) {
    displayOutput('parallel-output', e.message, true);
  }
}

async function demonstratePromiseRace() {
  displayOutput('parallel-output', 'Запуск Promise.race (кто быстрее)...');
  
  try {
    const result = await Promise.race([
      delayWithPromise(1000).then(() => "Долгий промис (1с)"),
      delayWithPromise(500).then(() => "Быстрый промис (0.5с)")
    ]);
    
    displayOutput('parallel-output', `Promise.race победитель: ${result}`);
  } catch (e) {
    displayOutput('parallel-output', e.message, true);
  }
}

async function demonstratePromiseAllSettled() {
  displayOutput('parallel-output', 'Запуск Promise.allSettled (ждут все, собирают ошибки)...');
  
  try {
    const results = await Promise.allSettled([
      Promise.resolve("Успех 1"),
      Promise.reject(new Error("Ошибка 2")),
      delayWithPromise(500).then(() => "Успех 3")
    ]);
    
    const formatted = results.map(r => 
      r.status === 'fulfilled' ? `[OK: ${r.value}]` : `[ERR: ${r.reason.message}]`
    );
    
    displayOutput('parallel-output', `Promise.allSettled:\n${formatted.join('\n')}`);
  } catch (e) {
    displayOutput('parallel-output', e.message, true);
  }
}

function setupParallelEvents() {
  document.getElementById('promise-all')?.addEventListener('click', demonstratePromiseAll);
  document.getElementById('promise-race')?.addEventListener('click', demonstratePromiseRace);
  document.getElementById('promise-allSettled')?.addEventListener('click', demonstratePromiseAllSettled);
}


// ЗАДАНИЕ 7: Реальные сценарии

async function sequentialApiRequests() {
  displayOutput('scenario-output', 'Шаг 1: Получаем пользователя...');
  
  try {
    // 1. Получить пользователя (id=1)
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1');
    const user = await userRes.json();
    
    displayOutput('scenario-output', `Шаг 1 завершен: ${user.name}. Шаг 2: получаем посты...`);
    
    // 2. Получить посты пользователя
    const postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
    const posts = await postsRes.json();
    
    displayOutput('scenario-output', `Шаг 2 завершен. Постов: ${posts.length}. Шаг 3: комментарии...`);
    
    // 3. Получить комментарии к первому посту
    const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${posts[0].id}/comments`);
    const comments = await commentsRes.json();
    
    displayOutput('scenario-output', `Все готово!\nПользователь: ${user.name}\nПостов: ${posts.length}\nКомментариев к 1-му: ${comments.length}`);
    
  } catch (error) {
    displayOutput('scenario-output', `Ошибка: ${error.message}`, true);
  }
}

async function simulateFileUpload() {
  const progressContainer = document.querySelector('.progress-container');
  const progressFill = document.getElementById('progress-fill');
  
  if (!progressContainer || !progressFill) return;

  progressContainer.classList.add('active');
  progressFill.style.width = '0%';
  displayOutput('scenario-output', 'Начало загрузки файла...');

  try {
    // Имитация 10 шагов загрузки по 200мс
    for (let i = 1; i <= 10; i++) {
      await delayWithPromise(200);
      const percent = i * 10;
      progressFill.style.width = `${percent}%`;
      displayOutput('scenario-output', `Загрузка: ${percent}%`);
    }
    
    displayOutput('scenario-output', 'Файл успешно загружен!');
    
    // Прячем прогресс-бар через 2 секунды
    setTimeout(() => {
      progressContainer.classList.remove('active');
    }, 2000);
    
  } catch (error) {
    displayOutput('scenario-output', `Ошибка загрузки: ${error.message}`, true);
  }
}

function createRequestCache() {
  const cache = new Map();
  
  return async function cachedRequest(url) {
    // Проверяем кэш
    if (cache.has(url)) {
      displayOutput('scenario-output', `Берем из кэша: ${url}`);
      return cache.get(url);
    }
    
    displayOutput('scenario-output', `Делаем запрос: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    
    // Сохраняем в кэш
    cache.set(url, data);
    return data;
  };
}

async function testCacheRequests() {
  const cachedFetch = createRequestCache();
  const url = 'https://jsonplaceholder.typicode.com/users/2';
  
  displayOutput('scenario-output', 'Первый запрос (должен пойти в сеть)...');
  const res1 = await cachedFetch(url);
  displayOutput('scenario-output', `Получен: ${res1.name}`);
  
  await delayWithPromise(1000); // Пауза для наглядности
  
  displayOutput('scenario-output', 'Второй запрос (должен взяться из кэша)...');
  const res2 = await cachedFetch(url);
  displayOutput('scenario-output', `Получен: ${res2.name} (мгновенно)`);
}

function setupRealScenarioEvents() {
  document.getElementById('sequential-requests')?.addEventListener('click', sequentialApiRequests);
  document.getElementById('upload-simulation')?.addEventListener('click', simulateFileUpload);
  document.getElementById('cache-requests')?.addEventListener('click', testCacheRequests);
}


// ИНИЦИАЛИЗАЦИЯ

function initializeAsyncOperations() {
  setupPromiseEvents();
  setupAsyncEvents();
  setupApiEvents();
  setupTimerEvents();
  setupErrorEvents();
  setupParallelEvents();
  setupRealScenarioEvents();
  
  console.log('Все асинхронные обработчики инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeAsyncOperations);