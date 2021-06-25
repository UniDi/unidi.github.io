# General Guidelines 
** Recommendations / Gotchas / Tips and Tricks **

**Do not use GameObject.Instantiate if you want your objects to have their dependencies injected**
If you want to instantiate a prefab at runtime and have any MonoBehaviour's automatically injected, we recommend using a FIX: [factory](#creating-objects-dynamically-using-factories).  You can also instantiate a prefab by directly using the DiContainer by calling any of the FIX: [InstantiatePrefab](#dicontainer-methods-instantiate) methods.  Using these ways as opposed to GameObject.Instantiate will ensure any fields that are marked with the `[Inject]` attribute are filled in properly, and all `[Inject]` methods within the prefab are called.

**Best practice with DI is to only reference the container in the composition root "layer"**
Note that factories are part of this layer and the container can be referenced there (which is necessary to create objects at runtime).  See FIX: [here](#creating-objects-dynamically-using-factories) for more details on this.

**Do not use IInitializable, ITickable and IDisposable for dynamically created objects**
* Objects that are of type `IInitializable` are only initialized once - at startup during Unity's `Start` phase.  If you create an object through a factory, and it derives from `IInitializable`, the `Initialize()` method will not be called.  You should use `[Inject]` methods in this case or call Initialize() explicitly yourself after calling Create.
* The same applies to `ITickable` and `IDisposable`.  Deriving from these will do nothing unless they are part of the original object graph created at startup.
* If you have dynamically created objects that have an `Update()` method, it is usually best to call `Update()` on those manually, and often there is a higher level manager-like class in which it makes sense to do this from.  If however you prefer to use `ITickable` for dynamically objects you can declare a dependency to `TickableManager` and add/remove it explicitly as well.

**Using multiple constructors**
* You can have multiple constructors however you must mark one of them with the `[Inject]` attribute so Zenject knows which one to use.  If you have multiple constructors and none of them are marked with `[Inject]` then Zenject will guess that the intended constructor is the one with the least amount of arguments.

**Lazily instantiated objects and the object graph**
* Zenject does not immediately instantiate every object defined by the bindings that you've set up in your installers.  It will only instantiate those bindings that are marked `NonLazy`.  All other bindings are only instantiated when they are needed.  All the `NonLazy` objects as well as all their dependencies form the 'initial object graph' of the application.  Note that this automatically includes all types that implement `IInitializable,` `ITickable,` `IDisposable,` etc.   So if you have a binding that is not being created because nothing in the initial object graph references it, then you can make this explicit by adding `NonLazy` to your binding

**Restrict the use of bind commands to the 'composition root' only**
In other words, do not make calls to `Container.Bind`, `Container.Rebind`, or `Container.Unbind` after the install phase is completed.  This important because immediately after install completes the initial object graph of your application is constructed, and needs access to the full set of bindings.

**The order that things occur in is wrong, like injection is occurring too late, or Initialize() event is not called at the right time, etc.**
* It may be because the 'script execution order' of the Zenject classes `ProjectKernel` or `SceneKernel` or `SceneContext` is incorrect.  These classes should always have the earliest or near earliest execution order.  This should already be set by default (since this setting is included in the `cs.meta` files for these classes).  However if you are compiling Zenject yourself or have a unique configuration, you may want to make sure, which you can do by going to `Edit > Project Settings > Script Execution Order` and confirming that these classes are at the top, before the default time.
