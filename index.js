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
        `the specified rerenderer which key is ${key} does not exist; ignored.`
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
        `the specified rerenderer which key is ${key} does not exist; ignored.`
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
  const { key, effect } = args ?? {};

  // const [, setState] = React.useState(true);
  // function rerender() {
  //   setState((e) => !e);
  // }
  const rerender = useRerender();

  React.useEffect(() => {
    let effectResult = undefined;
    if (typeof setup === "function") {
      try {
        effectResult = effect(rerender);
      } catch (e) {
        console.error(e);
      }
    }
    if (key !== undefined) {
      cmap.addRerenders(key, rerender);
    }
    return () => {
      if (typeof effectResult === "function") {
        try {
          effectResult(rerender);
        } catch (e) {
          console.error(e);
        }
      }
      if (key !== undefined) {
        cmap.deleteRerenders(key, rerender);
      }
    };
  });
  return () => {
    fireRerenderers(instance, key);
  };
}

export function fireRerenderers(instance, key) {
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
export const GLOBAL_INSTANCE = {};
const GLOBAL_INSTANCE_FACTORY = () => GLOBAL_INSTANCE;
function useInstanceDefinition(factory) {
  const rerender = useRerender();
  factory = factory ?? GLOBAL_INSTANCE_FACTORY;
  // if ( typeof factory !== 'function' ) {
  //   const defaultValue = factory;
  //   objectFactory = ()=>defaultValue;
  // }
  const ref = React.useRef(null);
  if (ref.current === null) {
    const instance = factory();
    ref.current = instance;

    if ( ('then' in instance) && (typeof instance.then === 'function') ) {
      (async()=>{
        ref.current = await instance;
        rerender();
      })();
    }
  }
  return ref.current;
}

const instanceContext = React.createContext(GLOBAL_INSTANCE);

export function useInstance() {
  const result = React.useContext(instanceContext);
  if ( result === GLOBAL_INSTANCE ) {
    console.warn( 'the current context is global' );
  }
  return result;
}
export function InstanceProvider({ factory, children }) {
  const instanceDefinition = useInstanceDefinition(factory);
  /*
   * return (
   *   <persistentObjectContext.Provider value={persistentObject}>
   *     {children}
   *   </persistentObjectContext.Provider>
   * );
   */
  return React.createElement(instanceContext.Provider, {
    value: instanceDefinition,
    children
  });
}

/*
 *
 * Layer 4
 *
 */
export function useGet(key) {
  const instance = useInstance();
  /* const rerender = */ useRerenderer(key);
  return instance[key];
}

export function useSet(key) {
  const instance = useInstance();
  const rerender = useRerenderer(key);
  return function writer(value) {
    instance[key] = value;
    rerender();
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
export function useNewTransmitter( key, value ) {
  if ( key === null || key === undefined ) {
    throw new ReferenceError( 'the parameter key was not specified' );
  }
  const scope = useInstance();
  React.useEffect(()=>{
    scope[ key ] = value;
    return ()=>{
      scope[ key ] = null;
    };
  });
  return scope;
}

export function getTransmitter( scope, key ) {
  if ( scope === null || scope === undefined ) {
    throw new ReferenceError( 'the parameter scope was not specified' );
  }
  if ( key === null || key === undefined ) {
    throw new ReferenceError( 'the parameter key was not specified' );
  }
  return scope[ key ] ?? null;
}

export function useTransmitter( key ) {
  const scope = useInstance();
  return getTransmitter( scope, key );
}

