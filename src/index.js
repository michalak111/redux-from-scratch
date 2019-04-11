import React from "react";
import ReactDOM from "react-dom";
import { connect } from "./store/connect";
import { Store } from "./store";
import { StoreProvider } from "./store/provider";
import "./styles.css";

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

const TestConnect = ({ test, name, random }) => {
  return (
    <div>
      <b>
        {test} {name}
      </b>
      <br />
      <br />
      <button onClick={random}>[Random] dispatch from connect</button>
    </div>
  );
};

const WithConnect = connect(
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
          [Random] dispatch directly to store
        </button>
        <br />
        <br />
        <WithConnect test={"This is"} />
      </StoreProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
