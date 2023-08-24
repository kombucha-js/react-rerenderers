 🌈 React-Rerenderers.js
======================
This is a new state management framework which allows you to decide when to
render your components. For further information, please see below.

 👺 Features
---------------
**react-rerenderers** is a new state management library. This is a quite unusual
and yet efficient usage of React.js' hooks.

- No more infinite rendering loop
- No more stale closure problem
- No more batch update problem
- No more fussy tricks to manage rendering triggers indirect way
- Just call rerender() whenever you want to rerender
- With no dependency


 🗽 Free Objects from Renderings 🎊
-------------------------------------
With **react-rerenderers**, you can create objects freely; that is your objects
do not have to follow these restrictions which React.js usually gives you.
Objects in React.js are usually difficult to survive between renderings; they
usually have to be created in `useEffect()` hook and oftentimes they have to be
protected with [memoization](https://react.dev/reference/react/memo).

With **react-rerenderers**, your objects will be placed outside from React
components and able to independently communicate to the components. And these
outside objects can freely request the peer components to rerender.

See this [https://j2wckn.csb.app/](Demo).

In this demo, components directly refer the fields on the object which is
located on a package scope; these values are not from `useState()` hook.
Accessing values in this way usually ends up with stale-value issues which
those components refer out-of-date states of the object. This is where
**react-rerenderers.js** comes in. Call `useRerenderer()`.

```javascript
// AppView.js

import { useRerenderer } from "./react-rerenderers";
import { model } from "./App";
export const AppView = () => {
  useRerenderer("cute-square");
  return (
    <div id="main-frame">
      <div
        id="main-object"
        className={model.cuteSquare}
        onClick={() => model.exec()}
      >
        {model.cuteSquare}
      </div>
      <div id="main-message">Click the Square</div>
    </div>
  );
};
```

It is not necessary to keep the returned value from the `useRerenderer()` hook.

After that:

```javascript
// AppModel.js

import { fireRerenderers } from "./react-rerenderers";
export class AppModel {
  counter = 0;
  exec() {
    if (3 < ++this.counter) this.counter = 0;
    fireRerenderers(this, "cute-square");
  }
  get cuteSquare() {
    return `f${this.counter}`;
  }
}
```

In the model object, use `fireRerenderers()` function. Note that this function
actually invokes hooks inside the components, but it is not necessary to be
inside a component function nor a hook function.

Please see how it works in the [https://j2wckn.csb.app/](Demo).

That is, the objects which contains your designated business logic can be
located in package scope with full ability to call hooks in your component.

It is also said that these objects can be accessed from anywhere in your
React.js application without necessity to take care of their life-cycle. The
objects persist until the owning browser window closes.

This property of this module makes applications drastically easier to develop.


 API Reference
---------------

Coming soon.


## Conclusion  ##

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


