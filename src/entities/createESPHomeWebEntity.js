import ESPHomeWebLightEntity from './ESPHomeWebLightEntity';
import ESPHomeWebBinarySensorEntity from './ESPHomeWebBinarySensorEntity';
import ESPHomeWebButtonEntity from './ESPHomeWebButtonEntity';
import ESPHomeWebSelectEntity from './ESPHomeWebSelectEntity';
import ESPHomeWebEntity from '../ESPHomeWebEntity';
import ESPHomeWebNumberEntity from './ESPHomeWebNumberEntity';
import ESPHomeWebSwitchEntity from './ESPHomeWebSwitchEntity';
import ESPHomeWebCoverEntity from './ESPHomeWebCoverEntity';
import ESPHomeWebFanEntity from './ESPHomeWebFanEntity';
import ESPHomeWebSensorEntity from './ESPHomeWebSensorEntity';

const entityTypeMap = {
  'binary_sensor': ESPHomeWebBinarySensorEntity,
  'light': ESPHomeWebLightEntity,
  'button': ESPHomeWebButtonEntity,
  'select': ESPHomeWebSelectEntity,
  'number': ESPHomeWebNumberEntity,
  'switch': ESPHomeWebSwitchEntity,
  'cover': ESPHomeWebCoverEntity,
  'fan': ESPHomeWebFanEntity,
  'sensor': ESPHomeWebSensorEntity,
}


export default function createESPHomeWebEntity(controller, data) {
  const [type,] = data.id.split('-');
  if (!type) {
    throw new Error(`Cant determine entity type from ${data.id}`);
  }

  if (!(type in entityTypeMap)) {
    console.warn(`Unknown entity type ${type}. Creating untyped entity for id ${data.id}`);
    return new ESPHomeWebEntity(controller, data);
  }

  return new entityTypeMap[type](controller, data);
}
