// Сумма любого количества аргументов
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Создание пользователя с деструктуризацией
function createUser({ name, age, email = "не указан" }) {
  return `Пользователь: ${name}, возраст: ${age}, email: ${email}`;
}

// Замыкание для секретного сообщения
function secretMessage(password, message) {
  return function (inputPassword) {
    if (inputPassword === password) {
      return message;
    }
    return "Доступ запрещен";
  };
}

// Композиция функций (справа налево)
function compose(...functions) {
  return function (value) {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
}

// Своя реализация map
function myMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

// Своя реализация filter
function myFilter(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

// Своя реализация reduce
function myReduce(array, callback, initialValue) {
  let acc = initialValue;
  let startIndex = 0;

  // Если начальное значение не передано, берём первый элемент
  if (acc === undefined) {
    if (array.length === 0) return undefined;
    acc = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    acc = callback(acc, array[i], i, array);
  }
  return acc;
}

// Каррирование
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

// Мемоизация
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Дебаунсинг (откладывает вызов)
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Троттлинг (ограничивает частоту)
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Валидатор
function createValidator(options) {
  const { minLength = 0, requireNumber = false, requireUppercase = false } = options;

  return function (str) {
    if (typeof str !== 'string') return false;
    if (str.length < minLength) return false;
    if (requireNumber && !/\d/.test(str)) return false;
    if (requireUppercase && !/[A-Z]/.test(str)) return false;
    return true;
  };
}