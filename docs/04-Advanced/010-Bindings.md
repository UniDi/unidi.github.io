# Bindings

[Binding Basics](../Basic%20Principles/Binding)

<br/> 

![HR](/img/hr.svg)
## GameObjects Bind Methods
## Naming and grouping:

Instantiating lots of GameObjects can clutter your hierarchy. UniDi provides a couple of extension methods that allows you to give the instantiated GameObject an unique name and specify where to place the new GameObject under.

###  WithGameObjectName
The name to give the new Game Object associated with this binding.

```csharp
Container
	.Bind<Foo>()
	.FromComponentInNewPrefabResource("Assets/MyPath/Foo")
	.WithGameObjectName("Foo1");

Container
	.Bind<Foo>()
	.FromNewComponentOnNewGameObject()
	.WithGameObjectName("Foo1");
```

### UnderTransform(Transform)
The actual transform to place the new game object under.

```csharp
Container
    .BindFactory<Bullet, Bullet.Factory>()
    .FromComponentInNewPrefab(BulletPrefab)
    .UnderTransform(BulletTransform);
```

### UnderTransform(Method)
A method to provide the transform to use.

```csharp
Container
    .BindFactory<Foo, Foo.Factory>()
    .FromComponentInNewGameObject()
    .UnderTransform(GetParent);

Transform GetParent(InjectContext context)
{
    if (context.ObjectInstance is Component)
    {
        return ((Component)context.ObjectInstance).transform;
    }

    return null;
}
```

This example will automatically parent the Foo GameObject underneath the game object that it is being injected into, unless the injected object is not a MonoBehaviour in which case it will leave Foo at the root of the scene hierarchy.

### UnderTransformGroup(string)
The name of the transform group to place the new game object under.  This is especially useful for factories, which can be used to create many copies of a prefab, so it can be nice to have them automatically grouped together within the scene hierarchy.

```csharp
Container.BindFactory<Bullet, Bullet.Factory>()
    .FromComponentInNewPrefab(BulletPrefab)
    .UnderTransformGroup("Bullets");
```

<br/> 

![HR](/img/hr.svg)
## Optional Binding

You can declare some dependencies as optional as follows:

```csharp
public class Bar
{
    public Bar(
        [InjectOptional]
        IFoo foo)
    {
        ...
    }
}
...

// You can comment this out and it will still work
Container.Bind<IFoo>().AsSingle();
```

Or, if you have an identifier as well:

```csharp
public class Bar
{
    public Bar(
        [Inject(Optional = true, Id = "foo1")]
        IFoo foo)
    {
        ...
    }
}
```

If an optional dependency is not bound in any installers, then it will be injected as null.

If the dependency is a primitive type (eg. `int,` `float`, `struct`) then it will be injected with its default value (eg. 0 for ints).

You may also assign an explicit default using the standard C# way such as:

```csharp
public class Bar
{
    public Bar(int foo = 5)
    {
        ...
    }
}
...

// Can comment this out and 5 will be used instead
Container.BindInstance(1);
```

Note also that the `[InjectOptional]` is not necessary in this case, since it's already implied by the default value.

Alternatively, you can define the primitive parameter as nullable, and perform logic depending on whether it is supplied or not, such as:

```csharp
public class Bar
{
    int _foo;

    public Bar(
        [InjectOptional]
        int? foo)
    {
        if (foo == null)
        {
            // Use 5 if unspecified
            _foo = 5;
        }
        else
        {
            _foo = foo.Value;
        }
    }
}

...

// Can comment this out and it will use 5 instead
Container.BindInstance(1);
```

<br/> 

![HR](/img/hr.svg)
## Conditional Bindings

In many cases you will want to restrict where a given dependency is injected.  You can do this using the following syntax:

```csharp
Container.Bind<IFoo>().To<Foo1>().AsSingle().WhenInjectedInto<Bar1>();
Container.Bind<IFoo>().To<Foo2>().AsSingle().WhenInjectedInto<Bar2>();
```

Note that `WhenInjectedInto` is simple shorthand for the following, which uses the more general `When()` method:

```csharp
Container.Bind<IFoo>().To<Foo>().AsSingle().When(context => context.ObjectType == typeof(Bar));
```

The InjectContext class (which is passed as the `context` parameter above) contains the following information that you can use in your conditional:

