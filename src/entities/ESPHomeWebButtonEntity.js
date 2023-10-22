import ESPHomeWebEntity from '../ESPHomeWebEntity'

export default class ESPHomeWebButtonEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  async press() {
    return this.controller.post(this.getPostURL('press'));
  }
}
