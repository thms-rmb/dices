import m from "mithril";

export default {
    view: vnode => m("form", {onsubmit: e => {
        e.preventDefault();
        vnode.attrs.handleConnect(e);
    }}, [
        m("div", [
            m("label", {for: "user"}, "Player name"),
            m("input", {type: "text", id: "user"})
        ]),
        m("div", [
            m("button", "Connect")
        ])
    ])
}
