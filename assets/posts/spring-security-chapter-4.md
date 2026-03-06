---
title: "Spring Security Chapter 4: Working with the AuthenticationFilter"
date: "2022-05-07"
slug: "spring-security-chapter-4"
description: "This article deals with creating our Custom Authentication Filter and making it part of Spring Security’s Filter chain."
tags: ["code", "java", "Security", "spring"]
wordpressId: 362
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/spring-security-chapter-4/main-scaled.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/spring-security-chapter-4/main-150x150.jpg"
  medium: "/blog-images/spring-security-chapter-4/main-300x200.jpg"
  mediumLarge: "/blog-images/spring-security-chapter-4/main-768x512.jpg"
  large: "/blog-images/spring-security-chapter-4/main-1024x683.jpg"
  full: "/blog-images/spring-security-chapter-4/main-scaled.jpg"
seo:
  ogTitle: "Spring Security Chapter 4: Working with the AuthenticationFilter Blogs by Snehasish"
  ogDescription: "This article deals with creating our Custom Authentication Filter and making it part of Spring Security's Filter chain."
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2022/05/main-scaled.jpg"
  twitterCard: "summary_large_image"
  twitterTitle: "Blogs by Snehasish Spring Security Chapter 4: Working with the AuthenticationFilter"
  twitterDescription: "This article deals with creating our Custom Authentication Filter and making it part of Spring Security's Filter chain."
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2022/05/main-scaled.jpg"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security/spring-security-chapter-4/"
---

Important

### Please Note

This is **one** of my spring security series. This series will cover **everything** related to Spring Security, the **architecture** from very basic to the most advanced real world scenarios. This will talk about Spring Security **from the ground up**, so that the underlying architecture is clear and we can extend the architecture in the intended way to meet the complex business need. This series will cover basic user name password based authentication to the most advanced ones like **SAML**, **OAuth2** and **OIDC**, **Multi factor authentication**, **authorization** and the **most common security concerns** in web and how we can make a robust application using the provided features of Spring Security.  
  
For the Best Possible experience, It is highly recommended to **follow since the beginning**. But if you are already an experienced spring security practitioner, you are always welcome to cherry pick the topic you need to understand.  
  
