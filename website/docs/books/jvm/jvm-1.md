# Introduction

## JVM Tuning Flags
- Types
	- Boolean flags 
		- `-XX:+ FLagName` Enable
		- `-XX:- FlagName` Disable
	- Flags that require parameter
		- `-XX: FlagName=something`
- *Ergonomics* - Automatically tuning flags based on environment

## Complete Performance Story
### Write better algos

### Write less code
- More objects = more allocation / retention => longer GC cycle => longer

### Prematurely Optimize (What it means)
- Write clean, simple straightforward code that is simple to read and understand
- Avoid code constructs that are known to be bad for performance 
- But don't pre-emptively make algorithmic / design changes until profiling has been done and  bottlenecks are clear

### The Database is the bottleneck
- Any part of the system that uses a CPU might be the bottleneck, it might not be java

### Optimise for the common case
- Not all performance aspects are equally important - focus on the common ones
	- Profile code and focus on ops taking the most time
	- Apply Occam's Razor: "entities should not be multiplied beyond necessity"
	- Write simple algos for most common operations