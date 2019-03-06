import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Store {
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

  getDispatch() {
    console.log(this);
    return this.dispatch;
  }
}

const reducer = (state, action) => {
  if (action.type === "RANDOM") {
    return {
      ...state,
      user: {
        ...state.user,
        name: `User - ${(Math.random() * 1000).toFixed(0)}`
      }
    };
  }
  return state;
};

const initialState = {
  user: {
    name: "User - 0123"
  }
};

const store = new Store(reducer, initialState);

const StoreContext = React.createContext(null);

class StoreProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.store.getState();
    this.subscribtion = null;
  }

  componentDidMount() {
    this.subscribtion = store.subscribe(store => {
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

const connect = (
  mapStateToProps = (state, props) => {},
  mapDispatchToProps = dispatch => {}
) => {
  return WrappedComponent => {
    return class extends React.Component {
      render() {
        const Context = StoreContext;
        return (
          <Context.Consumer>
            {({ state, dispatch }) => {
              const mappedState = mapStateToProps(state, this.props);
              const mappedDispatch = mapDispatchToProps(dispatch);
              return (
                <WrappedComponent
                  {...this.props}
                  {...mappedState}
                  {...mappedDispatch}
                />
              );
            }}
          </Context.Consumer>
        );
      }
    };
  };
};

const TestConnect = ({ test, name, random }) => {
  return (
    <div>
      <b>
        {test} {name}
      </b>
      <br />
      <button onClick={random}>Random2</button>
    </div>
  );
};

const WithHOC = connect(
  (state, props) => {
    return {
      name: state.user.name
    };
  },
  dispatch => {
    return {
      random: () => dispatch({ type: "RANDOM" })
    };
  }
)(TestConnect);

function App() {
  return (
    <div className="App">
      <StoreProvider store={store}>
        <button
          onClick={() => {
            store.dispatch({ type: "RANDOM" });
          }}
        >
          Randomize
        </button>
        <br />
        <br />
        <WithHOC test={"This is"} />
      </StoreProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
