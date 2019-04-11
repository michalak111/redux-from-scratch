import React from "react";

export const StoreContext = React.createContext(null);
export class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.store.getState();
    this.subscribtion = null;
  }

  componentDidMount() {
    this.subscribtion = this.props.store.subscribe(store => {
      this.setState({ store: store });
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
