---
title: "Spring Security Chapter 2: Adding Database into the picture"
date: "2021-08-31"
slug: "spring-security-chapter-2"
description: "In this article, we learn how we can use database to store user information and create custom UserDetailsManager to manage User information."
tags: ["code", "java", "Security", "spring"]
wordpressId: 198
author:
  name: "Snehasish Chakraborty"
  url: "https://blogs.snehasish-chakraborty.com/author/114snehasish/"
  avatar: "/blog-images/authors/114snehasish.jpg"
coverImage: "/blog-images/spring-security-chapter-2/pexels-markus-spiske-1089438.jpg"
coverImageResolutions:
  thumbnail: "/blog-images/spring-security-chapter-2/pexels-markus-spiske-1089438-150x150.jpg"
  medium: "/blog-images/spring-security-chapter-2/pexels-markus-spiske-1089438-300x200.jpg"
  mediumLarge: "/blog-images/spring-security-chapter-2/pexels-markus-spiske-1089438-768x512.jpg"
  large: "/blog-images/spring-security-chapter-2/pexels-markus-spiske-1089438-1024x682.jpg"
  full: "/blog-images/spring-security-chapter-2/pexels-markus-spiske-1089438.jpg"
seo:
  ogTitle: "spring-security-chapter-2-adding-database-into-the-picture"
  ogDescription: "In this article, we learn how we can use database to store user information and create custom UserDetailsManager to manage User information."
  ogImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2021/08/pexels-markus-spiske-1089438.jpg"
  twitterCard: "summary_large_image"
  twitterTitle: "spring-security-chapter-2-adding-database-into-the-picture"
  twitterDescription: "In this article, we learn how we can use database to store user information and create custom UserDetailsManager to manage User information."
  twitterImage: "https://blogs.snehasish-chakraborty.com/wp-content/uploads/2021/08/pexels-markus-spiske-1089438.jpg"
  canonicalUrl: "https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-2/"
---

Important

### Please Note

This is **one** of my spring security series. This series will cover **everything** related to Spring Security, the **architecture** from very basic to the most advanced real world scenarios. This will talk about Spring Security **from the ground up**, so that the underlying architecture is clear and we can extend the architecture in the intended way to meet the complex business need. This series will cover basic user name password based authentication to the most advanced ones like **SAML**, **OAuth2** and **OIDC**, **Multi factor authentication**, **authorization** and the **most common security concerns** in web and how we can make a robust application using the provided features of Spring Security.  
  
For the Best Possible experience, It is highly recommended to **follow since the beginning**. But if you are already an experienced spring security practitioner, you are always welcome to cherry pick the topic you need to understand.  
  
