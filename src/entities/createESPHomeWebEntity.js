import ESPHomeWebLightEntity from './ESPHomeWebLightEntity';
import ESPHomeWebBinarySensorEntity from './ESPHomeWebBinarySensorEntity';
import ESPHomeWebButtonEntity from './ESPHomeWebButtonEntity';
import ESPHomeWebSelectEntity from './ESPHomeWebSelectEntity';
import ESPHomeWebEntity from '../ESPHomeWebEntity';

export default function createESPHomeWebEntity(controller, data) {
  const [type,] = data.id.split('-');
  if (!type) {
    throw new Error(`Cant determine entity type from ${data.id}`);
  }

  switch (type) {
    case 'binary_sensor':
      return new ESPHomeWebBinarySensorEntity(controller, data);
    case 'light':
      return new ESPHomeWebLightEntity(controller, data);
    case 'button':
      return new ESPHomeWebButtonEntity(controller, data);
    case 'select':
      return new ESPHomeWebSelectEntity(controller, data);
    default:
      console.warn(`Unknown entity type ${type}. Creating untyped entity for id ${data.id}`);
      return new ESPHomeWebEntity(controller, data);
  }

}
