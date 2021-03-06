'use strict';

var url = 'http://localhost:3000/meals';

var mealInputBox = document.querySelector('.meal-input');
var calorieInputBox = document.querySelector('.calorie-input');
var dateInputBox = document.querySelector('.date-input');
var filterInputBox = document.querySelector('.filter-input');

var addMealButton = document.querySelector('.add-meal-button');
var listMealsButton = document.querySelector('.list-meals-button');
var filterMealsButton = document.querySelector('.filter-meals-button');

var mealListNameColumn = document.querySelector('.meal-list-name');
var mealListCaloriesColumn = document.querySelector('.meal-list-calories');
var mealListDateColumn = document.querySelector('.meal-list-date');
var deleteButtonsDiv = document.querySelector('.delete-buttons');

var mealListIsFiltered = false;
var mealListIsDisplayed = false;

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

function clearInputValues() {
  mealInputBox.value = '';
  mealInputBox.placeholder = 'What did you eat just now?';
  calorieInputBox.value = '';
  calorieInputBox.placeholder = 0;
  dateInputBox.value = 'YYYY-MM-DDThh:mm';
}

function clearDeleteButtons() {
  while (deleteButtonsDiv.firstChild) {
    deleteButtonsDiv.removeChild(deleteButtonsDiv.firstChild);
  }
}

var refresh = function() {
  createRequest('GET', url, {}, clearInputValues);
}

function createPostRequest() {
  var mealInput = mealInputBox.value;
  var calorieInput = calorieInputBox.value;
  var dateInput = dateInputBox.value;
  var newMeal = JSON.stringify({name: mealInput, calories: calorieInput, date: dateInput});
  clearDeleteButtons();
  createRequest('POST', url, newMeal, refresh);
}

function createGetAllRequest() {
  clearDeleteButtons();
  createRequest('GET', url, {}, listMeals);
}

function createFilterRequest() {
  clearDeleteButtons();
  var date = filterInputBox.value;
  var dateString = JSON.stringify({date: date});
  var dateUrl = url + '/filter/' + date;
  createRequest('GET', dateUrl, dateString, listMeals);
}

function createDeleteRequest() {
  if (event.target.classList.contains('delete-me-button')) {
    var mealUrl = url + '/' + event.target.id;
    var deletedMeal = JSON.stringify({id: event.target.id});
    createRequest('DELETE', mealUrl, deletedMeal, refresh);
  }
}

function buildTableCell(newCell, newElement, className, value, parent) {
  newCell = document.createElement(newElement);
  newCell.classList.add(className);
  newCell.innerText = value;
  parent.appendChild(newCell);
}

function buildTableRow(meal) {
  var newMealItemName;
  buildTableCell(newMealItemName, 'div', 'meal-list-item-name', meal.name, mealListNameColumn);
  var newMealItemCalories;
  buildTableCell(newMealItemCalories, 'div', 'meal-list-item-calories', meal.calories, mealListCaloriesColumn);
  var newMealItemDate;
  buildTableCell(newMealItemDate, 'div', 'meal-list-item-date', meal.date.substring(0, 10) + " " + meal.date.substring(11, 16), mealListDateColumn);
}

var listMeals = function(response) {
  var meals = JSON.parse(response);
  mealListNameColumn.innerText = 'Meal';
  mealListCaloriesColumn.innerText = 'Calories';
  mealListDateColumn.innerText = 'Date';
  mealListIsDisplayed = true;
  var sumOfCalories = 0;
  meals.forEach(function(meal) {
    buildTableRow(meal);
    var newDeleteButton = document.createElement('button');
    newDeleteButton.classList.add('delete-me-button');
    newDeleteButton.setAttribute('id', meal.id);
    newDeleteButton.innerText = 'Pretend you didn\'t';
    deleteButtonsDiv.appendChild(newDeleteButton);
    sumOfCalories += meal.calories;
  });
  var sumLineText = document.createElement('div');
  sumLineText.classList.add('sum-text');
  sumLineText.innerText = 'Total';
  mealListNameColumn.appendChild(sumLineText);
  var sumLineNumber = document.createElement('div');
  sumLineNumber.classList.add('sum-number');
  sumLineNumber.innerText = sumOfCalories;
  mealListCaloriesColumn.appendChild(sumLineNumber);
}

function checkMealListStatus() {
  if (mealListIsFiltered === true) {
    createFilterRequest();
  } else if (mealListIsDisplayed === true) {
    createGetAllRequest();
  }
}

addMealButton.addEventListener('click', function() {
  createPostRequest();
  checkMealListStatus();
});

listMealsButton.addEventListener('click', function(event) {
  mealListIsFiltered = false;
  filterInputBox.value = 'YYYY-MM-DD';
  createGetAllRequest();
});

deleteButtonsDiv.addEventListener('click', function(event) {
  createDeleteRequest();
  checkMealListStatus();
});

filterMealsButton.addEventListener('click', function(event) {
  mealListIsFiltered = true;
  createFilterRequest();
});
