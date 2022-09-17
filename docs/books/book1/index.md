---
id: 'Refactoring'
---

# Refactoring - Improving the Design of Existing Code
> By Martin Fowler

## Chapter 1 - A First Example
- Before refactoring, ensure that there exists a solid suite of tests
	- Must be self-checking
- When programming - Always leave the code base healthier than when you found it
- Common Sequence
	- Read code
	- Gain insight
	- Use refactoring to move insight from your head to the code

> The true test of good code is how easy it is to change it

## Chapter 2 - Principles in Refactoring
> Refactoring: a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior

### Refactoring vs Performance Optimization
- Similarity: Don't change overall functionality of code
- Difference: Purpose
	- Refactoring: making code easier to understand and easier to modify
	- Optimization: only care about speeding up the program


### Why Refactor? 
- Improves design of software
	- Harder to see design=> harder to preserve => rapidly decays
	- Poor design =>  takes more code to do the same thing
- Makes software easier to understand
	- 