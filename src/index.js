/* @jsx Kek.d */

function Kek() {}
Kek.nodes = {};
Kek.rNodes = [];

Kek.d = function(name, props) {
    return {n: name, p: props, c: Array.prototype.slice.call(arguments, 2)};
}

Kek.redraw = function(node, component, path) {
    Kek.rNodes = [];
    Kek.append(node, component, path);
    var keys = Object.keys(Kek.nodes);
    if (keys.length === Kek.rNodes) return;

    keys.forEach(function(name) {
        if (Kek.rNodes.indexOf(name) === -1) {
            Kek.nodes[name].remove();
            delete Kek.nodes[name];
        }
    })
}
Kek._each = function(node, childs, path) {
    if (!(childs instanceof Array)) return;
    childs.forEach(function(child, i) {
        Kek.append(node, child, path + i + '.');
    });
}
Kek.append = function(node, component, path) {
    Kek._each(node, component, path);

    if (!Kek.node) {
        Kek.node = node;
        Kek.root = component;
    }

    node = node || Kek.node;
    component = component || Kek.root;
    path = path || '0.';
    var name = component.n;
    var props = component.p;
    var childs = component.c;
    
    if (typeof component === 'boolean') return;

    Kek.rNodes.push(path);

    if (typeof name === 'function') {
        return Kek.append(node, (new name(props, childs)).render(), path);
    }

    if (typeof component === 'string') {
        return node.innerText = component;
    }

    var ref = Kek.nodes[path] || document.createElement(name);

    if(props) {
        Object.keys(props).forEach(function(name) {
            if (ref[name] !== props[name]) ref[name] = props[name];
        });
    }

    node.appendChild(Kek.nodes[path] = ref);
    Kek._each(ref, childs, path);
}