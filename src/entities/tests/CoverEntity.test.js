import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import CoverEntity from '../CoverEntity';

const createData = jest.fn(() => ({
  id: 'cover-name',
  value: 0,
  state: 'CLOSED',
  current_operation: 'IDLE',
}));

function createCoverEntity({controller = createController(), data = createData()} = {}) {
  return new CoverEntity(controller, data);
}

test('it should post to open when open is called', () =>{
  const entity = createCoverEntity();
  const controller = getLastController();
  entity.open();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('open'));
});

test('it should post to close when close is called', () =>{
  const entity = createCoverEntity();
  const controller = getLastController();
  entity.close();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('close'));
});

test('it should post to toggle when toggle is called', () =>{
  const entity = createCoverEntity();
  const controller = getLastController();
  entity.stop();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('stop'));
});

test('it should post to set when set is called', () =>{
  const entity = createCoverEntity();
  const controller = getLastController();
  entity.set({position: 0.5, tilt: 0.2});
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), {position: 0.5, tilt: 0.2});
});
