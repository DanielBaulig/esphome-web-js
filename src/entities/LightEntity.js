import Entity from '../Entity';
import filterObject from '../filterObject';

export default class LightEntity extends Entity {
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
