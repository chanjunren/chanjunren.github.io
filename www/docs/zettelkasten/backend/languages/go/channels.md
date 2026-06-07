🗓️ 07062026 1030
📎

# channels

**Core Concept**: A channel is a typed, thread-safe conduit for passing values between [[goroutines]]. Go's slogan: *don't communicate by sharing memory; share memory by communicating.*

## Why channels over locks

Instead of guarding shared state with a mutex, you hand ownership of data through a channel — only one goroutine holds it at a time. This turns many race conditions into compile-time-impossible situations and makes data flow explicit. (For the cases where channels are the wrong tool, see [[sync_primitives]].)

```go
ch := make(chan int)   // a channel of int
ch <- 42               // send (blocks until someone receives)
v := <-ch              // receive
```

## Unbuffered vs buffered

This is the core distinction.

- **Unbuffered** (`make(chan T)`): send blocks until a receiver is ready. It's a synchronization point — a rendezvous. Sender and receiver meet.
- **Buffered** (`make(chan T, n)`): send blocks only when the buffer is full; receive blocks only when empty. Decouples sender and receiver up to `n` items.

```go
done := make(chan struct{})     // unbuffered: signal
jobs := make(chan Job, 100)     // buffered: queue up to 100
```

Use buffering when a producer shouldn't block on a slow consumer — but pick the size deliberately; a full buffer still blocks.

## Closing, ranging, and the comma-ok receive

`close(ch)` signals no more values will be sent. Receivers can detect it:

```go
v, ok := <-ch    // ok == false once the channel is closed and drained

for job := range jobs {   // loops until jobs is closed
    process(job)
}
```

Rules that matter:
- **Only the sender closes** a channel, never the receiver.
- Sending on a closed channel **panics**. Receiving from one returns the zero value with `ok == false`.
- Closing is optional — only needed to broadcast "done" to rangers/receivers.

```ad-danger
A goroutine blocked forever on a send or receive is a **goroutine leak** — it never exits and its stack is never freed. Always ensure every send has a path to a receiver (and vice versa), usually via [[select]] with a done/context channel.
```

## Directional channel types

Restrict a channel's direction in function signatures to document intent and let the compiler enforce it.

```go
func produce(out chan<- int) { out <- 1 }   // send-only
func consume(in <-chan int)  { <-in }        // receive-only
```

## Nil channels

A nil channel blocks **forever** on both send and receive. This is occasionally useful — in a [[select]] you can set a case's channel to nil to disable that branch — but an accidental nil channel is a silent deadlock.

## Examples

```ad-example
Single consumer draining a buffered work queue (producer/consumer):
```go
type Worker struct {
    jobs chan Job
    done chan struct{}
}

func NewWorker() *Worker {
    w := &Worker{jobs: make(chan Job, 100), done: make(chan struct{})}
    go w.consume()       // one goroutine owns the queue
    return w
}

func (w *Worker) consume() {
    for job := range w.jobs {   // exits when jobs is closed
        job.Run()
    }
    close(w.done)
}

func (w *Worker) Submit(j Job) { w.jobs <- j }

func (w *Worker) Close() {
    close(w.jobs)   // sender closes; consume() drains then exits
    <-w.done        // wait for drain
}
```
```

## References

- [Effective Go: Channels](https://go.dev/doc/effective_go#channels)
- [Go Blog: Share memory by communicating](https://go.dev/blog/codelab-share)
