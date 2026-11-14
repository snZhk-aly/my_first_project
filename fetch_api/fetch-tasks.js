const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Вспомогательные функции
function displayOutput(elementId, data, isError = false) {
  const output = document.getElementById(elementId);
  if (!output) return;
  const timestamp = new Date().toLocaleTimeString();
  const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
  output.textContent = `[${timestamp}] ${content}`;
  output.className = `output ${isError ? 'error' : 'success'}`;
}

function displayData(elementId, data) {
  const container = document.getElementById(elementId);
  if (!container) return;

  if (Array.isArray(data)) {
    container.innerHTML = data.map(item => `
      <div class="user-card">
        <h4>${item.name || item.title || 'Без названия'}</h4>
        <p>Email: ${item.email || 'Нет'}</p>
        <p>Телефон: ${item.phone || 'Нет'}</p>
        <p>${item.body || ''}</p>
      </div>
    `).join('');
  } else if (typeof data === 'object') {
    container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } else {
    container.innerHTML = `<p>${String(data)}</p>`;
  }
}

function setLoadingState(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Загрузка...';
  } else {
    button.disabled = false;
    const originalText = button.getAttribute('data-original-text') || button.textContent.replace(' Загрузка...', '');
    button.innerHTML = originalText;
  }
}

function buildUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}


// ЗАДАНИЕ 1: GET запросы
async function fetchGetRequest() {
  setLoadingState('fetch-get', true);
  displayOutput('get-output', 'Загрузка поста...');
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    displayOutput('get-output', `Успешно получен пост:\nЗаголовок: ${data.title}`);
    displayData('get-data', data);
  } catch (error) {
    displayOutput('get-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-get', false);
  }
}

async function fetchJsonData() {
  setLoadingState('fetch-json', true);
  displayOutput('get-output', 'Загрузка пользователей...');
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    displayOutput('get-output', `Успешно загружено ${data.length} пользователей.`);
    displayData('get-data', data);
  } catch (error) {
    displayOutput('get-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-json', false);
  }
}

async function fetchWithError() {
  setLoadingState('fetch-error', true);
  displayOutput('get-output', 'Запрос к несуществующему URL...');
  try {
    // 1. Сетевая ошибка (неверный домен)
    await fetch('https://this-domain-does-not-exist-12345.com/data');
  } catch (error) {
    displayOutput('get-output', `Сетевая ошибка (TypeError): ${error.message}`, true);
  }

  try {
    // 2. HTTP ошибка (404)
    const response = await fetch(`${API_BASE_URL}/nonexistent-page`);
    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}. Fetch не падает сам по себе, нужно проверять response.ok.`);
    }
  } catch (error) {
    displayOutput('get-output', error.message, true);
  } finally {
    setLoadingState('fetch-error', false);
  }
}

function setupGetRequests() {
  document.getElementById('fetch-get')?.addEventListener('click', fetchGetRequest);
  document.getElementById('fetch-json')?.addEventListener('click', fetchJsonData);
  document.getElementById('fetch-error')?.addEventListener('click', fetchWithError);
}


// ЗАДАНИЕ 2: CRUD
async function fetchPostRequest() {
  setLoadingState('fetch-post', true);
  displayOutput('crud-output', 'Отправка POST...');
  try {
    const newPost = { title: 'Новый пост', body: 'Текст', userId: 1 };
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(newPost)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    displayOutput('crud-output', `Пост создан! ID: ${data.id}`);
  } catch (error) {
    displayOutput('crud-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-post', false);
  }
}

async function fetchPutRequest() {
  setLoadingState('fetch-put', true);
  displayOutput('crud-output', 'Отправка PUT (полное обновление)...');
  try {
    const updatedPost = { id: 1, title: 'Полностью обновленный', body: 'Новый текст', userId: 1 };
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(updatedPost)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    displayOutput('crud-output', `PUT успешен. Новый заголовок: ${data.title}`);
  } catch (error) {
    displayOutput('crud-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-put', false);
  }
}

async function fetchPatchRequest() {
  setLoadingState('fetch-patch', true);
  displayOutput('crud-output', 'Отправка PATCH (частичное обновление)...');
  try {
    const patchData = { title: 'Только заголовок изменен' };
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(patchData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    displayOutput('crud-output', `PATCH успешен.\nЗаголовок: ${data.title}\nТело осталось: ${data.body}`);
  } catch (error) {
    displayOutput('crud-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-patch', false);
  }
}

async function fetchDeleteRequest() {
  setLoadingState('fetch-delete', true);
  displayOutput('crud-output', 'Отправка DELETE...');
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    displayOutput('crud-output', `DELETE успешен. Статус: ${response.status} (удалено)`);
  } catch (error) {
    displayOutput('crud-output', `Ошибка: ${error.message}`, true);
  } finally {
    setLoadingState('fetch-delete', false);
  }
}

function setupCrudRequests() {
  document.getElementById('fetch-post')?.addEventListener('click', fetchPostRequest);
  document.getElementById('fetch-put')?.addEventListener('click', fetchPutRequest);
  document.getElementById('fetch-patch')?.addEventListener('click', fetchPatchRequest);
  document.getElementById('fetch-delete')?.addEventListener('click', fetchDeleteRequest);
}


// ЗАДАНИЕ 3: Заголовки и параметры
async function fetchWithHeaders() {
  displayOutput('headers-output', 'Отправка с кастомными заголовками...');
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      headers: {
        'X-Custom-Header': 'MyValue',
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    displayOutput('headers-output', `Успех. Отправлены заголовки X-Custom-Header и Accept. Заголовок: ${data.title}`);
  } catch (error) {
    displayOutput('headers-output', `Ошибка: ${error.message}`, true);
  }
}

async function fetchWithAuth() {
  displayOutput('headers-output', 'Имитация Bearer Token...');
  try {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      headers: { 'Authorization': `Bearer ${fakeToken}` }
    });
    displayOutput('headers-output', `Запрос с токеном прошел (сервер JSONPlaceholder игнорирует авторизацию). Статус: ${response.status}`);
  } catch (error) {
    displayOutput('headers-output', `Ошибка: ${error.message}`, true);
  }
}

async function fetchWithParams() {
  displayOutput('headers-output', 'Запрос с параметрами (_limit, _sort)...');
  try {
    const url = buildUrl(`${API_BASE_URL}/posts`, { _limit: 3, _sort: 'id', _order: 'desc' });
    displayOutput('headers-output', `URL: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    displayOutput('headers-output', `Получено ${data.length} постов. Первый ID: ${data[0].id}`);
  } catch (error) {
    displayOutput('headers-output', `Ошибка: ${error.message}`, true);
  }
}

