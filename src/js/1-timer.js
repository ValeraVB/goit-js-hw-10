import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  let userSelectedDate = null; // Змінна для зберігання обраної користувачем дати
  const startButton = document.getElementById('startTimer');
  const dateTimePicker = document.getElementById('datetime-picker');

  flatpickr(dateTimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0]; // Отримуємо обрану дату (перший елемент масиву)
      if (selectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startButton.classList.add('disabled'); // Додаємо клас для вимкнення кнопки
        userSelectedDate = null; // Очищаємо обрану дату
      } else {
        startButton.classList.remove('disabled'); // Видаляємо клас для увімкнення кнопки
        userSelectedDate = selectedDate; // Зберігаємо обрану дату
      }
    },
  });

  startButton.addEventListener('click', function () {
    if (userSelectedDate) {
      startCountdown(userSelectedDate);
      startButton.classList.add('disabled'); // Вимикаємо кнопку після натискання
      dateTimePicker.disabled = true; // Деактивуємо поле вибору дати
    }
  });

  function startCountdown(targetDate) {
    const timerUpdate = setInterval(updateTimer, 1000);

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timerUpdate);
        startButton.classList.remove('disabled'); // Робимо кнопку "Старт" знову активною
        dateTimePicker.disabled = false; // Активуємо поле вибору дати
        iziToast.success({
          title: 'Success',
          message: 'Countdown finished!',
        });
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(difference);

      document.getElementById('days').textContent = addLeadingZero(days);
      document.getElementById('hours').textContent = addLeadingZero(hours);
      document.getElementById('minutes').textContent = addLeadingZero(minutes);
      document.getElementById('seconds').textContent = addLeadingZero(seconds);
    }
  }

  function convertMs(ms) {
    // Кількість мілісекунд на одиницю часу
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Залишкові дні
    const days = Math.floor(ms / day);
    // Залишкові години
    const hours = Math.floor((ms % day) / hour);
    // Залишкові хвилини
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Залишкові секунди
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  function addLeadingZero(value) {
    return value < 10 ? `0${value}` : value;
  }
});
