import {jest, expect, test} from '@jest/globals';

const EventSourceMock = jest.fn(function EventSourceMock(...args) {
  return Object.assign(this, {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
});

const ResponseMock = jest.fn(function ResponseMock(body = '') {
  return Object.assign(this, {
    json: jest.fn(() => Promise.resolve(JSON.parse(body))),
    ok: true,
  });
});

function mockFetchResponse(body) {
  fetchMock.mockImplementationOnce(() => Promise.resolve(new ResponseMock(body)));
}

const fetchMock = jest.fn((...args) => {
  return Promise.resolve(new ResponseMock());
});

function mockDispatch(eventTarget, event) {
  const addEventListenerCalls = eventTarget.addEventListener.mock.calls;
  const eventListeners = addEventListenerCalls.filter(args => args[0] === event.type).map(args => args[1]);;
  eventListeners.forEach(listener => listener(event));
}

function mockConfirmConnection(controller) {
  mockDispatch(controller.eventSource, new Event('open'));
}

function mockStateMessage(controller, state) {
  mockDispatch(controller.eventSource, new MessageEvent('state', { data: JSON.stringify(state)}));
}

jest.unstable_mockModule('../fetch', () => {
  return {
    default: fetchMock,
  };
});

jest.unstable_mockModule('../EventSource', () => {
  return {
    default: EventSourceMock,
  };
});

const { default: Controller }  = await import('../Controller');

const defaultHost = 'localhost';
function createController(host = defaultHost) {
  return new Controller(host);
}

test('it should create an event source connection', () => {
  // Setup
  const controller = createController();
  const connectedCallback = jest.fn();
  controller.addEventListener('connected', connectedCallback);

  // Establish EventSource connection
  controller.connect();
  expect(EventSourceMock).toHaveBeenLastCalledWith(`http://${defaultHost}/events`);

  // Confirm and verify connection
  mockConfirmConnection(controller);
  expect(controller.connected).toBe(true);
  expect(connectedCallback).toHaveBeenCalled();
});

test('it should create entities when it discovers new entities', () => {
  const controller = createController();
  controller.connect();
  mockConfirmConnection(controller);

  const entityId = 'number-name';
  // Suppress the the debug message that receiving a state
  // message will trigger.
  jest.spyOn(console, 'debug').mockImplementation(() => {});
  mockStateMessage(controller, {
    id: entityId,
    value: 20,
    state: "20.0000",
  });
  expect(controller.entities[entityId]).toBeDefined();
  expect(controller.entities[entityId].constructor.name).toBe('NumberEntity');
});

test('it should send a post request when post is called', async () => {
  const controller = createController();
  controller.connect();
  mockConfirmConnection(controller);

  await controller.post('/type/name/verb');
  expect(fetchMock).toHaveBeenLastCalledWith(new URL(`http://${defaultHost}/type/name/verb`), { method: 'POST' });
})

test('it should send a get request and update the entity when get is called', async () => {
  const controller = createController();
  controller.connect();
  mockConfirmConnection(controller);

  const data = {id: 'type-name'};
  mockFetchResponse(JSON.stringify(data));
  // Suppress the console.warn that will get triggered for using an 
  // unknown type.
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  await controller.get('/type/name');
  expect(fetchMock).toHaveBeenLastCalledWith(new URL(`http://${defaultHost}/type/name`));
  expect(controller.entities['type-name']).toBeDefined();
  expect(controller.entities['type-name'].data).toEqual(data);
});
