class ESPHomeWebEntity {
  constructor(controller, data) {
    this.controller = controller;
    this.id = data.id;
    this.data = data;
  }

  update(data) {
    this.data = data;
  }

  getPostURL(action) {
    const [type, id] = this.id.split('-');
    return `/${type}/${id}/${action}`;
  }
}

function createESPHomeWebEntity(controller, data) {
  const [type,] = data.id.split('-');
  if (!type) {
    throw new Error(`Cant determine entity type from ${data.id}`);
  }

  switch (type) {
    case 'light':
      return new ESPHomeWebLightEntity(controller, data);
    default:
      console.warn(`Unknown entity type ${type}. Creating untyped entity for id ${data.id}`);
      return new ESPHomeWebEntity(controller, data);
  }

}

function filterObject(o) {
  return Object.fromEntries(
    Object.entries(o).filter(
      ([k, v]) => v !== undefined
    )
  );
}

class ESPHomeWebLightEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  turnOn({brightness, r, g, b, white_value, flash, transition, effect, color_temp} = {}) {
    const query = filterObject({
      brightness, r, g, b, white_value, flash, transition, effect, color_temp
    });

    this.controller.post(this.getPostURL('turn_on'), query);
  }

  turnOff({transition} = {}) {
    const query = filterObject({
      transition
    });
    this.controller.post(this.getPostURL('turn_off'), query);
  }

  toggle() {
    this.controller.post(this.getPostURL('toggle'));
  }
}

class ESPHomeWebEntityUpdateEvent extends CustomEvent {
  constructor(entity) {
    super('entityupdate', {detail: {entity}});
  }
}

class ESPHomeWebController extends EventTarget {
  connected = false;
  data = {};
  onentityupdate = null;

  constructor(host) {
    super();
    this.host = host;
    this.entities = {};
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

  post(path, query) {
    if (!this.connected) {
      throw new Error('ESPHomeWebController not connected. Please establish a connection first');
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

export default ESPHomeWebController;
