// Мобильное меню: открытие и закрытие по кнопке-бургеру

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  nav.classList.toggle('open');
});

// Закрываем меню после клика по ссылке
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('open');
  });
});

// Закрываем меню при увеличении окна до десктопной ширины
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    burger.classList.remove('active');
    nav.classList.remove('open');
  }
});