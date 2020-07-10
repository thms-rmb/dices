import m from "mithril";

const State = () => ({
    user: "User",
    notation: "",
    connection: null,
    results: [],
    errors: []
});

const Actions = state => ({
    clearResults: () => state.results = [],
    clearErrors: () => state.errors = []
});

const state = State();
const actions = Actions(state);

const onClose = () => {
    state.connection = null;
    m.redraw();
}

const onError = event => {
    state.errors.push(event);
    m.redraw();
}

const onMessage = ({ data }) => {
    try {
        const result = JSON.parse(data);
        state.results.push(result);
        m.redraw();
    } catch (error) {
        console.log(error);
    }
}

const connect = event => {
    const loc = window.location;
    const protocol = loc.protocol === "https:"
        ? "wss:"
        : "ws";

    state.connection = new WebSocket(`${protocol}://${loc.host}`);
    state.connection.onclose = onClose;
    state.connection.onerror = onError;
    state.connection.onmessage = onMessage;
}

const roll = () => {
    const payload = JSON.stringify({ user: state.user, notation: state.notation });
    state.connection.send(payload);
}

const App = {
    view: () => (
        m("div", [
            state.connection == null
                ? m("form.connect", {onsubmit: e => e.preventDefault(), key: 0}, [
                    m("input", {
                        type: "text",
                        name: "user",
                        placeholder: "User",
                        "aria-label": "User",
                        oninput: e => state.user = e.target.value
                    }),
                    m("button", {onclick: connect}, ["Connect"])
                ])
                : m("form.board", {onsubmit: e => e.preventDefault(), key: 1}, [
                    m("input", {
                        type: "text",
                        name: "notation",
                        placeholder: "Dice notation",
                        "aria-label": "Dice notation",
                        oninput: e => state.notation = e.target.value
                    }),
                    m("button", {onclick: roll}, ["Roll"])
                ]),
            m("div.results", {key: 2}, state.results.map(result => (
                m("div.result", [
                    m("div.user", [result.user]),
                    m("div.notation", [result.notation]),
                    m("div.rolls", [JSON.stringify(result.rolls[0].rolls.map(r => r.value))]),
                    m("div.total", [result.total])
                ])
            )))
        ])
    )
}

const root = document.createElement("div");
root.id = "app";
document.body.prepend(root);

m.mount(root, App);
