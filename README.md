 🌈 React-Rerenderers.js
======================
This is a new state management framework which allows you to decide when to
render your components. For further information, please see below.

 👺 Features
---------------
**react-rerenderers** is a new state management library. This is a quite
unusual and yet efficient usage of React.js' hooks which offers a way to escape
from React's hells hell.

- No more [useState() Hell][usestate-hell]
- No more [Prop Drilling][prop-drilling] Hell
- No more [Lifting-State-Up][lifting-state-up] Hell
- No more [Context-Provider Hell][context-provider-hell]
- No more [Redux State Hell][redux-state-hell]
- No more [Encapsulation Hell][encapsulation-hell]
- No more [Infinite Rendering Loop][inf-rendering-loop] hell
- No more [Stale Closure Problem][stale-closure-problem]
- No more [Batch Update Problem][batch-update-problem]
- No more fussy tricks to manage rendering triggers indirect way
- Zero dependent

[usestate-hell]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+state+hell
[prop-drilling]: https://react.dev/learn/passing-data-deeply-with-context
[lifting-state-up]: https://react.dev/learn/sharing-state-between-components
[context-provider-hell]: https://www.google.com/search?gl=us&hl=en&q=react+context+provider+hell
[redux-state-hell]: https://www.google.com/search?gl=us&hl=en&q=redux-state-hell
[inf-rendering-loop]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+infinite+rendering
[encapsulation-hell]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=encapsulation+hell
[stale-closure-problem]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+stale+closure+problem
[batch-update-problem]: https://www.google.com/search?gl=us&hl=en&gws_rd=cr&safe=off&q=react+state+batch+update+problem

 🗽 Free Objects from Renderings 🎊
=====================================

 React Development with the traditional `useState()`
ｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰ

Assume you are creating such a simple application:

