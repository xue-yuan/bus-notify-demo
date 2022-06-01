export function hasEmpty(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '') {
      return true;
    }
  }
  return false;
}

export function createOptionElement(value, text) {
  let element = document.createElement('option');
  element.value = value;
  element.innerText = text;
  return element;
}

export function createListElement(city, busNo, direction, stop) {
  let element = document.createElement('li');
  element.id = `${city}${busNo}${stop}`;
  element.innerText = `${city} ${busNo}（${direction}）: ${stop}`;
  return element;
}
