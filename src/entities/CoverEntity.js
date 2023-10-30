import Entity from '../Entity';
import filterObject from '../filterObject';

export default class CoverEntity extends Entity {
  constructor(controller, data) {
    super(controller, data);
  }

  async set({position, tilt} = {}) {
    const query = filterObject({
      position,
      tilt,
    });

    const args = [this.getPostURL('set')];
    if (Object.values(query).length > 0) {
      args.push(query);
    }

    return this.controller.post(...args);
  }

  async stop() {
    return this.controller.post(this.getPostURL('stop'));
  }

  async open() {
    return this.controller.post(this.getPostURL('open'));
  }
  
  async close() {
    return this.controller.post(this.getPostURL('close'));
  }
}
