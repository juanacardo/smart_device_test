'use strict';
var inputErrorColor = '#ff0001';
var inputErrorMessage = 'Пожалуйста, введите 10 цифр';

var page = document.querySelector('.page');
var popup = document.querySelector('.popup');
var popupOpenButton = document.querySelector('#popup-open-button');
var popupCloseButton = document.querySelector('#popup-close-button');
var popupOverlay = document.querySelector('.popup-overlay');
var popupForm = document.querySelector('#popup-form');
var popupName = document.querySelector('#popup-name');
var popupTel = document.querySelector('#popup-tel');
var popupQuestion = document.querySelector('#popup-question');

var feedbackForm = document.querySelector('#feedback-form');
var feedbackName = document.querySelector('#feedback-name');
var feedbackTel = document.querySelector('#feedback-tel');
var feedbackQuestion = document.querySelector('#feedback-question');

var spollerButtons = document.querySelectorAll('.spoller__button');
var spollers = document.querySelectorAll('.spoller__item');

// // Сохранение в Local Storage

var saveInLocalStorage = function (input) {
  localStorage.setItem(input.name, input.value);
};

// Функция визульного отображения ошибки валидации
var setError = function (input) {
  input.style.borderColor = inputErrorColor;
};

var removeError = function (input) {
  input.setCustomValidity('');
  input.style.borderColor = '';
};

// Валидация формы
var onTelInput = function (input) {
  var inputValue = input.value;
  var re = /^(\d{10})$/;
  if (re.test(inputValue) === false) {
    input.setCustomValidity(inputErrorMessage);
    setError(input);
  } else {
    removeError(input);
  }
  if (input.value === '') {
    removeError(input);
  }
  input.reportValidity();
};

var validatePopupTel = function () {
  onTelInput(popupTel);
};

// Modal
var showModal = function () {
  popup.classList.remove('popup--closed');
  popupOverlay.classList.remove('popup-overlay--closed');
  page.classList.add('blocked');
  popupName.focus();
};

var hideModal = function () {
  popup.classList.add('popup--closed');
  popupOverlay.classList.add('popup-overlay--closed');
  page.classList.remove('blocked');
};

var onPopupFormEscKeydown = function (evt) {
  if (evt.keyCode === 27) {
    hideModal();
  }
};

var openModal = function () {
  showModal();
  popupCloseButton.addEventListener('click', hideModal);
  page.addEventListener('keydown', onPopupFormEscKeydown);
  popupOverlay.addEventListener('click', hideModal);
  popupTel.addEventListener('input', validatePopupTel);
};

popupOpenButton.addEventListener('click', openModal);

function closeModal() {
  popupCloseButton.removeEventListener('click', hideModal);
  page.removeEventListener('keydown', onPopupFormEscKeydown);
  popupOverlay.removeEventListener('click', hideModal);
  popupTel.removeEventListener('input', validatePopupTel);
  saveInLocalStorage(popupName);
  saveInLocalStorage(popupTel);
  saveInLocalStorage(popupQuestion);
}

popupForm.addEventListener('submit', closeModal);

// Feedback form
var validateFeedbackTel = function () {
  onTelInput(feedbackTel);
};

var submitFeedback = function () {
  saveInLocalStorage(feedbackName);
  saveInLocalStorage(feedbackTel);
  saveInLocalStorage(feedbackQuestion);
};

feedbackForm.addEventListener('submit', submitFeedback);
feedbackTel.addEventListener('input', validateFeedbackTel);

// Spoller
spollers.forEach(function (spoller) {
  spoller.classList.remove('spoller__item--nojs');
});

spollerButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var spoller = button.closest('.spoller__item');

    if (spoller.classList.contains('spoller__item--opened')) {
      spoller.classList.remove('spoller__item--opened');
    } else {
      spollers.forEach(function (item) {
        item.classList.remove('spoller__item--opened');
      });
      spoller.classList.add('spoller__item--opened');
    }
  });
});

// Tel Mask

var phoneInputs = document.querySelectorAll('input[data-tel-input]');

var getInputNumbersValue = function (input) {
  // Return stripped input value — just numbers
  return input.value.replace(/\D/g, '');
};

var onPhonePaste = function (e) {
  var input = e.target;
  var inputNumbersValue = getInputNumbersValue(input);
  var pasted = e.clipboardData || window.clipboardData;
  if (pasted) {
    var pastedText = pasted.getData('Text');
    if (/\D/g.test(pastedText)) {
      // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
      // formatting will be in onPhoneInput handler
      input.value = inputNumbersValue;
      return;
    }
  }
};

var onPhoneInput = function (e) {
  var input = e.target;
  var inputNumbersValue = getInputNumbersValue(input);
  var selectionStart = input.selectionStart;
  var formattedInputValue = '';

  if (!inputNumbersValue) {
    input.value = '';
    return;
  }

  if (input.value.length !== selectionStart) {
    // Editing in the middle of input, not last symbol
    if (e.data && /\D/g.test(e.data)) {
      // Attempt to input non-numeric symbol
      input.value = inputNumbersValue;
    }
    return;
  }

  if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
    if (inputNumbersValue[0] === '9') {
      inputNumbersValue = '7' + inputNumbersValue;
    }
    var firstSymbols = (inputNumbersValue[0] === '8') ? '8' : '+7';
    formattedInputValue = input.value = firstSymbols + ' ';
    if (inputNumbersValue.length > 1) {
      formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
    }
    if (inputNumbersValue.length >= 5) {
      formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
    }
    if (inputNumbersValue.length >= 8) {
      formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
    }
    if (inputNumbersValue.length >= 10) {
      formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
    }
  } else {
    formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
  }
  input.value = formattedInputValue;
};
var onPhoneKeyDown = function (e) {
  // Clear input after remove last symbol
  var inputValue = e.target.value.replace(/\D/g, '');
  if (e.keyCode === 8 && inputValue.length === 1) {
    e.target.value = '';
  }
};
phoneInputs.forEach(function (input) {
  input.addEventListener('keydown', onPhoneKeyDown);
  input.addEventListener('input', onPhoneInput, false);
  input.addEventListener('paste', onPhonePaste, false);
});
