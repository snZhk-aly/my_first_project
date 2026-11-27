// Функция для вывода теста на страницу
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
    } else {
      document.body.appendChild(container);
    }
  }

  const resultElement = document.createElement('div');
  resultElement.className = `test-result ${isEqual ? 'test-success' : 'test-failure'}`;

  resultElement.innerHTML = `
    <strong>${testName}:</strong>
    ${isEqual ? 'УСПЕХ' : 'ОШИБКА'}
    <br>
    Ожидалось: ${JSON.stringify(expected)}
    <br>
    Получено: ${JSON.stringify(actual)}
  `;

  container.appendChild(resultElement);
  console.log(`${testName}: ${isEqual ? 'УСПЕХ' : 'ОШИБКА'}`, { expected, actual });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('ЗАПУСК ТЕСТОВ');

  setTimeout(() => {
    try {
      // Тест 1: Проверка наличия функций
      runTest('setupBasicEvents существует', typeof setupBasicEvents, 'function');
      runTest('createDebounce существует', typeof createDebounce, 'function');
      runTest('createThrottle существует', typeof createThrottle, 'function');

      // Тест 2: Логика Debounce
      let debounceCounter = 0;
      const testDebounceFn = createDebounce(() => debounceCounter++, 100);
      
      // Вызываем 3 раза подряд
      testDebounceFn();
      testDebounceFn();
      testDebounceFn();

      // Ждем больше 100мс и проверяем, что сработало ровно 1 раз
      setTimeout(() => {
        runTest('Debounce сработал 1 раз из 3', debounceCounter, 1);

        // Тест 3: Логика Throttle
        let throttleCounter = 0;
        const testThrottleFn = createThrottle(() => throttleCounter++, 100);
        
        testThrottleFn(); // Сработает
        testThrottleFn(); // Проигнорируется
        testThrottleFn(); // Проигнорируется
        
        runTest('Throttle сработал 1 раз из 3 (без задержки)', throttleCounter, 1);
        
        console.log('ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
      }, 150);

    } catch (error) {
      console.error('Ошибка во время выполнения тестов:', error);
    }
  }, 100);
});