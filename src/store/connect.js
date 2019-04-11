import React from "react";
import { StoreContext } from "./provider";

export const connect = (
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
