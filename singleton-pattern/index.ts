interface DBRecord {
  id: string;
}

interface Database<T extends DBRecord> {
  get(id: string): T;
  set(record: T): void;
}

class MemoryDatabase<T extends DBRecord> implements Database<T> {

  static instance: MemoryDatabase<DBRecord>;

  private constructor() {}

  static getInstance(): MemoryDatabase<DBRecord> {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }
    return MemoryDatabase.instance;
  }

  private db: Record<string, T> = {};

  get(id: string): T {
    return this.db[id];
  }

  set(value: T): void {
    this.db[value.id] = value;
  }
}

const db = MemoryDatabase.getInstance();

export default db