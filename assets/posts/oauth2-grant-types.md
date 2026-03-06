---
title: "Understanding different Grant Types in OAuth2 and how to use them correctly"
date: "2023-03-26"
slug: "oauth2-grant-types"
description: "This article describes all available Grant Types in OAuth2.0 in detail to understand how to use them correctly."
tags: ["OAuth2", "Security"]
wordpressId: 410
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/oauth2-grant-types/micah-williams-lmFJOx7hPc4-unsplash-scaled.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/oauth2-grant-types/micah-williams-lmFJOx7hPc4-unsplash-150x150.jpg"
  medium: "/blog-images/oauth2-grant-types/micah-williams-lmFJOx7hPc4-unsplash-300x200.jpg"
  mediumLarge: "/blog-images/oauth2-grant-types/micah-williams-lmFJOx7hPc4-unsplash-768x512.jpg"
  large: "/blog-images/oauth2-grant-types/micah-williams-lmFJOx7hPc4-unsplash-1024x683.jpg"
  full: "/blog-images/oauth2-grant-types/micah-williams-lmFJOx7hPc4-unsplash-scaled.jpg"
seo:
  ogTitle: "Understanding different Grant Types in OAuth2 and how to use them correctly - Blogs by Snehasish"
  ogDescription: "This article describes all available Grant Types in OAuth2.0 in detail to understand how to use them correctly."
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2023/03/micah-williams-lmFJOx7hPc4-unsplash-scaled.jpg"
  twitterCard: "summary_large_image"
  twitterTitle: "Understanding different Grant Types in OAuth2 and how to use them correctly - Blogs by Snehasish"
  twitterDescription: "This article describes all available Grant Types in OAuth2.0 in detail to understand how to use them correctly."
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2023/03/micah-williams-lmFJOx7hPc4-unsplash-scaled.jpg"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/full-stack-engineering/oauth2-grant-types/"
---

Table Of Contents

