import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import i18n from "I18n/i18n.config";
import { I18nextProvider } from "react-i18next";
import Root from "Core/root";
import store, { history } from "Redux/store/store";

// Declared globally in order to use async await, see this issue: https://github.com/babel/babel/issues/9849
import regeneratorRuntime from "regenerator-runtime";

//process.env.API_URL = 'http://localhost:8080/graphql';

const increment = () => {
  return {
    type: 'INCREMENT'
  }
}

window.store = store;

console.log(store.getState())

store.dispatch(increment())

//process.env.API_URL = 'https://nmserver.herokuapp.com/graphql';


ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Suspense fallback="loading">
      <Root store={store} history={history}></Root>
    </Suspense>
  </I18nextProvider>,
  document.getElementById("target")
);
