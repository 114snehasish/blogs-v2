---
title: "Difference between target=\"_blank\" and target=\"blank\""
date: "2021-07-06"
slug: "difference-between-target_blank-and-targetblank"
description: "This short article talks about target attribute in tags and see the different result that you get when you use target=blank vs target=_blank"
tags: ["bite sized", "web dev tricks"]
wordpressId: 156
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/difference-between-target_blank-and-targetblank/image.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/difference-between-target_blank-and-targetblank/image-150x150.jpg"
  medium: "/blog-images/difference-between-target_blank-and-targetblank/image-300x147.jpg"
  full: "/blog-images/difference-between-target_blank-and-targetblank/image.jpg"
seo:
  ogTitle: "Difference between target=_blank and target=blank Blogs by Snehasish"
  ogDescription: "This short article talks about target attribute in tags and see the different result that you get when you use target=blank vs target=_blank"
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2021/07/image.jpg"
  twitterCard: "summary_large_image"
  twitterTitle: "Difference between target=_blank and target=blank Blogs by Snehasish"
  twitterDescription: "This short article talks about target attribute in tags and see the different result that you get when you use target=blank vs target=_blank"
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2021/07/image.jpg"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/web-development/difference-between-target_blank-and-targetblank/"
---

In this short article, we will look at the differences between target=”\_blank” and target=”blank”.

### Usage

“target” is a HTML element attribute that we generally used in anchor tags to control if the link is going to be opened in the same tab, or a different tab or on a different browser window.

-   Not mentioning “target” attribute will open the link in the same browser tab.
-   **target=”\_self”** is same as the default behavior. That means it will open the link in the same tab.
-   **target=”\_blank”** will open the link in a separate browser tab (or window as this can be configured in the browsers’ settings)
-   **target=”\_parent”** will open the link in the parent tab/window from where the current tab/window was originated. So you can say this is the reverse of “\_blank”. If there is no parent then it behaves as “\_self”
-   **target=”\_top”** will open the link in the root parent. This is almost similar to “\_parent”, but this will open the link in the root parent instead of immediate parent. For example, if tab A opens tab B, then tab B opens tab C, then if a link tag is clicked in tab C with target=”\_top”, then will open in tab A.

In real life projects, mostly, either we do not use target attribute. or we use it in conjunction with “\_blank”.

### The difference

Lets try to understand the difference with the help of an example. Lets assume, **tab A** has opened a webpage with 3 links in it: **link1, link2, link3.** All of them have target=”\_blank”. Now if you click on these links, 3 more tabs/windows will open to show the content behind the link.

Now lets consider the links now have target=”blank”. We first click on **link1,** it will open up in a new tab, say **tab B**. now lets come back to **tab A** again and click on **link2**. To your surprise, it will also open the link in **tab B.** **link3** will also open up in **tab B**.

So, as you can see, with target=\_blank, browser will spawn new tabs/window for every links. But for target=blank, it will just create a new tab for the first link. All subsequent links will open in the same tab again and again.
