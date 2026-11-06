// Функция для вывода теста на страницу
function runTest(testName, actual, expected) {
  const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
  
  // Создаём контейнер для вывода, если его нет
  let container = document.getElementById('testResults');
  if (!container) {
    container = document.createElement('div');
    container.id = 'testResults';
    container.className = 'task-area';
    container.innerHTML = '<h3>Результаты автотестов</h3>';
    
    // Ищем футер внутри основного контейнера и вставляем перед ним
    const footer = document.querySelector('.container footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(container, footer);
    } else {
      // Если футера нет, добавляем в конец body
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

// Запуск тестов после загрузки
document.addEventListener('DOMContentLoaded', () => {
  console.log('ЗАПУСК ТЕСТОВ');

  // Ждём немного, чтобы dom-tasks.js успел отработать (инициализировать приложение)
  setTimeout(() => {
    try {
      // Тест 1: Подсчёт детей
      runTest('countChildren()', countChildren(), 3);

      // Тест 2: Поиск особого элемента
      runTest('findSpecialChild()', findSpecialChild(), 'Особый дочерний элемент');

      // Тест 3: Создание элементов
      const target1 = document.getElementById('target1');
      runTest('createCard добавил карточку', target1.querySelectorAll('.card').length > 0, true);
      runTest('createList добавил список', target1.querySelectorAll('ol').length > 0, true);

      // Тест 4: Валидация формы (имитация)
      const emptyFormData = new FormData();
      emptyFormData.append('username', '');
      emptyFormData.append('email', '');
      emptyFormData.append('age', '');
      
      const errors = validateForm(emptyFormData);
      runTest('Валидация пустой формы возвращает ошибки', errors !== null, true);
      runTest('Ошибка имени', !!errors.username, true);
      runTest('Ошибка email', !!errors.email, true);
      runTest('Ошибка возраста', !!errors.age, true);

      // Тест 5: Валидация корректной формы
      const goodFormData = new FormData();
      goodFormData.append('username', 'Иван');
      goodFormData.append('email', 'ivan@test.com');
      goodFormData.append('age', '25');
      
      runTest('Валидация корректной формы возвращает null', validateForm(goodFormData), null);

    } catch (error) {
      console.error('Ошибка во время выполнения тестов:', error);
    }

    console.log('ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
  }, 100); // небольшая задержка для стабильности DOM
});