export default class Logger {
  constructor(level) {
    this.level = level;
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      WARNING: 2,
      ERROR: 3,
    };
  }

  debug(msg) {
    if (this.level < this.levels.INFO) {
      console.log(msg.msg, msg.data);
    }
  }

  info(msg) {
    if (this.level < this.levels.WARNING) {
      console.log(msg.msg, msg.data);
    }
  }

  warning(msg) {
    if (this.level < this.levels.ERROR) {
      console.log(msg.msg, msg.data);
    }
  }

  error(msg) {
    if (this.level < 4) {
      console.log(msg.msg, msg.data);
    }
  }
}
