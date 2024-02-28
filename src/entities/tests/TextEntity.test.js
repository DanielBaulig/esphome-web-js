import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import TextEntity from '../TextEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'text-name',
  value: 'abc',
  state: 'abc',
}, extra));

function createTextEntity({controller = createController(), data = createData()} = {}) {
  return new TextEntity(controller, data);
}

test('it should post to set when set is called', () =>{
  const entity = createTextEntity();
  const controller = getLastController();
  entity.set(10);
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), {value: 10});
});

