import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// знаходимо форму
const form = document.querySelector('.form');

// додаємо обробника подій та робимо так, щоб сторінка не перезавантажувалась 
form.addEventListener('submit', e => {
    e.preventDefault();
// отримуємо значення затримки та значення відповідної радіокнопки
    const delay = Number(e.target.elements.delay.value);
    const state = e.target.elements.state.value;

    // створємо проміс
    createPromise(delay, state)
    // обробка успіху
        .then(message => {
            iziToast.success({
                title: 'Success',
                message: message,
                position: 'topRight',
            });
            form.reset();
        })
    // обробка помилки
        .catch(error => {
            iziToast.error({
                title: 'Error',
                message: error,
                position: 'topRight',
            });
            form.reset();
        });
});

// функція для створення промісу
function createPromise(delay, state) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        res(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        rej(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  });
}
