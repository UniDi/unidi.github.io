## A Dependency Injection Container built for Unity. 
A tool to write the code base of your game into a collection of loosely-coupled parts. So it's maintainable, flexible and testable.

UniDi provides DI functionality and automates many of the tasks involved in Object Composition, Interception, and Lifetime Management. It's an engine that resolves and manage object graphs. 

You can use a DI Container to resolve controller instances. This functionality can be implemented with all three DI Containers

Using reflection, they can analyze the requested class and figure out which Dependencies are needed.

Auto-Wiring is the ability to automatically compose an object graph from maps between Abstractions and concrete types by making use of type information supplied by the compiler and the Common Language Runtime (CLR).

A DI Container is a software library that can automate many of the tasks involved in Object Composition, Lifetime Management, and Interception. Although it’s possible to write all the required infrastructure code with Pure DI, it doesn’t add much value to an application. On the other hand, the task of composing objects is of a general nature and can be resolved once and for all; this is what’s known as a Generic Subdomain.1 Given this, using a general-purpose library can make sense. It’s not much different than implementing logging or data access; logging application data is the kind of problem that can be addressed by a general-purpose logging library. The same is true for composing object graphs.

## Why is dependency injection useful?
The vast majority of effort that is invested in software happens after the initial release. Because loosely coupled code makes your software much easier to change, a small up-front time investment will pay dividends as time goes on.


## How much does it cost?
UniDi is and will always be free for all projects, personal and commercial. It's open source (licensed under MIT/Apache 2.0 license), so you can fork the code.


## The UniDi project contains:
- UniDi Core
  - UniDi DI Container
  - Unidi Test Framework
- Extensions:
  - UniDi Async
  - Auto-Mocking
    - Moq
    - NSubstitute
  - Reflection Baking
  - Signals Eventbus
  - Memory Pool Monitor
- Demos:
  - Two example games (beginner and advanced)


# UniDi is running and tested on the following target platforms:

PC, Mac, Linux, iOS, Android, UWP / WSA / WP8 and WebGL.
Note: All IL2CPP based platforms should be supported as long code stripping is disabled in Unity.

A DI Container is a software library that provides DI functionality and automates many of the tasks involved in Object Composition, Interception, and Lifetime Management. It's an engine that resolves and manages object graphs.

