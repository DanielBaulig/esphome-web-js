import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import SwitchEntity from '../SwitchEntity';

const createData = jest.fn(() => ({
  id: 'switch-name',
  value: false,
  state: 'OFF',
}));

function createSwitchEntity({controller = createController(), data = createData()} = {}) {
  return new SwitchEntity(controller, data);
}

test('it should post to turn_on when turnOn is called', () =>{
  const entity = createSwitchEntity();
  const controller = getLastController();
  entity.turnOn();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('turn_on'));
});

test('it should post to turn_off when turnOff is called', () =>{
  const entity = createSwitchEntity();
  const controller = getLastController();
  entity.turnOff();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('turn_off'));
});

test('it should post to toggle when toggle is called', () =>{
  const entity = createSwitchEntity();
  const controller = getLastController();
  entity.toggle();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('toggle'));
});
