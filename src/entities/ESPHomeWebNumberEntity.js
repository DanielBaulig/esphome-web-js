import ESPHomeWebEntity from '../ESPHomeWebEntity'

export default class ESPHomeWebNumberEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  async set(value) {
    const query = {value};
    return this.controller.post(this.getPostURL('set'), query);
  }
}

