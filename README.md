 🌈 React-Rerenderers.js
======================
**React-Rerenderers** is a new state management library.
This is a quite unusual and yet efficient usage of React.js'
hooks which offers a way to escape from React's hells hell.

 👺 Features
---------------
- No more [useState() Hell][usestate-hell]
- No more [Prop Drilling][prop-drilling] Hell
- No more [Lifting-State-Up][lifting-state-up] Hell
- No more [Context-Provider Hell][context-provider-hell]
- No more [Redux State Hell][redux-state-hell]
- No more [Redux][redux]
- No more [Encapsulation Hell][encapsulation-hell]
- No more [Infinite Rendering Loop][inf-rendering-loop] Hell
- No more [Stale Closure Problem][stale-closure-problem]
- No more [Batch Update Problem][batch-update-problem]
- No more fussy tricks to manage rendering triggers indirect way
- Zero dependent

[usestate-hell]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+state+hell
[prop-drilling]: https://react.dev/learn/passing-data-deeply-with-context
[lifting-state-up]: https://react.dev/learn/sharing-state-between-components
[context-provider-hell]: https://www.google.com/search?gl=us&hl=en&q=react+context+provider+hell
[redux-state-hell]: https://www.google.com/search?gl=us&hl=en&q=redux-state-hell
[redux]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=redux
[inf-rendering-loop]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+infinite+rendering
[encapsulation-hell]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=encapsulation+hell
[stale-closure-problem]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+stale+closure+problem
[batch-update-problem]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+state+batch+update+problem

 🪐 The Design Goal of **React-Rerenderers.js**
--------------------
- Control when to rerender manually and precisely.
- Offer a way to manage **React.js** states without other frameworks.
- Centralize logic as Model-View Controller.
- Modularize not only components but also dialogs.

 🗽 The Things You Can Achieve with `React-Rerenderers` 🌈
===========================================================

 🍎 1. Eliminate State Lifting and Prop Drilling
---------------------------------------------------------

### ✨ React Development with the traditional `useState()`

Assume you are creating a simple application as follows:

