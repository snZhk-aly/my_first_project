// Вывод результата теста на страницу и в консоль
function runTest(testName, actual, expected) {
  const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
  const resultElement = document.createElement('div');
  resultElement.className = `test-result ${isEqual ? 'success' : 'error'}`;

  resultElement.innerHTML = `
    <strong>${testName}:</strong>
    ${isEqual ? 'УСПЕХ' : 'ОШИБКА'}
    <br>
    Ожидалось: ${JSON.stringify(expected)}
    <br>
    Получено: ${JSON.stringify(actual)}
  `;

  const container = document.getElementById('testResults');
  if (container) container.appendChild(resultElement);

  console.log(
    `${testName}:`,
    isEqual ? 'УСПЕХ' : 'ОШИБКА',
    { expected, actual }
  );
}

// Запуск всех тестов
function runAllTests() {
  console.log('ЗАПУСК ТЕСТОВ');

  // sum
  runTest('sum(1, 2, 3, 4)', sum(1, 2, 3, 4), 10);
  runTest('sum()', sum(), 0);
  runTest('sum(5)', sum(5), 5);
  runTest('sum(-1, 1)', sum(-1, 1), 0);

  // createUser
  runTest('createUser({name: "Ivan", age: 25})', createUser({ name: "Ivan", age: 25 }), "Пользователь: Ivan, возраст: 25, email: не указан");
  runTest('createUser({name: "Anna", age: 30, email: "a@a.ru"})', createUser({ name: "Anna", age: 30, email: "a@a.ru" }), "Пользователь: Anna, возраст: 30, email: a@a.ru");

  // secretMessage
  const getSecret = secretMessage('123', 'Hello');
  runTest('secretMessage правильный пароль', getSecret('123'), 'Hello');
  runTest('secretMessage неправильный пароль', getSecret('000'), 'Доступ запрещен');

  // compose
  const addOne = x => x + 1;
  const double = x => x * 2;
  const composed = compose(double, addOne); // double(addOne(x))
  runTest('compose(double, addOne)(3)', composed(3), 8);

  // myMap
  runTest('myMap([1,2,3], x=>x*2)', myMap([1, 2, 3], x => x * 2), [2, 4, 6]);
  runTest('myMap([], x=>x*2)', myMap([], x => x * 2), []);

  // myFilter
  runTest('myFilter([1,2,3,4], x=>x%2===0)', myFilter([1, 2, 3, 4], x => x % 2 === 0), [2, 4]);
  runTest('myFilter([], x=>true)', myFilter([], x => true), []);

  // myReduce
  runTest('myReduce([1,2,3], (a,b)=>a+b, 0)', myReduce([1, 2, 3], (a, b) => a + b, 0), 6);
  runTest('myReduce([1,2,3], (a,b)=>a+b)', myReduce([1, 2, 3], (a, b) => a + b), 6);
  runTest('myReduce([], (a,b)=>a+b)', myReduce([], (a, b) => a + b), undefined);

  // curry
  const add = (a, b, c) => a + b + c;
  const curriedAdd = curry(add);
  runTest('curry(add)(1)(2)(3)', curriedAdd(1)(2)(3), 6);
  runTest('curry(add)(1, 2)(3)', curriedAdd(1, 2)(3), 6);
  runTest('curry(add)(1, 2, 3)', curriedAdd(1, 2, 3), 6);

  // memoize
  let callCount = 0;
  const slowFn = memoize((x) => {
    callCount++;
    return x * 2;
  });
  slowFn(5);
  slowFn(5);
  runTest('memoize кэширует результат', callCount, 1);

  // debounce / throttle (проверка, что функции возвращают функцию)
  runTest('debounce возвращает функцию', typeof debounce(() => {}, 100), 'function');
  runTest('throttle возвращает функцию', typeof throttle(() => {}, 100), 'function');

  // createValidator
  const validatePassword = createValidator({ minLength: 6, requireNumber: true, requireUppercase: true });
  runTest('valid: "Password1"', validatePassword('Password1'), true);
  runTest('invalid: "password1" (нет заглавной)', validatePassword('password1'), false);
  runTest('invalid: "Password" (нет цифры)', validatePassword('Password'), false);
  runTest('invalid: "Pa1" (короткий)', validatePassword('Pa1'), false);

  console.log('ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  runAllTests();
});