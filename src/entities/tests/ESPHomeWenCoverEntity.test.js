import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import ESPHomeWebCoverEntity from '../ESPHomeWebCoverEntity';

const createData = jest.fn(() => ({
  id: 'cover-name',
  value: 0,
  state: 'CLOSED',
  current_operation: 'IDLE',
}));

function createESPHomeWebCoverEntity({controller = createController(), data = createData()} = {}) {
  return new ESPHomeWebCoverEntity(controller, data);
}

test('it should post to open when open is called', () =>{
  const entity = createESPHomeWebCoverEntity();
  const controller = getLastController();
  entity.open();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('open'));
});

test('it should post to close when close is called', () =>{
  const entity = createESPHomeWebCoverEntity();
  const controller = getLastController();
  entity.close();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('close'));
});

test('it should post to toggle when toggle is called', () =>{
  const entity = createESPHomeWebCoverEntity();
  const controller = getLastController();
  entity.stop();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('stop'));
});

test('it should post to set when set is called', () =>{
  const entity = createESPHomeWebCoverEntity();
  const controller = getLastController();
  entity.set({position: 0.5, tilt: 0.2});
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('set'), {position: 0.5, tilt: 0.2});
});
