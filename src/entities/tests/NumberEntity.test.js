import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import NumberEntity from '../NumberEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'number-name',
  value: 20,
  state: '20.000',
}, extra));

function createNumberEntity({controller = createController(), data = createData()} = {}) {
  return new NumberEntity(controller, data);
}

test('it should post to set when set is called', () =>{
  const entity = createNumberEntity();
  const controller = getLastController();
  entity.set(10);
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), {value: 10});
});

