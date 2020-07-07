import m from "mithril";

import { createSocket } from "./websocket";

import Errors from "./components/errors";
import Roll from "./components/roll";
import Log from "./components/log";
import Connect from "./components/connect";
import UserInfo from "./components/userinfo";

let state = {
    webSocket: null,
    user: "",
    rolls: [],
    errors: []
};

const handleConnect = ({ currentTarget: form }) => {
    createSocket(({ data }) => {
        try {
            const { success, user, notation, total, rolls } = JSON.parse(data);
            state.rolls.push({ user, notation, total, rolls });
            m.redraw();
        } catch (error) {
            console.log(error);
        }
    }, ({ target: ws }) => {
        state.webSocket = ws;
        state.user = form.elements.user.value;
        state.rolls = [];
        m.redraw();
    }, e => {
        state.webSocket = null;
        errors.push(e);
        m.redraw();
    });
}

const handleRoll = spec => {
    state.webSocket.send(JSON.stringify({user: state.user, spec}));
}

const handleDisconnected = () => {
    state.webSocket = null;
    m.redraw();
}

const root = document.createElement("div");
root.id = "app";
document.body.prepend(root);

const App = {
    view: () => {

        return m("div", [].concat(
            m(Errors, {errors: state.errors}),
            state.webSocket == null
                ? [
                    m("p", ["Please connect to server to start rolling dice."]),
                    m(Connect, {handleConnect: handleConnect})
                ]
                : [
                    m(UserInfo, {user: state.user, rolls: state.rolls.filter(r => r.user == state.user)}),
                    m(Roll, {
                        connection: state.webSocket,
                        handleRoll: handleRoll,
                        handleDisconnected: handleDisconnected
                    }),
                    m(Log, {rolls: state.rolls})
                ]
        ));
    }
}

m.mount(root, App);
