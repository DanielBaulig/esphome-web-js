import ESPHomeWebEntity from '../ESPHomeWebEntity';
import filterObject from '../filterObject';

export default class ESPHomeWebLightEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  async turnOn({brightness, r, g, b, white_value, flash, transition, effect, color_temp} = {}) {
    const query = filterObject({
      brightness, r, g, b, white_value, flash, transition, effect, color_temp
    });

    return this.controller.post(this.getPostURL('turn_on'), query);
  }

  async turnOff({transition} = {}) {
    const query = filterObject({
      transition
    });
    return this.controller.post(this.getPostURL('turn_off'), query);
  }

  async toggle() {
    return this.controller.post(this.getPostURL('toggle'));
  }
}