async function fetchWithTimeout() {
  displayOutput('headers-output', 'Запуск таймаута (3 сек)...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    // Имитация долгого запроса (JSONPlaceholder быстрый, поэтому просто навешиваем сигнал)
    const response = await fetch(`${API_BASE_URL}/posts?_limit=100`, { signal: controller.signal });
    clearTimeout(timeoutId);
    displayOutput('headers-output', 'Запрос успел выполниться до таймаута.');
  } catch (error) {
    if (error.name === 'AbortError') {
      displayOutput('headers-output', `Запрос отменен по таймауту (AbortError)`, true);
    } else {
      displayOutput('headers-output', `Ошибка: ${error.message}`, true);
    }
  }
}

function setupHeadersAndParams() {
  document.getElementById('fetch-headers')?.addEventListener('click', fetchWithHeaders);
  document.getElementById('fetch-auth')?.addEventListener('click', fetchWithAuth);
  document.getElementById('fetch-params')?.addEventListener('click', fetchWithParams);
  document.getElementById('fetch-timeout')?.addEventListener('click', fetchWithTimeout);
}


// ЗАДАНИЕ 4: Обработка ответов
async function fetchAndCheckStatus() {
  displayOutput('response-output', 'Проверка статусов...');
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    if (response.ok) {
      displayOutput('response-output', `Статус OK: ${response.status}`);
    } else {
      displayOutput('response-output', `Статус ошибки: ${response.status}`, true);
    }
  } catch (e) {
    displayOutput('response-output', e.message, true);
  }
}

async function fetchAndReadHeaders() {
  displayOutput('response-output', 'Чтение заголовков ответа...');
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length') || 'не указано (chunked)';
    displayOutput('response-output', `Content-Type: ${contentType}\nContent-Length: ${contentLength}`);
  } catch (e) {
    displayOutput('response-output', e.message, true);
  }
}

async function fetchBlobData() {
  setLoadingState('fetch-blob', true);
  displayOutput('response-output', 'Загрузка изображения (Blob)...');
  try {
    const response = await fetch('https://picsum.photos/200/300');
    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    
    displayOutput('response-output', `Изображение загружено. Размер: ${blob.size} байт, Тип: ${blob.type}`);
    
    const dataContainer = document.getElementById('response-data');
    if (dataContainer) {
      dataContainer.innerHTML = `<img src="${imgUrl}" alt="Loaded" style="max-width: 100%; border-radius: 8px;">`;
    }
  } catch (e) {
    displayOutput('response-output', e.message, true);
  } finally {
    setLoadingState('fetch-blob', false);
  }
}

