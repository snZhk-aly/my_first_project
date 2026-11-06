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
  console.log('ЗАПУСК ТЕСТОВ');

  // Ждём, пока dom загрузится
  setTimeout(async () => {
    try {
      // Тест 1: delayWithPromise
      const start = Date.now();
      await delayWithPromise(100);
      const duration = Date.now() - start;
      runTest('delayWithPromise задерживает выполнение', duration >= 100, true);

      // Тест 2: createBasicPromise (resolve)
      const res = await createBasicPromise(true);
      runTest('createBasicPromise(true) резолвится', res, 'Успех!');

      // Тест 3: createBasicPromise (reject)
      try {
        await createBasicPromise(false);
        runTest('createBasicPromise(false) должен был упасть', 'Нет ошибки', 'Ошибка!');
      } catch (e) {
        runTest('createBasicPromise(false) падает с ошибкой', e.message, 'Ошибка!');
      }

      // Тест 4: retryWithBackoff (имитация успеха с 3-й попытки)
      let attempts = 0;
      const flakyOp = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Fail');
        return 'Success';
      };
      const retryRes = await retryWithBackoff(flakyOp, 3);
      runTest('retryWithBackoff проходит с 3-й попытки', retryRes, 'Success');

      // Тест 5: createRequestCache
      const cache = createRequestCache();
      let fetchCount = 0;
      
      // Подменяем глобальный fetch на время теста
      const originalFetch = window.fetch;
      window.fetch = async () => {
        fetchCount++;
        return { json: async () => ({ data: 'test' }) };
      };

      await cache('http://test.com');
      await cache('http://test.com'); // Должен взять из кэша
      
      window.fetch = originalFetch; // Возвращаем как было
      
      runTest('createRequestCache делает только 1 запрос для 2 вызовов', fetchCount, 1);

    } catch (error) {
      console.error('Ошибка в тестах:', error);
    }

    console.log('ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
  }, 100);
});