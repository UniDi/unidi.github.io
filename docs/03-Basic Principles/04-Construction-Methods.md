---
id: Construction Methods

---

<div className="content-banner">
<p>
<b>When you bind a dependency you can specify how the instance should be constructed and retrieved.</b>
</p>
&nbsp;
<p>
UniDi has an comprehensive list of construction methods. You can use an existing instance or creating a new one.
These can be from any type, primitive type, Unity GameObject (in the hierarchy), component, prefab, UniDi Factory, sub-container...
Or create an instance with a total custom method.
</p>
<img className="content-banner-img" src="/static/img/unibot.svg" alt=" " />
</div>

## Container.Bind().From ... ()

* [Default => `.FromNew()`](#fromnew)
* [Instance => `.FromInstance(arg)`](#instance)
* [Instances `.FromInstances(args)`](#instance)
* [Method `.FromMethod(method)`](#method)
* [Method Returning Multiple Instances `.FromMethodMultiple(method)`](#method-multiple-instances)
* [Custom Factory `.FromFactory(Factory)`](#factory)
* [Generic IFactory `.FromIFactory(constructionmethod)`](#ifactory)
* [Component In Prefab `.FromComponentInNewPrefab(prefab)`](#component-in-new-prefab)
* [`.FromComponentsInNewPrefab()`](#components-in-new-prefab)
* [`.FromComponentInNewPrefabResource()`](#component-in-new-prefab-resource)
* [`.FromComponentsInNewPrefabResource()`](#components-in-new-prefab-resource)
* [`.FromNewComponentOnNewGameObject()`](#new-component-on-new-gameobject)
* [`.FromNewComponentOnNewPrefab()`](#new-component-on-new-prefab)
* [`.FromNewComponentOnNewPrefabResource()`](#new-component-on-new-prefab-resource)
* [`.FromNewComponentOn()`](#new-component-on)
* [`.FromNewComponentSibling()`](#new-component-sibling)
* [`.FromComponentInHierarchy()`](#component-in-hierarchy)
* [`.FromComponentsInHierarchy()`](#components-in-hierarchy)
* [`.FromComponentSibling()`](#components-sibling)
* [`.FromComponentsSibling()`](#component-sibling)
* [`.FromComponentInParents()`](#component-in-parents)
* [`.FromComponentsInParents()`](#components-in-parents)
* [`.FromComponentInChildren()`](#component-in-children)
* [`.FromComponentsInChildren()`](#components-in-children)
* [`.FromNewComponentOnRoot()`](#new-component-on-root)
* [`.FromResource()`](#resource)
* [`.FromResources()`](#resources)
* [`.FromScriptableObjectResource()`](#scriptableObject-resource )
* [`.FromNewScriptableObjectResource()`](#new-scriptableObject-resource)
* [`.FromResolve()`](#resolve)
* [`.FromResolveAll()`](#resolve-all)
* [`.FromResolveGetter()`](#resolve-getter)
* [`.FromResolveAllGetter()`](#resolve-all-getter)
* [`.FromSubContainerResolve()`](#subcontainer-resolve)
* [`.ByNewPrefabMethod()`](#bynewprefabmethod)
* [``](#)
* [``](#)
* [``](#)
* [``](#)

## New
### `.FromNew()`

Create via the C# new operator. This is the default if no construction method is specified.

```csharp
// These are both the same
Container.Bind<Foo>();
Container.Bind<Foo>().FromNew();
```

<br/> 

![HR](/img/hr.svg)
## Instance
### `.FromInstance(arg)`
### `.FromInstances(args)`

Add a given instance to the container. 

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
:::caution Note
In this particular case the given instance will not be injected. If you want your instance to be injected at startup, see [QueueForInject](#dicontainer-methods-queueforinject).
:::

<br/> 

![HR](/img/hr.svg)
## Method
### `.FromMethod(method)`

Create via a custom method.

```csharp
Container.Bind<Foo>().FromMethod(MyMethod);

Foo MyMethod(InjectContext context)
{
    ...
    return new Foo();
}
```

<br/> 

![HR](/img/hr.svg)
## Method Multiple Instances
### `.FromMethodMultiple(method)`

Same as [FromMethod](#method) except it allows the returning of multiple instances at once (or zero).

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

<br/> 

![HR](/img/hr.svg)
## Factory
### `.FromFactory(Factory)`

Create an instance using a custom factory class. This construction method is similar to `FromMethod` except can be cleaner in cases where the logic is more complicated or requires dependencies (since the factory itself can have dependencies injected).

```csharp
class FooFactory : IFactory<Foo>
{
    public Foo Create()
    {
        // ...
        return new Foo();
    }
}

Container
    .Bind<Foo>()
    .FromFactory<FooFactory>()
```

<br/> 

![HR](/img/hr.svg)
## IFactory
### `.FromIFactory()`

Create instance using a custom factory class. This is a more generic and more powerful alternative to FromFactory, because you can use any kind of construction method you want for your custom factory (unlike FromFactory which assumes `FromNew().AsCached()`)

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

Container
    .Bind<Foo>()
    .FromIFactory(x => x.To<FooFactory>()
    .FromScriptableObjectResource("FooFactory"))
    .AsSingle();
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
     Container
         .Bind<Foo>()
         .FromIFactory(x => x.To<FooFactory>()
         .FromSubContainerResolve()
         .ByMethod(InstallFooFactory))
         .AsSingle();
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

<br/> 

![HR](/img/hr.svg)
##  Component In New Prefab
### `.FromComponentInNewPrefab(prefab)`

Instantiate the given prefab as a new game object, inject any MonoBehaviour's on it, and then search the result for type **ResultType** in a similar way that `GetComponentInChildren` works

```csharp
Container.Bind<Foo>().FromComponentInNewPrefab(myPrefab);
```

**ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

:::note
When there are multiple matches for **ResultType** on the prefab, it will only match the first one encountered. Just like how GetComponentInChildren works. So if you are binding a prefab and there isn't a specific MonoBehaviour/component that you want to bind to, you can just choose `Transform` and it will match the root of the prefab.
:::

<br/> 

![HR](/img/hr.svg)
## Components In New Prefab
### `.FromComponentsInNewPrefab()`

- Same as FromComponentInNewPrefab except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

<br/> 

![HR](/img/hr.svg)
## Component In New Prefab Resource
### `.FromComponentInNewPrefabResource()`

Instantiate the given prefab (found at the given resource path) as a new game object, inject any MonoBehaviour's on it, and then search the result for type **ResultType** in a similar way that `GetComponentInChildren` works (in that it will return the first matching value found)

    ```csharp
    Container.Bind<Foo>().FromComponentInNewPrefabResource("Some/Path/Foo");
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

<br/> 

![HR](/img/hr.svg)
## Components In New Prefab Resource
### `.FromComponentsInNewPrefabResource()`

- Same as FromComponentInNewPrefab except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

<br/> 

![HR](/img/hr.svg)
## New Component On New GameObject
### `.FromNewComponentOnNewGameObject()`

- Create a new empty game object and then instantiate a new component of the given type on it.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnNewGameObject();
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

<br/> 

![HR](/img/hr.svg)
## New Component On New Prefab
### `.FromNewComponentOnNewPrefab()`

- Instantiate the given prefab as a new game object and also instantiate a new instance of the given component on the root of the new game object.  NOTE: It is not necessary that the prefab contains a copy of the given component.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnNewPrefab(somePrefab);
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

<br/> 

![HR](/img/hr.svg)
## New Component On New Prefab Resource 
### `.FromNewComponentOnNewPrefabResource()`

- Instantiate the given prefab (found at the given resource path) and also instantiate a new instance of the given component on the root of the new game object.  NOTE: It is not necessary that the prefab contains a copy of the given component.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnNewPrefabResource("Some/Path/Foo");
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

<br/> 

![HR](/img/hr.svg)
## New Component On
### `.FromNewComponentOn()`

- Instantiate a new component of the given type on the given game object

    ```csharp
    Container.Bind<Foo>().FromNewComponentOn(someGameObject);
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

<br/> 

![HR](/img/hr.svg)
## New Component Sibling
### `.FromNewComponentSibling()`

- Instantiate a new component of the given on the current transform.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type.

    ```csharp
    Container.Bind<Foo>().FromNewComponentSibling();
    ```

    Note that if the given component type is already attached to the current transform that this will just return that instead of creating a new component.  As a result, this bind statement functions similar to Unity's [RequireComponent] attribute.

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Also note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

<br/> 

![HR](/img/hr.svg)
## Component In Hierarchy
### `.FromComponentInHierarchy()`

- Look up the component within the scene hierarchy associated with the current context, as well as the hierarchy associated with any parent contexts.  Works similar to `GetComponentInChildren` in that it will return the first matching value found

    ```csharp
    Container.Bind<Foo>().FromComponentInHierarchy().AsSingle();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    In the most common case where the context is a SceneContext, this will search the entire scene hierarchy (except any sub-contexts such as GameObjectContext).  In other words, when the current context is a scene context, it will behave similar to `GameObject.FindObjectsOfType`.  Note that since this could be a big search, it should be used with caution, just like `GameObject.FindObjectsOfType` should be used with caution.

    In the case where the context is GameObjectContext, it will only search within and underneath the game object root (and any parent contexts).

    In the case where the context is ProjectContext, it will only search within the project context prefab

<br/> 

![HR](/img/hr.svg)
## Components In Hierarchy
### `.FromComponentsInHierarchy()`

- Same as FromComponentInHierarchy except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

<br/> 

![HR](/img/hr.svg)
## Component Sibling
### `.FromComponentSibling()`

- Look up the given component type by searching over the components that are attached to the current transform.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type. 

    ```csharp
    Container.Bind<Foo>().FromComponentSibling();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

<br/> 

![HR](/img/hr.svg)
## Components Sibling
### `.FromComponentsSibling()`

- Same as FromComponentSibling except will match multiple values or zero values.

<br/> 

![HR](/img/hr.svg)
## Component In Parents
### `.FromComponentInParents()`

- Look up the component by searching the current transform or any parent for the given component type.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type. 

    ```csharp
    Container.Bind<Foo>().FromComponentInParents();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

<br/> 

![HR](/img/hr.svg)
## Components In Parents
### `.FromComponentsInParents()`

- Same as FromComponentInParents except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere

<br/> 

![HR](/img/hr.svg)
## Component In Children
### `.FromComponentInChildren()`

- Look up the component by searching the current transform or any child transform for the given component type.  The current transform here is taken from the object being injected, which must therefore be a MonoBehaviour derived type.   Similar to `GetComponentInChildren` in that it will return the first matching value found

    ```csharp
    Container.Bind<Foo>().FromComponentInChildren();
    ```

    **ResultType** must either be an interface or derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

    Note that if a non-MonoBehaviour requests the given type, an exception will be thrown, since there is no current transform in that case.

<br/> 

![HR](/img/hr.svg)
## Components In Children
### `.FromComponentsInChildren()`

- Same as FromComponentInChildren except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere.  Can be thought of as similar to `GetComponentsInChildren`

<br/> 

![HR](/img/hr.svg)
## New Component On Root
### `.FromNewComponentOnRoot()`

- Instantiate the given component on the root of the current context.  This is most often used with GameObjectContext.

    ```csharp
    Container.Bind<Foo>().FromNewComponentOnRoot();
    ```

    **ResultType** must derive from UnityEngine.MonoBehaviour / UnityEngine.Component in this case

<br/> 

![HR](/img/hr.svg)
## Resource
### `.FromResource()`

- Create by calling the Unity3d function `Resources.Load` for **ResultType**.  This can be used to load any type that `Resources.Load` can load, such as textures, sounds, prefabs, etc.

    ```csharp
    Container.Bind<Texture>().WithId("Glass").FromResource("Some/Path/Glass");
    ```

<br/> 

![HR](/img/hr.svg)
## Resources
### `.FromResources()`

- Same as FromResource except will match multiple values or zero values.  You might use it for example and then inject `List<ContractType>` somewhere

<br/> 

![HR](/img/hr.svg)
## ScriptableObject Resource 
### `.FromScriptableObjectResource()`

- Bind directly to the scriptable object instance at the given resource path.  NOTE:  Changes to this value while inside unity editor will be saved persistently.  If this is undesirable, use FromNewScriptableObjectResource.

    ```csharp
    public class Foo : ScriptableObject
    {
    }

    Container.Bind<Foo>().FromScriptableObjectResource("Some/Path/Foo");
    ```

<br/> 

![HR](/img/hr.svg)
## New ScriptableObject Resource
### `.FromNewScriptableObjectResource()`

- Same as FromScriptableObjectResource except it will instantiate a new copy of the given scriptable object resource.  This can be useful if you want to have multiple distinct instances of the given scriptable object resource, or if you want to ensure that the saved values for the scriptable object are not affected by changing at runtime.

<br/> 

![HR](/img/hr.svg)
## Resolve
### `.FromResolve()`

- Get instance by doing another lookup on the container (in other words, calling `DiContainer.Resolve<ResultType>()`).  Note that for this to work, **ResultType** must be bound in a separate bind statement.  This construction method can be especially useful when you want to bind an interface to another interface, as shown in the below example

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

<br/> 

![HR](/img/hr.svg)
## Resolve All
### `.FromResolveAll()`

- Same as FromResolve except will match multiple values or zero values.

<br/> 

![HR](/img/hr.svg)
## Resolve Getter
### `.FromResolveGetter<ObjectType>()`

Get instance from the property of another dependency which is obtained by doing another lookup on the container (in other words, calling `DiContainer.Resolve<ObjectType>()` and then accessing a value on the returned instance of type **ResultType**).  Note that for this to work, **ObjectType** must be bound in a separate bind statement.

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


<br/> 

![HR](/img/hr.svg)
## Resolve All Getter
### `.FromResolveAllGetter<ObjectType>()`

Same as FromResolveGetter except will match multiple values or zero values.


<br/> 

![HR](/img/hr.svg)
## SubContainer Resolve
### `.FromSubContainerResolve()`

Get **ResultType** by doing a lookup on a subcontainer.  Note that for this to work, the sub-container must have a binding for **ResultType**.  This approach can be very powerful, because it allows you to group related dependencies together inside a mini-container, and then expose only certain classes (aka ["Facades"](https://en.wikipedia.org/wiki/Facade_pattern)) to operate on this group of dependencies at a higher level.  For more details on using sub-containers, see [this section](#sub-containers-and-facades).

There are several ways to define the subcontainer:
- [.ByNewPrefabMethod()](#bynewprefabmethod)
- [.ByNewPrefabInstaller()](#bynewprefabinstaller)
- [.ByNewPrefabResourceMethod()](#bynewprefabresourcemethod)
- [.ByNewPrefabResourceInstaller()](#bynewprefabresourceinstaller)
- [.ByNewGameObjectInstaller()](#bynewgameobjectinstaller)
- [.ByNewGameObjectMethod()](#bynewgameobjectmethod)
- [.ByMethod()](#bymethod)
- [.ByInstaller()](#byinstaller)
- [.ByNewContextPrefab()](#bynewcontextprefab)
- [.ByNewContextPrefabResource()](#bynewcontextprefabresource)
- [.ByInstance()](#byinstance)

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewPrefabMethod()`

  Initialize subcontainer by instantiating a new prefab.  Note that unlike `ByNewContextPrefab`, this bind method does not require that there be a GameObjectContext attached to the prefab.  In this case the GameObjectContext is added dynamically and then run with the given installer method.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewPrefabMethod(MyPrefab, InstallFoo);

  void InstallFoo(DiContainer subContainer)
  {
      subContainer.Bind<Foo>();
  }
  ```

  Note that instead of passing in a prefab directly, you can also pass in a getter method.

  For example:

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewPrefabMethod(ChooseFooPrefab, InstallFoo);
  
  UnityEngine.Object ChooseFooPrefab(InjectContext context) 
  {
      return FooPrefabs[Random.Range(0, FooPrefabs.Length)];
  }
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewPrefabInstaller()`

  Initialize subcontainer by instantiating a new prefab.  Same as ByNewPrefabMethod, except it initializes the dynamically created GameObjectContext with the given installer rather than a method.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewPrefabInstaller<FooInstaller>(MyPrefab);

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
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewPrefabInstaller<FooInstaller>(ChooseFooPrefab);

  UnityEngine.Object ChooseFooPrefab(InjectContext context) 
  {
      return FooPrefabs[Random.Range(0, FooPrefabs.Length)];
  }
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewPrefabResourceMethod()`

  Initialize subcontainer instantiating a new prefab obtained via `Resources.Load`.  Note that unlike `ByNewPrefabResource`, this bind method does not require that there be a GameObjectContext attached to the prefab.  In this case the GameObjectContext is added dynamically and then run with the given installer method.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewPrefabResourceMethod("Path/To/MyPrefab", InstallFoo);

  void InstallFoo(DiContainer subContainer)
  {
      subContainer.Bind<Foo>();
  }
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewPrefabResourceInstaller()`

  Initialize subcontainer instantiating a new prefab obtained via `Resources.Load`.  Same as ByNewPrefabResourceMethod, except it initializes the dynamically created GameObjectContext with the given installer rather than a method.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewPrefabResourceInstaller<FooInstaller>("Path/To/MyPrefab");

  class FooInstaller : Installer<FooInstaller>
  {
      public override void InstallBindings()
      {
          Container.Bind<Foo>();
      }
  }
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewGameObjectInstaller()`

  Initialize subcontainer by instantiating an empty game object, attaching GameObjectContext, and then installing using the given installer.  This approach is very similar to ByInstaller except has the following advantages:

  - Any ITickable, IInitializable, IDisposable, etc. bindings will be called properly
  - Any new game objects that are instantiated inside the subcontainer will be parented underneath the game object context object
  - You can destroy the subcontainer by just destroying the game object context game object

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewGameObjectMethod()`

  Same as [ByNewGameObjectInstaller()](#bynewgameobjectinstaller) except the subcontainer is initialized based on the given method rather than an installer type.

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByMethod()`

  Initialize the subcontainer by using a method.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByMethod(InstallFooFacade);

  void InstallFooFacade(DiContainer subContainer)
  {
      subContainer.Bind<Foo>();
  }
  ```

  Note that when using ByMethod, if you want to use zenject interfaces such as ITickable, IInitializable, IDisposable inside your subcontainer then you have to also use the WithKernel bind method like this:

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByMethod(InstallFooFacade)
      .WithKernel();

  void InstallFooFacade(DiContainer subContainer)
  {
      subContainer.Bind<Foo>();
      subContainer.Bind<ITickable>().To<Bar>();
  }
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByInstaller()`

  Initialize the subcontainer by using a class derived from `Installer`.  This can be a cleaner and less error-prone alternative than `ByMethod`, especially if you need to inject data into the installer itself.  Less error prone because when using ByMethod it is common to accidentally use Container instead of subContainer in your method.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByInstaller<FooFacadeInstaller>();

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
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByInstaller<FooFacadeInstaller>()
      .WithKernel();
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewContextPrefab()`

  Initialize subcontainer by instantiating a new prefab.  Note that the prefab must contain a `GameObjectContext` component attached to the root game object.  For details on `GameObjectContext` see [this section](#sub-containers-and-facades).

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewContextPrefab(MyPrefab);

  // Assuming here that this installer is added to the GameObjectContext at the root
  // of the prefab.  You could also use a ZenjectBinding in the case where Foo is a MonoBehaviour
  class FooFacadeInstaller : MonoInstaller
  {
      public override void InstallBindings()
      {
          Container.Bind<Foo>();
      }
  }
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByNewContextPrefabResource()`

  Initialize subcontainer instantiating a new prefab obtained via `Resources.Load`.  Note that the prefab must contain a `GameObjectContext` component attached to the root game object.

  ```csharp
  Container
      .Bind<Foo>()
      .FromSubContainerResolve()
      .ByNewContextPrefabResource("Path/To/MyPrefab");
  ```

<br/> 

[_FromSubContainerResolve_](#fromsubcontainerresolve)
- ### `.ByInstance()` 

  Initialize the subcontainer by directly using a given instance of DiContainer that you provide yourself.  This is only useful in some rare edge cases.


<br/> 

![HR](/img/hr.svg)
## SubContainer Resolve All
### `.FromSubContainerResolveAll()`

  Same as FromSubContainerResolve except will match multiple values or zero values.