async function fetchWithFormData() {
  displayOutput('response-output', 'Отправка FormData...');
  try {
    const formData = new FormData();
    formData.append('title', 'Отправка формы');
    formData.append('body', 'Текст из FormData');
    formData.append('userId', '1');

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData // fetch сам установит нужный Content-Type
    });
    const data = await response.json();
    displayOutput('response-output', `FormData успешно отправлена. ID поста: ${data.id}`);
  } catch (e) {
    displayOutput('response-output', e.message, true);
  }
}

function setupResponseHandling() {
  document.getElementById('fetch-status')?.addEventListener('click', fetchAndCheckStatus);
  document.getElementById('fetch-headers-response')?.addEventListener('click', fetchAndReadHeaders);
  document.getElementById('fetch-blob')?.addEventListener('click', fetchBlobData);
  document.getElementById('fetch-formdata')?.addEventListener('click', fetchWithFormData);
}


// ЗАДАНИЕ 5: Обработка ошибок
async function fetchNetworkError() {
  displayOutput('error-output', 'Сетевая ошибка (DNS)...');
  try {
    await fetch('https://fake-url-1234.com/api');
  } catch (e) {
    displayOutput('error-output', `Сеть упала: ${e.message}`, true);
  }
}

async function fetchHttpError() {
  displayOutput('error-output', 'HTTP Ошибка (404)...');
  try {
    const res = await fetch(`${API_BASE_URL}/nonexistent`);
    if (!res.ok) throw new Error(`HTTP Ошибка: ${res.status} ${res.statusText}`);
  } catch (e) {
    displayOutput('error-output', e.message, true);
  }
}

let currentAbortController = null;
async function fetchWithAbort() {
  displayOutput('error-output', 'Запрос запущен. Нажмите кнопку еще раз для отмены!');
  
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
    return;
  }

  currentAbortController = new AbortController();
  try {
    // Делаем запрос, который будет выполняться какое-то время
    await fetch(`${API_BASE_URL}/posts`, { signal: currentAbortController.signal });
    displayOutput('error-output', 'Запрос успешно завершился (не успели отменить).');
  } catch (e) {
    if (e.name === 'AbortError') {
      displayOutput('error-output', 'Запрос был отменен пользователем!', true);
    } else {
      displayOutput('error-output', e.message, true);
    }
  } finally {
    currentAbortController = null;
  }
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries) throw new Error(`Не удалось после ${retries} попыток: ${e.message}`);
      displayOutput('error-output', `Попытка ${i} упала. Повтор через 1с...`, true);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function testRetry() {
  displayOutput('error-output', 'Старт Retry-логики...');
  try {
    // Имитируем запрос к неверному пути, чтобы сработали попытки
    await fetchWithRetry(`${API_BASE_URL}/wrong-path`, {}, 3);
  } catch (e) {
    displayOutput('error-output', e.message, true);
  }
}

function setupErrorHandling() {
  document.getElementById('fetch-network-error')?.addEventListener('click', fetchNetworkError);
  document.getElementById('fetch-http-error')?.addEventListener('click', fetchHttpError);
  document.getElementById('fetch-abort')?.addEventListener('click', fetchWithAbort);
  document.getElementById('fetch-retry')?.addEventListener('click', testRetry);
}


// ЗАДАНИЕ 6: Параллельные запросы
async function fetchWithPromiseAll() {
  displayOutput('parallel-output', 'Promise.all (3 запроса разом)...');
  const start = Date.now();
  try {
    const [users, posts, todos] = await Promise.all([
      fetch(`${API_BASE_URL}/users`).then(r => r.json()),
      fetch(`${API_BASE_URL}/posts`).then(r => r.json()),
      fetch(`${API_BASE_URL}/todos`).then(r => r.json())
    ]);
    const time = Date.now() - start;
    displayOutput('parallel-output', `Promise.all завершен за ${time}мс.\nЮзеров: ${users.length}, Постов: ${posts.length}, Задач: ${todos.length}`);
  } catch (e) {
    displayOutput('parallel-output', e.message, true);
  }
}

async function fetchWithPromiseRace() {
  displayOutput('parallel-output', 'Promise.race (кто быстрее)...');
  try {
    const winner = await Promise.race([
      fetch(`${API_BASE_URL}/posts/1`).then(() => 'Пост 1 (медленный)'),
      fetch(`${API_BASE_URL}/todos/1`).then(() => 'Задача 1 (быстрый)')
    ]);
    displayOutput('parallel-output', `Победитель гонки: ${winner}`);
  } catch (e) {
    displayOutput('parallel-output', e.message, true);
  }
}

