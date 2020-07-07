import m from "mithril";

export default {
    view: vnode => {
        if ([2,3].includes(vnode.attrs.connection.readyState)) {
            return vnode.attrs.handleDisconnected()
        }
        return m("form", {onsubmit: e => {
            e.preventDefault();
            vnode.attrs.handleRoll(
                e.currentTarget.elements.diceSpec.value
            );
        }}, [
            m("div", [
                m("label", {for: "diceSpec"}, "Dice spec"),
                m("input", {
                    type: "text",
                    id: "diceSpec"
                })
            ]),
            m("div", [
                m("button", "Submit")
            ])
        ])
    }
}
