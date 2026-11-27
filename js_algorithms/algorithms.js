// Числа

// Проверка на простое число
function isPrime(number) {
  if (!Number.isInteger(number) || number < 2) return false;
  if (number === 2) return true;
  if (number % 2 === 0) return false;

  // Проверяем делители до корня из числа
  for (let i = 3; i * i <= number; i += 2) {
    if (number % i === 0) return false;
  }
  return true;
}

// Факториал числа
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return null;
  if (n === 0 || n === 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Первые n чисел Фибоначчи
function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}

// НОД двух чисел (алгоритм Евклида)
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}


// Строки

// Проверка на палиндром (без учёта пробелов и регистра)
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-zа-яё0-9]/g, '');

  let left = 0;
  let right = clean.length - 1;

  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Подсчёт гласных букв
function countVowels(str) {
  const vowels = 'аеёиоуыэюяaeiou';
  let count = 0;

  for (const char of str.toLowerCase()) {
    if (vowels.includes(char)) count++;
  }
  return count;
}

// Переворот строки без встроенных методов
function reverseString(str) {
  let result = '';

  // Идём с конца и клеим символы
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

// Самое длинное слово в предложении
function findLongestWord(sentence) {
  const words = sentence.split(/\s+/);
  let longest = '';

  for (const word of words) {
    // Убираем знаки препинания по краям
    const clean = word.replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, '');
    if (clean.length > longest.length) {
      longest = clean;
    }
  }
  return longest;
}


// Массивы

// Поиск максимума без Math.max
function findMax(arr) {
  if (!arr || arr.length === 0) return undefined;

  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// Удаление дубликатов через Set
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Пузырьковая сортировка
function bubbleSort(arr) {
  const result = arr.slice(); // не мутируем исходный массив
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
        swapped = true;
      }
    }

    // Если обменов не было — массив уже отсортирован
    if (!swapped) break;
  }
  return result;
}

// Бинарный поиск в отсортированном массиве
function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}


// Утилиты

// Форматирование суммы: 1234.56 -> "1 234.56 Р"
function formatCurrency(amount, currency = 'Р') {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '';

  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  // Расставляем пробелы между разрядами
  let formattedInt = '';
  for (let i = 0; i < intPart.length; i++) {
    const posFromEnd = intPart.length - i;
    formattedInt += intPart[i];
    if (posFromEnd > 1 && posFromEnd % 3 === 1) {
      formattedInt += ' ';
    }
  }

  return `${formattedInt}.${decPart} ${currency}`;
}

// Проверка email регуляркой
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

// Генерация пароля
function generatePassword(length = 8) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const all = upper + lower + digits + special;

  // Хотя бы по одному символу каждого типа
  const required = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  const rest = [];
  for (let i = required.length; i < length; i++) {
    rest.push(all[Math.floor(Math.random() * all.length)]);
  }

  const passwordArr = required.concat(rest);

  // Перемешиваем
  for (let i = passwordArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
  }

  return passwordArr.join('');
}