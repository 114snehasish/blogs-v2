---
title: "Quick Tip: Template Literal Types in Typescript 4.1"
date: "2022-02-08"
slug: "template-literal-types-in-typescript-4-1"
description: "This quick article talks about the Template Literal Type features introduced in Typescript version 4.1 which uses string interpolation."
tags: ["bite sized", "code", "tips", "typescript"]
wordpressId: 282
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/template-literal-types-in-typescript-4-1/typescript-4.1.png"
coverImageResolutions:
  thumbnail: "/blog-images/template-literal-types-in-typescript-4-1/typescript-4.1-150x150.png"
  medium: "/blog-images/template-literal-types-in-typescript-4-1/typescript-4.1-300x167.png"
  full: "/blog-images/template-literal-types-in-typescript-4-1/typescript-4.1.png"
seo:
  ogTitle: "Quick Tip: Template Literal Types in Typescript 4.1 Blogs by Snehasish"
  ogDescription: "This quick article talks about the Template Literal Type features introduced in Typescript version 4.1 which uses string interpolation."
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2022/02/typescript-4.1.png"
  twitterCard: "summary_large_image"
  twitterTitle: "Quick Tip: Template Literal Types in Typescript 4.1 Blogs by Snehasish"
  twitterDescription: "This quick article talks about the Template Literal Type features introduced in Typescript version 4.1 which uses string interpolation."
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2022/02/typescript-4.1.png"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/web-development/template-literal-types-in-typescript-4-1/"
---

We all know that Typescript supports custom union types that only allows specific values to the variables of that type, like below:

```typescript
type mood ='😀' | '😔' | '😡' | '😭' | '😢' | '💔';

type intensity = '1x' | '2x' | '5x' | '10x' | '100x';
```

But what if we want to have a combined type that unions all possible combination of above two types?

Thanks to Template Literal Type features in Typescript 4.1, which allows us to combine multiple types using string interpolation like below:

```typescript
type intenseMood = `${intensity}-${mood}`;
```

That gives us a new type will all possible values like below:

![](/blog-images/template-literal-types-in-typescript-4-1/typescript-4.1.gif)
