## Signals Declaration

Before declaring a signal you need to create a class that will represent it.  For example:

```csharp
public class PlayerDiedSignal
{
}
```

Any parameters passed along with the signal should be added as public members or properties.  For example:

```csharp
public class NewHighScoreSignal
{
    public Player Player;
    public int Score;
}
```

You might also consider making the Signal classes immutable, for example like this WeaponEquippedSignal:

```csharp
public class WeaponEquippedSignal
{
    public WeaponEquippedSignal(Player player, IWeapon weapon)
    {
        Player = player;
        IWeapon = weapon;
    }

    public IWeapon Weapon
    {
        get; private set;
    }

    public Player Player
    {
        get; private set;
    }
}
```

This isn't necessary but you might consider doing this to ensure that any signal handlers do not attempt to change the signal parameter values, which could negatively affect other signal handler behaviour.

After we have created our signal class we just need to declare it in an installer somewhere:

```csharp
public override void InstallBindings()
{
    Container.DeclareSignal<PlayerDiedSignal>();
}
```

Any objects that are in the container where it's declared, or any sub container, can now listen on the signal and also fire it.

## Declaration Binding Syntax

The format of the DeclareSignal statement is the following:

Container.DeclareSignal&lt;<b>SignalType</b>&gt;()
    .WithId(<b>Identifier</b>)
    .<b>(RequireSubscriber|OptionalSubscriber|OptionalSubscriberWithWarning)</b>()
    .<b>(RunAsync|RunSync)</b>()
    .WithTickPriority(<b>TickPriority</b>)
    .(<b>Copy</b>|<b>Move</b>)Into(<b>All</b>|<b>Direct</b>)SubContainers();

Where:

### SignalType
The custom class that represents the signal

### Identifier
The value to use to uniquely identify the binding.  This can be ignored in most cases, but can be useful in cases where you want to define multiple distinct signals using the same signal type.

### RequireSubscriber/OptionalSubscriber/OptionalSubscriberWithWarning
These values control how the signal should behave when it fired but there are no subscribers associated with it.  Unless it is over-ridden in TODO: <a href="#settings">UniDiSettings</a>, the default is OptionalSubscriber, which will do nothing in this case.  When RequireSubscriber is set, exceptions will be thrown in the case of zero subscribers.  OptionalSubscriberWithWarning is half way in between where it will issue a console log warning instead of an exception.  Which one you choose depends on how strict you prefer your application to be, and whether it matters if the given signal is actually handled or not.

### RunAsync/RunSync
These values control whether the signal is fired synchronously or asynchronously:

    * **RunSync** - This means the that when the signal is fired by calling `SignalBus.Fire` that all the subscribed handler methods are immediately invoked.

    * **RunAsync** - This means that when a signal is fired, the subscribed methods will not be invoked until later (as specified by the TickPriority parameter).

    Note that Unless It is over-ridden in <a href="#settings">UniDiSettings</a>, the default value is to run synchronously.   See TODO: <a href="#async-signals">here</a> for a discussion of asynchronous signals and why you might sometimes want to use that instead.

### TickPriority
The tick priority to execute the signal handler methods at.  Note that this is only applicable when using **RunAsync**.

### (Copy|Move)Into(All|Direct)SubContainers
Same behaviour as described in TODO: <a href="../README.md#binding">main section on binding</a>.

    Note that the default value for **RunSync**/**RunAsync** and **RequireSubscriber**/**OptionalSubscriber** can be overridden by changing <a href="#settings">UniDiSettings</a>

