// @ts-nocheck
import React from "react";

/*
 *
 * Layer 0
 *
 */
class CollectionMap {
  rerenderMap = new Map();
  getRerenders(key) {
    if (this.rerenderMap.has(key)) {
      return this.rerenderMap.get(key);
    } else {
      const set = new Set();
      this.rerenderMap.set(key, set);
      return set;
    }
  }

  addRerenders(key, item) {
    this.getRerenders(key).add(item);
  }
  deleteRerenders(key, item) {
    this.getRerenders(key).delete(item);
  }
  peekRerenders(key) {
    if (this.rerenderMap.has(key)) {
      return this.rerenderMap.get(key);
    } else {
      console.warn(
        "the specified rerenderer of which key is '" +
          (key ?? "null").toString() +
          "' does not exist; ignored."
      );
      return undefined;
    }
  }

  dependerMap = new Map();
  getDependers(key) {
    if (this.dependerMap.has(key)) {
      return this.dependerMap.get(key);
    } else {
      const set = new Set();
      this.dependerMap.set(key, set);
      return set;
    }
  }

  addDependers(key, item) {
    this.getDependers(key).add(item);
  }
  deleteDependers(key, item) {
    this.getDependers(key).delete(item);
  }
  peekDependers(key) {
    if (this.dependerMap.has(key)) {
      return this.dependerMap.get(key);
    } else {
      console.warn(
        "the specified rerenderer which key is '" +
          key +
          "' does not exist; ignored."
      );
      return undefined;
    }
  }
}

/*
 *
 * Layer 1
 *
 */
class CollectionMapMap {
  mapMap = new Map();
  getMap(key) {
    if (this.mapMap.has(key)) {
      return this.mapMap.get(key);
    } else {
      const collectionMap = new CollectionMap();
      this.mapMap.set(key, collectionMap);
      return collectionMap;
    }
  }
}

/*
 *
 * Layer 1.5
 *
 */

export function useRerender() {
  const [, setState] = React.useState(true);
  function rerender() {
    setState((e) => !e);
  }
  return rerender;
}

/*
 *
 * Layer 2
 *
 */
const mapMap = new CollectionMapMap();
// const cmap = new CollectionMap();
export function useRerenderer(args = { key: null }) {
  const instance = useInstance();
  const cmap = mapMap.getMap(instance);
  if (typeof args === "string") {
    args = { key: args };
  }
  const { key } = args ?? {};
  const rerender = useRerender();
  React.useEffect(() => {
    if (key !== undefined) {
      cmap.addRerenders(key, rerender);
    }
    return () => {
      if (key !== undefined) {
        cmap.deleteRerenders(key, rerender);
      }
    };
  });
  return () => {
    fireRerenderers(instance, key);
  };
}

export function fireRerenderers(...args) {
  const instance =
    (args.length < 2 ? GLOBAL_INSTANCE : args[0]) ??
    (() => {
      throw new TypeError("instance is not specified");
    })();
  const key =
    (args.length < 2 ? args[0] : args[1]) ??
    (() => {
      throw new TypeError("key is not specified");
    })();

  const cmap = mapMap.getMap(instance);
  const collection = cmap.peekRerenders(key);
  if (collection !== undefined) {
    for (const rerender of collection) {
      try {
        rerender();
      } catch (e) {
        console.warn("the rerender throws an error", e);
      }
    }
  }
}

/*
 *
 * Layer 3
 *
 */

function __executeUpdate(update, instance, state) {
  update = update ?? (() => null);
  try {
    update(instance, state);
  } catch (e) {
    console.error(
      "useInstanceDefinition",
      "specified `update` function threw an error; ignored.",
      e
    );
  }
}

export const GLOBAL_INSTANCE = { ID: "GLOBAL_INSTANCE" };
const GLOBAL_INSTANCE_FACTORY = () => GLOBAL_INSTANCE;

function useInstanceDefinition(factory, update) {
  const rerender = useRerender();
  factory = factory ?? GLOBAL_INSTANCE_FACTORY;
  const ref = React.useRef(null);

  if (ref.current === null) {
    const instance = factory();
    ref.current = null;
    if (("then" in instance ) && (typeof instance.then === "function")) {
      (async () => {
        ref.current = await instance;
        __executeUpdate(update, ref.current, "new");
        rerender();
      })();
    } else {
      ref.current = instance;
      __executeUpdate(update, ref.current, "new");
    }
  } else {
    __executeUpdate(update, ref.current, "update");
  }
  return ref.current;
}

const instanceContext = React.createContext(GLOBAL_INSTANCE);

export function useInstance() {
  const result = React.useContext(instanceContext);
  if (result === GLOBAL_INSTANCE) {
    console.warn("useInstance() returns GLOBAL_INSTANCE.");
  }
  return result;
}

export function InstanceProvider({ factory, update, children }) {
  const instanceDefinition = useInstanceDefinition(factory, update);
  if (!Array.isArray(children)) {
    children = [children];
  }
  /*
   * return (
   *   <persistentObjectContext.Provider value={persistentObject}>
   *     {children}
   *   </persistentObjectContext.Provider>
   * );
   */
  return React.createElement(instanceContext.Provider, {
    value: instanceDefinition,
    children: [...(Array.isArray(children) ? children : [children])]
  });
}

/*
 *
 * Layer 4
 *
 */
export function useInstanceValue(key) {
  const instance = useInstance();
  /* const rerender = */ useRerenderer(key);
  return instance[key];
}

export function useInstanceValueSetter(key) {
  const instance = useInstance();
  return function setter(f) {
    if (typeof f !== "function") {
      throw new TypeError("value is not a function");
    }
    instance[key] = f(instance[key]);
    fireRerenderers(instance, key);
  };
}

/*
 *
 * Layer 5
 *
 */
/*
  The Most Critical Problem of Lifting Up and Drilling Down in React.js
  Thu, 17 Aug 2023 12:00:29 +0900

  +-[node]
       + ? hook
       +-[node]
            + / hook
            +-[node]
*/
function setTransmitter(scope, key, value) {
  if (key === null || key === undefined) {
    throw new ReferenceError("the parameter key was not specified");
  }
  if (scope === null || scope === undefined) {
    throw new ReferenceError("the parameter scope was not specified");
  }
  if (typeof scope !== "object") {
    throw new ReferenceError("scope must be an object");
  }
  scope[key] = value;
  return;
}

function getTransmitter(scope, key) {
  if (key === null || key === undefined) {
    throw new ReferenceError("the parameter key was not specified");
  }
  if (scope === null || scope === undefined) {
    throw new ReferenceError("the parameter scope was not specified");
  }
  if (typeof scope !== "object") {
    throw new ReferenceError("scope must be an object");
  }
  return scope[key] ?? null;
}

export function useNewTransmitter(key, value) {
  if (key === null || key === undefined) {
    throw new ReferenceError("the parameter key was not specified");
  }
  const scope = useInstance();
  setTransmitter(scope, key, value);
}

export function useTransmitter(key) {
  /* const rerenderer = */ useRerenderer(key);
  const scope = useInstance();
  return getTransmitter(scope, key);
}

/*
 *
 */

export function useNewSharedState( key, initializer, dependency ) {
  const value = React.useMemo( initializer, dependency );
  const scope = useInstance();
  setTransmitter( scope, key , value );

  return value;
}

export function useSharedState(key) {
  /* const rerenderer = */ useRerenderer(key);
  const scope = useInstance();
  return getTransmitter(scope, key);
}

