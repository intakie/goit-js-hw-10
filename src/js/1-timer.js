import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.getElementById('datetime-picker');
const startBtn = document.querySelector('button');

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const now = new Date();

    if (userSelectedDate < now) {
      iziToast.error({
        message: 'Please choose a date in the future',
        backgroundColor: 'red',
        messageColor: 'white',
        messageSize: '16',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

startBtn.disabled = true;

const fp = flatpickr(input, options);

startBtn.addEventListener('click', () => {
  input.disabled = true;
  startBtn.disabled = true;

  const countdownInterval = setInterval(() => {
    const now = new Date();
    const difference = userSelectedDate.getTime() - now.getTime();

    if (difference <= 0) {
      clearInterval(countdownInterval);
      updateTimer(0, 0, 0, 0);
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(difference);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);
});

function updateTimer(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
