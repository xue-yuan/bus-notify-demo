import { getDisplayStopOfRoute, getRealTimeNearStop } from './api.js';
import { hasEmpty, createOptionElement, createListElement } from './utils.js';

const REGISTER_NOTIFICATIONS = {};
const UP_TRAIN = 0;
const DOWN_TRAIN = 1;
const KEY_ENTER = 13;

let citySelect = document.getElementById('city');
let directionSelect = document.getElementById('direction');
let stopSelect = document.getElementById('stop');
let busNoInput = document.getElementById('busNo');
let registerButton = document.getElementById('register');
let registered = document.getElementById('registeredNotification');

busNo.addEventListener('keypress', async (e) => {
  if (e.keyCode === KEY_ENTER) {
    stopSelect.replaceChildren();
    directionSelect.replaceChildren();

    let stopOptions = await _getBusStops(UP_TRAIN);
    let directionOptions = [
      {
        label: `往${stopOptions[stopOptions.length - 1].label}`,
        value: UP_TRAIN,
      },
      {
        label: `往${stopOptions[0].label}`,
        value: DOWN_TRAIN,
      },
    ];

    for (let option of directionOptions) {
      let opElement = createOptionElement(option.value, option.label);
      directionSelect.appendChild(opElement);
    }
  }
});

directionSelect.addEventListener('change', () => {
  stopSelect.replaceChildren();
  _getBusStops(directionSelect.value);
});

registerButton.addEventListener('click', () => {
  if (
    hasEmpty([
      citySelect.value,
      busNoInput.value,
      stopSelect.value,
      directionSelect.value,
    ])
  ) {
    alert('[ERROR] type bus number first');
    return;
  }

  let registerKey = `${citySelect.value}-${busNoInput.value}-${stopSelect.value}-${directionSelect.value}`;
  if (registerKey in REGISTER_NOTIFICATIONS) {
    alert('[INFO] this stop has already registered');
    return;
  }

  REGISTER_NOTIFICATIONS[registerKey] = {
    city: citySelect[citySelect.selectedIndex].innerText,
    busNo: busNoInput.value,
    direction: directionSelect[directionSelect.selectedIndex].innerText,
    stop: stopSelect[stopSelect.selectedIndex].innerText,
  };

  let liElement = createListElement(
    REGISTER_NOTIFICATIONS[registerKey].city,
    REGISTER_NOTIFICATIONS[registerKey].busNo,
    REGISTER_NOTIFICATIONS[registerKey].direction,
    REGISTER_NOTIFICATIONS[registerKey].stop
  );
  registered.appendChild(liElement);
  alert(`[INFO] added to registered list`);
});

setInterval(async () => {
  console.log('[DEBUG] REG_NOTIFICATION', REGISTER_NOTIFICATIONS);
  for (const [key, info] of Object.entries(REGISTER_NOTIFICATIONS)) {
    let [city, busNo, stop, direction] = key.split('-');
    let realTimeInfo = await getRealTimeNearStop(city, busNo, stop, direction);

    for (let bus of realTimeInfo) {
      if (bus.StopSequence >= stop - 5 && bus.StopSequence <= stop - 3) {
        console.log('[DEBUG] target stop', stop, 'coming', bus.StopSequence);
        alert(
          `${info.city}${info.busNo}（${info.direction}）${info.stop}站 即將到站`
        );

        break;
      }
    }
  }
}, CONFIG.QUERY_INTERVAL * 1000);

async function _getBusStops(direction) {
  let routes = await getDisplayStopOfRoute(
    citySelect.value,
    busNoInput.value,
    direction
  );

  if (routes.length === 0) {
    busNoInput.value = '';
    alert('[ERROR] no such bus');
    return;
  }

  let stopOptions = routes
    .filter((stop) => {
      return stop.RouteName.Zh_tw === busNoInput.value;
    })[0]
    .Stops.map((stop) => {
      return {
        label: stop.StopName.Zh_tw,
        value: stop.StopSequence,
      };
    });

  for (let option of stopOptions) {
    let opElement = createOptionElement(option.value, option.label);
    stopSelect.appendChild(opElement);
  }

  return stopOptions;
}
