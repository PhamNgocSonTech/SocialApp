import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyle from "./Default/GlobalStyle";
import { BrowserRouter } from "react-router-dom";
import store from "./app/store";
import { Provider } from "react-redux";
import { GoogleAuthProvider } from "./components/common/GoogleAuth/googleAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <GlobalStyle>
            <Provider store={store}>
                <GoogleAuthProvider>
                    <App />
                </GoogleAuthProvider>
            </Provider>
        </GlobalStyle>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
