## Test Doubles

:::note Test Doubles
It’s a common technique to create implementations of Dependencies that act as stand-ins for real or intended implementations. Such implementations are called Test Doubles, and they’ll never be used in the final application. Instead, they serve as placeholders for real Dependencies when these are unavailable or undesirable to use.
A Test Double is useful when the real Dependency is slow, expensive, destructive, or sim- ply outside the scope of the current test. There’s a complete pattern language around Test Doubles and many subtypes, such as [Dummies, Fakes, Stubs, Spies and Mocks](https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs).
:::

Loose coupling enables unit testing because consumers follow the [Liskov Substitution Principle](https://medium.com/hackernoon/liskov-substitution-principle-a982551d584a): they don't care about the concrete types of their Dependencies. This means that you can inject Test Doubles into the System Under Test.

One of the really cool features of DI is the fact that it makes testing code much, much easier.  This is because you can easily substitute one dependency for another by using a different Composition Root. For example, if you only want to test a particular class (let's call it Foo) and don't care about testing its dependencies, you might write Test Doubles for them so that you can isolate Foo specifically.

```csharp
public class Foo
{
    IGameServer _gameServer;

    public Foo(IGameServer gameServer)
    {
        _gameServer = gameServer;
    }

    public void Initialize()
    {
        // ...
        var x = _gameServer.SomeMethod();
        // ...
    }
}
```

In this example, we have a class Foo that interacts with a web server to retrieve content.  This would normally be very difficult to test for the following reasons:

* You would have to set up an environment where it can properly connect to a web server (configuring ports, urls, etc.)
* Running the test could be slower and limit how much testing you can do
* The web server itself could contain bugs so you couldn't with certainty isolate Foo as the problematic part of the test
* You can't easily configure the values returned from the web server to test sending various inputs to the Foo class

However, if we create a mock object for IGameServer then we can address all these problems:

```csharp
public class MockGameServer : IGameServer
{
    // ...
}
```

Then hook it up in our installer:

```csharp
Container
    .Bind<IGameServer>()
    .To<MockGameServer>()
    .AsSingle();
```

Then you can implement the fields of the IGameServer interface and configure them based on what you want to test on Foo. Hopefully You can see how this can make life when writing tests much easier.

To avoid writing all the mocking classes, like the above MockGameServer class example. UniDi allows you to automate this process by using a mocking library which does all the work for you. UniDi supports *Moq* and *NSubstitute*. Both are most used in the field but have some different approaches to mocking. And will be handled differently in this document.

Note that by default, Auto-mocking is not enabled in UniDi.  If you wish to use the auto-mocking feature then you need to install [UniDi/AutoMoq](#TODO) or [UniDi/AutoSubstitute](#TODO). 
