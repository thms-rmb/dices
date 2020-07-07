import m from "mithril";

export default {
    view: vnode => {
        return m("ul", vnode.attrs.errors.map(error => {
            return m("li", String(error))
        }));
    }
}
