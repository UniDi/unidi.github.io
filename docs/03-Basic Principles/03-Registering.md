# Registering objects

The core of a dependency injection framework is the DI container. In it's simplest form it's an object which contains a dictionary that holds all the _registrations_. 
In this section we are going to cover the 'register a new mapping' part. In UniDi it's called _binding_. As it creates a binding between an _abstraction_ to a _concrete type_. 

## Binding

Every dependency injection framework is ultimately just a framework to bind types to instances.

In UniDi, dependency mapping is done by adding bindings to something called a container. The container should then 'know' how to create all the object instances in your application, by recursively resolving all dependencies for a given object.

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

The full format for the bind command is the following.  Note that in most cases you will not use all of these methods and that they all have logical defaults when unspecified

<pre>
Container.Bind&lt;<b>ContractType</b>&gt;()
    .WithId(<b>Identifier</b>)
    .To&lt;<b>ResultType</b>&gt;()
    .From<b>ConstructionMethod</b>()
    .As<b>Scope</b>()
    .WithArguments(<b>Arguments</b>)
    .OnInstantiated(<b>InstantiatedCallback</b>)
    .When(<b>Condition</b>)
    .(<b>Copy</b>|<b>Move</b>)Into(<b>All</b>|<b>Direct</b>)SubContainers()
    .NonLazy()
    .IfNotBound();
</pre>

Where:

* **ContractType** = The type that you are creating a binding for.

    * This value will correspond to the type of the field/parameter that is being injected.

* **ResultType** = The type to bind to.

    * Default: **ContractType**
    * This type must either to equal to **ContractType** or derive from **ContractType**.  If unspecified, it assumes ToSelf(), which means that the **ResultType** will be the same as the **ContractType**.  This value will be used by whatever is given as the **ConstructionMethod** to retrieve an instance of this type

