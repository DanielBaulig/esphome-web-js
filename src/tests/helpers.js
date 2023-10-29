import {jest} from '@jest/globals';

export function getMockController() {
  return {
    post: jest.fn(),
  };
}
export const createController = jest.fn(() => {
  return getMockController();
});

export function getLastInstance(fn) {
  expect(fn).toHaveBeenCalled();
  expect(fn).toHaveReturned();
  const instances = fn.mock.instances;
  return instances[instances.length - 1];
}

export function getLastResult(fn) {
  expect(fn).toHaveBeenCalled();
  expect(fn).toHaveReturned();
  const results = fn.mock.results;
  return results[results.length - 1].value;
}

export function getLastController() {
  return getLastResult(createController);
}