* `Type ObjectType` - The type of the newly instantiated object, which we are injecting dependencies into.  Note that this is null for root calls to `Resolve<>` or `Instantiate<>`
* `object ObjectInstance` - The newly instantiated instance that is having its dependencies filled.  Note that this is only available when injecting fields or into `[Inject]` methods and null for constructor parameters
* `string Identifier` - This will be null in most cases and set to whatever is given as a parameter to the `[Inject]` attribute.  For example, `[Inject(Id = "foo")] _foo` will result in `Identifier` being equal to the string "foo".
* `object ConcreteIdentifier` - This will be null in most cases and set to whatever is given as the identifier in the `WithConcreteIdentifier` bind method
* `string MemberName` - The name of the field or parameter that we are injecting into.  This can be used, for example, in the case where you have multiple constructor parameters that are strings.  However, using the parameter or field name can be error prone since other programmers may refactor it to use a different name.  In many cases it's better to use an explicit identifier
* `Type MemberType` - The type of the field or parameter that we are injecting into.
* `InjectContext ParentContext` - This contains information on the entire object graph that precedes the current class being created.  For example, dependency A might be created, which requires an instance of B, which requires an instance of C.  You could use this field to inject different values into C, based on some condition about A.  This can be used to create very complex conditions using any combination of parent context information.  Note also that `ParentContext.MemberType` is not necessarily the same as ObjectType, since the ObjectType could be a derived type from `ParentContext.MemberType`
* `bool Optional` - True if the `[InjectOptional]` parameter is declared on the field being injected

<br/> 

![HR](/img/hr.svg)
## List Bindings

When UniDi finds multiple bindings for the same type, it interprets that to be a list.  So, in the example code below, `Bar` would get a list containing a new instance of `Foo1,` `Foo2`, and `Foo3`:

```csharp
// In an installer somewhere
Container.Bind<IFoo>().To<Foo1>().AsSingle();
Container.Bind<IFoo>().To<Foo2>().AsSingle();
Container.Bind<IFoo>().To<Foo3>().AsSingle();

...

public class Bar
{
    public Bar(List<IFoo> foos)
    {
    }
}
```

The order of the list will be the same as the order in which they were added with a `Bind` method.  The only exception is when you use subcontainers, since in that case the list will be ordered first by the associated subcontainer, with the first set of instances taken from the bottom most subcontainer, and then the parent, then the grandparent, etc.

<br/> 

![HR](/img/hr.svg)
## Global Bindings Using Project Context

This all works great for each individual scene, but what if you have dependencies that you wish to persist permanently across all scenes?  In UniDi you can do this by adding installers to a `ProjectContext` object.

To do this, first you need to create a prefab for the `ProjectContext,` and then you can add installers to it.  You can do this most easily by selecting the menu item `Edit -> UniDi -> Create Project Context`. You should then see a new asset in the folder `Assets/Resources` called 'ProjectContext'.  Alternatively, you can right click somewhere in Projects tab and select `Create -> UniDi -> ProjectContext`.

If you click on this it will appear nearly identically to the inspector for `SceneContext`.  The easiest way to configure this prefab is to temporarily add it to your scene, add Installers to it, then click "Apply" to save it back to the prefab before deleting it from your scene.  In addition to installers, you can also add your own custom MonoBehaviour classes to the ProjectContext object directly.

