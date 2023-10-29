import ESPHomeWebEntity from '../ESPHomeWebEntity';
import filterObject from '../filterObject';

export default class ESPHomeFanEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  async turnOn({speed_level, oscillation} = {}) {
    const query = filterObject({
      speed_level,
      oscillation
    });

    const args = [this.getPostURL('turn_on')];
    if (Object.values(query).length > 0) {
      args.push(query);
    }

    return this.controller.post(...args);
  }

  async turnOff() {
    return this.controller.post(this.getPostURL('turn_off'));
  }

  async toggle() {
    return this.controller.post(this.getPostURL('toggle'));
  }
}