[Example No.0](https://codesandbox.io/s/rerenderers-example-no-00-without-react-rerenderers-6d5hnh?file=/src/AppView.js)

```jsx
import React from "react";

export const AppView = () => {
  const [counter, setCounter] = React.useState(0); // << check this out
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

In this demo, every time you click on the square `main-object`, its CSS class
will be set to `square0`, `square1`, `square2` and `square3` respectively.  As
the CSS class goes, the square moves around the screen to top-left, top-right,
bottom-right and bottom-left, respectively.

In **React-Rerenderers**, we implement the same logic in the following manner:

 React Development With `React-Rerenderers`'s Value Accessors
ｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰ

[Example No.1](https://codesandbox.io/s/rerenderers-example-no-01-a-basic-usage-nkvvjs?file=/src/AppView.js)

```javascript
import * as Rerenderers from "./react-rerenderers";

export const AppView = () => {
  const counter = Rerenderers.useInstanceValue("counter"); // << check this out
  const setCount = Rerenderers.useInstanceValueSetter("counter"); // << check this out
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

They share almost same functionarities. But **React-Rerenderers** requires two
hook callings.  Though the fact that **Rerenderers** requries more finger power
than `useState()` hook could disgust you, it gives some advantages which
`useState()` cannot achieve.

 The Things You Can Achieve with `React-Rerenderers`
ｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰｰ

### 🍎 1. Eliminate State Lifting and Prop Drilling ###

See the example below:

[Example No.2](https://codesandbox.io/s/rerenderers-example-no-02-modifying-a-vaue-from-a-remote-location-with-usestate-lm5yhm?file=/src/AppView.js)

I moved the click handler to a remote location which is defined in a different file.

Note that with the traditional `useState()` hook, you have to
[Lifting Up][lifting-state-up] the `useState()` hook and then you have to
[Drilling Properties][prop-drilling] six feet deep down as the following:

```javascript
import React from "react";
import { AppButton } from "./AppButton.js";
import { AppSquare } from "./AppSquare.js";

export const AppView = () => {
  const [counter, setCounter] = React.useState(0); // check this out
  return (
    <div id="main-frame">
      <AppSquare counter={counter} />
      <AppButton setCounter={setCounter} />
    </div>
  );
};
```

```javascript
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

```javascript
export function AppSquare({ counter }) {
  return (
    <div id="main-object" className={`square${counter}`}>
      <div>{counter}</div>
    </div>
  );
}
```

With **React-Rerenderers.js**, you do not need [Lifting Up][lifting-state-up]
and [Drilling Properties][prop-drilling] anymore.

See the following example:

[Example No.3](https://codesandbox.io/s/rerenderers-example-no-03-modifying-a-vaue-from-a-remote-location-cc8rdd?file=/src/AppView.js)

```javascript
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

```javascript
import * as Rerenderers from "./react-rerenderers";

export function AppSquare() {
  // check this out
  const counter = Rerenderers.useInstanceValue("counter");
  return (
    <div id="main-object" className={`square${counter}`}>
      <div>{counter}</div>
    </div>
  );
}
```

```javascript
import * as Rerenderers from "./react-rerenderers";

export function AppButton() {
  // check this out
  const setCount = Rerenderers.useInstanceValueSetter("counter");
  return (
    <button id="main-message" onClick={() => setCount((count) => count + 1)}>
      Click Me
    </button>
  );
}
```

Note that `useState()` hook calling at the `<AppView/>` component is eliminated.
See it just works fine.

And you will see that this small difference invokes a drastic change of the
component design.


### 🍎 2. Update Components from Outside React
**React-Rerenderers** offers unique `useRerenderers()` hook.  With
`useRerenderers()` hook you actually don't have to call any hook when only thing
you want to do is to update the state.

Actually, this is the biggest surprise which I have encountered duruing I was
designing **React-Rerenderers**. I have never thought if I could implement it in
such a way.

See the following example:

[Example No.4](https://codesandbox.io/s/rerenderers-example-no-04-update-components-from-outside-react-ss6tdm?file=/src/AppView.js)


```javascript
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

### 🍎 3. You can Implement Model-View Controller in a Simplest Way ####
[Example No.4](https://codesandbox.io/s/rerenderers-example-no-03-an-advanced-usage-fxwhvp?file=/src/AppView.js)


```javascript
import * as Rerenderers from "./react-rerenderers";

export const AppView = () => {
  const model = Rerenderers.useInstance();
  /*
   * This is acutually the only hook which you have
   * to call in this framework. In order to mark
   * which component to rerender when the model state is
   * modified, you have to call useRerenderer() hook.
   */
  Rerenderers.useRerenderer("counter");

  /*
   * You can read and write any fields on the model
   * without any React hells.
   *
   * See ./AppModels.js too
   */
  return (
    <div id="main-frame">
      <div
        id="main-object"
        className={`square${model.counter}`}
        onClick={() => model.counter++}
      >
        <div>{model.counter}</div>
      </div>
      <div id="main-message">Click the Square</div>
    </div>
  );
};
```


```javascript
import { fireRerenderers } from "./react-rerenderers";

export class AppModel {
  __counter = 0;
  set counter(v) {
    /*
     * This is MOD operator; this resets `v` to zero if
     * `v` is equals or greater than four.
     */
    this.__counter = v % 4;

    /*
     * See ./AppModel.js , too.
     * You will find a call to useRerenderers(name) there.
     *
     * When ever you call the fireRerenderers(name) function,
     * the componponent which calls the useRerenderers() hook
     * will be rerendered.
     *
     * This enables users to precisely controll when to rerender
     * component. Also note that, this class is defined outside
     * compontent functions nor hooks.
     *
     * React usually restricts calling hooks from outside of
     * hooks/component functions.
     *
     * With React-Rerenderers.js, you can invoke React rerendering
     * process anywhere.
     *
     * This is the most crucial part of `react-rerenderers`
     */
    fireRerenderers(this, "counter");
  }
  get counter() {
    return this.__counter;
  }
}

export const model = new AppModel();
```


 🌈  Miscellaneous 🌈
=====================================

 👩‍❤️‍👨 Using React-Rerenderers with React-Router  👩‍❤️‍👨
------------------------------------------------------------------
You very likely want to use **React-Rerenderers** with **React-Router**.  If
you are in that case, you will try the following code and notice that it does
not work.

```javascript
const router = [ ... /* some-routes */ ];
return (
  <InstanceProvider factory={() => model} >
    <RouterProvider router={router} />
  </InstanceProvider>
);
```

**React-Rerenderers** uses `useContext()` hook; the context consumer have to be
a direct descendant of the context provider. In **React-Router**, your
component will be a direct descendant of `Route` component which is the case
that **useContext()** cannot corpolate with.

Unless your component is placed in following way, it will not be able to
retrieve its `current instance`.

```javascript
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

See [this post](https://github.com/remix-run/react-router/issues/9324#issuecomment-1268554681)
for further information.


 🌈 API Reference 🌈
=====================================

### `InstanceProvider()` ###

### `useInstance()` ###

### `GLOBAL_INSTANCE` ###

### `useRerenderer()` ###

### `fireRerenderers()` ###

### `useGet()` ###

### `useSet()` ###

### `useNewTransmitter()` ###

### `getTransmitter()` ###

### `useTransmitter()` ###

### `useRerender()` ###


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
  module **react-hooks**. Since then **rerenderers.js** have been developped in
  a different application.
- On Aug 24, 2023, the new repository **react-rerenderers.js** was started.
- At the time **react-rerenderers.js** was started, it was not registered to
  [https://npmjs.org/]()


