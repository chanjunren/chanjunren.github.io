🗓️ 05062024 0950

# mvel_overview

## Origin and Purpose

- Designed to be embedded in java applications
- For performing simple scripting tasks

## Features

- **Inline Parsing:** Can be used to parse and execute expressions directly within Java code
- **Dynamic Typing:** Supports dynamic typing, allowing for flexible and less verbose code
- **Code Generation:** Supports code generation and is often used in template engines and rule engines

## Syntax and Usage

```mvel
// 1. Arithmetic Operations
int a = 5;
int b = 3;
int sum = a + b;
int diff = a - b;
int prod = a * b;
int quot = a / b;

// 2. Logical Operations
boolean andOp = (a > b) && (b < 2); // false
boolean orOp = (a > b) || (b < 2); // true
boolean notOp = !(a == b); // true

// 3. Comparison Operations
boolean greater = a > b; // true
boolean lessOrEqual = a <= b; // false
boolean equal = a == b; // false
boolean notEqual = a != b; // true

// 4. Variables
int x = 10;
int y = 20;
int z = x + y; // 30

// 5. Collections
List myList = [1, 2, 3, 4];
Map myMap = {"key1": "value1", "key2": "value2"};

int listElement = myList[2]; // 3
String mapValue = myMap["key1"]; // "value1"

// 6. Functions
def greet(name) {
	return "Hello, " + name;
}
String greeting = greet("World"); // "Hello, World"

// 7. Conditional Statements
String message;
if (x > 5) {
	message = "Greater than 5";
} else {
	message = "Less than or equal to 5";
}
// message = "Greater than 5"

// Ternary Operator
String ternaryMessage = (x > 5) ? "Greater" : "Smaller or Equal";
// ternaryMessage = "Greater"

// 8. Loops
String loopResult = "";
for (int i = 0; i < 5; i++) {
	loopResult += i + " ";
}
// loopResult = "0 1 2 3 4 "

// 9. Accessing Java Objects
String myString = "Hello";
int stringLength = myString.length(); // 5

String personName = person.name; // "Alice"
int personAge = person.age; // 30

// 10. Inline Maps and Lists
List inlineList = [5, 6, 7, 8];
Map inlineMap = {"a": 1, "b": 2};

// Accessing Inline Collections
int inlineListElement = inlineList[1]; // 6
int inlineMapValue = inlineMap["a"]; // 1
```

---

## References

- ChatGPT
