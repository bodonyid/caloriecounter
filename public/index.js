'use strict';

var url = 'http://localhost:3000/meals';
var mealInputBox = document.querySelector('.meal-input');
var calorieInputBox = document.querySelector('.calorie-input');
var dateInputBox = document.querySelector('.date-input');
var addMealButton = document.querySelector('.add-meal-button');

function createRequest(method, url, data, callback) {
  var newRequest = new XMLHttpRequest();
  newRequest.open(method, url);
  newRequest.setRequestHeader('Content-Type', 'application/json');
  newRequest.send(data);
  newRequest.onreadystatechange = function() {
    if (newRequest.readyState === 4) {
      callback(newRequest.response);
    }
  };
}

function defaultInput() {
  mealInputBox.value = 'What did you eat just now?';
  calorieInputBox.value = 0;
  dateInputBox.value = 'YYYY-MM-DDThh:mm';
}

var refresh = function() {
  createRequest('GET', url, {}, defaultInput);
}

function createPostRequest() {
  var mealInput = mealInputBox.value;
  var calorieInput = calorieInputBox.value;
  var dateInput = dateInputBox.value;
  var newMeal = JSON.stringify({name: mealInput, calories: calorieInput, date: dateInput});
  createRequest('POST', url, newMeal, refresh);
}

addMealButton.addEventListener('click', createPostRequest);
