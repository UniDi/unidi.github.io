# Introduction

## What is Dependency Injection?

**Dependency injection** is a technique in which an object receives other objects that it depends on. These other objects are called dependencies. In the typical _using_ relationship the receiving object is called a client and the passed (that is, _injected_) object is called a service. The code that passes the service to the client can be many kinds of things and is called the injector. Instead of the client specifying which service it will use, the injector tells the client what service to use. The "injection" refers to the passing of a dependency (a service) into the object (a client) that would use it.

The service is made part of the client's state. Passing the service to the client, rather than allowing a client to build or find the service, is the fundamental requirement of the pattern.

The intent behind dependency injection is to achieve separation of concerns of construction and use of objects. This can increase readability and code reuse.

_Source: [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)_

## Theory

What follows is a general overview of Dependency Injection from my perspective. However, it is kept light, so I highly recommend seeking other resources for more information on the subject, as there are many other people (often with better writing ability) that have written about the theory behind it.

When writing an individual class to achieve some functionality, it will likely need to interact with other classes in the system to achieve its goals. One way to do this is to have the class itself create its dependencies, by calling concrete constructors:

```cpp
public class Foo
{
    ISomeService _service;

    public Foo()
    {
        _service = new SomeService();
    }

    public void DoSomething()
    {
        _service.PerformTask();
        ... 
    }
}
```

This works fine for small projects, but as your project grows it starts to get unwieldy. The class Foo is tightly coupled to class ‘SomeService’. If we decide later that we want to use a different concrete implementation then we have to go back into the Foo class to change it.

After thinking about this, often you come to the realization that ultimately, Foo shouldn’t bother itself with the details of choosing the specific implementation of the service. All Foo should care about is fulfilling its own specific responsibilities. As long as the service fulfills the abstract interface required by Foo, Foo is happy. Our class then becomes:

```cpp
public class Foo
{
    ISomeService _service;

    public Foo(ISomeService service)
    {
        _service = service;
    }

    public void DoSomething()
    {
        _service.PerformTask();
        ...
    }
}
```

This is better, but now whatever class is creating Foo (let’s call it Bar) has the problem of filling in Foo’s extra dependencies:

```cpp
public class Bar
{
    public void DoSomething()
    {
        var foo = new Foo(new SomeService());
        foo.DoSomething();
        ...
    }
}
```

And class Bar probably also doesn’t really care about what specific implementation of SomeService Foo uses. Therefore we push the dependency up again:

```cpp
public class Bar
{
    ISomeService _service;

    public Bar(ISomeService service)
    {
        _service = service;
    }

    public void DoSomething()
    {
        var foo = new Foo(_service);
        foo.DoSomething();
        ...
    }
}
```

So we find that it is useful to push the responsibility of deciding which specific implementations of which classes to use further and further up in the ‘object graph’ of the application. Taking this to an extreme, we arrive at the entry point of the application, at which point all dependencies must be satisfied before things start. The dependency injection lingo for this part of the application is called the ‘composition root’. It would normally look like this:

```cpp
var service = new SomeService();
var foo = new Foo(service);
var bar = new Bar(service);
var qux = new Qux(bar);
.. etc.
```

DI frameworks such as UniDi simply help automate this process of creating and handing out all these concrete dependencies, so that you don’t need to explicitly do so yourself like in the above code.

## Misconceptions

There are many misconceptions about DI, due to the fact that it can be tricky to fully wrap your head around at first. It will take time and experience before it fully ‘clicks’.

As shown in the above example, DI can be used to easily swap different implementations of a given interface (in the example this was ISomeService). However, this is only one of many benefits that DI offers.

More important than that is the fact that using a dependency injection framework like UniDi allows you to more easily follow the [Single Responsibility Principle](Single-responsibility principle). By letting UniDi worry about wiring up the classes, the classes themselves can just focus on fulfilling their specific responsibilities.

Another common mistake that people new to DI make is that they extract interfaces from every class, and use those interfaces everywhere instead of using the class directly. The goal is to make code more loosely coupled, so it’s reasonable to think that being bound to an interface is better than being bound to a concrete class. However, in most cases the various responsibilities of an application have single, specific classes implementing them, so using interfaces in these cases just adds unnecessary maintenance overhead. Also, concrete classes already have an interface defined by their public members. A good rule of thumb instead is to only create interfaces when the class has more than one implementation or in cases where you intend to have multiple implemenations in the future (this is known, by the way, as the [Reused Abstraction Principle](http://codemanship.co.uk/parlezuml/blog/?postid=934))

Other benefits include:

- **Refactorability** - When code is loosely coupled, as is the case when using DI properly, the entire code base is much more resilient to changes. You can completely change parts of the code base without having those changes wreak havoc on other parts.
- **Encourages modular code** - When using a DI framework you will naturally follow better design practices, because it forces you to think about the interfaces between classes.
- **Testability** - Writing automated unit tests or user-driven tests becomes very easy, because it is just a matter of writing a different ‘composition root’ which wires up the dependencies in a different way. Want to only test one subsystem? Simply create a new composition root. UniDi also has some support for avoiding code duplication in the composition root itself (using Installers - described below).
Also see here and here for further discussion and justification for using a DI framework.

_Originally written by Steve Vermeulen in 2016, edited for UniDi_
