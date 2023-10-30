import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ButtonEntity from '../ButtonEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'button-name',
}, extra));

function createButtonEntity({controller = createController(), data = createData()} = {}) {
  return new ButtonEntity(controller, data);
}

test('it should post to press when press is called', () =>{
  const entity = createButtonEntity();
  const controller = getLastController();
  entity.press();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('press'));
});
