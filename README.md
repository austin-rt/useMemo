# Demystifying React Hooks: useMemo

![](./assets/png/useCallback-header-small.png)

In this article, we will explore when and how to use React’s `useMemo` Hook to increase your app's performance.

## Getting Started

If you'd like to follow along in your local IDE, you can find the GitHub Repo [here](https://github.com/austin-rt/useMemo). Otherwise, you can reference the code snippets, though you will miss out on the performance comparison demonstrations.

- `fork and clone`
- `cd client`
- `npm i`
- `npm start`

## Starter Code

We'll begin with a quick overview of our starter code. In `App.js`, you'll find a function name "`jacobsthal`," two pieces of state, and a `calculation`. Notice that we wrapped `jacobsthal` in a `useCallback` Hook, and that `calculation` is the returned value from calling `jacobsthal`. The JSX renders both inputs and their respective values. If you need a refresher on what service the `useCallback` Hook provides, I'd suggest you pause here and give my <a href="https://medium.com/@austinrt/demystifying-react-Hooks-usecallback-7c78fac08947">useCallback</a> article a quick read.

```js
import './App.css';
import { useState, useCallback } from 'react';

function App() {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');

  const jacobsthal = useCallback((n) => {
    if (n < 2) return n;
    return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  }, []);

  const calculation = jacobsthal(number);

  return (
    <div>
      <main>
        <section>
          <div className='user-input'>
            <input
              type='text'
              value={number}
              placeholder='desired index'
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
          </div>
          <div className='result'>{calculation || 0}</div>
        </section>
        <section>
          <div className='user-input'>
            <input
              type='text'
              value={input}
              placeholder='user input'
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </div>
          <div className='result'>{input || '--'}</div>
        </section>
      </main>
    </div>
  );
}

export default App;
```

</br>
<blockquote>
Our <code>jacobsthal</code> function is a simple, <a href="https://www.geeksforgeeks.org/javascript-memoization/">recursive</a> function that returns the <a href="https://en.wikipedia.org/wiki/Jacobsthal_number">Jacobsthal Number</a> at a given index. The specifics of the code and Jacobsthal Number don't matter for this article. All we care about is that it's a computationally expensive function, defined <strong>within</strong> our component, hence the implementation of <code>useCallback</code>.
</blockquote>
</br>

If we provide a small value to the `number` input, we'll see that our React app behaves as expected. It snappily renders the result. However, as we increase the value of our input, we notice that the app still provides the desired output, but it takes increasingly longer to render.

## Why is This Happening?

If we're up to speed on what React is doing behind the scenes, we know that any change in props or state triggers a re-render. So, every time our input changes, the app re-renders, which causes our expensive function to recalculate its output.

Thirty-five seems to be the sweet spot of slow enough to be annoying and never make it to production but fast enough that we can still test our solution. So we'll input 35 and wait for the output to calculate.

To further demonstrate, use 35 as the first input and start typing into the second input. See how slow it is to render? That's because when the input changed, the **entire** component re-rendered, and our expensive function recalculated the output before rendering. Recalculations will happen even when `jacobsthal`'s output doesn't change. This is obviously a problem.

<blockquote>A Quick Aside:

I've made this mistake and seen countless other Junior Developers do the same. You don't always need <code>useState</code> for your forms. I'll even propose that you **usually don't**. If all you're doing is submitting that form to an API endpoint, and no part of your application needs to see the updated value in real time, you should be using <code>useRef</code> instead. We will get into how and why in a later article.</blockquote>

So with the stage set and the curtains drawn, how do we resolve the issue at hand?

## Enter `useMemo`

