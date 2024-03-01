import {jest, expect, test} from '@jest/globals';
import {createController, getLastController} from '../../tests/helpers.js';
import LockEntity from '../LockEntity';

const createData = jest.fn((extra = {}) => Object.assign({
  id: 'lock-name',
  state: 'UNLOCKED',
}, extra));


function createLockEntity({controller = createController(), data = createData()} = {}) {
  return new LockEntity(controller, data);
}

test('it should post to open when open is called', () =>{
  const entity = createLockEntity();
  const controller = getLastController();
  entity.open();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('open'));
});

test('it should post to lock when lock is called', () =>{
  const entity = createLockEntity();
  const controller = getLastController();
  entity.lock();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('lock'));
});

test('it should post to unlock when unlock is called', () =>{
  const entity = createLockEntity();
  const controller = getLastController();
  entity.unlock();
  expect(controller.post).toHaveBeenLastCalledWith(entity.getPostURL('unlock'));
});
