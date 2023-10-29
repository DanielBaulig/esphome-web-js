import {jest, expect, test} from '@jest/globals';
import {createController} from '../tests/helpers.js';
import ESPHomeWebEntity from '../ESPHomeWebEntity';

const type = 'some_type';
const slug = 'some_name';
const createData = jest.fn(({id = `${type}-${slug}`} = {}) => {
  return {
    id,
  }
});

function createESPHomeWebEntity({controller = createController(), data = createData()} = {}) {
  return new ESPHomeWebEntity(controller, data);
}

test('it should populate type and slug from the id', () => {
  const entity = createESPHomeWebEntity();
  expect(entity.type).toBe(type);
  expect(entity.slug).toBe(slug);

});

test('it should update it\'s data when update get\'s called', () => {
  const entity = createESPHomeWebEntity();
  const newData = {};
  entity.update(newData);
  expect(entity.data).toBe(newData);
})

test('it should emit an update event when it\'s data get\'s updated', () => {
  const entity = createESPHomeWebEntity();
  const callback = jest.fn();
  entity.addEventListener('update', callback);
  const newData = {};
  entity.update(newData);
  expect(callback).toHaveBeenCalled();
  const event = callback.mock.lastCall[0];
  expect(event).toBeDefined();
  expect(event.type).toBe('update');
  expect(event.detail).toBeDefined();
  expect(event.detail.entity).toBe(entity);
});

test('it should return a valid post url', () => {
  const entity = createESPHomeWebEntity();
  const verb = 'verb';
  expect(entity.getPostURL(verb)).toBe(`/${type}/${slug}/${verb}`);
});
