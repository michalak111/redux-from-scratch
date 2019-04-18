import React from "react";

export const StoreContext = React.createContext(null);
export class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { state: props.store.getState() }
    this.subscribtion = null;
  }

  componentDidMount() {
    const {store} = this.props
    this.subscribtion = store.subscribe(() => {
      this.setState({ state: store.getState()});
    });
  }

  componentWillUnmount() {
    this.subscribtion.unsubscribe();
  }

  render() {
    const Context = StoreContext;
    return (
      <Context.Provider value={{ ...this.props.store, ...this.state }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
