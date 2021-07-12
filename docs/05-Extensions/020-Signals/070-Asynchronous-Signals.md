## Asynchronous Signals

In some cases it might be desirable to run a given signal asynchronously.  Asynchronous signals have the following advantages:

1. The update-order that the signal handlers are triggered might be more predictable.  When using synchronous signals, the signal handler methods are executed at the same time that the signal is fired, which could be triggered at any time during the frame, or in some cases multiple places if the signal is fired multiple times.  This can lead to some update-order issues.  With async signals, the signal handlers are always executed at the same time in the frame as configured by the TickPriority.

2. Asynchronous signals can encourage less coupling between the sender and receiver, which is often what you want.  As explained <a href="#when-to-use-signals">above</a>, signals work best when they are used for "fire and forget" events where the sender doesn't care about the behaviour of any listeners.   By making a signal async, it can enforce this separation because the signal handler methods will be executed later, and therefore the sender actually cannot make direct use of the result of the handlers behaviour.

3. Unexpected state changes can occur while firing just one signal.  For example, an object A might trigger a signal which would trigger some logic that would eventually cause A to be deleted.  If the signal was executed synchronously, then the call stack could eventually return to object A where the signal was fired, and object A might then attempt to execute commands afterwards that causes problems (since object A will have already been deleted)

This is not to say that asynchronous signals are superious to synchronous signals.  Asynchronous signals have their own risks as well.

1. Debugging can be more difficult, because it isn't clear from the stack trace where the signal was fired.

2. Some parts of the state can be out of sync with each other.   If a class A fires an async signal that requires a response from class B, then there will be some period between when the signal was fired and the handler method in class B was invoked, where B is out of sync with A, which can lead to some bugs.

3. The overall system might be more complex than when using synchronous signals and therefore harder to understand.