[Example No.0](https://codesandbox.io/s/rerenderers-example-no-00-without-react-rerenderers-6d5hnh?file=/src/AppView.js)
```jsx
import React from "react";

export const AppView = () => {
  const [counter, setCounter] = React.useState(0); // << See this
  return (
    <div id="main-frame">
      <div
        id="main-object"
        className={`square${counter}`}
        onClick={(e) => setCounter((counter) => (counter + 1) % 4)}
      >
        <div>{counter}</div>
      </div>
      <div id="main-message">Click the Square</div>
    </div>
  );
};
```

In this demo, every time you click on the square where its ID is `main-object`, its CSS class
will be set to `square0`, `square1`, `square2` and `square3` respectively.  As
the CSS class goes, the square moves around the screen to top-left, top-right,
bottom-right and bottom-left, respectively.

In **React-Rerenderers**, we implement the same logic in the following manner:

### ✨ React Development With `React-Rerenderers`'s Value Accessors ### 

[Example No.1](https://codesandbox.io/s/rerenderers-example-no-01-a-basic-usage-nkvvjs?file=/src/AppView.js)

```jsx
import * as Rerenderers from "./react-rerenderers";

export const AppView = () => {
  const counter = Rerenderers.useInstanceValue("counter"); // << See this
  const setCount = Rerenderers.useInstanceValueSetter("counter"); // << See this
  return (
    <div id="main-frame">
      <div
        id="main-object"
        className={`square${counter}`}
        onClick={() => setCount((count) => count + 1)}
      >
        <div>{counter}</div>
      </div>
      <div id="main-message">Click the Square</div>
    </div>
  );
};
```

In the example above, it uses `useInstanceValue()` hook and
`useInstanceValueSetter()` hook. Note that they have some similarities with
`useState()`.  While `useState()` returns the current state value and its
setter function, `useInstanceValue()` returns only the current state value and
`useInstanceValueSetter()` returns only its setter.

You might notice that their functionalities are identical; while
**React-Rerenderers** offers separated hook functions for each functionality of
getting the current state and setting the new state, `useState()` offers both
functionalities at one go.

This small difference gives some advantages which `useState()` cannot achieve.

Before we go inside the description of the advantages, let's review the necessity of lifting states of `useState()` hook.

### ✨ Necessity of Lifting States with React Hooks

See the example below:

[Example No.2](https://codesandbox.io/s/rerenderers-example-no-02-modifying-a-vaue-from-a-remote-location-with-usestate-lm5yhm?file=/src/AppView.js)

I moved the click handler to a remote location which is defined in a different file.

Note that with the traditional `useState()` hook, you have to
[Lifting Up][lifting-state-up] the `useState()` hook and then you have to
[Drilling Properties][prop-drilling] as following:

```jsx
import React from "react";
import { AppButton } from "./AppButton.js";
import { AppSquare } from "./AppSquare.js";

export const AppView = () => {
  const [counter, setCounter] = React.useState(0); // << See this
  return (
    <div id="main-frame">
      <AppSquare counter={counter} />
      <AppButton setCounter={setCounter} />
    </div>
  );
};
```

```jsx
export function AppButton({ setCounter }) {
  return (
    <button
      id="main-message"
      onClick={() => setCounter((count) => (count + 1) % 4)}
    >
      Click Me
    </button>
  );
}
```

```jsx
export function AppSquare({ counter }) {
  return (
    <div id="main-object" className={`square${counter}`}>
      <div>{counter}</div>
    </div>
  );
}
```

Even though it does not seem to cause serious issues, it does cause some
serious issues when it comes to a larger project.

- As the number of pages increases, it is usually getting more difficult to
  modularize your logic when you have to shift up or down those state functions
  or objects. It requires more complicated works and finally it is going to be
  impossible to achieve.
- As a state is lifted up, the more components are likely to be rerendered when
  the hook is called. This causes slowing down the rerendering process.
- Components with animation should usually not be rerendered. Unexpected
  rerendering causes components to stop their animation.

**React-Rerenderers.js** can eliminate these [Lifting Up][lifting-state-up]
and [Drilling Properties][prop-drilling] necessity.

### ✨ How **React-Rerenderers** Eliminate the State Lifting ###

See the following example:

[Example No.3](https://codesandbox.io/s/rerenderers-example-no-03-modifying-a-vaue-from-a-remote-location-cc8rdd?file=/src/AppView.js)

```jsx
import { AppButton } from "./AppButton.js";
import { AppSquare } from "./AppSquare.js";

export const AppView = () => {
  // It is not necessary to call `useState()` in
  // the root of the virtual DOM tree.
  // const [counter, setCounter] = React.useState(0);
  return (
    <div id="main-frame">
      <AppSquare />
      <AppButton />
    </div>
  );
};
```

```jsx
import * as Rerenderers from "./react-rerenderers";

export function AppSquare() {
  const counter = Rerenderers.useInstanceValue("counter"); // << See this
  return (
    <div id="main-object" className={`square${counter}`}>
      <div>{counter}</div>
    </div>
  );
}
```

```jsx
import * as Rerenderers from "./react-rerenderers";

export function AppButton() {
  const setCount = Rerenderers.useInstanceValueSetter("counter"); // << See this
  return (
    <button id="main-message" onClick={() => setCount((count) => count + 1)}>
      Click Me
    </button>
  );
}
```

Note that `useState()` hook calling at the `<AppView/>` component is eliminated.

And you will see that this small difference triggers a drastic change of the
component design.


 🍎 2. Update React Virtual DOM Tree from Outside of React
----------------------------------------------------------------
**React-Rerenderers** offers unique `useRerenderers()` hook.  With
`useRerenderers()` hook you actually don't have to call any hook when only thing
you want to do is to update the state.

Actually, this is the biggest surprise which I have encountered during I was
designing **React-Rerenderers**. I have never thought if I could implement it in
such a way.

See the following example:

[Example No.4](https://codesandbox.io/s/rerenderers-example-no-04-update-components-from-outside-react-ss6tdm?file=/src/AppView.js)


```jsx
import * as Rerenderers from "./react-rerenderers";

/*
 * Please note that this variable is not
 * defined inside a React component nor a React hook.
 */
let counter = 0;

/*
 * Again, please note that this function is not
 * defined inside a React component nor a React hook.
 */
const handleClick = () => {
  counter = (counter + 1) % 4;
  /*
   * This rerenders the component which called the
   * useRenderer() hook with the argument "counter".
   * See below.
   */
  Rerenderers.fireRerenderers("counter");
};

export const AppView = () => {
  /*
   * This is acutually the only hook which you have
   * to call in this framework. In order to mark
   * which component to rerender when the model state is
   * modified, you have to call useRerenderer() hook.
   */
  Rerenderers.useRerenderer("counter");
  /*
   * Note that you can read and write the variable which
   * is defined outside the domain of React.
   * Also note that it can be achieved
   * without these React hells hell.
   */
  return (
    <div id="main-frame">
      <div id="main-object" className={`square${counter}`}>
        <div>{counter}</div>
      </div>
      <button id="main-message" onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
};
```

This actually opens a door for more aggressive optimization.

 🍎 3. You can Implement Model-View Controller in a Simpler Way
-------------------------------------------------------------------

In the previous section, we have seen that states are actually able to be stored
outside hooks/components. And we also have seen that, by using `useRerenderers()`
hook, it is able to manually invoke the rebuilding process of React Virtual
DOM Tree.

It seemed to me as a hint to the possibility to a further optimization.  I
realized it is also able to store states as JavaScript objects outside React
hooks/components.  I think, this could be an implementation of Model-View
Controller in **React.js**.

See the following example:

[Example No.4](https://codesandbox.io/s/rerenderers-example-no-03-an-advanced-usage-fxwhvp?file=/src/AppView.js)

At first, define a class which contains all states in the same application.

```jsx
import { fireRerenderers } from "./react-rerenderers";
export class AppModel {
  __counter = 0;
  set counter(v) {
    this.__counter = v % 4;
    fireRerenderers(this, "counter");
  }
  get counter() {
    return this.__counter;
  }
}
/*
 * Create an instance of the class.
 */
export const model = new AppModel();
```

After defining the model class, associate the created instance to the React Virtual
DOM Tree by **InstanceProvider** component.

```jsx
import "./styles.css";
import { InstanceProvider } from "./react-rerenderers";
import { AppView } from "./AppView.js";
import { model } from "./AppModel.js";
import React from "react";

export default function App() {
  return (
    <InstanceProvider factory={() => model}>
      <AppView />
    </InstanceProvider>
  );
}
```

In **AppView** component, it is able to access to the instance by `useInstance()` hook.

```jsx
import * as Rerenderers from "./react-rerenderers";

export const AppView = () => {
  /*
   * This returns the instance of **AppModel** class which is defined above.
   *
  const model = Rerenderers.useInstance();
  /*
   * Call the useRerender() hook because we are actually
   * going to make a read-access to the field `counter`
   * in this method. Call `useRerenderer('counter')` causes this component
   * to be rerendered when `fireRerenderers('counter')` is called.
   */
  Rerenderers.useRerenderer("counter");

  return (
    <div id="main-frame">
      <div
        id="main-object"
        /*
         * Note that this performes the read-access to
         * the `counter` field of the class directly.
         */
        className={`square${model.counter}`}

        /*
         * Note that this performes the write-access to
         * the `counter` field of the class directly.
         * This effectively invokes get() method of the class.
         */
        onClick={() => model.counter++}
      >
        <div>{model.counter}</div>
      </div>
      <div id="main-message">Click the Square</div>
    </div>
  );
};
```

The example above works. And I noticed that, in this way,
it is able to cleanly modularize components and their states and
the application can scalably be extended.


### 📜 Rules of `useRerenderer()` and `fireRerenderers()` 📜 ###

It is very important to understand when to call `useRerenderer()` and
`fireRerenderers()`.  

See the following example:

[The Rules of React-Rerenderers.js No.1][rerenderers-rule-01]

[rerenderers-rule-01]: https://codesandbox.io/s/react-rerenderers-usererenderer-and-firererenderers-y3x92v?file=/src/App.js

```jsx
import * as rers from "./react-rerenderers";
import * as bs from "react-bootstrap";

export const Value01Reader = () => {
  const model = rers.useInstance();
  rers.useRerenderer("value01");
  return <input value={model.value01} readOnly />;
};

export const Value01Writer = () => {
  const model = rers.useInstance();
  function handleClick() {
    model.value01++;
    rers.fireRerenderers(model, "value01");
  }
  return <bs.Button onClick={handleClick}>Add</bs.Button>;
};
```

The rules are:

- Call `useRerenderer()` if the component makes a read-access to a field of the
  current associated instance.
- Call 'fireRerenderers()` if the component makes a write-access to a field of
  the current associated instance.
- ID parameter of the functions should match to the name of the field where the
  component makes an access but it is not mandatory; though it must be unique
  enough to identify the field.

The principle behind the rules is simple:

- `useRerenderer()` marks the component where the hook is called as the
  specified ID; this process effectively makes a list of components with that
  specified ID and stores the list on the current associated instance.
- `fireRerenderer()` rerenders and refreshes the all components in the list
  which is stored as the specified ID.

This set of rules is related to the mechanism of the re-rendering process of
React.js. It requires the knowledge of the proces in order to understand the set
of rules properly.

For further information, see [Render and Commit in React.js Official Documentation](https://react.dev/learn/render-and-commit).

### 📜 Rules of `useInstanceValue()` and `useInstanceValueSetter()` 📜 ###

In the previous section, we have seen when to `useRerenderer()` and
`fireRerenderer()`.

`useInstanceValue()` and `useInstanceValueSetter()` are merely helper functions
to utilize `useInstanceValue()` and `fireRerenderer()`.

See their source code:

```jsx
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
```

They only help to conform to the rules which are described in the previous
section.


 🐙 4. Modularize Modal Dialogs
-------------------------------------------------------------------
Implementing Modal Dialogs with **React.js** is tricky. At the first glance,
it seems easy; but it actually isn't. See the following example:

[Dialogs with React-Router 1. ][example-dialog1]

In this example, dialogs are implemented with a popular module named
`react-bootstrap`.  A confirmation dialog box will pop up when you click the
center button and it will automatically navigate to another route after the
`proceed` button is clicked.

You may notice that the dialog appears with an animation
while the dialog disappears without the animation. It should
be with the animation also when it disappears.
But you will notice that its workaround for this issue is not easy.

Understanding this behavior requires an advanced knowledge particularly about
where it keeps the current state and where it tries to rebuild React Virtual DOM.

```
// The Route Definition for the Router
  +-route1
    +-<Dialog1 />
    +-<View1 />
  +-route2
    +-<Dialog2 />
    +-<View2 />

// The Transition of the React Virtual DOM Tree
Step 1. Before the navigation
  +-Router
    +-<Dialog1/>
    +-<View1/>
Step 2. Right after the navigation is triggerd
  +-Router
    +- <Dialog1/> (-) // this will be destroyed node
    +- <View1/>   (-) // this will be destroyed node
    +- <Dialog2/> (+) // this is a newly created node
    +- <View2/>   (+) // this is a newly created node
3. After it navigates to another
  +-Router
    +- <Dialog2/>
    +- <View2/>
```

The animation which occurs when the dialog disappears is always interrupted
because the `<Dialog1/>` component will be unmounted after `Router` starts to
navigate to the `route2` without waiting `<Dialog1/>` finishes its animation.
Therefore, we can conclude that **all dialogs should be placed outside the
`Router`**.  But this requirement invokes more complexity and you will see that
the complexity finally becomes out of control.

See the following example:
[Dialogs with React-Router 2. Provider Hell][example-dialog2]

There are three things to consider in order to take measurement for the issue of
interruption of the animation as we have seen in above:

- Every dialog must be placed outside the Router.
- When a dialog is placed outside the router, its state should also be placed
  outside the Router.
- The state should also be passed to the caller of the dialog; otherwise the
  caller cannot trigger the dialog to pop up.

This is actually a very difficult problem. React Router states that every
definition of routes should be placed to the global scope.

How can this be achieved?

The only way to pass an arbitrary value to a route is actually using
[useContext()][use-context] hook.

But you will be suffered with the second problem. Actually every route is not
able to be any descendant of other React Virtual DOM Tree. In short,

```jsx
const MY_VALUE={};
const ctx = createContext(MY_VALUE);
const router = [ ... /* some-routes */ ];
return (
  <ctx.Provider  >
    <RouterProvider router={router} />
  </ctx.Provider>
);
```

Unfortunately, the code above does not work. But the good news is, there are a
simple workaround; create a pathless route with `<Outlet/>` as follows:

```jsx
const MY_VALUE={};
const ctx = createContext(MY_VALUE);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={ <ctx.Provider /><Outlet/></ctx.Provider> }>
      <Route path="/" element={<MyView />} />
    </Route>
  )
);
return (
  <RouterProvider router={router} />
);
```

This flawlessly works. The workaround will be explained further in the following section.

Good! So we can go through this difficulty, right?!
Actually this leads us to another hell.
That is the [Provider Hell][context-provider-hell].

This hell is terrible.  See the previous example again:

[Dialogs with React-Router 2. Provider Hell][example-dialog1]

**AppView.js**
```jsx
  {
    path: "/",
    element: (
      <>
        <Rotate1Provider>
          <Rotate2Provider>
            <Router.Outlet />
          </Rotate2Provider>
        </Rotate1Provider>
      </>
    ),
    children: [
      {
          //...
      },
      //...
    ],
  },
```

Now we have two providers. That's fine. But the more we create dialogs, the more
the nested providers we get. Say we have twenty dialogs, it goes:

```jsx
  {
    path: "/",
    element: (
      <>
        <Rotate1Provider>
          <Rotate2Provider>
            <Rotate3Provider>
              <Rotate4Provider>
                <Rotate5Provider>
                  <Rotate6Provider>
                    <Rotate7Provider>
                      <Rotate8Provider>
                        <Rotate9Provider>
                          <Rotate10Provider>
                            <Rotate11Provider>
                              <Rotate12Provider>
                                <Rotate13Provider>
                                  <Rotate14Provider>
                                    <Rotate15Provider>
                                      <Rotate16Provider>
                                        <Rotate17Provider>
                                          <Rotate18Provider>
                                            <Rotate19Provider>
                                              <Rotate20Provider>
                                                <Router.Outlet />
                                              </Rotate20Provider>
                                            </Rotate19Provider>
                                          </Rotate18Provider>
                                        </Rotate17Provider>
                                      </Rotate16Provider>
                                    </Rotate15Provider>
                                  </Rotate14Provider>
                                </Rotate13Provider>
                              </Rotate12Provider>
                            </Rotate11Provider>
                          </Rotate10Provider>
                        </Rotate9Provider>
                      </Rotate8Provider>
                    </Rotate7Provider>
                  </Rotate6Provider>
                </Rotate5Provider>
              </Rotate4Provider>
            </Rotate3Provider>
          </Rotate2Provider>
        </Rotate1Provider>
      </>
    ),
    children: [
      {
          //...
      },
      //...
    ],
  },
```

This is the [Provider Hell][context-provider-hell].

This is where **React-Rerenderers**'s `useTransmitter()` comes in. See the
following example;

[Dialogs with React-Router 3. : Eliminate Provider Hell][example-dialog3]

```jsx
const routes = [
  {
    path: "/",
    loader: () => {
      return {};
    },
    element: (
      <>
        <Dialog1 />
        <Dialog2 />
        <Router.Outlet />
      </>
    ),
    children: [
      //...
    ],
  }
];
```

It cuts out the necessity of the providers and flattens the definitions of the
dialogs.

With **React-Rerenderers**'s `useTransmitter()` hook, it is not required to
define customized providers.  See the following code:

```jsx
export const Dialog1 = () => {
  const navigate = rr.useNavigate();
  const [show, setShow] = React.useState(false);
  const handlers = {
    show,
    handleClose: (result) => {
      setShow(false);
      if (result) {
        navigate("/" + handlers.to);
      }
    },
    handleShow: () => setShow(true),
    get message() {
      return `Navigate to ${handlers.to}?`;
    },
    to: "bar"
  };

  Rerenderers.useNewTransmitter("route1dialog", handlers); // << See this.

  return (
    <>
      <bs.Modal show={handlers.show} onHide={handlers.handleClose}>
        //....
      </bs.Modal>
    </>
  );
}
```


After we called the `useState()` hook, we set the state setter function to an
object. Then we passed the object to **React-Rerenderers.js**'s
`useNewTransmitter()` hook with an ID, in this case it is `route1dialog`.

While the component which calls the `useNewTransmitter()` hook is mounted
somewhere in the React Virtual DOM Tree, you can access to the value via
calling `useTransmitter()` hook with the specified ID `route1dialog` .

This enables users to access to any hooks (that is, states and state setter
functions) from anywhere in the React Virtual DOM Tree without those nested
context providers.


[example-dialog1]: https://codesandbox.io/s/rerenderers-example-no-03-implement-dialogs-in-a-router-1-9xhhwv?file=/src/AppView.js
[example-dialog2]: https://codesandbox.io/s/rerenderers-example-no-03-implement-dialogs-in-a-router-2-with-provider-hell-rjf8k4?file=/src/AppView.js
[example-dialog3]: https://codesandbox.io/s/rerenderers-example-no-03-implement-dialogs-in-a-router-3-without-provider-hell-qq9s9d?file=/src/AppView.js
[use-context]: https://react.dev/reference/react/useContext


 👷‍♂️Model-View Controller Architecture with **React-Rerenderers.js** 👷‍♀️
==========================================================================================


 👩‍❤️‍👨 How to Use React-Rerenderers with React-Router
==========================================================================

You very likely want to use **React-Rerenderers** with **React-Router**.  If
you are in that case, you might try the following code and notice that it does
not work.

```jsx
const router = [ ... /* some-routes */ ];
return (
  <InstanceProvider factory={() => model} >
    <RouterProvider router={router} />
  </InstanceProvider>
);
```

This problem roots to the difficulty of using React Context with React Router.
See the following example.

```jsx
export const ctx = React.createContext("FOO");
const router = createBrowserRouter([ ... ]);
const Main =()=>{
  return (
    <ctx.Provider value={"BAR"}>
      <RouterProvider router={router} />
    </ctx.Provider>
  );
}
```

It is not able to access to the value which is set to `<ctx.Provider />` if you
place the provider outside the route object tree.

The context consumer has to be a direct descendant of the context provider. In
**React-Router**, your component will be a direct descendant of `Route`
component which is the case that **useContext()** cannot corporate with.

The only workaround which I could find in the net is mentioned in
[this post](context-with-router) in React-Router Remix's GitHub Repository.

```jsx
export const ctx = React.createContext("FOO");
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={
      <ctx.Provider value={"BAR"} >
        <Outlet />
      </ctx.Provider>
    }>
      <Route path="/" element={<AppView />} />
    </Route>
  )
);
const Main =()=>{
  return (
    <RouterProvider router={router} />
  );
}
```

According to [this post](context-with-router), it is necessary to create a
pathless route and place others as its children. Otherwise `useContext()` hook
cannot access to the current value that is set to `<Provider/>` component.

See [this post](context-with-router) for further information.

[context-with-router]: https://github.com/remix-run/react-router/issues/9324#issuecomment-1268554681

**React-Rerenderers.js**'s `<InstanceProvider/>` uses `useContext()` hook. That
is, the instance consumer has to be a direct descendant of the instance
provider.

```jsx
const router = [ ... /* some-routes */ ];
return (
  <InstanceProvider factory={() => model} >
    <RouterProvider router={router} />
  </InstanceProvider>
);
```
The code above does not work as expected.

Unless the `<InstanceProvider/>` is placed as follows, it will not be able to
retrieve its `current state`.

```jsx
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={ <InstanceProvider factory={() => model} /> }>
      <Route path="/" element={<AppView />} />
    </Route>
  )
);
return (
  <RouterProvider router={router} />
);
```








 🌈 API Reference 🌈
=====================================

### `<InstanceProvider factory={} />` ###

`<InstanceProvider/>` can share the current object which all states in an
application should be stored.  The attribute `factory` should be a function
which returns the current object.

Opposing to the name `factory` suggests, in most case, it should be as follows:
```jsx
export const myModel = new MyModel();
const Main = ()=>{
  return (
    <InstanceProvider factory={()=>myModel} >
      <MyView/>
    </InstanceProvider>
  );
};
```

Not as follows:
```jsx
const Main = ()=>{
  return (
    <InstanceProvider factory={()=>new MyModel()} >
      <MyView/>
    </InstanceProvider>
  );
};
```

The object should be located on the global scope because actions and loaders on
your routers are very likely placed on the global scope. If your model is placed
on **React.js**'s state, there is no way to access to it from your actions and
loaders.

Usage of `<InstanceProvider/>` is not mandatory. In case you haven't specified
your current object, it defaults to `GLOBAL_INSTANCE` as mentioned later.

#### Attributes ####
- factory : function 
  Specify a function which returns the current instance value to associate with.

### `useInstance()` ###
`useInstance()` hook returns the current instance which is associated to the
React Virtual DOM Tree where the caller component is belonging to. If no
instance is associated, it returns `GLOBAL_INSTANCE`.

`GLOBAL_INSTANCE` is described in the following section.

### `GLOBAL_INSTANCE` ###
`GLOBAL_INSTANCE` is the default instance where there is no current instance
which is associated to the React Virtual DOM Tree where the current component is
belonging to.

### `useInstanceValue( fieldname : string )` ###
`useInstanceValue()` returns the value of the specified field on the current
instance which is associated to the React Virtual DOM Tree where the caller
component is belonging to.

This is a helper function which is meant to simplify the calling process of
`useRerenderer()` and `fireRerenderers()`.

#### Parameter ####
- fieldname : string 
  Specify the field name to get the current value



### `useInstanceValueSetter( fieldname : string )` ###
`useInstanceValueSetter()` returns a setter function to set a value of the
specified field on the current instance which is associated to the React Virtual
DOM Tree where the caller component is belonging to.

This is a helper function which is meant to simplify the calling process of
`useRerenderer()` and `fireRerenderers()`.

#### Parameter ####
- fieldname : string 
  Specify the field name to set a new value


### `useRerenderer( id:any )` ###
`useRerenderer()` hook function marks the caller component with the specified ID


#### Parameter ####
- id : any 
  Specify the ID to mark as.

### `fireRerenderers(instance:object, id:any)` ###
`fireRerenderers()` refreshes and re-renders the components which is associated
to the specified ID.

#### Parameter ####
- instance : any 
  Specify the current instance.
- id : any 
  Specify the ID of the components to be re-rendered.


### `useNewTransmitter( id:any, f:function )` ###

`useNewTransmitter()` sets a value to the specified field on the current
associated instance only while the caller component is mounted to the React
Virtual DOM Tree in order to share the value with the components anywhere on the
associated tree.

The value can be obtained by calling `useTransmitter()` and `getTransmitter()`
while the component is mounted.

This hook is meant to be used to share states and state setter functions between
components on the other part of the tree.

#### Parameter ####
- id:any 
  Specify the ID which is used for identify the value.
- f:function 
  Specify the function which returns the value which should be shared with
  other components.


### `useTransmitter( id:any )` ###
`useTransmitter()` retrieves the current value which is registered by
`useNewTransmitter()` hook. `useTransmitter()` returns the value only when the
caller of useNewTransmitter()` hook is mounted; otherwise it returns `null`.

#### Parameter ####
- id:any 
  Specify the ID which is used for identify the value.

### `getTransmitter( instance:any, id:any )` ###
`getTransmitter()` is a non-hook function which has the exactly same
functionality with `useTransmitter()` function.

### `useRerender()` ###
`useRerender()` is the lowest-level basic function of **React-Rerenderers**.
The return value is a function. Call the function to invoke rerendering process
of the component which calls the `useRerender()` hook.


#### Return Value ####
- a function to rerender the component which calls the `useRerender()` hook.



 🌈  Conclusion 🌈
=====================================

I am not sure this is an appropriate usage React.js nor I even don't think this
is a correct usage of React.js since this usage is a kind of an attempt of
denial of the React.js's mechanism for the automatic update detection.

But in this way, I believe, the number of issues which you often encounter when
you build a comparably larger application can be easily avoided.

I am worrying that nobody understand the meaning and the effectiveness of this
module because I even think this module is very weird; but it works.


Additionally, I am from Japan; my English ability is quite limited. Please
excuse my obscured English and I hope my English is good enough for everyone to
understand my idea.

Thank you very much and see you soon.


## History ##

### as `react-hooks` ###

- v1.0.0 Released
- v1.0.1 Updated README.md
- v1.0.2 Updated README.md (Tue, 08 Aug 2023 10:41:08 +0900)
- v1.0.3 Updated README.md (Tue, 08 Aug 2023 10:49:17 +0900)
- v1.0.4 Updated README.md (Tue, 08 Aug 2023 16:24:05 +0900)
- v1.0.5 Updated README.md (Wed, 09 Aug 2023 17:23:53 +0900)
- v1.0.6 Updated README.md (Wed, 09 Aug 2023 20:30:01 +0900)
- v1.0.7 Removed JSX syntax (Fri, 11 Aug 2023 10:56:13 +0900)
- v1.0.8 Exported `useRerender()` (Sat, 12 Aug 2023 15:57:48 +0900)

### as `react-rerenderers.js` ###

- After **react-hooks** was released, **rerenderers.js** was forked from the
  module **react-hooks**. Since then **rerenderers.js** have been developed in
  a different application.
- On Aug 24, 2023, the new repository **react-rerenderers.js** was started.
- At the time **react-rerenderers.js** was started, it was not registered to
  [https://npmjs.org/]()
