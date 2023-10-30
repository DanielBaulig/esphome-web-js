import LightEntity from './LightEntity';
import BinarySensorEntity from './BinarySensorEntity';
import ButtonEntity from './ButtonEntity';
import SelectEntity from './SelectEntity';
import Entity from '../Entity';
import NumberEntity from './NumberEntity';
import SwitchEntity from './SwitchEntity';
import CoverEntity from './CoverEntity';
import FanEntity from './FanEntity';
import SensorEntity from './SensorEntity';

const entityTypeMap = {
  'binary_sensor': BinarySensorEntity,
  'light': LightEntity,
  'button': ButtonEntity,
  'select': SelectEntity,
  'number': NumberEntity,
  'switch': SwitchEntity,
  'cover': CoverEntity,
  'fan': FanEntity,
  'sensor': SensorEntity,
}


export default function createEntity(controller, data) {
  const [type,] = data.id.split('-');
  if (!type) {
    throw new Error(`Cant determine entity type from ${data.id}`);
  }

  if (!(type in entityTypeMap)) {
    console.warn(`Unknown entity type ${type}. Creating untyped entity for id ${data.id}`);
    return new Entity(controller, data);
  }

  return new entityTypeMap[type](controller, data);
}
