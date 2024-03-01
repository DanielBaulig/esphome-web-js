import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ClimateEntity from '../ClimateEntity';

const createData = jest.fn(() => ({
  id: 'climate-name',
  state: 'HEATING',
}));

function createClimateEntity({controller = createController(), data = createData()} = {}) {
  return new ClimateEntity(controller, data);
}

test('it should post to set when set is called', () =>{
  const entity = createClimateEntity();
  const controller = getLastController();
  entity.set({mode: 'HEAT_COOL', target_temperature_high: 72, target_temperature_low: 68});
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), {mode: 'HEAT_COOL', target_temperature_high: 72, target_temperature_low: 68});
});
