
import Entity from '../Entity';
import filterObject from '../filterObject';

export default class ClimateEntity extends Entity {
  constructor(controller, data) {
    super(controller, data);
  }

  async set({mode, target_temperature_high, target_temperature_low, target_temperature} = {}) {
    const query = filterObject({
      mode,
      target_temperature_high,
      target_temperature_low,
      target_temperature
    });

    const args = [this.getPostURL('set')];
    if (Object.values(query).length > 0) {
      args.push(query);
    }

    return this.controller.post(...args);
  }
}
