# Injection

There are many different ways of declaring dependencies on the container, which are documented in the [next section](#binding).  There are also several ways of having these dependencies injected into your classes. These are:

## Constructor Injection**

```csharp
public class Foo
{
    IBar _bar;

    public Foo(IBar bar)
    {
        _bar = bar;
    }
}
```

## Field Injection

```csharp
public class Foo
{
    [Inject]
    IBar _bar;
}
```

Field injection occurs immediately after the constructor is called.  All fields that are marked with the `[Inject]` attribute are looked up in the container and given a value.  Note that these fields can be private or public and injection will still occur.

## Property Injection

```csharp
public class Foo
{
    [Inject]
    public IBar Bar
    {
        get;
        private set;
    }
}
```

Property injection works the same as field injection except is applied to C# properties.  Just like fields, the setter can be private or public in this case.

## Method Injection

```csharp
public class Foo
{
    IBar _bar;
    Qux _qux;

    [Inject]
    public void Init(IBar bar, Qux qux)
    {
        _bar = bar;
        _qux = qux;
    }
}
```

Method Inject injection works very similarly to constructor injection.

Note the following:

- Inject methods are the recommended approach for MonoBehaviours, since MonoBehaviours cannot have constructors.
- There can be any number of inject methods.  In this case, they are called in the order of Base class to Derived class.  This can be useful to avoid the need to forward many dependencies from derived classes to the base class via constructor parameters, while also guaranteeing that the base class inject methods complete first, just like how constructors work.
- Inject methods are called after all other injection types.  It is designed this way so that these methods can be used to execute initialization logic which might make use of injected fields or properties.  Note also that you can leave the parameter list empty if you just want to do some initialization logic only.
- You can safely assume that the dependencies that you receive via inject methods will themselves already have been injected (the only exception to this is in the case where you have circular dependencies).  This can be important if you use inject methods to perform some basic initialization, since in that case you may need the given dependencies to be initialized as well
- Note however that it is usually not a good idea to use inject methods for initialization logic.  Often it is better to use IInitializable.Initialize or Start() methods instead, since this will allow the entire initial object graph to be created first.

## Best practices

Best practice is to prefer constructor/method injection compared to field/property injection.
* Constructor injection forces the dependency to only be resolved once, at class creation, which is usually what you want.  In most cases you don't want to expose a public property for your initial dependencies because this suggests that it's open to changing.
* Constructor injection guarantees no circular dependencies between classes, which is generally a bad thing to do.  UniDi does allow circular dependencies when using other injections types however such as method/field/property injection
* Constructor/Method injection is more portable for cases where you decide to re-use the code without a DI framework such as UniDi.  You can do the same with public properties but it's more error prone (it's easier to forget to initialize one field and leave the object in an invalid state)
* Finally, Constructor/Method injection makes it clear what all the dependencies of a class are when another programmer is reading the code.  They can simply look at the parameter list of the method.  This is also good because it will be more obvious when a class has too many dependencies and should therefore be split up (since its constructor parameter list will start to seem long)
