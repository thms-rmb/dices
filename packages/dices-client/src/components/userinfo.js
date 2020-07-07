import m from "mithril";

export default {
    view: vnode => m("div", [
        `User: ${vnode.attrs.user}`,
        vnode.attrs.rolls.length > 0
            ? `, last roll total was ${vnode.attrs.rolls[vnode.attrs.rolls.length - 1].total}.`
            : ``
    ])
}
