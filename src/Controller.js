import EventSource from './EventSource';
import fetch from './fetch';
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

  constructor(host) {
    super();
    this.host = host;
  }

  connect() {
    if (this.connected || this.connecting) {
      return;
    }
    const eventSource = new EventSource(`http://${this.host}/events`);
    eventSource.addEventListener("state", this._onEventSourceStateMessage);
    eventSource.addEventListener("open", this._onEventSourceConnected);
    this.eventSource = eventSource;
    this.connecting = true;
  }

  async post(path, query) {
    if (!this.connected) {
      throw new Error('Controller not connected. Please establish a connection first.');
    }

    const url = new URL(path, `http://${this.host}`);
    url.search = new URLSearchParams(query).toString();

    return fetch(url, { method: 'POST' });
  }

  async get(path) {
    const url = new URL(path, `http://${this.host}`);

    const response = await fetch(url);
    if (!response.ok) {
      return response;
    }

    const json = await response.json();
    this._updateEntity(json);

    return response;
  }

  _updateEntity(data) {
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

  _onEventSourceConnected = (event) => {
    this.connecting = false;
    this.connected = true;
    this.dispatchEvent(new Event('connected'));
  }

  _onEventSourceStateMessage = (event) => {
    const json = JSON.parse(event.data);
    this._updateEntity(json);
  }

  disconnect() {
    if (!this.connected && !this.connecting) {
      return;
    }
    const eventSource = this.eventSource;
    eventSource.removeEventListener("state", this._onEventSourceStateMessage);
    eventSource.close();
    this.eventSource = null;
    this.connected = false;
    this.connecting = false;
  }

  destroy() {
    this.disconnect();
  }
}
