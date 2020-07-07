import m from "mithril";

export default {
    view: vnode => (
        m("ul", vnode.attrs.rolls.map(r => (
            m("li", [
                m("strong", [r.user]),
                `: `,
                `Rolled ${r.notation} and got ${JSON.stringify(r.rolls)} = ${r.total}`
            ])
        )))
    )
}