Then, when you start any scene that contains a `SceneContext`, your `ProjectContext` object will always be initialized first.  All the installers you add here will be executed and the bindings that you add within them will be available for use in all scenes within your project.  The `ProjectContext` game object is set as [DontDestroyOnLoad](https://docs.unity3d.com/ScriptReference/Object.DontDestroyOnLoad.html) so it will not be destroyed when changing scenes.

Note also that this only occurs once.  If you load another scene from the first scene, your `ProjectContext` will not be called again and the bindings that it added previously will persist into the new scene.  You can declare `ITickable` / `IInitializable` / `IDisposable` objects in your project context installers in the same way you do for your scene installers with the result being that `IInitializable.Initialize` is called only once across each play session and `IDisposable.Dispose` is only called once the application is fully stopped.

The reason that all the bindings you add to a global installer are available for any classes within each individual scene, is because the Container in each scene uses the `ProjectContext` Container as it's "parent".  For more information on nested containers see [here](#sub-containers-and-facades).

`ProjectContext` is a very convenient place to put objects that you want to persist across scenes.  However, the fact that it's completely global to every scene can lead to some unintended behaviour.  For example, this means that even if you write a simple test scene that uses UniDi, it will load the `ProjectContext,` which may not be what you want.  To address these problems it is often better to use Scene Parenting instead, since that approach allows you to be selective in terms of which scenes inherit the same common bindings.  See [here](#TODO) for more details on that approach.

Note also that by default, any game objects that are instantiated inside ProjectContext will be parented underneath it by default.  If you'd prefer that each newly instantiated object is instead placed at the root of the scene hierarchy (but still marked DontDestroyOnLoad) then you can change this by unchecking the flag 'Parent New Objects Under Context' in the inspector of ProjectContext.

<br/> 

![HR](/img/hr.svg)
## Identifiers

You can also give an ID to your binding if you need to have distinct bindings for the same type, and you don't want it to just result in a `List<>`.  For example:

```csharp
Container.Bind<IFoo>().WithId("foo").To<Foo1>().AsSingle();
Container.Bind<IFoo>().To<Foo2>().AsSingle();

...

public class Bar1
{
    [Inject(Id = "foo")]
    IFoo _foo;
}

public class Bar2
{
    [Inject]
    IFoo _foo;
}
```

In this example, the `Bar1` class will be given an instance of `Foo1`, and the `Bar2` class will use the default version of `IFoo` which is bound to `Foo2`.

Note also that you can do the same thing for constructor/inject-method arguments as well:

```csharp
public class Bar
{
    Foo _foo;

    public Bar(
        [Inject(Id = "foo")]
        Foo foo)
    {
    }
}
```

In many cases, the ID is created as a string, however you can actually use any type you like for this.  For example, it's sometimes useful to use an enum instead:

```csharp
enum Cameras
{
    Main,
    Player,
}

Container.Bind<Camera>().WithId(Cameras.Main).FromInstance(MyMainCamera);
Container.Bind<Camera>().WithId(Cameras.Player).FromInstance(MyPlayerCamera);
```

You can also use custom types, as long as they implement the `Equals` operator.

<br/> 

![HR](/img/hr.svg)
## Non Generic Bindings

In some cases you may not know the exact type you want to bind at compile time.  In these cases you can use the overload of the `Bind` method which takes a `System.Type` value instead of a generic parameter.

```csharp
// These two lines will result in the same behaviour
Container.Bind(typeof(Foo));
Container.Bind<Foo>();
```

Note also that when using non generic bindings, you can pass multiple arguments:

```csharp
Container.Bind(typeof(Foo), typeof(Bar), typeof(Qux)).AsSingle();

// The above line is equivalent to these three:
Container.Bind<Foo>().AsSingle();
Container.Bind<Bar>().AsSingle();
Container.Bind<Qux>().AsSingle();
```

The same goes for the To method:

```csharp
Container.Bind<IFoo>().To(typeof(Foo), typeof(Bar)).AsSingle();

// The above line is equivalent to these two:
Container.Bind<IFoo>().To<Foo>().AsSingle();
Container.Bind<IFoo>().To<Bar>().AsSingle();
```

You can also do both:

```csharp
Container.Bind(typeof(IFoo), typeof(IBar)).To(typeof(Foo1), typeof(Foo2)).AsSingle();

// The above line is equivalent to these:
Container.Bind<IFoo>().To<Foo>().AsSingle();
Container.Bind<IFoo>().To<Bar>().AsSingle();
Container.Bind<IBar>().To<Foo>().AsSingle();
Container.Bind<IBar>().To<Bar>().AsSingle();
```

This can be especially useful when you have a class that implements multiple interfaces:

```csharp
Container.Bind(typeof(ITickable), typeof(IInitializable), typeof(IDisposable)).To<Foo>().AsSingle();
```

Though in this particular example there is already a built-in shortcut method for this:

```csharp
Container.BindInterfacesTo<Foo>().AsSingle();
```

<br/> 

![HR](/img/hr.svg)
## Convention Based Binding

Convention based binding can come in handy in any of the following scenarios:

- You want to define a naming convention that determines how classes are bound to the container (eg. using a prefix, suffix, or regex)
- You want to use custom attributes to determine how classes are bound to the container
- You want to automatically bind all classes that implement a given interface within a given namespace or assembly

Using "convention over configuration" can allow you to define a framework that other programmers can use to quickly and easily get things done, instead of having to explicitly add every binding within installers.  This is the philosophy that is followed by frameworks like Ruby on Rails, ASP.NET MVC, etc.  Of course, there are both advantages and disadvantages to this approach.

They are specified in a similar way to [Non Generic bindings](#non-generic-bindings), except instead of giving a list of types to the `Bind()` and `To()` methods, you describe the convention using a Fluent API.  For example, to bind `IFoo` to every class that implements it in the entire codebase:

```csharp
Container.Bind<IFoo>().To(x => x.AllTypes().DerivingFrom<IFoo>());
```

Note that you can use the same Fluent API in the `Bind()` method as well, and you can also use it in both `Bind()` and `To()` at the same time.

For more examples see the [examples](#convention-binding-examples) section below.  The full format is as follows:

<pre>
x.<b>InitialList</b>().<b>Conditional</b>().<b>AssemblySources</b>()
</pre>

### Where:

* **InitialList** = The initial list of types to use for our binding.  This list will be filtered by the given **Conditional**s.  It can be one of the following (fairly self explanatory) methods:

    1. **AllTypes**
    1. **AllNonAbstractClasses**
    1. **AllAbstractClasses**
    1. **AllInterfaces**
    1. **AllClasses**

* **Conditional** = The filter to apply to the list of types given by **InitialList**.  Note that you can chain as many of these together as you want, and they will all be applied to the initial list in sequence.  It can be one of the following:

    1. `DerivingFrom<T>` - Only match types deriving from `T`
    1. `**DerivingFromOrEqual**<T>` - Only match types deriving from or equal to `T`
    1. `**WithPrefix**(value)` - Only match types with names that start with `value`
    1. `**WithSuffix**(value)` - Only match types with names that end with `value`
    1. `**WithAttribute**<T>` - Only match types that have the attribute `[T]` above their class declaration
    1. `**WithoutAttribute**<T>` - Only match types that do not have the attribute `[T]` above their class declaration
    1. `**WithAttributeWhere**<T>(predicate)` - Only match types that have the attribute `[T]` above their class declaration AND in which the given predicate returns true when passed the attribute.  This is useful so you can use data given to the attribute to create bindings
    1. `**InNamespace**(value)` - Only match types that are in the given namespace
    1. `**InNamespaces**(value1, value2, etc.)` - Only match types that are in any of the given namespaces
    1. `**MatchingRegex**(pattern)` - Only match types that match the given regular expression
    1. `**Where**(predicate)` - Finally, you can also add any kind of conditional logic you want by passing in a predicate that takes a `Type` parameter

* **AssemblySources** = The list of assemblies to search for types when populating **InitialList**.  It can be one of the following:

    1. `**FromAllAssemblies**` - Look up types in all loaded assemblies.  This is the default when unspecified.
    1. `**FromAssemblyContaining**<T>` - Look up types in whatever assembly the type `T` is in
    1. `**FromAssembliesContaining**(type1, type2, ..)` - Look up types in all assemblies that contains any of the given types
    1. `**FromThisAssembly** - Look up types only in the assembly in which you are calling this method
    1. `**FromAssembly**(assembly)` - Look up types only in the given assembly
    1. `**FromAssemblies**(assembly1, assembly2, ...)` - Look up types only in the given assemblies
    1. `**FromAssembliesWhere**(predicate)` - Look up types in all assemblies that match the given predicate

### Examples:

Note that you can chain together any combination of the below conditionals in the same binding.  Also note that since we aren't specifying an assembly here, UniDi will search within all loaded assemblies.

1. Bind `IFoo` to every class that implements it in the entire codebase:

    ```csharp
    Container.Bind<IFoo>().To(x => x.AllTypes().DerivingFrom<IFoo>());
    ```

    Note that this will also have the same result:

    ```csharp
    Container.Bind<IFoo>().To(x => x.AllNonAbstractTypes());
    ```

    This is because UniDi will skip any bindings in which the concrete type does not actually derive from the base type.  Also note that in this case we have to make sure we use `AllNonAbstractTypes` instead of just `AllTypes`, to ensure that we don't bind `IFoo` to itself

1. Bind an interface to all classes implementing it within a given namespace

    ```csharp
    Container.Bind<IFoo>().To(x => x.AllTypes().DerivingFrom<IFoo>().InNamespace("MyGame.Foos"));
    ```

1. Auto-bind `IController` every class that has the suffix "Controller" (as is done in ASP.NET MVC):

    ```csharp
    Container.Bind<IController>().To(x => x.AllNonAbstractTypes().WithSuffix("Controller"));
    ```

    You could also do this using `MatchingRegex`:

    ```csharp
    Container.Bind<IController>().To(x => x.AllNonAbstractTypes().MatchingRegex("Controller$"));
    ```

1. Bind all types with the prefix "Widget" and inject into Foo

    ```csharp
    Container.Bind<object>().To(x => x.AllNonAbstractTypes().WithPrefix("Widget")).WhenInjectedInto<Foo>();
    ```

1. Auto-bind the interfaces that are used by every type in a given namespace

    ```csharp
    Container.Bind(x => x.AllInterfaces())
        .To(x => x.AllNonAbstractClasses().InNamespace("MyGame.Things"));
    ```

    This is equivalent to calling `Container.BindInterfacesTo<T>()` for every type in the namespace "MyGame.Things".  This works because, as touched on above, UniDi will skip any bindings in which the concrete type does not actually derive from the base type.  So even though we are using `AllInterfaces` which matches every single interface in every single loaded assembly, this is ok because it will not try and bind an interface to a type that doesn't implement this interface.

<br/> 

![HR](/img/hr.svg)
## Decorator Bindings

Decorator Bindings has it's own documentation [here](Decorator-Bindings).
