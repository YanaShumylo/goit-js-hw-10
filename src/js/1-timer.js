import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// шукаємо кнопку старт
const startBtn = document.querySelector('[data-start]'); 
// шукаємо поле вибору дати 
const dateInput = document.querySelector('#datetime-picker');
// шукаємо елементи, куди будемо виводити значення днів, годин, хвилин, секунд.
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');
// створюємо змінну для дати, яку вибрав користувач 
let userSelectedDate = null;
// створємо змінну ID інтервалу, щоб його можна було зупинити
let timerId = null;
// робимо, щоб кнопка спочатку була неактивна
startBtn.disabled = true; 

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    // Якщо дата, що обрано в минулому або теперішня, показуємо помилку і блокуємо кнопку
    if (selectedDate <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      // якщо все добре, то зберігаємо вибрану дату і вмикаємо кнопку
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

// при кліку на кнопку
startBtn.addEventListener('click', () => {
// Якщо користувач не вибрав дату, функція переривається
  if (!userSelectedDate) return;
// блокуємо кнопку старт і поле вибору дати
  startBtn.disabled = true;
  dateInput.disabled = true;

  // запускаємо таймер
  timerId = setInterval(() => {
    // поточна дата
    const now = new Date();
    // кільки мілісекунд залишилося до обраної дати.
    const diff = userSelectedDate - now;
// 0 або менше мілісекунд, таймер зупиняється
    if (diff <= 0) {
      // таймер зупиняється 
      clearInterval(timerId);
// викликаємо, щоб показалися всі нулі 
      updateTimerDisplay(0);
      // стає активним поле вибору дати
      dateInput.disabled = false;
      return;
    }
// виводимо на сторінку дані, якщо є ще залишок в мілесекундах
    updateTimerDisplay(diff);
  }, 1000);
});

// Функція перетворює мілісекунди у дні/години/хвилини/секунди і виводить у відповідні елементи
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Додає 0 спереду до чисел
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

// Перетворює мілісекунди у дні, години, хвилини та секунди
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