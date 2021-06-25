# Using Non-MonoBehaviour Classes

## ITickable

In some cases it is preferable to avoid the extra weight of MonoBehaviours in favour of just normal C# classes. UniDi allows you to do this much more easily by providing interfaces that mirror functionality that you would normally need to use a MonoBehaviour for.

For example, if you have code that needs to run every frame, then you can implement the ITickable interface:

``` csharp
public class Ship : ITickable
{
    public void Tick()
    {
        // This gets called every frame.
    }
}
```

Then, to hook it up in an installer:

``` csharp
Container
    .Bind<ITickable>()
    .To<Ship>()
    .AsSingle();
```

Or if you don't want to have to always remember which interfaces your class implements, you can use the shortcut described here

Note that the order that the Tick() is called in for all ITickables is also configurable, as TODO: update link: [outlined here](#link).

Also note that there are interfaces ILateTickable and IFixedTickable which mirror Unity's LateUpdate and FixedUpdated methods

<br/> 

![HR](/img/hr.svg)
## IInitializable

If you have some initialization that needs to occur on a given object, you could include this code in the constructor. However, this means that the initialization logic would occur in the middle of the object graph being constructed, so it may not be ideal.

A better alternative is to implement IInitializable, and then perform initialization logic in an Initialize() method.

Then, to hook it up in an installer:

```csharp
Container
    .Bind<IInitializable>()
    .To<Foo>()
    .AsSingle();
```

Or if you don't want to have to always remember which interfaces your class implements, you can use the shortcut described here

The Foo.Initialize method would then be called after the entire object graph is constructed and all constructors have been called.

Note that the constructors for the initial object graph are called during Unity's Awake event, and that the IInitializable.Initialize methods are called immediately on Unity's Start event. Using IInitializable as opposed to a constructor is therefore more in line with Unity's own recommendations, which suggest that the Awake phase be used to set up object references, and the Start phase be used for more involved initialization logic.

This can also be better than using constructors or [Inject] methods because the initialization order is customizable in a similar way to ITickable, as explained here.

```csharp
public class Ship : IInitializable
{
    public void Initialize()
    {
        // Initialize your object here
    }
}
```

IInitializable works well for start-up initialization, but what about for objects that are created dynamically via factories? (see this section for what I'm referring to here). For these cases you will most likely want to either use an [Inject] method or an explicit Initialize method that is called after the object is created. For example:

```csharp
public class Foo
{
    [Inject]
    IBar _bar;

    [Inject]
    public void Initialize()
    {
        ...
        _bar.DoStuff();
        ...
    }
}
```

<br/> 

![HR](/img/hr.svg)
## IDisposable

If you have external resources that you want to clean up when the app closes, the scene changes, or for whatever reason the context object is destroyed, you can declare your class as IDisposable like below:

```csharp
public class Logger : IInitializable, IDisposable
{
    FileStream _outStream;

    public void Initialize()
    {
        _outStream = File.Open("log.txt", FileMode.Open);
    }

    public void Log(string msg)
    {
        _outStream.WriteLine(msg);
    }

    public void Dispose()
    {
        _outStream.Close();
    }
}
```

Then in your installer you can include:

```csharp
Container
    .Bind(typeof(Logger), typeof(IInitializable), typeof(IDisposable))
    .To<Logger>()
    .AsSingle();
```

Or you can use the BindInterfaces shortcut:

```csharp
Container
    .BindInterfacesAndSelfTo<Logger>()
    .AsSingle();
```

This works because when the scene changes or your unity application is closed, the unity event OnDestroy() is called on all MonoBehaviours, including the SceneContext class, which then triggers Dispose() on all objects that are bound to IDisposable.

You can also implement the ILateDisposable interface which works similar to ILateTickable in that it will be called after all IDisposable objects have been triggered. However, for most cases you're probably better off setting an explicit execution order instead if the order is an issue.

<br/> 

![HR](/img/hr.svg)
## BindInterfacesTo and BindInterfacesAndSelfTo
If you end up using the ITickable, IInitializable, and IDisposable interfaces as described above, you will often end up with code like this:

```csharp
Container
    .Bind(typeof(Foo), typeof(IInitializable), typeof(IDisposable))
    .To<Logger>()
    .AsSingle();
```

This can be a bit verbose sometimes. Also, it is not ideal because if I later on decide that Foo doesn't need a Tick() or a Dispose() then I have to keep the installer in sync.

A better idea might be to just always use the interfaces like this:

```csharp
Container
    .Bind(new[] { typeof(Foo) }.Concat(typeof(Foo).GetInterfaces()))
    .To<Foo>()
    .AsSingle();
```

This pattern is useful enough that UniDi includes a custom bind method for it. The above code is equivalent to:

```csharp
Container
    .BindInterfacesAndSelfTo<Foo>()
    .AsSingle();
```

Now, we can add and remove interfaces to/from Foo and the installer remains the same.

In some cases you might only want to bind the interfaces, and keep Foo hidden from other classes. In that case you would use the BindInterfacesTo method instead:

```csharp
Container
    .BindInterfacesTo<Foo>()
    .AsSingle()
```

Which, in this case, would expand to:

```csharp
Container
    .Bind(typeof(IInitializable), typeof(IDisposable))
    .To<Foo>()
    .AsSingle();
```

<br/> 

![HR](/img/hr.svg)
## Using the Unity Inspector To Configure Settings
One implication of writing most of your code as normal C# classes instead of MonoBehaviour's is that you lose the ability to configure data on them using the inspector. You can however still take advantage of this in UniDi by using the following pattern:

```csharp
public class Foo : ITickable
{
    readonly Settings _settings;

    public Foo(Settings settings)
    {
        _settings = settings;
    }

    public void Tick()
    {
        Debug.Log("Speed: " + _settings.Speed);
    }

    [Serializable]
    public class Settings
    {
        public float Speed;
    }
}
```

Then, in an installer:

```csharp
public class TestInstaller : MonoInstaller<TestInstaller>
{
    public Foo.Settings FooSettings;

    public override void InstallBindings()
    {
        Container.BindInstance(FooSettings);
        Container.BindInterfacesTo<Foo>().AsSingle();
    }
}
```

Or, equivalently:

```csharp
public class TestInstaller : MonoInstaller<TestInstaller>
{
    public Foo.Settings FooSettings;

    public override void InstallBindings()
    {
        Container.BindInterfacesTo<Foo>().AsSingle().WithArguments(FooSettings);
    }
}
```

Now, if we run our scene we can change the speed value to tune the Foo class in real time.

Another (arguably better) way to do this is to use ScriptableObjectInstaller instead of MonoInstaller, which have the added advantage that you can change your settings at runtime and have those changes automatically persist when play mode is stopped. See here for details.
