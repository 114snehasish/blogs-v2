---
title: "Function Currying in JavaScript with real world examples"
date: "2022-02-13"
slug: "function-currying-in-javascript"
description: "This article explains what Function Currying in JavaScript is and let you understand the benefits of using it using real world examples."
tags: ["code", "JavaScript"]
wordpressId: 292
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-scaled.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-150x150.jpg"
  medium: "/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-300x200.jpg"
  mediumLarge: "/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-768x511.jpg"
  large: "/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-1024x681.jpg"
  full: "/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-scaled.jpg"
seo:
  ogTitle: "Function Currying in JavaScript with real world examples - Blogs by Snehasish"
  ogDescription: "This article explains what Function Currying in JavaScript is and let you understand the benefits of using it using real world examples."
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2022/02/chuttersnap-2TSv-Z3GUtI-unsplash-scaled.jpg"
  twitterCard: "summary_large_image"
  twitterTitle: "Function Currying in JavaScript with real world examples - Blogs by Snehasish"
  twitterDescription: "This article explains what Function Currying in JavaScript is and let you understand the benefits of using it using real world examples."
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2022/02/chuttersnap-2TSv-Z3GUtI-unsplash-scaled.jpg"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/web-development/function-currying-in-javascript/"
---

![Featured Image](/blog-images/function-currying-in-javascript/chuttersnap-2TSv-Z3GUtI-unsplash-1024x681.jpg)

Photo by [CHUTTERSNAP](https://unsplash.com/@chuttersnap?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/curry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Table Of Contents

1.  [The Need to write the article](#the-need-to-write-the-article)
2.  [What is Function currying](#what-is-function-currying)
3.  [You need a situation to understand the need](#you-need-a-situation-to-understand-the-need)
    -   [Why the name "Currying"](#why-the-name-currying)
4.  [A bit involved example](#a-bit-involved-example)

## The Need to write the article

Every time I try finding some good post related to Function currying in JavaScript, I always find blogs/articles/tutorials related to how you can implement function currying in JavaScript. But those did not mention why you need to know or use function currying in the first place. In this article I will describe what exactly function currying is and why you would need something like this to achieve something better for JS projects.

## What is Function currying

In simple terms, and what you will find everyone is saying, function currying in JavaScript is the process of splitting a function that takes multiple arguments, into multiple nested functions which take the individual arguments. For example, if we have a function below:

```javascript
function func(x, y, z) {
  //do something
}
```

To curry the above function, we can do something like below:

```javascript
function func(x) {
  //do something
  function inner1(y) {
    //do something
    function inner2(z) {
      //do something
    }
    return inner2;
  }
  return inner1;
}
```

Now, instead of calling the function in a regular way by passing 3 arguments at once, you can now use IIFE to call the function. Like below:

```javascript
//This is the regular way you can call func before it was curried
func(10, 20, 30);
//you need to call the function like this(in IIFE fashion or
//you may capture the inner functions into different variables if you want)
func(10)(20)(30);
```

But the question is why you would want to do this? Why someone want to break their function into multiple nested functions? what are the benifits?

To Understand this, lets imaging a situation.

## You need a situation to understand the need

Imagine on a fine Friday, you boss gives you a task for your project, where you need to write a functionality, where whatever you throw at it, it will give you double of it. You worked hard and found a solution that works:

```javascript
function double(x) {
  return 2 * x;
}
```

After running successful unit tests, you happily pushed the code and started packing up things to leave for the day, when you receive another untimely call from your boss. Now your boss is asking you to write a functionality which give you triple of what you give. Now you are in hurry. It is Friday night and you are already bit late for starting your awesome weekend. Knowing that you will be doing injustice to the code, what you have done is, copying the code you have already written and modified the name and the logic like below to get things done quickly.

```javascript
function triple(x) {
  return 3 * x;
}
```

While you were committing your new code, you got another call from your boss asking for functionality that gives quadruple.

Now, you really thought, if your further duplicate the code, you will do huge injustice to the code. So, this time you give it a thought and tried to figure out how you can refactor the code so that you can omit duplicity. You find that all different functionalities are nothing but multiplication in it’s core. So instead of creating functions which doubles or triples things, you now write a function that multiplies like below:

```javascript
function multiply(x) {
  function inner(y) {
    return x * y;
  }
  return inner;
}
```

Instead of writing **multiply** function with 2 arguments, you curried it. Which gives you to do something cool like below:

```javascript
const double = multiply(2);
const triple = multiply(3);
const quadruple = multiply(4);

console.log(double(10)); //20
console.log(triple(10)); //30
console.log(quadruple(10)); //40
```

Like above, now the consumer of **multiply** can create as many functions as they want by calling multiply with different arguments. This time, **double**, **triple** or **quadruple** knows what is one of the arguments that is present in their lexical scope, and due to the capability of **closures**, that information persists even though **multiply** finishes it’s execution.

### Why the name “Currying”

Comparing the above example with Curries, you can prepare curry by following one recipe. Then if you throw fish at it, it becomes fish curry, if you give chicken, it will be chicken curry, if you use egg, you get egg curry. Similarly you can use function currying to reuse code in different situations

## A bit involved example

Imaging you need to have 3 different functionalities, which iterate through an array that they receive and return sum of

-   All Elements
-   Odd Elements
-   Even Elements

If you don’t care of code duplicity, you may end up creating something like below:

```javascript
const sum = (array) => array.reduce((e1, e2) => e1 + e2, 0);

const sumEven = (array) =>
  array.filter((e) => e % 2 === 0).reduce((e1, e2) => e1 + e2, 0);

const sumOdd = (array) =>
  array.filter((e) => e % 2 !== 0).reduce((e1, e2) => e1 + e2, 0);
```

But if you think closely, you can reduce the code duplicity and create extensible code by using something like below:

```javascript
const sumArray = (filter) => (array) =>
  array.filter(filter).reduce((e1, e2) => e1 + e2, 0);

const sum = sumArray(() => true);
const sumEven = sumArray((e) => e % 2 === 0);
const sumOdd = sumArray((e) => e % 2 !== 0);
```

The above code allows us have concise and free of duplicate codes. It is also extensible. For example if in future, there is any requirement to get the sum of prime numbers only, we just have to write code that checks whether a number is prime or not and plug that in into our code.

Thanks for reading through. I hope, this help you better understand the concept of function currying better.

Happy Coding 🙏🙏🙏
