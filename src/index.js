function K() {}

/**
 * All Nodes list
 */
K.n = {};

/**
 * Painted nodes
 */
K.r = [];

/**
 * JSX DOM
 * @param node 
 * @param props
 */
K.d = function(name, props) {
  return {n: name, p: props, c: K.r.slice.call(arguments, 2)};
};

/**
 * Redrawn dom
 * @param node 
 * @param component
 * @param path
 */
K.redraw = function(node, component, path) {
  K.r = [];
  K.a(node, component, path);
  var keys = Object.keys(K.n);  // nodes
  if (keys.length === K.r) return;

  keys.forEach(function(name) {
    if (K.r.indexOf(name) === -1) {
      K.n[name].remove();  // remove node
      delete K.n[name];  // 
    }
  });
};

/**
 * Each childs
 * @param node 
 * @param childs
 * @param path
 */
K.e = function(node, childs, path) {
  if (!(childs instanceof Array)) return;
  childs.forEach(function(child, i) {
    K.a(node, child, path + (!child.p || child.p.id) + i + '.');
  });
};

/** 
 * Append to dom node
 * @param node 
 * @param component
 * @param path
*/
K.a = function(node, component, path) {
  K.e(node, component, path);

  if (!K.node) { 
    K.node = node;
    K.root = component;
  }

  node = node || K.node;
  component = component || K.root;
  path = path || '0.';
  var name = component.n;
  var props = component.p;
  var childs = component.c;
    
  if (typeof component === 'boolean') return;

  K.r.push(path);

  if (typeof name === 'function') {
    return K.a(node, (new name(props, childs)).render(), path);
  }

  if (typeof component === 'string') {
    return node.innerText = component;
  }

  var ref = K.n[path] || document.createElement(name);

  if(props) {
    Object.keys(props).forEach(function(name) {
      if (ref[name] !== props[name]) ref[name] = props[name];
    });
  }

  node.appendChild(K.n[path] = ref);
  K.e(ref, childs, path);
};

K.append = K.a;
var Kek = K; // eslint-disable-line