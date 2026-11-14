// Функция для вывода теста
function runTest(testName, actual, expected) {
  const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
  
  let container = document.getElementById('testResults');
  if (!container) {
    container = document.createElement('div');
    container.id = 'testResults';
    container.className = 'task-area';
    container.innerHTML = '<h3>Результаты автотестов</h3>';
    
    const footer = document.getElementById('main-footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(container, footer);
    }
  }

  const resultElement = document.createElement('div');
  resultElement.className = `test-result ${isEqual ? 'test-success' : 'test-failure'}`;
  resultElement.innerHTML = `
    <strong>${testName}:</strong> ${isEqual ? 'УСПЕХ' : 'ОШИБКА'}
    <br>Ожидалось: <code>${JSON.stringify(expected)}</code>
    <br>Получено: <code>${JSON.stringify(actual)}</code>
  `;

  container.appendChild(resultElement);
  console.log(`[${isEqual ? 'OK' : 'FAIL'}] ${testName}`, { expected, actual });
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('ЗАПУСК ТЕСТОВ FETCH API');

  setTimeout(async () => {
    try {
      // Тест 1: Проверка buildUrl
      const builtUrl = buildUrl('https://api.test.com/data', { q: 'js', limit: 5 });
      runTest('buildUrl формирует правильный URL', builtUrl, 'https://api.test.com/data?q=js&limit=5');

      // Тест 2: GET запрос (реальный)
      const res = await fetch(`${API_BASE_URL}/posts/1`);
      runTest('GET-запрос возвращает статус 200', res.ok, true);
      
      const data = await res.json();
      runTest('GET-запрос возвращает JSON с id=1', data.id, 1);

      // Тест 3: POST запрос (реальный)
      const postRes = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test', body: 'Test', userId: 1 })
      });
      const postData = await postRes.json();
      runTest('POST-запрос возвращает статус 201', postRes.status, 201);
      runTest('POST-запрос возвращает объект с новым id', typeof postData.id, 'number');

      // Тест 4: Обработка 404 (не падает, но ok=false)
      const errRes = await fetch(`${API_BASE_URL}/posts/99999`);
      runTest('Запрос 404 возвращает ok=false', errRes.ok, false);
      runTest('Запрос 404 не выбрасывает исключение (промис резолвится)', errRes.status, 404);

      // Тест 5: AbortController
      const controller = new AbortController();
      controller.abort(); // сразу отменяем
      
      try {
        await fetch(`${API_BASE_URL}/posts`, { signal: controller.signal });
        runTest('AbortController должен был отменить запрос', 'Запрос прошел', 'AbortError');
      } catch (e) {
        runTest('AbortController бросает ошибку AbortError', e.name, 'AbortError');
      }

      // Тест 6: Сетевая ошибка
      try {
        await fetch('https://fake-domain-12345.com');
        runTest('Сетевая ошибка должна была выбросить TypeError', 'Нет ошибки', 'TypeError');
      } catch (e) {
        runTest('Несуществующий домен вызывает TypeError', e instanceof TypeError, true);
      }

    } catch (error) {
      console.error('Критическая ошибка в тестах:', error);
    }
    console.log('ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
  }, 500);
});