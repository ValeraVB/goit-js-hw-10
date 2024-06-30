// Імпортуємо бібліотеки iziToast для спливаючих повідомлень і налаштування її стилів
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Чекаємо, коли весь DOM буде завантажено
document.addEventListener('DOMContentLoaded', function () {
  // Знаходимо форму за класом '.form'
  const form = document.querySelector('.form');

  // Додаємо обробник події відправки форми
  form.addEventListener('submit', function (event) {
    // Зупиняємо стандартну поведінку відправки форми
    event.preventDefault();

    // Отримуємо значення затримки та стану з форми
    const delayInput = form.elements['delay'].valueAsNumber;
    const state = form.elements['state'].value;

    // Створюємо promise з затримкою
    const delayPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Якщо стан 'fulfilled', promise виконана
        if (state === 'fulfilled') {
          resolve(delayInput);
          // Якщо стан 'rejected', promise відхилена
        } else if (state === 'rejected') {
          reject(delayInput);
        }
      }, delayInput);
    });

    // Обробляємо результати promise
    delayPromise.then(
      // Виводимо успішне повідомлення з часом виконання
      delay => {
        iziToast.success({
          title: 'Success',
          message: `✅ Fulfilled promise in ${delay}ms`,
        });
      },
      // Виводимо повідомлення про помилку з часом відхилення
      delay => {
        iziToast.error({
          title: 'Error',
          message: `❌ Rejected promise in ${delay}ms`,
        });
      }
    );
  });
});
