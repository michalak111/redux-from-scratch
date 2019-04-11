export class Store {
  constructor(reducer, initialState) {
    this.state = initialState || {};
    this.reducer = reducer;
    this.listeners = [];
    this.dispatch = this.dispatch.bind(this);
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter(el => el !== fn);
      }
    };
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.propagateState();
  }

  propagateState() {
    this.listeners.map(fn => fn());
  }

  getState() {
    return this.state;
  }
}
