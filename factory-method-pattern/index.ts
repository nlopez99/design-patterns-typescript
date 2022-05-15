interface LoggerT {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
  debug(message: string): void
}

class ProductionLogger implements LoggerT {
  info(_: string): void {}

  debug(_: string): void {}

  warn(message: string): void {
    console.warn(message)
  }

  error(message: string): void {
    console.error(message)
  }
}

class DevelopmentLogger implements LoggerT {
  info(message: string): void {
    console.info(message)
  }

  debug(message: string): void {
    console.debug(message)
  }

  warn(message: string): void {
    console.warn(message)
  }

  error(message: string): void {
    console.error(message)
  }
}

class LoggerFactory {
  static createLogger(): LoggerT {
    switch (process.env.NODE_ENV) {
      case 'production':
        return new ProductionLogger()
      case 'development':
        return new DevelopmentLogger()
      case 'staging':
        return new DevelopmentLogger()
      default:
        return new DevelopmentLogger()
    }
  }
}

const logger = LoggerFactory.createLogger()

export default logger