This series also has a public [GitHub repository](https://github.com/114snehasish/spring-security-series/tree/main). The repository is **divided into multiple branches**, each for the different posts/chapters in the series. Each chapter specific branch also contains multiple commits which corresponds to different checkpoints in the chapter/post. I would recommend you to use tools like [GitKraken](https://www.gitkraken.com/) to easily navigate around the repository across multiple branches and commits.

Table Of Contents

1.  [Before we Proceed](#before-we-proceed)
2.  [Adding Database support](#adding-database-support)
3.  [Understanding application.properties](#understanding-applicationproperties)
4.  [Creating our custom UserDetailsService](#creating-our-custom-userdetailsservice)
5.  [Creating the SecurityConfig](#creating-the-securityconfig)
6.  [Creating the UserRepository](#creating-the-userrepository)
7.  [Let's run it](#lets-run-it)
8.  [Spring Security is Stateful](#spring-security-is-stateful)
9.  [Managing users in our application(Using UserDetailsManager)](#managing-users-in-our-applicationusing-userdetailsmanager)
10.  [Encrypting passwords in the Database](#encrypting-passwords-in-the-database)
11.  [Conclusion](#conclusion)
12.  [Please Note](#please-note)

### Before we Proceed

As this article is a continuation upon what we have learned in [Part 1](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/), I would recommend you to use the [Github repository](https://github.com/114snehasish/spring-security-series/tree/main) and checkout the first commit of the branch **sprint-security-chapter-2** and then either create your own branch from there and code along, or continue checking out all the commits in the branch.

In this series, I have used MYSQL as the Relational Database. You can use any other relational database solution as long as it is supported by Hibernate, which we will use as the JPA provider for the series.

### Adding Database support

In our application we will use JPA to interact with our database. We also need the appropriate driver classes. Below is our final **pom.xml**. I have excluded all other obvious dependency for brevity. Once we add all of the dependencies. **You can checkout the first commit in the sprint-security-chapter-2 at this point to follow along**.

```xml
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
```

We are using the above dependencies for below purpose:

-   **spring-boot-starter-data-jpa:** We will use JPA to do all the interaction with the database so that we do not need to think about the low level DB details in our application.
-   **spring-boot-starter-security:** Of course we need this to have spring security available in our application. Please see [Part 1](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/) of this series to know more.
-   **mysql-connector-java:** This is needed as the interface that Hibernate needs to communicate to the MYSQL database server. This is one of the low level dependency that we need to include in our application.
-   **lombok**: We will be using Lombok to avoid boilerplate code by utilizing annotation preprocessing.

### Understanding application.properties

We have not added anything to **application.properties** which is Spring Security specific. But still we will go through the configurations we have added in the file. the properties file contains below configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost/spring_security_series
spring.datasource.username=spring_security_series
spring.datasource.password=spring_security_series
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQL5Dialect
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto = create
logging.level.org.hibernate.SQL=debug
logging.level.org.hibernate.type.descriptor.sql=trace
```

Below are the types of configurations of above properties file:

1.  Database connection details. Replace the details with your own.
2.  Specifying hibernate to use MYSQL dialect.
3.  Configurations so that we do not have to create database tables. They will be auto generated from the business models.
4.  Configurations to log the generated SQL statements and the parameters.

### Creating our custom UserDetailsService

Lets create **service** package and create our class **DBUserDetailsService** which extends [UserDetailsService](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/#userdetailsservice).

```java
@RequiredArgsConstructor
public class DBUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUserName(userName);
        User u = userOptional.orElseThrow(() -> new UsernameNotFoundException("Error::: username " + userName + " not found."));
        return new SecurityUser(u);
    }
}
```

In the above code, we can see we have created a class from extending the **UserDetailsService**. So we needed to override the **loadUserByUsername** method which takes the username as the argument . in this method we have just written JPA code to fetch the user from the database based on the provided username.

According to the interface, the method should return **UserDetails**. We have created our custom [**UserDetails**](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/#userdetailsservice) namely **SecurityUser**.

```java
public class SecurityUser implements UserDetails {

    private final User user;
    
    ....
}
```

The **SecurityUser**, in turn wraps **User**, which is our application’s business object, corresponds to **user** table in the database.

```java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String userName;
    private String password;

}
```

Being the implementation of **UserDetails, SecurityUser** also needs to override some methods. We have overridden them as below:

```java
@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(()->"READ");
    }

    @Override
    public String getPassword() {
        return user.getPassword();
     }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
```

For simplicity, we are returning **READ** as the static authority for all the users. We will dig deep into the Authority section in future articles. To get the Username and the Password, we are delegating the call to the wrapped User object. for the other method that returns boolean, we have returned **true** as of now, for simplicity. You can move these info to the actual User object level, having different database table columns to store these flags. But lets keep it simple as of now.

### Creating the SecurityConfig

Let’s create a class **SecurityConfig** inside config package and add the below code in it:

```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return NoOpPasswordEncoder.getInstance();
    }


    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository){
        return new DBUserDetailsService(userRepository);
    }


}
```

The above configuration just creates beans of our custom UserDetailsService and the PasswordEncoder as we have discussed already in the [last lesson](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/#extending-our-application-further).

### Creating the UserRepository

Creating the UserRepository has nothing to do with spring security. This is just a JPARepository with one abstract method that we have used in our custom UserDetailsService.

```java
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String userName);
}
```

### Let’s run it

We can run the code at this point and the application should start without any error. If you are using dedicated database then make sure that the database is running and accessible from your system.

In the application startup log, you should see something like this:

```log
2021-08-11 22:43:50.104 DEBUG 19432 --- [  restartedMain] org.hibernate.SQL                        : drop table if exists user
2021-08-11 22:43:50.158 DEBUG 19432 --- [  restartedMain] org.hibernate.SQL                        : create table user (id integer not null auto_increment, password varchar(255), user_name varchar(255), primary key (id)) engine=MyISAM
```

As we can see, hibernate has automatically created the **user** table as it found the corresponding JPA interface in the application context.

Now Let’s add some user to the user table:

![database table image](/blog-images/spring-security-chapter-2/database-entry.png)

Add some user to the table

Now lets fire up Postman and hit http://localhost:8080 and provide the credentials like we have done [before](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/#running-the-application). You will see successful response if you provide the correct credentials. If you don’t, then HTTP 401 code will be returned. This is same as we have seen before.

But this time lets come back to the application log after hitting the endpoint. You will see the SQL queries that Hibernate has generated.

```log
2021-08-11 23:02:19.272 DEBUG 19432 --- [nio-8080-exec-4] org.hibernate.SQL                        : select user0_.id as id1_0_, user0_.password as password2_0_, user0_.user_name as user_nam3_0_ from user user0_ where user0_.user_name=?
2021-08-11 23:02:19.281 TRACE 19432 --- [nio-8080-exec-4] o.h.type.descriptor.sql.BasicBinder      : binding parameter [1] as [VARCHAR] - [jdoe]
2021-08-11 23:02:19.285 TRACE 19432 --- [nio-8080-exec-4] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([id1_0_] : [INTEGER]) - [1]
2021-08-11 23:02:19.288 TRACE 19432 --- [nio-8080-exec-4] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([password2_0_] : [VARCHAR]) - [12345]
2021-08-11 23:02:19.289 TRACE 19432 --- [nio-8080-exec-4] o.h.type.descriptor.sql.BasicExtractor   : extracted value ([user_nam3_0_] : [VARCHAR]) - [jdoe]
```

Now lets do something tricky. Lets clear out the current application console so that we do not have any old logs hanging around and then try hitting the endpoint multiple times with a correct credential. If you come back to the application console, you will notice that the SQL queries were not logged anymore.

### Spring Security is Stateful

When you are hitting the API endpoint multiple times, spring security is not querying the database every time. Thus, you are not seeing the queries logged. Then why we are able to see the response as expected without 401?

This is because when the first successful request made to the server, spring security creates a session in the memory. Then it sends the session identifier as a **cookie** in the response. The cookie name is **JSESSIONID.** You can see the cookie that the server returned in the cookies tab in the response section of Postman.

![Cookie sent by spring security](/blog-images/spring-security-chapter-2/JSESSIONID-1024x191.png)

**JSESSIONID** cookie is sent by spring security to identify subsequent requests.

Once the cookie is received, our user agent, Postman, automatically sets the cookie in all future requests that we make to the same domain. You can check that in the request headers section of Postman. This eliminates the need of querying the database every time we hit a secured endpoint, thus improving the performance of the application. We will come back to this and talk about other ways we can manage sessions in our future articles.

### Managing users in our application(Using UserDetailsManager)

You might have noticed that whenever we are restarting our application, the table gets recreated, thus needing to create user manually before testing the secured endpoint. Lets fix that using **UserDetailsManager**. You can checkout the next commit at this point.

Lets update **DBUserDetailsService** to implement **UserDetailsManager**. Override all the needed methods for user management. We will keep the method body blank for now.

```java
public class DBUserDetailsService implements UserDetailsManager {
    
    ....
}
```

Update the Bean method **userDetailsService** in **SecurityConfig** so that we can create some users. This is similar to what we have done in [part 1](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/#extending-our-application-further). But this time, the underlying implementation will be ours.

```java
@Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        var userDetailsManager = new DBUserDetailsService(userRepository);
        userDetailsManager.createUser(new SecurityUser(User.builder().userName("jdoe").password("12345").build()));
        return userDetailsManager;
    }
```

Make sure to have a **@Builder** annotation in **User** class to use Builder pattern.

Now, lets implement the **createUser** method in our **DBUserDetailsService** like below:

```java
@Transactional
    public void createUser(UserDetails userDetails) {
        userRepository.save(((SecurityUser) userDetails).getUser());
    }
```

We needed to do the typecasting as we are using a custom method **getUser** in our **SecurityUser** class to get the wrapped **User** object. This type casting can be avoided if we don’t use **SecurityUser** as a wrapper class for our **User** object and making **User** class directly implementing **UserDetails**. Personally I like the wrapper approach as this separates the **User** class free from all the other bloats that are needed to implement authentication-authorization. Instead we keep the **User** class clean to use that in the other sections of our application.

That’s it. We can run the application now and see the result in Postman.

### Encrypting passwords in the Database

Encrypting password in the database while managing users is completely similar to what we have done in [part1](https://blogs.snehasish-chakraborty.com/full-stack-engineering/web-security/spring-security-chapter-1/#using-bcrypt) of the series. You can try that yourself **or just checkout the next commit** to see how I have achieved the same.

This time our user is created in the database like below:

![password stored as encrypted text](/blog-images/spring-security-chapter-2/Password-encrypted.png)

Using BCrypt, we can easily store the hashed version of the password in the persistent storage.

### Conclusion

In this article, we have learned how we can use database to store our user information and create custom **UserDetailsService** or **UserDetailsManager** to easily implement user storing and management mechanism.

In the next post we will dive deeper into the guts of **AuthenticationProviders**.

Until then, **Happy coding**. 🙏🙏🙏
