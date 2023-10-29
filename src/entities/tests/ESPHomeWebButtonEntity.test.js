import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ESPHomeWebButtonEntity from '../ESPHomeWebButtonEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'button-name',
}, extra));

function createESPHomeWebButtonEntity({controller = createController(), data = createData()} = {}) {
  return new ESPHomeWebButtonEntity(controller, data);
}

test('it should post to press when press is called', () =>{
  const entity = createESPHomeWebButtonEntity();
  const controller = getLastController();
  entity.press();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('press'));
});