1.  [TL;DR OAuth2](#tldr-oauth2)
    -   [The Client](#the-client)
    
    -   [The Resource Server](#the-resource-server)
    
    -   [Authorization Server](#authorization-server)
2.  [What is Grant Type](#what-is-grant-type)
    -   [Password Grant Type](#password-grant-type)
    
    -   [Implicit Grant Type](#implicit-grant-type)
    
    -   [Authorization Code Grant Type](#authorization-code-grant-type)
    
    -   [Authorization Code With PKCE enhancement](#authorization-code-with-pkce-enhancement)
        -   [Public Client](#public-client)
        
        -   [Confidential Client](#confidential-client)
    -   [Client Credentials](#client-credentials)
3.  [Conclusion](#conclusion)

Grant Types are one of the important aspect when configuring OAuth2 in your applications. In this post we will discuss the different Grant Types OAuth2 offers so that we can take informed decision when to use what for a given use case. But before that, lets quickly recap what OAuth2 really is. I am planning to publish a detailed post on OAuth2 in near future.

## TL;DR OAuth2

In a single sentence OAuth2 is an authorization protocol, where a **client** can consume a **resource server** by gaining an **access token** from the **authorization server**. This access token issued by the authorization server is the key for the client to be able to consume the resource server on behalf of the user.

### The Client

The client is the application being used by the end users. It can be anything from a Single Page applications to traditional Web application; from Mobile apps to desktop applications; from CLI tools to smart appliances – basically any piece of software that can talk to the internet.

### The Resource Server

The Resource server is nothing but the protected service that the client is consuming. It can be a first party backend(meaning the backend created in the first place for the client itself) or, it can be a third party service(meaning any service meant to be consumed by multiple clients and not necessary be maintained by same team/company).

### Authorization Server

It’s the centralized application that is maintaining the user credentials and taking care of the actual user authentication mechanism. For example, when you see “Sign in with Google” button in an application, the application/client uses **accounts.google.com** as the Authorization server. In the context of enterprise applications, [Okta](https://www.okta.com/), [Ping Identity](https://www.pingidentity.com/en.html), they are very popular SAAS solutions to authorization servers. [Keycloak](https://www.keycloak.org/) is one of the most commonly used self-managed open-source authorization server. They can also be custom made, but its quite obvious that it would be very daunting task to do.

## What is Grant Type

Simply put, Grant Type is nothing but different ways a Client can get an access token from an Authorization Server. You might ask, is there a real need of multiple Grant Types in OAuth2? Are we not over-complicating the protocol by adding multiple ways/flows? The answers will be obvious as you read along.

Let’s now discuss different Grant Types in details. To understand them better I will use a use case where a **user** is using an **application**, which can download images from the user’s **Google Drive**, apply some filter to them, and then save them back to **Drive**. Below are the Grant Types available in OAuth 2.0 standards:

-   Password Credentials
-   Implicit
-   Authorization Code
-   Authorization Code with PKCE
-   Client Credentials

### Password Grant Type

Password Grant Type is the simplest form of the grant type available. They are also sometimes called **Resource Owner Credential Grant Type**. Let’s understand how client gets the required access token in this grant type with our example use case.

1.  The Client directly askes the user their Google credentials.
2.  User provides their Google credentials to the Client directly.
3.  The Client produces the credential to the authorization server of Google.
4.  Google validates the credentials of the user and if that is correct, it replies back to the client with the token.

Now, if you think about this, this grant type should not be used at all in case of the **Application** is not developed/managed by Google themselves. If that’s the case the user is simply giving away their precious Google ID and password to some third party application. If its a shady application, it might misuses the credentials. If the application is directly associated to Google themselves, then also this grant type is not a suitable choice, because we are not following the concept of **delegated authentication** or **the separation of concerns**. That means, the user credentials must not leak into the application/client directly, event though its just for message passing. The application/client should be unaware of user credentials in every possible way. This is the reason, **this grant type is marked as deprecated in OAuth2.0 and will be removed in OAuth2.1.**

### Implicit Grant Type

This is a little improvement towards Password Grant Type. It flows like this:

1.  The Client redirects the user to the Authorization Server.
2.  The Authorization Server takes care of authenticating the user.
3.  Upon successful authentication, the Authorization Server redirects the user back to the Client. While redirecting, it puts the access token directly as a URL Parameter of the Client’s redirection URL.
4.  After redirection is complete and the user is back to the Client, the Client then reads the provided access token directly from the URL.

From the above flow, you might think that Implicit Grant Type is the ultimate solution to the Password Grant Type’s problem. But, to your surprise, Implicit flow is **also deprecated in OAuth2.0 and will be removed in OAuth2.1 specification.** **BUT WHY??** it seems all are okay with the implicit flow, right? It used to be a perfect solution back in the days when it was first introduced. But with the technological advancements that have happened throughout the last decade, make this grant type not suitable any more. Below are few points to justify that:

-   As the access token is directly sent back in the redirect URL, it might end up getting logged into anywhere like layer 7 proxies or may be some WIFI gateway.
-   Browsers generally save users’ browsing history, and there the redirected URL, along with the access token might get logged and may be synched across all the platforms if the user has enabled browser sync feature.
-   Browser plugins can directly access the access token as it is part of the URL.

So, you see, putting the access token directly in the redirect URL is where the problem lies. Let’s try to solve this with our next Grant Type.

### Authorization Code Grant Type

This is again an improvement towards to Implicit Grant Type. Let’s see how:

1.  The Client redirects the user to the Authorization Server.
2.  The Authorization Server takes care of authenticating the user.
3.  Upon successful authentication, the Authorization Server redirects the user back to the Client. **While redirecting it puts a short-lived, one time usable random string(called code)** as a URL parameter of the Client’s redirection URL.
4.  After redirection is complete and the user is back to the Client, the Client then reads the provided **code** directly from the URL.
5.  The client then makes another **Back Channel** call to the Authorization Server to get the actual access token in exchange of the **code** received in the previous step.

You may ask why adding one more step to implicit flow makes this Grant Type a better choice? Here also, the **code** can leak into other resources like mentioned previously. But, here the catch is, even though the **code** might be known to other parties, but, no one except the client can get the **access token** in exchange of the **code.** How? Let’s concentrate on the details of step 5. It will be clearer.

When Clients makes the **Back Channel** call to the Authorization server, it needs to pass few things along with the just received code. They are:

-   **Client ID:** This acts like unique identifier of the Client itself. Because there might be hundred other applications talking to the same Authorization Server. This ID lets Authorization Servers understand for which client its currently serving to. This Client ID is also passed as URL parameter in step 1 above. The client puts it’s ID in the redirect URL so that the Authorization server generates the **code** against this specific Client ID.
-   **Client Secret:** This acts like a password of the Client to the Authorization Server. This is a secret and only known to the Client and Authorization Server. So, when the Authorization server sees the correct combination of Client ID and Client Secret in Step 5, it understand the legitimate client is asking for the access token in exchange of the **code.**
-   **Grant Type:** this contains ‘**code**‘ as the value. This is also sent as URL parameter in step 1.
-   **Redirect URL:** the client URL that the Authorization server should use to redirect the user back to the Client. This needs to match with one of the preconfigured set of URLs for the Client so that the Authorization Server does not end up sending the code to any random application. This is only sent in the URL parameter in step 1 and step 5 does not send this information again.

Please note that the time gap between step 4 and 5(means the time gap between receiving the **code** and sending it back to Authorization server for the actual token) should be minimal as the time duration for the **code** to be active is very short(generally between 30 secs to 1 min).

When we say **back channel** request, it means a separate API call to the Authorization server, which is hidden from the end user. It can be AJAX call in the front end itself, or may be a call from the Client’s own backend. This distinction will be helpful to understand why Authorization Code Grant type is not always the solution.

### Authorization Code With PKCE enhancement

In our previous grant type’s step 5, if the back channel call is made through the client itself, for example, AJAX call in the browser, anyone can easily inspect the network activity and figure out the the **Client Secret**. If that happens, it can be stolen and any other application can misuse them to get the access token. We need some other way. Welcome **PKCE – Proof of Key Code Exchange**. But before jumping into the details of how it works, lets first clear thing out where **Authorization Code** flow is still relevant. To understand that we have to understand the Client Types

#### Public Client

These are the type of clients where the entire source code can be exposed, or any network activity can be monitored. For example, Single Page Web Application, mobile apps, desktop apps, CLI tools etc. Here, we can not store the client secret in the source code as it can be exposed easily. Please note if these types of clients have their own backend, then the backend can be utilized for the back channel calls. For example if we use React Single Page Apps, but with meta frameworks like **NextJS,** it can not be called public client any more, because it has it’s own backend in-spite of being an “SPA”. So at the end of the day it completely depends on the architecture of the application to determine it to be public client.

#### Confidential Client

These are the clients where we have a dedicated backend for the Front ended application. They are traditional web application where each page is generated in the server and served to the user, or may be any mobile/desktop/SPA with its own backend. Here the Authorization Code flow can be used with confidence as the back channel call can be made from the backend, where the Client Secret can be hidden. But, as per the security specialists, its always better to use the PKCE version of the Code flow, even if the Client is a confidential client. Lets understand how this PKCE enhance flow works.

1.  The client redirects the user to Authorization Server. While doing so, its puts below information to the URL:
    -   **Client ID:** for the same purpose as discussed in the previous flow.
    -   **Grant Type:** It simply contains **‘code’**.
    -   **Code Challenge:** Its some random String that the client generates
    -   **Code Challenge Method**: This signifies how the **Code Challenge** is generated. This parameter might contain **‘plaintext’** as the value, signifying that the client generates the random string and sends same string as the code challenge value. It might also contain some hashing algorithm names like **‘S256’** that signifies that the random string is generated first, then it is hashed with S256 hashing algorithm, and then the hashed version of the random string sent as the code challenge value. The original random string is still kept and called **Code Verifier.** So, in case of **Code challenge method** as **plaintext**, the **code challenge** value is **same** as **code verifier.** But for other cases, the **code challenge** is the **hashed** version of the **code verifier.**
    -   **Redirect URI:** Its the URL where the Authorization server needs to put the **code** back and sends the user back to Client.
    -   **State, scope** etc. but these are not relevant to understand PKCE flow.
2.  The Authorization server validates few of the parameters like:
    -   If the client ID is valid
    -   If the redirect URI is one of the preconfigured redirect URL for the client.
3.  The Authorization server takes care of the user authentication.
4.  Upon successful authentication, the Authorization Server redirects the user back to the Client. **While redirecting it puts a short-lived, one time usable random string(called code)** as a URL parameter of the Client’s redirection URL.
5.  After redirection is complete and the user is back to the Client, the Client then reads the provided **code** directly from the URL.
6.  The client then makes another **Back Channel** call to the Authorization Server to get the actual access token in exchange of the **code** received in the previous step. It sends the below information in the back channel request
    -   **Client ID:** for the same reason discussed before.
    -   **Code:** to get the access token in exchange
    -   **Code verifier:** Unlike Authorization Code flow we discussed previously, it does not send the **Client Secret**. As this code verifier is generated for every user authentication request, it can be used for any types of client- public or confidential.
7.  Upon receiving all the information from the client, the authorization server then validated:
    -   If the code corresponds to the provided client ID.
    -   **If same hashing method applied to the code verifier, is it producing the same code challenge which is provided in the initial request.** This particular verification ensures the back channel request is performed by the same party who initiated the authentication flow in the first place. So, you should never use “plaintext” as the code verifier method.
8.  Once validated, the Authorization server sends the tokens back in the response body.

So, PKCE provides a **password-less/zero knowledge proof** approach by utilizing the [Commitment capability of Hash Functions](https://en.wikipedia.org/wiki/Commitment_scheme). This enables this Grant Type to be more secure than a regular Authorization Code flow because it does not rely on client secrets(which is kind of a static password) which has higher potential to get leaked.

### Client Credentials

This particular Grant Type is used in a specific situation where there is no involvement of end users, rather the client is authenticating itself to the authorization server. This is helpful when we are dealing with process to process communication or a service to service communication in microservice architecture. Where one microservice needs to authenticate itself to the Authorization Server in order to get an access token to call other microservices. Its also a relatively simple:

1.  Client calls the token endpoint of Authorization server. It sends below information in the request
    -   **Client ID**
    -   **Client Secret**
    -   **Grant Type**
    -   **Scope**
2.  Upon validating the received information, the Authorization Server issues a token and pass it back to the client in the same request as part of the response body.

We can see from above that the Client Credentials Grant Type is pretty straight forward and has a specific use case, where we need to establish a secure machine to machine communication.

## Conclusion

From the above discussion, it should be clear to us the differences between the Grant Types OAuth2.0 offers and how to choose which one should we use for a specific use case.

Hope you have liked this post. Do comment in case you have something in your mind. 🙏🙏

Photo by [Micah Williams](https://unsplash.com/@mr_williams_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/lmFJOx7hPc4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
