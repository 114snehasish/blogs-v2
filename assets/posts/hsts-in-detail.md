---
title: "What is HSTS and how it can help  securing websites"
date: "2021-06-16"
slug: "hsts-in-detail"
description: "HSTS or HTTP Strict Transport Security enables supported browsers and user agents to strictly use HTTPS scheme for a website no matter what the scenario is. We’ll discuss in details how this works and how site owners can make use of if."
tags: ["hsts", "HTTPS", "Security"]
wordpressId: 71
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/hsts-in-detail/http-368146_1920-1536x1086-copy.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/hsts-in-detail/http-368146_1920-1536x1086-copy-150x150.jpg"
  medium: "/blog-images/hsts-in-detail/http-368146_1920-1536x1086-copy-300x212.jpg"
  mediumLarge: "/blog-images/hsts-in-detail/http-368146_1920-1536x1086-copy-768x543.jpg"
  full: "/blog-images/hsts-in-detail/http-368146_1920-1536x1086-copy.jpg"
seo:
  ogTitle: "What is HSTS and how it can help securing websites - Blogs by Snehasish"
  ogDescription: "HSTS or HTTP Strict Transport Security enables supported browsers and user agents to strictly use HTTPS scheme for a website no matter what the scenario is. We'll discuss in details how this works and how site owners can make use of if."
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2021/06/http-368146_1920-1536x1086-copy.jpg"
  twitterCard: "summary_large_image"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/full-stack-engineering/hsts-in-detail/"
---

Table Of Contents