* **Identifier** = The value to use to uniquely identify the binding.  This can be ignored in most cases, but can be quite useful in cases where you need to distinguish between multiple bindings with the same contract type.  See [here](#identifiers) for details.

* **ConstructionMethod** = The method by which an instance of **ResultType** is created/retrieved.  See [this section](#construction-methods) for more details on the various construction methods.

    * Default: FromNew()
    * Examples: eg. FromGetter, FromMethod, FromResolve, FromComponentInNewPrefab, FromSubContainerResolve, FromInstance, etc.

* **Scope** = This value determines how often (or if at all) the generated instance is re-used across multiple injections.

    * Default: AsTransient.  Note however that not all bindings have a default, so an exception will be thrown if not supplied.  The bindings that do not require the scope to be set explicitly are any binding with a construction method that is a search rather than creating a new object from scratch (eg. FromMethod, FromComponentX, FromResolve, etc.)
    * It can be one of the following:
        1. **AsTransient** - Will not re-use the instance at all.  Every time **ContractType** is requested, the DiContainer will execute the given construction method again
        2. **AsCached** - Will re-use the same instance of **ResultType** every time **ContractType** is requested, which it will lazily generate upon first use
        3. **AsSingle** - Exactly the same as AsCached, except that it will sometimes throw exceptions if there already exists a binding for **ResultType**.  It is simply a way to ensure that the given **ResultType** is unique within the container.  Note however that it will only guarantee that there is only one instance across the given container, which means that using AsSingle with the same binding in a sub-container could generate a second instance.

    * In most cases, you will likely want to just use AsSingle, however AsTransient and AsCached have their uses too.

* **Arguments** = A list of objects to use when constructing the new instance of type **ResultType**.  This can be useful as an alternative to adding other bindings for the arguments in the form `Container.BindInstance(arg).WhenInjectedInto<ResultType>()`
* **InstantiatedCallback** = In some cases it is useful to be able customize an object after it is instantiated.  In particular, if using a third party library, it might be necessary to change a few fields on one of its types.  For these cases you can pass a method to OnInstantiated that can customize the newly created instance.  For example:

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

    Note that you can also bind a custom factory using FromFactory that directly calls Container.InstantiateX before customizing it for the same effect, but OnInstantiated can be easier in some cases

* **Condition** = The condition that must be true for this binding to be chosen.  See [here](#conditional-bindings) for more details.
* (**Copy**|**Move**)Into(**All**|**Direct**)SubContainers = This value can be ignored for 99% of users.  It can be used to automatically have the binding inherited by subcontainers.  For example, if you have a class Foo and you want a unique instance of Foo to be automatically placed in the container and every subcontainer, then you could add the following binding:

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

* **NonLazy** = Normally, the **ResultType** is only ever instantiated when the binding is first used (aka "lazily").  However, when NonLazy is used, **ResultType** will immediately be created on startup.

* **IfNotBound** = When this is added to a binding and there is already a binding with the given contract type + identifier, then this binding will be skipped.

## Construction Methods

1. **FromNew** - Create via the C# new operator. This is the default if no construction method is specified.

    ```csharp
    // These are both the same
    Container.Bind<Foo>();
    Container.Bind<Foo>().FromNew();
    ```

1. **FromInstance** - Add a given instance to the container.  Note that the given instance will not be injected in this case.  If you also want your instance to be injected at startup, see [QueueForInject](#dicontainer-methods-queueforinject)

    ```csharp
    Container.Bind<Foo>().FromInstance(new Foo());

    // You can also use this short hand which just takes ContractType from the parameter type
    Container.BindInstance(new Foo());

    // This is also what you would typically use for primitive types
    Container.BindInstance(5.13f);
    Container.BindInstance("foo");

    // Or, if you have many instances, you can use BindInstances
    Container.BindInstances(5.13f, "foo", new Foo());
    ```

1. **FromMethod** - Create via a custom method

    ```csharp
    Container.Bind<Foo>().FromMethod(SomeMethod);

    Foo SomeMethod(InjectContext context)
    {
        ...
        return new Foo();
    }
    ```

1. **FromMethodMultiple** - Same as FromMethod except allows returning multiple instances at once (or zero).

    ```csharp
    Container.Bind<Foo>().FromMethodMultiple(GetFoos);

    IEnumerable<Foo> GetFoos(InjectContext context)
    {
        ...
        return new Foo[]
        {
            new Foo(),
            new Foo(),
            new Foo(),
        }
    }
    ```

1. **FromFactory** - Create instance using a custom factory class.  This construction method is similar to `FromMethod` except can be cleaner in cases where the logic is more complicated or requires dependencies (since the factory itself can have dependencies injected)

    ```csharp
    class FooFactory : IFactory<Foo>
    {
        public Foo Create()
        {
            // ...
            return new Foo();
        }
    }

    Container.Bind<Foo>().FromFactory<FooFactory>()
    ```

1. **FromIFactory** - Create instance using a custom factory class.  This is a more generic and more powerful alternative to FromFactory, because you can use any kind of construction method you want for your custom factory (unlike FromFactory which assumes `FromNew().AsCached()`)

    For example, you could use a factory that is a scriptable object like this:

    ```csharp
    class FooFactory : ScriptableObject, IFactory<Foo>
    {
        public Foo Create()
        {
            // ...
            return new Foo();
        }
    }

    Container.Bind<Foo>().FromIFactory(x => x.To<FooFactory>().FromScriptableObjectResource("FooFactory")).AsSingle();
    ```

    Or, you might want to have your custom factory be placed in a subcontainer like this:

    ```csharp
    public class FooFactory : IFactory<Foo>
    {
        public Foo Create()
        {
            return new Foo();
        }
    }

    public override void InstallBindings()
    {
        Container.Bind<Foo>().FromIFactory(x => x.To<FooFactory>().FromSubContainerResolve().ByMethod(InstallFooFactory)).AsSingle();
    }

    void InstallFooFactory(DiContainer subContainer)
    {
        subContainer.Bind<FooFactory>().AsSingle();
    }
    ```

    Also note that the following two lines are equivalent:

    ```csharp
    Container.Bind<Foo>().FromFactory<FooFactory>().AsSingle();
    Container.Bind<Foo>().FromIFactory(x => x.To<FooFactory>().AsCached()).AsSingle();
    ```

1. **FromComponentInNewPrefab** - Instantiate the given prefab as a new game object, inject any MonoBehaviour's on it, and then search the result for type **ResultType** in a similar way that `GetComponentInChildren` works

    ```csharp
    Container.Bind<Foo>().FromComponentInNewPrefab(somePrefab);
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if there are multiple matches for **ResultType** on the prefab it will only match the first one encountered just like how GetComponentInChildren works.  So if you are binding a prefab and there isn't a specific MonoBehaviour/Component that you want to bind to, you can just choose Transform and it will match the root of the prefab.

1. **FromComponentsInNewPrefab** - Same as FromComponentInNewPrefab except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

1. **FromComponentInNewPrefabResource** - Instantiate the given prefab (found at the given resource path) as a new game object, inject any MonoBehaviour's on it, and then search the result for type **ResultType** in a similar way that `GetComponentInChildren` works (in that it will return the first matching value found)

    ```csharp
    Container.Bind<Foo>().FromComponentInNewPrefabResource("Some/Path/Foo");
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

1. **FromComponentsInNewPrefabResource** - Same as FromComponentInNewPrefab except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

1. **FromNewComponentOnNewGameObject** - Create a new empty game object and then instantiate a new component of the given type on it.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnNewGameObject();
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

1. **FromNewComponentOnNewPrefab** - Instantiate the given prefab as a new game object and also instantiate a new instance of the given component on the root of the new game object.  NOTE: It is not necessary that the prefab contains a copy of the given component.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnNewPrefab(somePrefab);
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

1. **FromNewComponentOnNewPrefabResource** - Instantiate the given prefab (found at the given resource path) and also instantiate a new instance of the given component on the root of the new game object.  NOTE: It is not necessary that the prefab contains a copy of the given component.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnNewPrefabResource("Some/Path/Foo");
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

1. **FromNewComponentOn** - Instantiate a new component of the given type on the given game object

    ```csharp
    Container.Bind<Foo>().FromNewComponentOn(someGameObject);
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

1. **FromNewComponentSibling** - Instantiate a new component of the given on the current transform.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type.

    ```csharp
    Container.Bind<Foo>().FromNewComponentSibling();
    ```

    Note that if the given component type is already attached to the current transform that this will just return that instead of creating a new component.  As a result, this bind statement functions similar to Unity's [RequireComponent] attribute.

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Also note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

1. **FromComponentInHierarchy** - Look up the component within the scene hierarchy associated with the current context, as well as the hierarchy associated with any parent contexts.  Works similar to `GetComponentInChildren` in that it will return the first matching value found

    ```csharp
    Container.Bind<Foo>().FromComponentInHierarchy().AsSingle();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    In the most common case where the context is a SceneContext, this will search the entire scene hierarchy (except any sub-contexts such as GameObjectContext).  In other words, when the current context is a scene context, it will behave similar to `GameObject.FindObjectsOfType`.  Note that since this could be a big search, it should be used with caution, just like `GameObject.FindObjectsOfType` should be used with caution.

    In the case where the context is GameObjectContext, it will only search within and underneath the game object root (and any parent contexts).

    In the case where the context is ProjectContext, it will only search within the project context prefab

1. **FromComponentsInHierarchy** - Same as FromComponentInHierarchy except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

1. **FromComponentSibling** - Look up the given component type by searching over the components that are attached to the current transform.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type. 

    ```csharp
    Container.Bind<Foo>().FromComponentSibling();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

1. **FromComponentsSibling** - Same as FromComponentSibling except will match multiple values or zero values.

1. **FromComponentInParents** - Look up the component by searching the current transform or any parent for the given component type.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type. 

    ```csharp
    Container.Bind<Foo>().FromComponentInParents();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

1. **FromComponentsInParents** - Same as FromComponentInParents except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere

1. **FromComponentInChildren** - Look up the component by searching the current transform or any child transform for the given component type.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type.   Similar to `GetComponentInChildren` in that it will return the first matching value found

    ```csharp
    Container.Bind<Foo>().FromComponentInChildren();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

1. **FromComponentsInChildren** - Same as FromComponentInChildren except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

1. **FromNewComponentOnRoot** - Instantiate the given component on the root of the current context.  This is most often used with GameObjectContext.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnRoot();
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

1. **FromResource** - Create by calling the Unity3d function `Resources.Load` for **ResultType**.  This can be used to load any type that `Resources.Load` can load, such as textures, sounds, prefabs, etc.

    ```csharp
    Container.Bind<Texture>().WithId("Glass").FromResource("Some/Path/Glass");
    ```

1. **FromResources** - Same as FromResource except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere

1. **FromScriptableObjectResource** - Bind directly to the scriptable object instance at the given resource path.  NOTE:  Changes to this value while inside unity editor will be saved persistently.  If this is undesirable, use FromNewScriptableObjectResource.

    ```csharp
    public class Foo : ScriptableObject
    {
    }

    Container.Bind<Foo>().FromScriptableObjectResource("Some/Path/Foo");
    ```

1. **FromNewScriptableObjectResource** - Same as FromScriptableObjectResource except it will instantiate a new copy of the given scriptable object resource.  This can be useful if you want to have multiple distinct instances of the given scriptable object resource, or if you want to ensure that the saved values for the scriptable object are not affected by changing at runtime.

1. **FromResolve** - Get instance by doing another lookup on the container (in other words, calling `DiContainer.Resolve<ResultType>()`).  Note that for this to work, **ResultType** must be bound in a separate bind statement.  This construction method can be especially useful when you want to bind an interface to another interface, as shown in the below example

    ```csharp
    public interface IFoo
    {
    }

    public interface IBar : IFoo
    {
    }

    public class Foo : IBar
    {
    }

    Container.Bind<IFoo>().To<IBar>().FromResolve();
    Container.Bind<IBar>().To<Foo>();
    ```

1. **FromResolveAll** - Same as FromResolve except will match multiple values or zero values.

1. **FromResolveGetter&lt;ObjectType&gt;** - Get instance from the property of another dependency which is obtained by doing another lookup on the container (in other words, calling `DiContainer.Resolve<ObjectType>()` and then accessing a value on the returned instance of type **ResultType**).  Note that for this to work, **ObjectType** must be bound in a separate bind statement.

    ```csharp
    public class Bar
    {
    }

    public class Foo
    {
        public Bar GetBar()
        {
            return new Bar();
        }
    }

    Container.Bind<Foo>();
    Container.Bind<Bar>().FromResolveGetter<Foo>(x => x.GetBar());
    ```

1. **FromResolveAllGetter&lt;ObjectType&gt;** - Same as FromResolveGetter except will match multiple values or zero values.

1. **FromSubContainerResolve** - Get **ResultType** by doing a lookup on a subcontainer.  Note that for this to work, the sub-container must have a binding for **ResultType**.  This approach can be very powerful, because it allows you to group related dependencies together inside a mini-container, and then expose only certain classes (aka ["Facades"](https://en.wikipedia.org/wiki/Facade_pattern)) to operate on this group of dependencies at a higher level.  For more details on using sub-containers, see [this section](#sub-containers-and-facades).  There are several ways to define the subcontainer:

    1. **ByNewPrefabMethod** - Initialize subcontainer by instantiating a new prefab.  Note that unlike `ByNewContextPrefab`, this bind method does not require that there be a GameObjectContext attached to the prefab.  In this case the GameObjectContext is added dynamically and then run with the given installer method.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewPrefabMethod(MyPrefab, InstallFoo);

        void InstallFoo(DiContainer subContainer)
        {
            subContainer.Bind<Foo>();
        }
        ```

        Note that instead of passing in a prefab directly, you can also pass in a getter method.  For example:

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewPrefabMethod(ChooseFooPrefab, InstallFoo);

        UnityEngine.Object ChooseFooPrefab(InjectContext context) {
            return FooPrefabs[Random.Range(0, FooPrefabs.Length)];
        }
        ```

    1. **ByNewPrefabInstaller** - Initialize subcontainer by instantiating a new prefab.  Same as ByNewPrefabMethod, except it initializes the dynamically created GameObjectContext with the given installer rather than a method.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewPrefabInstaller<FooInstaller>(MyPrefab);

        class FooInstaller : Installer
        {
            public override void InstallBindings()
            {
                Container.Bind<Foo>();
            }
        }
        ```

        Note that instead of passing in a prefab directly, you can also pass in a getter method.  For example:

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewPrefabInstaller<FooInstaller>(ChooseFooPrefab);

        UnityEngine.Object ChooseFooPrefab(InjectContext context) {
            return FooPrefabs[Random.Range(0, FooPrefabs.Length)];
        }
        ```

    1. **ByNewPrefabResourceMethod** - Initialize subcontainer instantiating a new prefab obtained via `Resources.Load`.  Note that unlike `ByNewPrefabResource`, this bind method does not require that there be a GameObjectContext attached to the prefab.  In this case the GameObjectContext is added dynamically and then run with the given installer method.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewPrefabResourceMethod("Path/To/MyPrefab", InstallFoo);

        void InstallFoo(DiContainer subContainer)
        {
            subContainer.Bind<Foo>();
        }
        ```

    1. **ByNewPrefabResourceInstaller** - Initialize subcontainer instantiating a new prefab obtained via `Resources.Load`.  Same as ByNewPrefabResourceMethod, except it initializes the dynamically created GameObjectContext with the given installer rather than a method.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewPrefabResourceInstaller<FooInstaller>("Path/To/MyPrefab");

        class FooInstaller : Installer<FooInstaller>
        {
            public override void InstallBindings()
            {
                Container.Bind<Foo>();
            }
        }
        ```

    1. **ByNewGameObjectInstaller** - Initialize subcontainer by instantiating a empty game object, attaching GameObjectContext, and then installing using the given installer.  This approach is very similar to ByInstaller except has the following advantages:

        - Any ITickable, IInitializable, IDisposable, etc. bindings will be called properly
        - Any new game objects that are instantiated inside the subcontainer will be parented underneath the game object context object
        - You can destroy the subcontainer by just destroying the game object context game object

    1. **ByNewGameObjectMethod** - Same as ByNewGameObjectInstaller except the subcontainer is initialized based on the given method rather than an installer type.

    1. **ByMethod** - Initialize the subcontainer by using a method.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByMethod(InstallFooFacade);

        void InstallFooFacade(DiContainer subContainer)
        {
            subContainer.Bind<Foo>();
        }
        ```

        Note that when using ByMethod, if you want to use zenject interfaces such as ITickable, IInitializable, IDisposable inside your subcontainer then you have to also use the WithKernel bind method like this:

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByMethod(InstallFooFacade).WithKernel();

        void InstallFooFacade(DiContainer subContainer)
        {
            subContainer.Bind<Foo>();
            subContainer.Bind<ITickable>().To<Bar>();
        }
        ```

    1. **ByInstaller** - Initialize the subcontainer by using a class derived from `Installer`.  This can be a cleaner and less error-prone alternative than `ByMethod`, especially if you need to inject data into the installer itself.  Less error prone because when using ByMethod it is common to accidentally use Container instead of subContainer in your method.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByInstaller<FooFacadeInstaller>();

        class FooFacadeInstaller : Installer
        {
            public override void InstallBindings()
            {
                Container.Bind<Foo>();
            }
        }
        ```

        Note that when using ByInstaller, if you want to use zenject interfaces such as ITickable, IInitializable, IDisposable inside your subcontainer then you have to also use the WithKernel bind method like this:

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByInstaller<FooFacadeInstaller>().WithKernel();
        ```

    1. **ByNewContextPrefab** - Initialize subcontainer by instantiating a new prefab.  Note that the prefab must contain a `GameObjectContext` component attached to the root game object.  For details on `GameObjectContext` see [this section](#sub-containers-and-facades).

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewContextPrefab(MyPrefab);

        // Assuming here that this installer is added to the GameObjectContext at the root
        // of the prefab.  You could also use a UniDiBinding in the case where Foo is a MonoBehaviour
        class FooFacadeInstaller : MonoInstaller
        {
            public override void InstallBindings()
            {
                Container.Bind<Foo>();
            }
        }
        ```

    1. **ByNewContextPrefabResource** - Initialize subcontainer instantiating a new prefab obtained via `Resources.Load`.  Note that the prefab must contain a `GameObjectContext` component attached to the root game object.

        ```csharp
        Container.Bind<Foo>().FromSubContainerResolve().ByNewContextPrefabResource("Path/To/MyPrefab");
        ```

    1. **ByInstance** - Initialize the subcontainer by directly using a given instance of DiContainer that you provide yourself.  This is only useful in some rare edge cases.

1. **FromSubContainerResolveAll** - Same as FromSubContainerResolve except will match multiple values or zero values.
