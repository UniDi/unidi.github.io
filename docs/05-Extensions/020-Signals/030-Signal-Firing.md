
## Signal Firing

To fire the signal, you add a reference to the `SignalBus` class, and then call the `Fire` method like this:

```csharp
public class PlayerJoinedSignal
{
}

public class UserManager
{
    private readonly SignalBus _signalBus;

    public UserManager(SignalBus signalBus)
    {
        _signalBus = signalBus;
    }

    public void DoSomething()
    {
        _signalBus.Fire<PlayerJoinedSignal>();
    }
}
```

Or, if the signal has parameters then you will want to create a new instance of it, like this:

```csharp
public class PlayerJoinedSignal
{
    public string Username;
}

public class UserManager
{
    private readonly SignalBus _signalBus;

    public UserManager(SignalBus signalBus)
    {
        _signalBus = signalBus;
    }

    public void DoSomething()
    {
        _signalBus.Fire(new PlayerJoinedSignal() { Username = "Bob" });
    }
}
```

When `Fire()` is called, SignalBus expects the signal to be declared and exception will be thrown if the signal is not declared. If you want to call `Fire()` regardless of the signal declaration, use `TryFire()` method instead that ignores undeclared signals. You can use `TryFire()` looks like this:

```csharp
public class PlayerJoinedSignal
{
}

public class UserManager
{
    private readonly SignalBus _signalBus;

    public UserManager(SignalBus signalBus)
    {
        _signalBus = signalBus;
    }

    public void DoSomething()
    {
        // Generic version
        _signalBus.TryFire<PlayerJoinedSignal>(); // Nothing happens if PlayerJoinedSignal is NOT declared

        // Non-Generic version
        _signalBus.TryFire(new PlayerJoinedSignal()); // Nothing happens if PlayerJoinedSignal is NOT declared
    }
}
```

