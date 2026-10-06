# Spring Boot Application

This is a simple Spring Boot application created using Spring Initializr.

## Project Structure

```
spring-boot-app
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── demo
│   │   │               └── DemoApplication.java
│   │   └── resources
│   │       └── application.properties
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── demo
│                       └── DemoApplicationTests.java
├── pom.xml
├── mvnw
├── mvnw.cmd
└── .gitignore
```

## Prerequisites

- Java 11 or higher
- Maven 3.6.0 or higher (if not using the provided wrapper)

## Building the Application

To build the application, navigate to the project directory and run:

```
./mvnw clean package
```

## Running the Application

To run the application, use the following command:

```
./mvnw spring-boot:run
```

## Testing the Application

To run the tests, execute:

```
./mvnw test
```

## Additional Information

For more details on Spring Boot, visit the [Spring Boot Documentation](https://spring.io/projects/spring-boot).