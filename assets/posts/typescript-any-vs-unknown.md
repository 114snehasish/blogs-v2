---
title: "any vs unknown in Typescript &#8211; which one should you pick"
date: "2023-03-18"
slug: "typescript-any-vs-unknown"
description: "I was quite curious about the fact that Typescript supports both any and unknown types which can be used to store any type of data without strict type checking. I had no Idea why there are two types for the same reason. I recently came to know their differences. Lets understand with below snippets. Photo [&hellip;]"
tags: ["bite sized", "tips", "typescript", "web dev tricks"]
wordpressId: 397
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/typescript-any-vs-unknown/chien-nguyen-minh-yU5NdAg09f4-unsplash-scaled.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/typescript-any-vs-unknown/chien-nguyen-minh-yU5NdAg09f4-unsplash-150x150.jpg"
  medium: "/blog-images/typescript-any-vs-unknown/chien-nguyen-minh-yU5NdAg09f4-unsplash-300x238.jpg"
  mediumLarge: "/blog-images/typescript-any-vs-unknown/chien-nguyen-minh-yU5NdAg09f4-unsplash-768x608.jpg"
  large: "/blog-images/typescript-any-vs-unknown/chien-nguyen-minh-yU5NdAg09f4-unsplash-1024x811.jpg"
  full: "/blog-images/typescript-any-vs-unknown/chien-nguyen-minh-yU5NdAg09f4-unsplash-scaled.jpg"
seo:
  ogTitle: "any vs unknown in Typescript - which one should you pick - Blogs by Snehasish"
  ogDescription: "This quick post describes the different capabilities provided by 'any' and 'unknown' types in typescript and their uses"
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2023/03/chien-nguyen-minh-yU5NdAg09f4-unsplash-scaled.jpg"
  twitterCard: "summary_large_image"
  twitterTitle: "any vs unknown in Typescript - which one should you pick - Blogs by Snehasish"
  twitterDescription: "This quick post describes the different capabilities provided by 'any' and 'unknown' types in typescript and their uses"
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2023/03/chien-nguyen-minh-yU5NdAg09f4-unsplash-scaled.jpg"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/web-development/typescript-any-vs-unknown/"
---

I was quite curious about the fact that Typescript supports both **any** and **unknown** types which can be used to store any type of data without strict type checking. I had no Idea why there are two types for the same reason. I recently came to know their differences. Lets understand with below snippets.

![](/blog-images/typescript-any-vs-unknown/any-type.jpg)

Figure 1: any type in Typescript does not restrict invalid operations

![](/blog-images/typescript-any-vs-unknown/unknown-not-allowing-all-operation.jpg)

Figure 2: unknown type in Typescript restricts arbitrary operations to a variable, requiring us to use narrowing

![](/blog-images/typescript-any-vs-unknown/type-narrowing-with-unknown.jpg)

Figure 3: Type narrowing in action for unknown types

Photo by [Chien Nguyen Minh](https://unsplash.com/@wru_fightming?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/yU5NdAg09f4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
