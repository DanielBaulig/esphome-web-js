
import ESPHomeWebEntity from '../ESPHomeWebEntity'

export default class ESPHomeWebButtonEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  async set(option) {
    const query = { option };
    return this.controller.post(this.getPostURL('set'), query);
  }
}
