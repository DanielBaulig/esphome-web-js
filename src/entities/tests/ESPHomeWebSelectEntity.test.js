import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ESPHomeWebSelectEntity from '../ESPHomeWebSelectEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'select-name',
  value: 'option 1',
  state: 'option 1',
  option: ['option 1', 'option 2'],
}, extra));

function createESPHomeWebSelectEntity({controller = createController(), data = createData()} = {}) {
  return new ESPHomeWebSelectEntity(controller, data);
}

test('it should post to set when set is called', () =>{
  const entity = createESPHomeWebSelectEntity();
  const controller = getLastController();
  entity.set('option 2');
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), { option: 'option 2' });
});
