🗓️ 23072024 1413
📎

# fixtures
- state or data you set up before running tests
- create a consistent environment for your tests to execute in
- Includes
    - Initializing database records
    - Setting up mock objects or services
    - Creating test user accounts

## Example

```groovy
setup:
    def user = new User(name: "Bob")
    userService.save(user)  // Assume userService is a mock or real service

when:
    def foundUser = userService.findById(user.id)

then:
    foundUser == user
```

## Closures in Fixtures

You can often use closures within fixtures to define the actions that need to be performed to set up the test environment:

Groovy

```
def setupDatabase = { 
    // Code to populate the database with test data
}

setup:
    setupDatabase() 
```

Use code [with caution.](/faq#coding)

**Key Takeaways:**

- **Closures:** Blocks of code that capture their environment.
- **Fixtures:** Test data or state used to create a consistent testing environment.
- **Groovy:** Provides excellent support for both closures and fixtures, making them powerful tools for testing and other tasks.

---

# References
