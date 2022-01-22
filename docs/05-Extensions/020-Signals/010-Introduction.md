# Introduction

## Motivation / Theory

Given two classes A and B that need to communicate, your options are usually:

1. Directly call a method on B from A.  In this case, A is strongly coupled with B.
2. Inverse the dependency by having B observe an event on A.  In this case, B is strongly coupled with A

As a third option, in some cases it might actually be better for neither one to know about the other. This way your code is kept as loosely coupled as possible.  You can achieve this by having A and B interact with an intermediary object (in this case, UniDi signals) instead of directly with each other.

Note also that while the result will be more loosely coupled, this isn't always going to be better.  Signals can be misused just like any programming pattern, so you have to consider each case for whether it's a good candidate for them or not.

## Signals Quick Start

If you just want to get up and running immediately, see the following example which shows basic usage:

```csharp

public class PlayerJoinedSignal
{
    public string Username;
}

public class Game : IInitializable
{
    private readonly SignalBus _signalBus;

    public Game(SignalBus signalBus)
    {
        _signalBus = signalBus;
    }

    public void Initialize()
    {
        _signalBus.Fire(new PlayerJoinedSignal() { Username = "Bob" });
    }
}

public class MatchNotifier
{
    public void NewPlayerJoined(PlayerJoinedSignal playerJoined)
    {
        Debug.Log(playerJoined.Username + " joined the match.");
    }
}

public class GameInstaller : MonoInstaller<GameInstaller>
{
    public override void InstallBindings()
    {
        SignalBusInstaller
			.Install(Container);

        Container
			.DeclareSignal<PlayerJoinedSignal>();

        Container
			.Bind<MatchNotifier>()
			.AsSingle();

        Container
			.BindSignal<PlayerJoinedSignal>()
       		     	.ToMethod<MatchNotifier>(x => x.NewPlayerJoined)
			.FromResolve();

        Container
			.BindInterfacesTo<Game>()
			.AsSingle();
    }
}
```

To run, just copy and paste the code above into a new file named `GameInstaller` then create an empty scene with a new scene context and attach the new installer.

There are several ways of creating signal handlers.  Another approach would be the following

```csharp
public class MatchNotifier : IInitializable, IDisposable
{
    private readonly SignalBus _signalBus;

    public MatchNotifier(SignalBus signalBus)
    {
        _signalBus = signalBus;
    }

    public void Initialize()
    {
        _signalBus.Subscribe<PlayerJoinedSignal>(OnPlayerJoined);
    }

    public void Dispose()
    {
        _signalBus.Unsubscribe<PlayerJoinedSignal>(OnPlayerJoined);
    }

    void OnPlayerJoined(PlayerJoinedSignal args)
    {
        NewPlayerJoined(args.Username);
    }

    public void NewPlayerJoined(string userName)
    {
        Debug.Log(userName + " joined the match.");
    }
}

public class GameInstaller : MonoInstaller<GameInstaller>
{
    public override void InstallBindings()
    {
        SignalBusInstaller
			.Install(Container);

        Container
			.DeclareSignal<PlayerJoinedSignal>();

        // Here, we can get away with just binding the interfaces since 
	// they don't refer to each other:
        Container
			.BindInterfacesTo<MatchNotifier>()
			.AsSingle();
        Container
			.BindInterfacesTo<Game>()
			.AsSingle();
    }
}
```

As one final alternative approach, you could also combine UniDi signals with the UniRx library and do it like this instead:


```csharp
public class MatchNotifier : IInitializable, IDisposable
{
    private readonly SignalBus _signalBus;
    private readonly CompositeDisposable _disposables = new CompositeDisposable();

    public MatchNotifier(SignalBus signalBus)
    {
        _signalBus = signalBus;
    }

    public void Initialize()
    {
        _signalBus
			.GetStream<PlayerJoinedSignal>()
            		.Subscribe(x => NewPlayerJoined(x.Username))
			.AddTo(_disposables);
    }

    public void Dispose()
    {
        _disposables.Dispose();
    }

    public void NewPlayerJoined(string userName)
    {
        Debug.Log(userName + " joined the match.");
    }
}
```

Note that if you go this route that you need to enable UniRx integration as described [here](#TODO).

As you can see in the the above examples, you can either directly bind a handler method to a signal in an installer using `BindSignal` (first example) or you can have your signal handler attach and detach itself to the signal (second and third examples)

## When To Use Signals

Signals are most appropriate as a communication mechanism when:

1. There might be multiple interested receivers listening to the signal
2. The sender doesn't need to get a result back from the receiver
3. The sender doesn't even really care if it gets received.  In other words, the sender should not rely on some state changing when the signal is called for subsequent sender logic to work correctly.  Ideally signals can be thought as "fire and forget" events
4. The sender triggers the signal infrequently or at unpredictable times

These are just rules of thumb, but useful to keep in mind when using signals.  The less logically coupled the sender is to the response behaviour of the receivers, the more appropriate it is compared to other forms of communication such as direct method calls, interfaces, C# event class members, etc.  This is also one reason you might consider using <a href="#async-signals">asynchronous signals</a>

When event driven program is abused, it is possible to find yourself in "callback hell" where events are triggering other events etc. and which make the entire system impossible to understand.  So signals in general should be used with caution.  Personally I like to use signals for high level game-wide events and then use other forms of communication (unirx streams, c# events, direct method calls, interfaces) for most other things.

Details of how this works are explained in the following sections.
