# Ответы на вопросы для самоконтроля — Практическая работа №10

## 1. В чём разница между Function Declaration и Function Expression в контексте hoisting?

Function Declaration (`function foo() {}`) поднимается полностью — её можно вызвать до объявления в коде.

Function Expression (`const foo = function() {}` или `const foo = () => {}`) поднимается только переменная, но не значение. Вызвать её до объявления нельзя — будет `ReferenceError` или `TypeError`.

## 2. Как работают rest parameters (...args) и в чём их отличие от arguments object?

Rest parameters собирают «лишние» аргументы в настоящий массив:
```javascript
function f(a, ...rest) {} // rest — массив