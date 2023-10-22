import EventSource from './EventSource';
import createESPHomeWebEntity from './entities/createESPHomeWebEntity'

export class ESPHomeWebEntityUpdateEvent extends CustomEvent {
  constructor(entity) {
    super('entityupdate', {detail: {entity}});
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
      throw new Error('ESPHomeWebController not connected. Please establish a connection first.');
    }

    const url = new URL(path, `http://${this.host}`);
    url.search = new URLSearchParams(query).toString();

    return fetch(url, { method: 'POST' });
  }

  _updateEntity(data) {
    const entity = data.id;
    if (entity in this.entities) {
      this.entities[entity].update(data);
    } else {
      this.entities[entity] = createESPHomeWebEntity(this, data);
    }
    const event = new ESPHomeWebEntityUpdateEvent(this.entities[entity]);
    this.dispatchEvent(event);
  }

  _onEventSourceConnected = (event) => {
    this.connecting = false;
    this.connected = true;
    this.dispatchEvent(new Event('connected'));
  }

  _onEventSourceStateMessage = (event) => {
    console.debug(`EventSource Message: ${event.data}`);
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
    console.info(`Disconnected from ${this.host}`);
  }

  destroy() {
    this.disconnect();
  }
}
