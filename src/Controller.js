import createEntity from './entities/createEntity'

export class EntityUpdateEvent extends CustomEvent {
  constructor(entity) {
    super('entityupdate', {detail: {entity}});
  }
}

export class EntityDiscoveredEvent extends CustomEvent {
  constructor(entity) {
    super('entitydiscovered', {detail: {entity}});
  }
}

export default class Controller extends EventTarget {
  connected = false;
  entities = {};
  #EventSource;
  #fetch;

  constructor(host, {EventSource, fetch} = {}) {
    super();
    this.host = host;
    this.#EventSource = EventSource || globalThis.EventSource;
    this.#fetch = fetch || globalThis.fetch;
  }

  connect() {
    if (this.connected || this.connecting) {
      return;
    }
    const eventSource = new this.#EventSource(`http://${this.host}/events`);
    eventSource.addEventListener("log", this.#onEventSourceLogMessage);
    eventSource.addEventListener("ping", this.#onEventSourcePingMessage);
    eventSource.addEventListener("state", this.#onEventSourceStateMessage);
    eventSource.addEventListener("open", this.#onEventSourceConnected);
    eventSource.addEventListener("error", this.#onEventSourceError);
    this.eventSource = eventSource;
    this.connecting = true;
  }

  async post(path, query) {
    if (!this.connected) {
      throw new Error('Controller not connected. Please establish a connection first.');
    }

    const url = new URL(path, `http://${this.host}`);
    url.search = new URLSearchParams(query).toString();

    return this.#fetch.call(undefined, url, { method: 'POST' });
  }

  async get(path) {
    const url = new URL(path, `http://${this.host}`);

    const response = await this.#fetch.call(undefined, url);
    if (!response.ok) {
      return response;
    }

    const json = await response.json();
    this.#updateEntity(json);

    return response;
  }

  #updateEntity(data) {
    const entity = data.id;
    let event = null;
    if (entity in this.entities) {
      this.entities[entity].update(data);
      event = new EntityUpdateEvent(this.entities[entity]);
    } else {
      this.entities[entity] = createEntity(this, data);
      event = new EntityDiscoveredEvent(this.entities[entity]);
    }
    this.dispatchEvent(event);
  }

  #onEventSourceConnected = (event) => {
    this.connecting = false;
    this.connected = true;
    this.dispatchEvent(new Event('connected'));
  }

  #onEventSourceStateMessage = (event) => {
    const json = JSON.parse(event.data);
    this.#updateEntity(json);
  }

  #onEventSourcePingMessage = (event) => {
    this.dispatchEvent(new CustomEvent('ping', { detail: { data: event.data } }));
  }

  #onEventSourceLogMessage = (event) => {
    this.dispatchEvent(new CustomEvent('log', { detail: { data: event.data } }));
  }

  #onEventSourceError = (event) => {
    this.disconnect();
    this.dispatchEvent(new Event('error'));
  }

  disconnect() {
    if (!this.connected && !this.connecting) {
      return;
    }
    const eventSource = this.eventSource;
    eventSource.removeEventListener("ping", this.#onEventSourcePingMessage);
    eventSource.removeEventListener("log", this.#onEventSourceLogMessage);
    eventSource.removeEventListener("state", this.#onEventSourceStateMessage);
    eventSource.removeEventListener("open", this.#onEventSourceConnected);
    eventSource.removeEventListener("error", this.#onEventSourceError);
    eventSource.close();
    this.eventSource = null;
    this.connected = false;
    this.connecting = false;
  }

  destroy() {
    this.disconnect();
  }
}