1.  [The Definition](#the-definition)
2.  [A Bit History](#a-bit-history)
3.  [The Need](#the-need)
    -   [HTTP to HTTPS redirection is not secure](#http-to-https-redirection-is-not-secure)
        -   [HTTP Downgrade attack:](#http-downgrade-attack)
        
        -   [Session/Cookie Hijacking:](#sessioncookie-hijacking)
        
        -   [Phishing:](#phishing)
4.  [Adding HSTS support](#adding-hsts-support)
    -   [What the browser does for HSTS](#what-the-browser-does-for-hsts)
    
    -   [The preload directive](#the-preload-directive)
        -   [How to see if chrome cached a domain as HSTS enabled](#how-to-see-if-chrome-cached-a-domain-as-hsts-enabled)
5.  [Removing HSTS Support](#removing-hsts-support)
6.  [Conclusion](#conclusion)

Have you ever noticed that you go to your web browser and type “youtube.com” and hit enter and end up landing on “https://youtube.com”? You might be thinking that it is a simple http to https redirection that has been implemented at the application end and that at the end of the day landed you on the https version of the site. Well, you are mostly correct. But that’s not all there is. Lets us dig deep to understand what is happening behind the scene.

### The Definition

**HSTS** or **HTTP Strict Transport Security** is a mechanism that enforces browser to use HTTPS if the user did not explicitly mention the URL scheme. Even if the user manually types _http://example.com_, or click on a hyperlink with http in it, it will always use _HTTPS_ instead. Now Chrome 90 by default uses _HTTPS_ if the user does not explicitly mention the scheme. But this is something specific to browser implementation and not part of the HTTP Standard.

### A Bit History

HSTS was first ideated as early as 2009 and was submitted to IETF as draft in 2012. It has become a part of the standard in 2015. You might want to read [RFC-6797](https://datatracker.ietf.org/doc/html/rfc6797) for more details on the actual proposal.

### The Need

You might be asking if a site runs on HTTPS, and if there is HTTP to HTTPS redirection implemented at the application side or at the proxy end, why it is necessary to implement something like HSTS to enhance the website’s security? To understand the need, lets create a scenario, where our website “example.com” does not implement HSTS and rely on good old redirection techniques to let users always use HTTPS.

#### HTTP to HTTPS redirection is not secure

Our site “example.com” does not uses HSTS rather rely on HTTPS and redirection to provide a “secure” user experience. That means when a user goes to “http://example.com”, the request will go to the server unencrypted. Now the expectation is the HTTP to HTTPS redirection service will send a response back to the user agent with a redirect response code(generally 301) and the **location** header set to “https://example.com”. Thus the next request that the user agent/browser sends to https://example.com. below are 2 screen grabs of my chrome network tab to explain this:

![initial request and response with HTTP scheme](/blog-images/hsts-in-detail/image.png)

Initial Request with HTTP scheme. It returns a 301 redirection code with Location header set to HTTPS equivalent

![](/blog-images/hsts-in-detail/image-1.png)

The next request made by the browser to the actual https version of the website

Now, below can happen if you are visiting a non HTTPS site:

###### **HTTP Downgrade attack:**

If a request is going through not secure http channel, anyone in the middle can intercept the request and modify the content of the request and then forwards it to the actual intended server. The attacker changes the content so that the server thinks that the user is using very old computer or browser which does not support latest security protocols and mechanism. Thus the server establishes a connection to the user with fallback protocols which are legacy and vulnerable.

###### **Session/Cookie Hijacking:**

Cookie/Session hijacking is a mechanism where a cyber-criminal can steal users’ session cookie for a website and do whatever they want to do in the website pretending to be the user. In this case the website does not have any other way to validate the authenticity of the attacker as the attacker presents a valid session cookie to the server. Think this situation for a banking website. The victim can lose all of his hard-earned money if they become the victim of this exploit.

###### **Phishing:**

This might be one of the most – if not the most, infamous cyber attacks out there. If someone makes an insecure HTTP request, it can be person-in-the-middle-attacked by intercepting the unencrypted and unsigned request. Rather than forwarding the request to the intended server, the attacker can return back a response then and there asking the browser to redirect to their evil site. The browser will happily accept the redirection request as there is no validation involved in an unsigned HTTP request. As the end user, one might not notice that the URL they have been redirected to is not the one they intended. Trust me, there are symbols in the Unicode character set that looks completely similar to one another. End users who are technical, even they can not spot the difference between the URLs in these cases.

Note that these topics themselves deserve dedicated articles. I will definitely try to write articles related to these topics in the future. For now, lets focus on HSTS and how it can help us avoiding the above said scenarios.

### Adding HSTS support

Adding HSTS support is not at all a hard task. The web server just needs to return a specific HTTP header in it’s response. When browser or any other user agent that supports HSTS, sees the header in the response, they understand that the server implements HSTS and acts accordingly. What the browsers do exactly? we’ll discuss in next section. The specific HTTP header is “**strict-transport-security**” and has the below directives:

```
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; preload
```

As you can see from above, the **strict-transport-security** header supports 3 directives:

-   **max-age=<expire-time>:** This directive denotes the browsers/user agents for how long they can cache the fact that the web server is having HSTS implemented. <expire-time> is denoted in seconds. That means, if the browser makes a request to a web server and finds that in the response there is **strict-transport-security: max-age=300**, that means the browser will cache the fact that the web server is on HSTS for the next 5 minutes.
-   **includeSubDomains:** This is an optional directive. if the directive is present in the response, then the browser will consider that all the subdomains also supports HSTS. That means if the bowser sees the directive in a response from example.com, the browser will consider \*.example.com to be on HSTS.
-   **preload:** This is also an optional directive. To understand the meaning of this directive, we first need to know what the browser/user agent really does if it receives **strict-transport-security** in the first place. So we will come back to this preload thing very soon.

#### What the browser does for HSTS

If a browser knows that a domain is on HSTS and if the max-age period is still not expired, it will default all the http request to use HTTPS scheme. that means even though user just types **example.com** or **http://example.com**, browser will not make the http request come out in the internet at all. It will automatically convert the scheme to HTTPS. That means with HSTS, the http to https redirection is happening within the browser itself, not over the internet with 1 unsecure roundtrip. See below screen grab for facebook.com. I intentionally tried accessing http://facebook.com and see what the browser does for me:

![Facebook with HSTS implementation](/blog-images/hsts-in-detail/Capture.png)

facebook.com with HSTS implemented

![](/blog-images/hsts-in-detail/Capture1.png)

The very next request is the HTTPS version of the site.

As you can see from the above screen grab, somehow my browser knew that Facebook implements HSTS, thus when I first make the http request, it makes a **307 internal redirect**. In that redirect response, you can see the **location** header is set to **https://facebook.com** and the reason of the redirect is **HSTS**. That result in the very next request to be on https://facebook.com. In this response you can see. that the server returned **strict-transport-security** header with **max-age=15552000** and **includeSubdomain** directives. This means from that moment onwards the browser will know the fact that it can confidently change any future http request to https for the next 6 months. It will also apply the same rule if I try to visit **developer.facebook.com** or **api.facebook.com** or any other subdomains of Facebook.

#### The preload directive

Lets say you have never visited a site in your browser. So the specific browser does not know about the site. It also can not predict if the site supports HSTS and upgrade from HTTP to HTTPS internally. In this case if you try to access the site using **https** protocol first, then its okay and the browser will know whether to cache the domain as HSTS enabled or not. But if the very first request that you send is over **http**, then the request will go to the internet to get redirected to the https version. In this case you might become the victim of all the attacks that we have talked about. As you can see here, you must visit the site once to let the browser know that the site is on HSTS. If this is okay with you as a site owner, then its okay. But for a banking site or like the large social media sites, they might want to secure their communication with the client even if its the first request.

Also, if someone clears the browser cache, all the HSTS related info is wiped out from the browser. Again for any next http call will go to the internet.

##### **How to see if chrome cached a domain as HSTS enabled**

If you using chrome, you can query if a particular domain is already cached as HSTS enabled or not, by following the below step:

-   In chrome go to **chrome://net-internals/#hsts**
    -   In the page that appears, you can query for existing domains, add domains which is not already cached

![](/blog-images/hsts-in-detail/image-3.png)

Quarrying if a domain is cached to be on HSTS in Chrome

As you understand that these HSTS information is decentralized and browser specific, no one can predict how the site will behave in certain client machine. This is the reason the **preload** directive comes in handy. It makes this information somewhat centralized. If a browser sees that the directive is present, that means it knows that they can add this domain to the list of HSTS enabled domains in their source code directly.

No, do not think that If your website is sending the **preload** directive in its HSTS header, the browser will automatically notice it and add the site permanently to the source code in it’s future release. This is not automatic. You need to go to [This Site](https://hstspreload.org/ "This site") to submit a HSTS preload request. But this has certain criteria to submit a request to preload a domain. You can check the link and see the criteria in details. Once you submit your request, your site will be added to chrome’s HSTS domain preload list and hardcoded into the source code of chrome. Other browsers take the list from chrome. So eventually all popular browsers will have your site preloaded after it is approved.

### Removing HSTS Support

Removing HSTS support from your site is not as simple as preloading it. For any odd reason, if you want to remove https support from your website, you can not do it right away. Because all the browsers who have accessed your website have cached the HSTS info for a specific time period. So they will always try to access your website in HTTPS mode. If you want to come back to http for some reason, you need to do multiple deployments of your website by slowly reducing **max-age** value, so that you make sure all of your users’ browsers invalidated the cache before you move to HTTP.

### Conclusion

As you can see, HSTS will increase your website’s security by completely eliminating http traffic to your website. This will definitely help us make a safe and better internet.
