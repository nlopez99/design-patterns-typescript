type Listener<EventType> = (event: EventType) => void

type Observer<EventType> = {
  subscribe: (listener: Listener<EventType>) => () => void
  publish: (event: EventType) => void
}

function createObserver<EventType>(): Observer<EventType> {
  let listeners: Listener<EventType>[] = []

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter((l) => l !== listener)
      }
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event))
    },
  }
}

interface BeforeSet<T> {
  value: T
  newValue: T
}

interface AfterSet<T> {
  value: T
}

interface DBRecord {
  id: string
}

interface Database<T extends DBRecord> {
  get(id: string): T
  set(record: T): void
  onBeforeAdd(listener: Listener<BeforeSet<T>>): () => void
  onAfterAdd(listener: Listener<AfterSet<T>>): () => void
}

class MemoryDatabase<T extends DBRecord> implements Database<T> {
  private db: Record<string, T> = {}
  private beforeAddListeners = createObserver<BeforeSet<T>>()
  private afterAddListeners = createObserver<AfterSet<T>>()

  get(id: string): T {
    return this.db[id]
  }

  set(newValue: T): void {
    this.beforeAddListeners.publish({
      newValue,
      value: this.db[newValue.id],
    })
    this.db[newValue.id] = newValue

    this.afterAddListeners.publish({
      value: newValue,
    })
  }

  onBeforeAdd(listener: Listener<BeforeSet<T>>): () => void {
    return this.beforeAddListeners.subscribe(listener)
  }

  onAfterAdd(listener: Listener<AfterSet<T>>): () => void {
    return this.afterAddListeners.subscribe(listener)
  }
}

interface Employee {
  id: string
  name: string
  jobTitle: string
}

const db = new MemoryDatabase<Employee>()

const unsubscribeFromBeforeAdd = db.onBeforeAdd(({ newValue }) => {
  console.log('before add', newValue)
})

const unsubscribeFromAfterAdd = db.onAfterAdd(({ value }) => {
  console.log('after add', value)
})

db.set({
  id: '1',
  name: 'John Doe',
  jobTitle: 'Developer',
})

unsubscribeFromBeforeAdd()
unsubscribeFromAfterAdd()

db.set({
  id: '2',
  name: 'Jane Doe',
  jobTitle: 'Developer',
})
