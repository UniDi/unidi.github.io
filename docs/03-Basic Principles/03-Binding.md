---
id: Binding
description: "This article explains how to use the Bind<>() method for registering dependencies into the Di-container."
---

In UniDi, dependency mapping is done by adding bindings to something called a container. The container should then _know_ how to create all the object instances in your application, by recursively resolving all dependencies for a given object.

When the container is asked to construct an instance of a given type, it uses C# reflection to find the list of constructor arguments, and all fields/properties that are marked with an [Inject] attribute. It then attempts to resolve each of these required dependencies, which it uses to call the constructor and create the new instance.

Each UniDi application therefore must tell the container how to resolve each of these dependencies, which is done via Bind commands.  For example, given the following class:

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

You can wire up the dependencies for this class with the following:

```csharp
Container.Bind<Foo>().AsSingle();
Container.Bind<IBar>().To<Bar>().AsSingle();
```

This tells UniDi that every class that requires a dependency of type Foo should use the same instance, which it will automatically create when needed.  And similarly, any class that requires the IBar interface (like Foo) will be given the same instance of type Bar.

## The bind command in full

The full format for the bind command is the following:

<div className="content-banner">
        <b>Container.Bind&lt;</b>ContractType<b>&gt;()</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.WithId(</b>Identifier<b>)</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.To&lt;</b>ResultType<b>&gt;()</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.From</b>ConstructionMethod<b>()</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.AsScope()</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.WithArguments(</b>Arguments<b>)</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.OnInstantiated(</b>InstantiatedCallback<b>)</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.When(</b>Condition<b>)</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.<b>Copy</b>/<b>Move</b>Into<b>All</b>/<b>Direct</b>SubContainers()</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.NonLazy()</b><br/>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>.IfNotBound();</b>
  <img className="content-banner-img" src="/static/img/unibot.svg" alt=" " />
</div>

:::note
In most cases you will not use all of these methods and that they all have logical defaults when unspecified
:::

Where:

### Bind<**ContractType**\>()

**ContractType** = The type that you are creating a binding for.

This value will correspond to the type of the field/parameter that is being injected.

### WithId(**Identifier**)

**Identifier** = The value to use to uniquely identify the binding.  

This can be ignored in most cases, but can be quite useful in cases where you need to distinguish between multiple bindings with the same contract type. See [here](#identifiers) for details.

### To<**ResultType**\>()

**ResultType** = The type to bind to.

Default: **ContractType** 

This type must either be equal to **ContractType** or derive from **ContractType**. If unspecified, it assumes `ToSelf()`, which means that the **ResultType** will be the same as the **ContractType**. This value will be used by whatever is given as the **ConstructionMethod** to retrieve an instance of this type.

### From**ConstructionMethod**()

**ConstructionMethod** = The method by which an instance of **ResultType** is created/retrieved.  See [this section](#construction-methods) for more details on the various construction methods.  

Default: FromNew()  

Examples: `FromGetter`, `FromMethod`, `FromResolve`, `FromComponentInNewPrefab`, `FromSubContainerResolve`, `FromInstance`, etc.

### As**Scope**()

**Scope** = This value determines how often (or if at all) the generated instance is re-used across multiple injections.  

Default: AsTransient()

:::note
Not all bindings have a default, an exception will be thrown if there's not a scope supplied. The bindings that do not require the scope to be set explicitly are any binding with a construction method that is a search rather than creating a new object from scratch (eg. FromMethod, FromComponent, FromResolve, etc.).
:::

It can be one of the following:
#### AsTransient()
Will not re-use the instance at all.  Every time **ContractType** is requested, the DiContainer will execute the given construction method again
#### AsCached()
Will re-use the same instance of **ResultType** every time **ContractType** is requested, which it will lazily generate upon first use
#### AsSingle()
Exactly the same as AsCached, except that it will sometimes throw exceptions if there already a binding for **ResultType** exists. It is simply a way to ensure that the given **ResultType** is unique within the container. Note however that it will only guarantee that there is only one instance across the given container, which means that using AsSingle with the same binding in a sub-container could generate a second instance.

In most cases, you will likely want to just use AsSingle, however AsTransient and AsCached have their uses too.

### WithArguments(**Arguments**)

**Arguments** = A list of objects to use when constructing the new instance of type **ResultType**.  

This can be useful as an alternative to adding other bindings for the arguments in the form `Container.BindInstance(arg).WhenInjectedInto<ResultType>()`

### OnInstantiated(**InstantiatedCallback**)

**InstantiatedCallback** = In some cases it is useful to be able customize an object after it is instantiated.  

In particular, if using a third party library, it might be necessary to change a few fields on one of its types.  For these cases you can pass a method to OnInstantiated that can customize the newly created instance.  For example:

```csharp
Container.Bind<Foo>().AsSingle().OnInstantiated<Foo>(OnFooInstantiated);

void OnFooInstantiated(InjectContext context, Foo foo)
{
    foo.Qux = "asdf";
}
```

Or, equivalently:

```csharp
Container.Bind<Foo>().AsSingle().OnInstantiated<Foo>((ctx, foo) => foo.Bar = "qux");
```

:::note
You can also bind a custom factory using FromFactory that directly calls Container.Instantiate before customizing it for the same effect, but OnInstantiated can be easier in some cases.
:::

### When(**Condition**)
**Condition** = The condition that must be true for this binding to be chosen.  
See [here](#conditional-bindings) for more details.

### **Copy**Into**All**SubContainers()
### **Copy**Into**Direct**SubContainers()
### **Move**Into**All**SubContainers()
### **Move**Into**Direct**SubContainers()

**Copy**/**Move**Into**All**/**Direct**SubContainers = This value can be ignored for 99% of users.  

It can be used to automatically have the binding inherited by subcontainers.  For example, if you have a class Foo and you want a unique instance of Foo to be automatically placed in the container and every subcontainer, then you could add the following binding:

```csharp
Container.Bind<Foo>().AsSingle().CopyIntoAllSubContainers()
```

In other words, the result will be equivalent to copying and pasting the `Container.Bind<Foo>().AsSingle()` statement into the installer for every sub-container.

Or, if you only wanted Foo in the subcontainers and not the current container:

```csharp
Container.Bind<Foo>().AsSingle().MoveIntoAllSubContainers()
```

Or, if you only wanted Foo to be in the immediate child subcontainer, and not the subcontainers of these subcontainers:

```csharp
Container.Bind<Foo>().AsSingle().MoveIntoDirectSubContainers()
```

### NonLazy()

**NonLazy** = Normally, the **ResultType** is only ever instantiated when the binding is first used (aka "lazily"). However, when NonLazy is used, **ResultType** will immediately be created on startup.

### IfNotBound()

**IfNotBound** = When this is added to a binding and there is already a binding with the given contract type + identifier, then this binding will be skipped.