This series also has a public [GitHub repository](https://github.com/114snehasish/spring-security-series/tree/main). The repository is **divided into multiple branches**, each for the different posts/chapters in the series. Each chapter specific branch also contains multiple commits which corresponds to different checkpoints in the chapter/post. I would recommend you to use tools like [GitKraken](https://www.gitkraken.com/) to easily navigate around the repository across multiple branches and commits.

Table Of Contents

1.  [Everything we have learned so far](#everything-we-have-learned-so-far)
2.  [Running the application with tracing enabled](#running-the-application-with-tracing-enabled)
3.  [Creating Our Custom AuthenticationFilter](#creating-our-custom-authenticationfilter)
    -   [Implementing javax.servlet.Filter](#implementing-javaxservletfilter)
    
    -   [Making our filter part of Filter Chain](#making-our-filter-part-of-filter-chain)
    
    -   [Fixing our code to have correct HTTP status code in case of Authentication Failure](#fixing-our-code-to-have-correct-http-status-code-in-case-of-authentication-failure)
    
    -   [Implementing OncePerRequestFilter](#implementing-onceperrequestfilter)
4.  [Conclusion](#conclusion)
5.  [Please Note](#please-note)

### Everything we have learned so far

To learn Authentication Filters, I have gone through all the concepts we have learned so far and prepared a project including all of the concepts. The project also includes industry best practices. I recommend you to checkout the first commit on [spring-security-chapter4](https://github.com/114snehasish/spring-security-series/tree/spring-security-chapter4) and open project **spring-security-04**. I recommend you to go through the codebase so that we have a quick refresher on all of the topics like database driven User details Manager, password encoders, Authentication Provider and Security Context. The project also follows lots of industry best practices which you can look at and use straight away in your own projects.

### Running the application with tracing enabled

I have also pre-configured the **application.yml** file so that we have spring security related tracing logs enabled just so we understand what is happening with the entire application in terms of spring security.

Now, let’s run the application and hit **http://localhost:8080/api/v1/getUserDetails**. You would get the appropriate userdetails or 401 error based on what credentials you provide. But if you go back to you IDE and look at the console output, you would find lots of interesting things.

```log
2022-05-07 12:56:10.594 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Trying to match request against DefaultSecurityFilterChain [RequestMatcher=any request, Filters=[org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@14bd523b, org.springframework.security.web.context.SecurityContextPersistenceFilter@113a6636, org.springframework.security.web.header.HeaderWriterFilter@261609a7, org.springframework.security.web.csrf.CsrfFilter@593354fa, org.springframework.security.web.authentication.logout.LogoutFilter@15a2fddd, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter@187df588, org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter@165824f5, org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter@cc7909f, org.springframework.security.web.authentication.www.BasicAuthenticationFilter@6e1d9b32, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@7bad18f5, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@768e40af, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@8ce4320, org.springframework.security.web.session.SessionManagementFilter@7dfca9e6, org.springframework.security.web.access.ExceptionTranslationFilter@41c88e00, org.springframework.security.web.access.intercept.FilterSecurityInterceptor@77e5c765]] (1/1)
2022-05-07 12:56:10.595 DEBUG 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Securing GET /api/v1/getUserDetails
2022-05-07 12:56:10.595 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking WebAsyncManagerIntegrationFilter (1/15)
2022-05-07 12:56:10.597 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking SecurityContextPersistenceFilter (2/15)
2022-05-07 12:56:10.597 TRACE 20072 --- [nio-8080-exec-1] w.c.HttpSessionSecurityContextRepository : No HttpSession currently exists
2022-05-07 12:56:10.597 TRACE 20072 --- [nio-8080-exec-1] w.c.HttpSessionSecurityContextRepository : Created SecurityContextImpl [Null authentication]
2022-05-07 12:56:10.599 DEBUG 20072 --- [nio-8080-exec-1] s.s.w.c.SecurityContextPersistenceFilter : Set SecurityContextHolder to empty SecurityContext
2022-05-07 12:56:10.599 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking HeaderWriterFilter (3/15)
2022-05-07 12:56:10.600 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking CsrfFilter (4/15)
```

I did not put the entire log above, but, if you look at it, you will understand that **FilterChainProxy** is invoking 15 filters one after another. The number might be different for your case based on what Spring Security version you are using. If you look closely and try to find the log statements that we have put in our **CustomAuthProvider**, then you will find something like below:

```log
2022-05-07 12:56:10.601 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking BasicAuthenticationFilter (9/15)
2022-05-07 12:56:10.603 TRACE 20072 --- [nio-8080-exec-1] o.s.s.w.a.www.BasicAuthenticationFilter  : Found username 'mstone' in Basic Authorization header
2022-05-07 12:56:10.603 DEBUG 20072 --- [nio-8080-exec-1] c.s.s.providers.CustomAuthProvider       : Checking whether CustomAuthProvider support UsernamePasswordAuthenticationToken or not
2022-05-07 12:56:10.604 DEBUG 20072 --- [nio-8080-exec-1] c.s.s.providers.CustomAuthProvider       : The authentication type is supported
2022-05-07 12:56:10.604 TRACE 20072 --- [nio-8080-exec-1] o.s.s.authentication.ProviderManager     : Authenticating request with CustomAuthProvider (1/1)
2022-05-07 12:56:10.604 DEBUG 20072 --- [nio-8080-exec-1] c.s.s.providers.CustomAuthProvider       : Trying to authenticate mstone
2022-05-07 12:56:10.623 DEBUG 20072 --- [nio-8080-exec-1] org.hibernate.SQL                        : select user0_.id as id1_0_, user0_.account_non_expired as account_2_0_, user0_.account_non_locked as account_3_0_, user0_.credentials_non_expired as credenti4_0_, user0_.enabled as enabled5_0_, user0_.password as password6_0_, user0_.username as username7_0_ from user user0_ where user0_.username=?
2022-05-07 12:56:10.624 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [mstone]
2022-05-07 12:56:10.627 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([id1_0_] : [BIGINT]) - [2]
2022-05-07 12:56:10.629 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([account_2_0_] : [BOOLEAN]) - [true]
2022-05-07 12:56:10.629 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([account_3_0_] : [BOOLEAN]) - [true]
2022-05-07 12:56:10.629 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([credenti4_0_] : [BOOLEAN]) - [true]
2022-05-07 12:56:10.629 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([enabled5_0_] : [BOOLEAN]) - [true]
2022-05-07 12:56:10.629 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([password6_0_] : [VARCHAR]) - [$2a$10$1PxN.wZm.ju5WDAnH.ULNu21fKR8To2taV41rLBS3mkNajzFS51FG]
2022-05-07 12:56:10.629 TRACE 20072 --- [nio-8080-exec-1] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([username7_0_] : [VARCHAR]) - [mstone]
2022-05-07 12:56:10.632 DEBUG 20072 --- [nio-8080-exec-1] c.s.s.providers.CustomAuthProvider       : User found. checking password
2022-05-07 12:56:10.699 DEBUG 20072 --- [nio-8080-exec-1] c.s.s.providers.CustomAuthProvider       : User authenticated. Returning fully authenticated object
2022-05-07 12:56:10.704 DEBUG 20072 --- [nio-8080-exec-1] o.s.s.w.a.www.BasicAuthenticationFilter  : Set SecurityContextHolder to UsernamePasswordAuthenticationToken [Principal=SecurityUser[user=User(id=2, username=mstone, accountNonExpired=true, accountNonLocked=true, credentialsNonExpired=true, enabled=true)], Credentials=[PROTECTED], Authenticated=true, Details=WebAuthenticationDetails [RemoteIpAddress=0:0:0:0:0:0:0:1, SessionId=null], Granted Authorities=[]]
2022-05-07 12:56:10.704 TRACE 20072 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking RequestCacheAwareFilter (10/15)
```

From the above log, it is clear that **BasicAuthenticatioFilter(9/15)** is what responsible for intercepting the request and delegating it to the **ProviderManager**, which in turn calls **CustomAuthProvider(1/1)** to execute the validity of the authentication request.

So, our next job will be to create our own **AuthenticationFilter** and replace it with the default **BasicAuthenticationFilter**, so that we have our own logic implemented in our security stack. **You can checkout the next commit at this point**.

### Creating Our Custom AuthenticationFilter

There are multiple ways we can create Filters. We will start with the most basic way of creating it. Then we would move to the better ways of creating Filters.

#### Implementing javax.servlet.Filter

The most basic way we can have filters in our project is to directly implementing [Filter](https://docs.oracle.com/javaee/7/api/javax/servlet/Filter.html) interface from javax.servlet. Lets do that. We will create a package called Filter and create our **CustomAuthFilter**.

```java
public record CustomAuthFilter() implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest,
                         ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {
        
    }
}
```

**Filter** has only one abstract method, **doFilter()**, which we have to implement to intercept the incoming request. It has 3 arguments:

1.  **ServletRequest:** Request that is getting intercepted by the filter for it to analyze.
2.  **ServletResponse:** Response that the filter will modify optionally, for the request.
3.  **FilterChain**: holds the reference of entire filter chain so that the responsibility can be forwarded to next filter.

So, lets implement the **doFilter()** method, so that instead of capturing the username and password from the base64 encoded value in the **authorization** header of the request, we can pass the username and password in clear text in two separate request headers(username, password)

```java
@Component
@Slf4j
public record CustomAuthFilter(
        AuthenticationManager authenticationManager
) implements Filter {
    public static final String HEADER_USERNAME = "username";
    public static final String HEADER_PASSWORD = "password";

    @Override
    public void doFilter(ServletRequest servletRequest,
                         ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {
        val username = getHeaderValue(servletRequest, HEADER_USERNAME);
        val password = getHeaderValue(servletRequest, HEADER_PASSWORD);
        try {
            if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password))
                throw new BadCredentialsException("Username or password cannot be empty");
            val authentication = new UsernamePasswordAuthenticationToken(username, password);
            val fullAuthentication = authenticationManager.authenticate(authentication);
            SecurityContextHolder.getContext().setAuthentication(fullAuthentication);
            filterChain.doFilter(servletRequest, servletResponse);
        } catch (AuthenticationException ex) {
            log.error("Exception occurred while authenticating: {}", ex.getMessage());
        }
    }

    private String getHeaderValue(ServletRequest servletRequest, String headerName) {
        return ((HttpServletRequest) servletRequest).getHeader(headerName);
    }
}
```

If we recollect the Spring Security Architecture diagram, then we will see the similarity in the above code also, as it is:

1.  Intercepting the incoming request.
2.  Delegating the authentication to the **AuthenticationManager**.
3.  Storing the fully authenticated object into the **SecurityContext**.

In order to have **AuthenticationManager** injected into our Filter, we needed to mark our Filter with **@Component** annotation. To have the **AuthenticationManager** auto injected into the context, we also need to have below code in our **SecurityConfig** which extends **WebSecurityConfigurerAdapter**.

```java
@Override
@Bean
public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
}
```

Now, if we run the application and hit the same URL, without putting the username and password in the respective headers, rather sending the credentials in old way(base64 encoded format in authorization header), we will see weird behavior. Instead of 401, we will receive a 200 status with a blank response body. If we look at the logs, we can figure out below things:

-   **BasicAuthenticationFilter** is still in action and sitting at 9th position and carrying out the authentication process as usual.
-   Our own filter is coming into picture after all the filters in the filter chain proxy has finished their job.
-   As we are not sending the username and password in the headers, our filter is throwing **BadCredentialsException** as expected.
-   But that exception is not getting reflected in the response as 401 error code.
-   If we also pass the username and password header, then we get the correct response.

So now our Job will be to make our filter to be part of the Spring security’s Filter chain. **You can check out the next commit at this point**.

#### Making our filter part of Filter Chain

We have to make certain changes to avoid circular dependency, but the bottom line is that the below code needs to be added to our **WebSecurityConfigurerAdapter**.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.addFilterAt(customAuthFilter, BasicAuthenticationFilter.class);
}
```

In the above code, we have overridden another overloaded **configure()** method, that takes in **HttpSecurity**(more on this on later chapters). With the help of **addFilterAt()** method present in **HttpSecurity**, we are asking to replace **BasicAuthenticationFilter** with our own custom implementation. **HttpSecurity** also has similar methods like **addFilterBefore()**, **addFilterAfter()**, **addFilter()** etc.

After running the application, we can see that **BasicAuthenticationFilter** has been replaced by our own **CustomAuthFilter**. You might notice that the number of filters also reduced from 15 to 11(this may vary in future). This is because **BasicAuthenticationFilter** is also dependent on other filters to carry out the whole work. As it is out of the context now, all the dependent filters were also not added to the chain.

But still we can see below behaviors:

-   In case of wrong credentials, we receive HTTP status 200 with blank response body.
-   **CustomAuthFilter** is still sitting at the end of all filter chain, thus appearing twice in the filter chain, making duplicate efforts in order to authenticate the request.

Lets fix them one after another. **You can checkout the next commit at this point.**

#### Fixing our code to have correct HTTP status code in case of Authentication Failure

This is simple. We just have to update the **HttpStatus** code of the **ServletResponse**, if any **AuthenticationException** is thrown.

```java
catch (AuthenticationException ex) {
    log.error("Exception occurred while authenticating: {}", ex.getMessage());
        ((HttpServletResponse)servletResponse).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
}
```

In order to solve the second issue, we need to create our Filter in a different way. Let’s see how.

#### Implementing **OncePerRequestFilter**

**OncePerRequestFilter** is an abstract implementation of the aforementioned **Filter** interface itself, which comes with Spring security. As the name suggest, if we create a filter by extending it, it will guarantee that the filter will only appear once in the filter chain. It also comes with other benefits like below:

1.  It’s **doFilterInternal()**, method, which we need to override (as opposed to **doFilter()**, the way we have done already), already accepts **HttpServletRequest** and **HttpServletResponse**. So we do not require any sort of ugly casting which we have done above.
2.  It comes with lots of utility method which we can call to determine if the filter at all is applicable for a specific request. This will allow us to achieve below use cases:
    -   Having no authentication for some part of the application.
    -   Having multiple authentication based on request type.
    -   and many more. Your creativity is the limit here.

Lets change our **CustomAuthFilter** to extend from **OncePerRequestFilter**.

```java
@Component
@Slf4j
public class CustomAuthFilter extends OncePerRequestFilter {
    public static final String HEADER_USERNAME = "username";
    public static final String HEADER_PASSWORD = "password";
    private AuthenticationManager authenticationManager;

    @Override
    public void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws IOException, ServletException {
        val username = request.getHeader(HEADER_USERNAME);
        val password = request.getHeader(HEADER_PASSWORD);
        try {
            if (!StringUtils.hasLength(username) || !StringUtils.hasLength(password))
                throw new BadCredentialsException("Username or password cannot be empty");
            val authentication = new UsernamePasswordAuthenticationToken(username, password);
            val fullAuthentication = authenticationManager.authenticate(authentication);
            SecurityContextHolder.getContext().setAuthentication(fullAuthentication);
            filterChain.doFilter(request, response);
        } catch (AuthenticationException ex) {
            log.error("Exception occurred while authenticating: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    @Autowired
    @Lazy
    public void setAuthenticationManager(AuthenticationManager manager) {
        this.authenticationManager = manager;
    }

}
```

### Conclusion

Now, if you run the application, and hit the endpoint, it will show the expected behavior. But still we have one more concern to address: every time we hit the endpoint, the authentication mechanism triggers and the database is getting hit to get the user information. Whereas in previous case, we have seen that the HttpCookie was being used in subsequent request to retrieve the security context. We will solve the issue in future chapters.

Until then, **Happy Coding…** 🙏🙏🙏

Photo by [FLY:D](https://unsplash.com/@flyd2069?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/security-chain?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
