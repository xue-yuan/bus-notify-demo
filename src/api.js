export function getDisplayStopOfRoute(city, busNo, direction) {
  let url = new URL(
    `${CONFIG.API_SERVER}/MOTC/v2/Bus/DisplayStopOfRoute/City/${city}/${busNo}`
  );

  let params = {
    $top: 30,
    $format: 'JSON',
    $filter: `Direction eq ${direction}`,
  };

  url.search = new URLSearchParams(params).toString();

  return _request(url);
}

export function getRealTimeNearStop(city, busNo, stop, direction) {
  let url = new URL(
    `${CONFIG.API_SERVER}/MOTC/v2/Bus/RealTimeNearStop/City/${city}/${busNo}`
  );

  let params = {
    $top: 30,
    $format: 'JSON',
    $filter: `Direction eq ${direction}`,
  };

  url.search = new URLSearchParams(params).toString();

  return _request(url);
}

function _request(url) {
  let headers = _getHeaders();

  return fetch(url, {
    headers: headers,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
}

function _getHeaders() {
  let appId = CONFIG.APP_ID;
  let appKey = CONFIG.APP_KEY;

  let currentTime = new Date().toGMTString();
  let hash = new SHA1('SHA-1', 'TEXT');
  hash.setHMACKey(appKey, 'TEXT');
  hash.update('x-date: ' + currentTime);

  let signature = hash.getHMAC('B64');
  let authorization = `hmac username="${appId}", algorithm="hmac-sha1", headers="x-date", signature="${signature}"`;

  return {
    Accept: 'application/json',
    Authorization: authorization,
    'X-Date': currentTime,
    'Accept-Encoding': 'gzip, deflate',
  };
}
