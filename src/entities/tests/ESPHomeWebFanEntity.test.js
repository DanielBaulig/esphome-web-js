import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ESPHomeWebFanEntity from '../ESPHomeWebFanEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'fan-name',
  value: false,
  state: 'OFF',
}, extra));

function createESPHomeWebFanEntity({controller = createController(), data = createData()} = {}) {
  return new ESPHomeWebFanEntity(controller, data);
}

test('it should post to turn_on when turnOn is called', () =>{
  const entity = createESPHomeWebFanEntity();
  const controller = getLastController();
  entity.turnOn();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('turn_on'));
});

test('it should pass oscillation and speed_level when provided', () => {
  const entity = createESPHomeWebFanEntity();
  const controller = getLastController();
  entity.turnOn({oscillation: true, speed_level: 2});
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('turn_on'), {oscillation: true, speed_level: 2});
});
