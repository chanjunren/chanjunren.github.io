# Approach to Performance Testing

::: note
Testing should occur on the actual product in the way that it is used

This chapter describes 3 categories of tests => the category that includes your application will provide the best results
:::

## Microbenchmarks
- Test to measure small unit of performance 
```
public void doTest() {
	double l;
	long then = System.currentTimeMillis();
	for (int i = 0; i < nLoops; i++) {
		l = fibImpl1(50);
	}
	long now = System.currentTimeMillis();
	System.out.println("Elapsed time: " + (now - then));
}
```
### Microbenchmarks must use their results
- In the example above, smart compiler will just execute the following
```
long then = System.curremtTimeMillis();
long now = System.curremtTimeMillis();
System.out.println(...)
```
- Workaround: Ensure that each result is read, not simply written

::: Info
Need to use `volatile`  for `l`, even the program is single-threaded - explanation in chapter 9
:::

### Must not include extraneuous operations
- Tests should consider a range of values
	- e.g. using a randomly generated numbers
- Tests should also not include the time taken for operations irrelevant to the process being profiled
	- e.g. time taken to generate a random number
- Solution: Generate number beforehand

### Randomized inputs must be valid

### Considerations
- Does benchmark measure things that are not germane to the implementation
	- Loop / method overhead
	- Need to write to volatile variables
- Does it actually matter to save on a few nanoseconds
	- Is it accessed a great number of times
- Additional compilation effects
	- Compiler optimizations based on
		- which methods are frequently called

## Macrobenchmarks 
:::note
The application itself is the best thing to use to measure its own performance, in conjunction with any external resources used 

*micro and module-level benchmarks cannot give full picture of application's performance*
:::

### Rationale
- Resources used by an application is coupled with external resources used
	- e.g. database connections consume lots of heap space for buffers
	- networks become saturated when more data is sent over
	- simple/complex code is optimized differently
- Resource allocation

## Mesobenchmarks
- Benchmarks that do some real work, but are not full fledged applications
- Fewer pitfalls than microbenchmarks
- Not perfect
	- e.g. if running a test using 2 instances, 2 instances might have different overheads for the same operation

## Summary
- Good microbenchmarks are hard to write and offer limited value => only use them for a quick overview but don't rely on them
- Testing an entire application is the only way to know how the code will actually run
- Isolating performance at the modular level offers a reasonable compromise but is not a subsitute for macrobenchmarking

## Throughput, Batch and Response Time

::: info
There are various ways to look at application's performance, which one to use depends on which factors are more important to your application
:::

### Elapsed Time (Batch) Measurements
- Simplest way: see how long it takes to complete a task
- Factors
	- Where data is cached etc.
	- Where a warmup time matters
		- Might take soem time to finish warmup

### Throughput Measurements
- Measurement of amt of work that can be accomplished in a period of time
- Client Server test
	- Client sends req to server -> Client receives response -> Client sends request again ->  number of operations is aggregated over measurement period
	- Risk: Client cannot send data quickly enough to server -> as a result it is more of a measure of the client's performance
		- Zero-think-time throughput oriented test is more likely to encounter (since each client thread performs more work)
		- Workaround: Use a client with fewer worker threads

### Response TImes
- *amount of time elapsed between sending of request from client and receipt of response*
- Difference :
	- Client thread in response time sleeps for some period of time between operations (*think time*)
		- Throughput becomes fixed
		- Given number of clients executing requests with given think time will always yield same TPS
		- More closely mimics what a user does
- GC can sometimes introduce big outliers

## Understanding Variability
- Need to introduce tests that include some randomness
- Interpreting results
	- Shouldn't be something so simple like just considering the average time taken between *baseline* and *specimen*
	- Should apply some statistics formula (even then, might not be 100%)
		- p-test
		- t-test etc.
	- Statistical significance does not mean statistical importance
	- Usually this is because there is a lack of data

::: warning
(Quote from book) The conclusion here is that regression testing is not a black-and-white science. You cannot look at a series of numbers (or their averages) and make a judgment that compares them without doing some statistical analysis to understand what the numbers mean. Yet even that analysis cannot yield a completely definitive answer due to the laws of probabilities. The job of a performance engineer is to look at the data, understand those probabilities, and determine where to spend time based on all the available data.
:::

## Test Early, Test Often
- Ideal world: performance tests run everytime code is merged => code that causes performance regression is blocked
- Performance test should at least be a medium-sized mesobenchmark
- But this might not be fully feasible given the development cycle

### Guidelines
- Performance testing should be scripted
	- Ensure proper setup / configurations
		- Machine should be in a known state
	- Perform t-test analysis
	- Run multiple times
	- Only repeatable if environment is same from run to run
- Measure everything
	- Usage of
		- CPU
		- Memory
		- Network
		- Disk
	- System logs
	- Periodic Thread stacks
	- Heap analysis data
	- Measure data from other parts of system
		- Database
	- Serve as a guide to analysis of any regressions that are unconvered 
- Run on Target System


## Summary of chapter 2 from book

Performance testing involves a number of trade-offs. Making good choices among competing options is crucial to successfully tracking the performance characteristics of a system.

Choosing what to test is the first area where experience with the application and intuition will be of immeasurable help when setting up performance tests. Microbenchmarks tend to be the least helpful test; they are useful really only to set a broad guideline for certain operations. That leaves a quite broad continuum of other tests, from small module-level tests to a large, multitiered environment. Tests all along that continuum have some merit, and choosing the tests along that continuum is one place where experience and intuition will come into play. However, in the end there can be no substitute for testing a full application as it is deployed in production; only then can the full effect of all performance-related issues be understood.

Similarly, understanding what is and is not an actual regression in code is not always a black-and-white issue. Programs always exhibit random behavior, and once randomness is injected into the equation, we will never be 100% certain about what data means. Applying statistical analysis to the results can help to turn the analysis to a more objective path, but even then some subjectivity will be involved. Understanding the underlying probabilities and what they mean can help to lessen that subjectivity.

Finally, with these foundations in place, an automated testing system can be put in place that gathers full information about everything that occurred during the test. With the knowledge of what’s going on and what the underlying tests mean, the performance analyst can apply both science and art so that the program can exhibit the best possible performance