const btnList = document.getElementById('btnList'),
      btnMean = document.getElementById('btnMean'),
      btnMedian = document.getElementById('btnMedian'),
      btnMode = document.getElementById('btnMode'),
      btnHelp = document.getElementById('btnHelp'),
      paraList = document.getElementById('resultList'),
      divBtnResult = document.getElementById('resultBtn');

var numList = [],
    numListDirection = 'least';

/*
The function sortArray sorts an inputted array of numbers from least to greatest if the inputted string
is 'least' and vice versa if the string is 'greatest'.
The function sortArray requires an array of numbers and a string that is either 'least' or 'greatest'.
The function sortArray returns an array of numbers sorted either from least to greatest or vice versa.
*/
function sortArray(array, direction) {
  let comparisonFunc;
  if(direction == 'least')
    comparisonFunc = (a, b) => a <= b;
  else
    comparisonFunc = (a, b) => a >= b;
  while(array.some((v, i) => {
    if(i != 0)
      return !comparisonFunc(array[i - 1], v);
  })) {
    array.forEach((v, i) => {
      if(i != 0)
        if(!comparisonFunc(array[i - 1], v))
          array.splice(i - 1, 2, v, array[i - 1]);
    });
  }
  return array;
}

/*
The function createElement creates a html element with the specified tag, parent, attributes, and event listeners.
The function createElement requires a valid tag name in the form of a string and a parent element, and can
optionally be given objects one for attributes and one for event listeners that use the attribute name and event
as the key and the value of the attribute and what to do once the event has been triggered as the value.
The function createElement returns the element it has created.
*/
function createElement(tag, parent, attributes = {}, eventListeners = {}) {
  let element = document.createElement(tag);
  parent.appendChild(element);
  Object.entries(attributes).forEach(v => element[v[0]] = v[1]);
  Object.entries(eventListeners).forEach(v => element[v[0]] = v[1]);
  return element;
}

/*
The function clearResultDivs removes all child nodes in the html element divBtnResult
*/
function clearResultDivs() {
  while(divBtnResult.childNodes.length)
    divBtnResult.removeChild(divBtnResult.firstChild);
}

/*
The function displayList displays the items of numList joined together with a comma and
a space in the html element paraList
*/
function displayList() {
  if(numList.length == 0)
    paraList.innerText = 'Please add an item to the list.';
  else
    paraList.innerText = numList.join(', ');
}

/*
The function clearList sets numList to an empty array and calls the function displayList
*/
function clearList() {
  numList = [];
  displayList();
}


/*
The function reverseList changes the value of numListDirection either from the string 'least' to the string
'greatest' or vice versa and then sorts and displays numList.
*/
function reverseList() {
  numListDirection = ['least', 'greatest'][1 - ['least', 'greatest'].indexOf(numListDirection)];
  if(numList.length > 1) {
    numList = sortArray(numList, numListDirection);
    displayList();
  }
}

/*
The function addItem adds the numbers inside the input field to numList and then sorts and displays numList
and clears the input field.
*/
function addItem() {
  let input = document.getElementsByTagName('input')[0];
  let val = input.value.split(', ').map(v => +v);
  val.forEach(v => {
    if(isFinite(v))
      numList.push(v);
  });
  numList = sortArray(numList, numListDirection);
  displayList();
  input.value = '';
}

/*
The function optionList removes all child nodes in the html element divBtnResult
and then displays numList and creates the buttons Add Item To List, Clear List, 
and Reverse List along with the input field and displays them.
*/
function optionList() {
  clearResultDivs();
  displayList();
  createElement('input', divBtnResult, { type: 'text' }, { onkeyup: () => event.key == 'Enter' && addItem() });
  createElement('button', divBtnResult, { innerText: 'Add Item To List' }, { onclick: addItem, ontouchend: addItem });
  createElement('button', divBtnResult, { innerText: 'Clear List' }, { onclick: clearList, ontouchend: clearList });  
  createElement('button', divBtnResult, { innerText: 'Reverse List' }, { onclick: reverseList, ontouchend: reverseList });
}

/*
The function optionMean removes all child nodes in the html element divBtnResult
and then displays the mean of numList in a paragraph html element that is created
and displayed.
*/
function optionMean() {
  clearResultDivs();
  let tempTxt = '';
  if(numList.length > 0) {
    let mean = 0;
    numList.forEach(v => mean += v);
    mean /= numList.length;
    tempTxt = 'The mean is: ' + mean;
  } else {
    tempTxt = 'Please create a list with at least 1 item.';
  }
  createElement('p', divBtnResult, { innerText: tempTxt, 'style.borderLeftWidth': '0px', className: 'result' });
}

/*
The function optionMedian removes all child nodes in the html element divBtnResult
and then displays the median of numList in a paragraph html element that is created
and displayed.
*/
function optionMedian() {
  clearResultDivs();
  let tempTxt = '';
  if(numList.length > 0) {
    let median;
    if(numList.length % 2 != 0)
      median = numList[numList.length / 2 - 0.5];
    else
      median = (numList[numList.length / 2 - 1] + numList[numList.length / 2]) / 2;
    tempTxt = 'The median is: ' + median;
  } else {
    tempTxt = 'Please create a list with at least 1 item.';
  }
  createElement('p', divBtnResult, { innerText: tempTxt, 'style.borderLeftWidth': '0px', className: 'result' });
}

/*
The function optionMode removes all child nodes in the html element divBtnResult
and then displays the modes of numList in a paragraph html element that is created
and displayed.
*/
function optionMode() {
  clearResultDivs();
  let tempTxt = '';
  if(numList.length > 0) {
    let modes = [];
    let counter = {};
    numList.forEach(v => {
      if(counter[+v] == undefined)
        counter[+v] = 1;
      else
        counter[+v] += 1;
    });
    Object.entries(counter).forEach(v => {
      if(modes.length == 0) {
        modes.push(v)
      } else {
        if(v[1] > modes[0][1])
          modes = [v];
        else if(v[1] == modes[0][1])
          modes.push(v);
      }
    });
    if(modes.length != numList.length) {
      if(modes.length == 1)
        tempTxt = 'The mode is: ';
      else
        tempTxt = 'The modes are: ';
      tempTxt += sortArray(modes.map(v => +v[0]), numListDirection).join(', ');
    } else {
      tempTxt = 'All the numbers in the list occur the same amount of times.';
    }
  } else {
    tempTxt = 'Please create a list with at least 1 item.';
  }
  createElement('p', divBtnResult, { innerText: tempTxt, 'style.borderLeftWidth': '0px', className: 'result' });
}

/*
The function optionHelp removes all child nodes in the html element divBtnResult
and then displays a message to help the user use the website in a paragraph html
element that is created and displayed.
*/
function optionHelp() {
  clearResultDivs();
  createElement('p', divBtnResult, { innerText: 'To add an item to the list (shown on the right) click on the list button and type the numbers you wish to add into the input box with each number seperated by a comma and a space then either press enter or click the button below the input.', 'style.style.borderLeftWidth': '0px', 'style.fontSize': '6vh', className: 'result' });
}
     
btnList.onclick = optionList;
btnList.ontouchend = optionList;

btnMean.onclick = optionMean;
btnMean.ontouchend = optionMean;

btnMedian.onclick = optionMedian;
btnMedian.ontouchend = optionMedian;

btnMode.onclick = optionMode;
btnMode.ontouchend = optionMode;

btnHelp.onclick = optionHelp;
btnHelp.ontouchend = optionHelp;

document.body.onload = optionList;