We'll begin with some context. Memoization is a Programming technique that stores the **results** of a function call, so the next time you call that function, it doesn't have to recalculate the output. Instead, it can return the stored result, saving a lot of [time complexity](https://www.freecodecamp.org/news/time-complexity-of-algorithms/) with recursive functions. That's all you need to know for now, but if you'd like a more in-depth explanation, you can also check out this [Memoization in JavaScript](https://www.geeksforgeeks.org/javascript-memoization/) article by GeeksforGeeks. And at the end of this article, we will refactor our `jacobsthal` function to use proper JavaScript memoization.

## `useMemo` vs. `useCallback`

To sum it up, `useCallback` stores the **definition** of the function, so it doesn't unnecessarily **redefine** on every render. `useCallback` creates referential equality between instances of the function across renders.

Similarly, `useMemo` stores the **result** of the function call, so it doesn't unnecessarily **recalculate** on every render. `useMemo` creates referential equality between instances of the value across renders.

You can already see how this is helpful and leads directly to the primary purpose of `useMemeo`. In short, the aptly named `useMemo` Hook is React's built-in memoization tool.

## `useMemo` in Action

Let's write some code!

We'll start by importing `useMemo` from `'react'`.

```js
import { useState, useCallback, useMemo } from 'react';
```

## `useMemo` Syntax

You guessed it, `useMemo` has a simial skeletal structure to both `useEffect` and `useCallback`: an anonymous callback function with a dependency array that tracks a variable to tell our Hook when to trigger.

```js
useEffect = (() => {}, []);
useCallback = (() => {}, []);
useMemo = (() => {}, []);
```

As in our `useCallback` example, we want to cache what's **returned** from this Hook. So we will assign our `calculation` variable to the return value of `useMemo`, wrapping our function call in an anonymous callback.

_Remember your `return` keyword within the anonymous function so it is accessible by `useMemo`!_

```js
const calculation = useMemo(() => {
  return jacobsthal(number);
}, []);
```

After we save, we'll notice a familiar warning from React. Our Hook is missing a dependency.

```
WARNING in [eslint]
src/App.js
  Line 11:6:  React Hook useMemo has a missing dependency: 'number'. Either include it or remove the dependency array  react-Hooks/exhaustive-deps

webpack compiled with 1 warning
```

As always, before blindly obeying React's warnings, let's first think through the purpose of this dependency array and the functionality it extends to our application.

The intent of dependency arrays with React Hooks is to trigger our Hook more intentionally and specifically. When the value of the variable being `tracked` changes, the Hook knows it's time to _do its thing_. In our specific case, when the `number` input changes, we want our `jacobsthal` function to recalculate the result.

So let's add `number` to our dependency array.

```js
const calculation = useMemo(() => {
  return jacobsthal(number);
}, [number]);
```

Now that we've successfully memoized our function, let's test it out. We'll start by inputting 35 as our magic number. Our calculation still takes time to evaluate because our `jacobsthal` function is still computationally expensive. But now, when we type in the second input, we notice that our React app is again snappy and responsive. It's no longer reassessing our `jacobsthal` output because `number` has not changed.

## Conclusion (kind of)

We've successfully memoized our React function and made our app more performant. Because we memoized the results, we've created referential equality between renders of our component and eliminated any unnecessary renders. But why is our `jacobsthal` function still so slow? Well, we have optimized our React app, but not our `jacobsthal` function. And since I can't leave well enough alone, we'll quickly brush over memoization. If you only came here for the React piece, thanks so much for reading, and look out for the `useRef` article next! Otherwise, let's memoize this `jacobsthal` function!

We begin by creating a `previousValues` parameter with a default value of an empty array. This will be our cache that we will later pass to our recursive sequence. Doing so will spare our recursive sequence from working overtime.

```js
export const jacobsthal = (n, previousValues = []) => {
  if (n < 2) {
    return n;
  }
  return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
};
```

Next, inside our code block, we'll create a results variable. We will later reassign the value, so we'll need to use our `let` keyword.

```js
export const jacobsthal = (n, previousValues = []) => {
  let result;
  if (n < 2) {
    return n;
  }
  return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
};
```

Instead of returning our computations directly, we'll explicitly wrap our recursive sequence in an `else` block and assign our `return` options to `result` rather than returning them directly.

```js
export const jacobsthal = (n, previousValues = []) => {
  let result;
  if (n < 2) {
    result = n;
  } else {
    result = jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  }
};
```

Now, after our conditionals have evaluated and assigned a value to `result`, we set `previousValues` at index `n` equal to our current result, then return `result`, thus caching this value and making it accessible as a `return`.

```js
export const jacobsthal = (n, previousValues = []) => {
  let result;
  if (n < 2) {
    result = n;
  } else {
    result = jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  }
  previousValues[n] = result;
  return result;
};
```

Next, the first thing our function should do is check to see if `previousValues` at index `n` exists. If it does, we'll simply return it.

```js
export const jacobsthal = (n, previousValues = []) => {
  if (previousValues[n]) {
    return previousValues[n];
  }
  let result;
  if (n < 2) {
    result = n;
  } else {
    result = jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  }
  previousValues[n] = result;
  return result;
};
```

Lastly, we'll pass our `previousValues` as an argument to our recursive sequence.

```js
export const jacobsthal = (n, previousValues = []) => {
  if (previousValues[n]) {
    return previousValues[n];
  }
  let result;
  if (n < 2) {
    result = n;
  } else {
    result = jacobsthal(n - 1, previousValues) + 2 * jacobsthal(n - 2, previousValues);
  }
  previousValues[n] = result;
  return result;
};
```

## Conclusions (for real this time)

_Whew_. We can now test our newly (thoroughly) memoized component. Try 35 again. Pretty snappy, huh? So snappy, in fact, that if we enter 1026 as our input, it's still responsive. Even calculating '`Infinity`' doesn't crash our app. And yes, `useMemo` is still doing its thing. There is no lag in our other input.

If you'd like to dive deeper with useMemo, you can learn more in the [official React docs](https://beta.reactjs.org/apis/react/useMemo).

# Resources

- [useMemo](https://beta.reactjs.org/apis/react/useMemo)
- [useCallback](https://medium.com/@austinrt/demystifying-react-Hooks-usecallback-7c78fac08947)
- [Recursion](https://www.freecodecamp.org/news/understanding-recursion-in-javascript-1938884c6be8/)
- [Time Complexity](https://www.freecodecamp.org/news/time-complexity-of-algorithms/)
- [Memoization](https://www.geeksforgeeks.org/javascript-memoization/)
- [Jacobsthal Number](https://en.wikipedia.org/wiki/Jacobsthal_number)
