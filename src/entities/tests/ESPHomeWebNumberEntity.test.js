import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ESPHomeWebNumberEntity from '../ESPHomeWebNumberEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'number-name',
  value: 20,
  state: '20.000',
}, extra));

function createESPHomeWebNumberEntity({controller = createController(), data = createData()} = {}) {
  return new ESPHomeWebNumberEntity(controller, data);
}

test('it should post to set when set is called', () =>{
  const entity = createESPHomeWebNumberEntity();
  const controller = getLastController();
  entity.set(10);
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), {value: 10});
});

