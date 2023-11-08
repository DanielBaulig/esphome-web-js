# ESPHome Web API

An implementation of the [ESPHome WebServer API](https://esphome.io/web-api/).
Primarily written for use in [ESPHome Web
App](https://github.com/DanielBaulig/esphome-web-app).

## Installation

```
npm install esphome-web
```

## Use 

```
import ESPHomeWeb from 'esphome-web';

const esphome = new ESPHomeWeb(hostname);
esphome.addEventListener('entitydiscovered', (event) => {
  console.log('New entity discovered', event.detail.entity);
});
esphome.connect();
```
