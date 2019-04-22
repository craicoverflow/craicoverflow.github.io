---
title: "Controlling component visibility with React Hooks"
layout: post
categories: guides react
blog: true
image: https://i.imgur.com/f83hzUs.jpg
author: EndaPhelan
summary: "A guide to controlling the visibility of your components using React Hooks"
description: "A guide to controlling the visibility of your components using React Hooks"
tag:
    - React
    - JavaScript
    - React hooks
    - useEffect
    - Tutorial
    - Programming
---

<p style="text-align:center;">
  <img class="image" src="{{site.image_cdn}}/f83hzUs.jpg">
</p>

With the release of React 16.8, _Hooks_ are the newest addition to the world's most popular front-end framework. Hooks give us access to state and other lifecycle events from functional components. Before now functional components were always stateless. To use state we had to write class components, which are more verbose and complex than their functional counterparts.

In this guide we are going to make a simple component which will remain hidden until a button is clicked. We will also set a timeout event to hide the component after a set duration.

For this we will use two hooks - `useState` and `useEffect`. I'll explain what they do when we go to implement them, but for now let's define the component and its props.

```jsx
export const Alert = ({ visible, duration, onDurationEnd, children }) => {
    return children;
};
```

I've defined a functional component with four props.

-   `visible` (required) - This will be a boolean, either `true` or `false`. It controls the current visible state of the component.
-   `duration` (optional) - This is the duration is milliseconds that the component should display for before hiding again. If it is not set, the component will remain visible.
-   `onDurationEnd` (optional) - Callback function that executes after the duration has ended. Typically used reset the component's visibility to `false` from the parent component.
-   `children` (required) - This can be anything, from a single word to multiple components. `children` are added to the component as child elements.

### State

`useState` allows us to use and set component state, which persists across renders. `useState` returns a pair, the current state value and a function for modifying it. Finally, `useState` takes a single argument which sets the initial value.

```jsx
import React, { useState } from "react";

export const Alert = ({ visible, duration, onDurationEnd, children }) => {
    const [isVisible, setVisibility] = useState(null);

    return children;
};
```

Here we have set up a hook to control the visibility of the component. The initial state value is `null` as this will be overwritten almost immediately after render.

What I really like about `useState` is you can declare it multiple times in a single component.

```jsx
const [isVisible, setVisibility] = useState(null);
// defining a second state variable
const [message, setMessage] = useState(null);
```

The benefit of this is that we can separate the control of different state values. In a class component, all state values are in a single object. So if you want to update one, you must also update the rest.

```jsx
function setVisibility(visible) {
    this.setState({
        ...this.state,
        isVisible: visible
    });
}
```

### Effect

`useEffect` lets us perform side effect functions from a functional component. A side effect is something which affects something outside of the function being executed, like state or a network request. Think of `useEffect` like `componentDidMount`, `componentDidUpdate` and `componentWillUpdate` combined. By using this hook, you tell React to execute the logic inside the hook after every render.

```jsx
export const Alert = ({ visible, duration, onDurationEnd, children }) => {
    const [isVisible, setVisibility] = useState(null);

    useEffect(() => {
        setVisibility(visible); // update the state
    }, [visible]); // hook is only triggered when value changes

    return children;
};
```

So what does this do? After setting the initial state value, the `useEffect` hook is the next event to run. The hook overrides the initial value for `isVisible` to match the value acquired from the parent component's props.

The final argument in `useEffect` is an optional optimization. The effect will only re-run the if the value of `visible` changes, preventing unnecessary re-renders.

<div class="breaker"></div>

Once the `useEffect` hook has finished, we want to check the value of `isVisible`. If it's `false`, we don't want to render the component, so we return `null`.

```jsx
if (!isVisible) return null;
```

If `duration` contains a value, we need to set a timeout which will reset the component's visibility once the duration has passed. If `onDurationEnd` is defined then the parent component expects the value for controlling this component's visibility to also be reset to `false`, once the timeout has complete.

```jsx
if (duration) {
    setTimeout(() => {
        setVisibility(false);

        // pass `false` back to the parent to update its state
        if (onDurationEnd) {
            onDurationEnd(false);
        }
    }, duration);
}
```

Take a look at the finished component below. The introduction of React hooks has made developing components quicker, with fewer lifecyle events to worry about. The file itself is reduced by a number of lines versus a class component that does the same thing.

```jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Customisable alert component that remains hidden until called.
 *
 * @param {boolean} props.visible - The current visibility of the component.
 * @param {number} [props.duration] - The time in milliseconds to display the component for. If not set, the component will stay visible.
 * @param {func} onDurationEnd - Set visible state of component from parent.
 * @param {*} props.children - Child components.
 */
export const Alert = ({ visible, duration, onDurationEnd, children }) => {
    const [isVisible, setVisibility] = useState(null);

    useEffect(() => {
        setVisibility(visible);
    }, [visible]);

    if (!isVisible) return null;

    if (duration) {
        setTimeout(() => {
            setVisibility(false);

            if (onDurationEnd) {
                onDurationEnd(false);
            }
        }, duration);
    }

    return children;
};

Alert.propTypes = {
    visible: PropTypes.bool.isRequired,
    timeout: PropTypes.number,
    children: PropTypes.node.isRequired
};
```

Check out a [live demo](https://endaphelan.me/react-hooks-timeout-example/) or the code from this tutorial on [GitHub](https://github.com/craicoverflow/react-hooks-timeout-example).

And I can't let you go without a meme.

<p style="text-align:center;">
  <img class="image" src="https://i.imgflip.com/2z5ybq.jpg">
</p>