async function fetchSequentialRequests() {
  displayOutput('parallel-output', 'Последовательные запросы...');
  const start = Date.now();
  try {
    await fetch(`${API_BASE_URL}/users/1`).then(r => r.json());
    await fetch(`${API_BASE_URL}/posts/1`).then(r => r.json());
    await fetch(`${API_BASE_URL}/todos/1`).then(r => r.json());
    const time = Date.now() - start;
    displayOutput('parallel-output', `3 запроса последовательно выполнены за ${time}мс.\n(Сравните с параллельным - обычно в 2-3 раза дольше).`);
  } catch (e) {
    displayOutput('parallel-output', e.message, true);
  }
}

function setupParallelRequests() {
  document.getElementById('fetch-all')?.addEventListener('click', fetchWithPromiseAll);
  document.getElementById('fetch-race')?.addEventListener('click', fetchWithPromiseRace);
  document.getElementById('fetch-sequential')?.addEventListener('click', fetchSequentialRequests);
}


// ЗАДАНИЕ 7: Реальные сценарии
async function fetchUserWithPosts() {
  displayOutput('scenario-output', 'Загрузка пользователя и его постов...');
  try {
    const user = await fetch(`${API_BASE_URL}/users/1`).then(r => r.json());
    const posts = await fetch(`${API_BASE_URL}/posts?userId=${user.id}`).then(r => r.json());
    
    displayOutput('scenario-output', `Пользователь: ${user.name}\nЕго постов: ${posts.length}`);
    displayData('scenario-data', posts.slice(0, 5)); // первые 5
  } catch (e) {
    displayOutput('scenario-output', e.message, true);
  }
}

async function fetchWithSearch() {
  displayOutput('scenario-output', 'Поиск постов (userId=5)...');
  try {
    const res = await fetch(`${API_BASE_URL}/posts?userId=5`);
    const data = await res.json();
    displayOutput('scenario-output', `Найдено постов: ${data.length}`);
    displayData('scenario-data', data.slice(0, 3));
  } catch (e) {
    displayOutput('scenario-output', e.message, true);
  }
}

async function simulateFileUpload() {
  displayOutput('scenario-output', 'Симуляция загрузки файла (через FormData)...');
  try {
    const blob = new Blob(['Текст файла'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, 'test.txt');
    
    // Отправляем на jsonplaceholder (он проигнорирует, но покажет, что отправка прошла)
    const res = await fetch(`${API_BASE_URL}/posts`, { method: 'POST', body: formData });
    displayOutput('scenario-output', `Файл "загружен", статус: ${res.status}`);
  } catch (e) {
    displayOutput('scenario-output', e.message, true);
  }
}

function createFetchCache() {
  const cache = new Map();
  return async function cachedFetch(url) {
    if (cache.has(url)) {
      displayOutput('scenario-output', `[КЭШ] Данные взяты мгновенно для ${url}`);
      return cache.get(url);
    }
    
    displayOutput('scenario-output', `[СЕТЬ] Выполняем запрос к ${url}`);
    const res = await fetch(url);
    const data = await res.json();
    cache.set(url, data);
    return data;
  };
}

async function testCache() {
  const cachedFetch = createFetchCache();
  const url = `${API_BASE_URL}/posts/1`;
  
  displayOutput('scenario-output', 'Первый запрос...');
  await cachedFetch(url);
  
  await new Promise(r => setTimeout(r, 1000)); // пауза
  
  displayOutput('scenario-output', 'Второй запрос (должен быть из кэша)...');
  await cachedFetch(url);
}

function setupRealScenarios() {
  document.getElementById('fetch-user-posts')?.addEventListener('click', fetchUserWithPosts);
  document.getElementById('fetch-search')?.addEventListener('click', fetchWithSearch);
  document.getElementById('fetch-upload')?.addEventListener('click', simulateFileUpload);
  document.getElementById('fetch-cache')?.addEventListener('click', testCache);
}


// ИНИЦИАЛИЗАЦИЯ
function initializeFetchAPI() {
  setupGetRequests();
  setupCrudRequests();
  setupHeadersAndParams();
  setupResponseHandling();
  setupErrorHandling();
  setupParallelRequests();
  setupRealScenarios();

  // Сохраняем оригинальные тексты кнопок
  document.querySelectorAll('button').forEach(button => {
    button.setAttribute('data-original-text', button.textContent);
  });

  console.log('Все обработчики Fetch API инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeFetchAPI);