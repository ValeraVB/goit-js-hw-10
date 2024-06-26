import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      document
        .querySelector('button[data-start]')
        .setAttribute('disabled', true);
    } else {
      document.querySelector('button[data-start]').removeAttribute('disabled');
    }
  },
};

flatpickr('#datetime-picker', options);

let countdownInterval;

document
  .querySelector('button[data-start]')
  .addEventListener('click', function () {
    const selectedDate = new Date(
      document.querySelector('#datetime-picker').value
    );
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      return;
    }

    document.querySelector('button[data-start]').setAttribute('disabled', true);
    document.querySelector('#datetime-picker').setAttribute('disabled', true);

    const timerUpdate = () => {
      const msDifference = selectedDate - new Date();

      if (msDifference <= 0) {
        clearInterval(countdownInterval);
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        iziToast.success({
          title: 'Timer Finished',
          message: 'Countdown has ended!',
        });
        document
          .querySelector('button[data-start]')
          .removeAttribute('disabled');
        document.querySelector('#datetime-picker').removeAttribute('disabled');
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(msDifference);
      updateTimerDisplay({ days, hours, minutes, seconds });
    };

    countdownInterval = setInterval(timerUpdate, 1000);
  });

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = formatTime(days);
  document.querySelector('[data-hours]').textContent = formatTime(hours);
  document.querySelector('[data-minutes]').textContent = formatTime(minutes);
  document.querySelector('[data-seconds]').textContent = formatTime(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}
