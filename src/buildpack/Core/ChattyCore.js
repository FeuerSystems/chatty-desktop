import Logger from './Logging/Logger';

export default class ChattyCore {
  constructor(config, v) {
    this.c = config;
    this.v = v;
    this.logger = new Logger(1);
  }

  build() {
    this.v.Chatty = this;
    this.v.Chatty.options = {};
    this.v.Chatty.options.experiments = this.c.allowExperiments;
    this.v.Chatty.options.developer = this.c.developer;
    this.v.Chatty.options.production = this.c.production;
  }

  addModule(name, module) {
    this.v.Chatty[name] = module;
  }

  removeModule(name) {
    this.v.Chatty[name] = module;
  }
}
