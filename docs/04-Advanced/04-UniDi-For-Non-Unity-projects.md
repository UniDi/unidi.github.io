## Using UniDi Outside Unity Or For DLLs

If you are building some code as DLLs and then including them in Unity, you can still add bindings for those classes inside your installers, with the only limitation being that you have to use constructor injection.  If you want to use the other inject approaches such as member injection or method injection, then you can do that too, however in that case you will need to add a reference for your project to `UniDi-Usage.dll` which can be found in the `UniDi\Source\Usage` directory.  This DLL also includes the standard interfaces such as `ITickable,` `IInitializable,` etc. so you can use those as well.

You can also use UniDi for non-unity projects by downloading `UniDi-NonUnity.zip` from the [releases section](https://github.com/svermeulen/Extenject/releases)

Finally, if you are attempting to run unit tests outside of Unity using the Unity generated solution, you might encounter run time errors in the UniDi code when it attempts to access the Unity API.  You can disable this behaviour by adding a define for `UNIDI_TESTS_OUTSIDE_UNITY` in the generated solution.

## UniDi Settings

A lot of the default behaviour in UniDi can be customized via a settings property on the ProjectContext.  This includes the following:

### Validation Error Response
This value controls the behaviour that is triggered when UniDi encounters a validation error.  It can be set to either 'Log' or 'Throw'.  The difference here is that when set to 'Log' there will be multiple validation errors printed every time validation is run, whereas if set to 'Throw' only the first validation error will be output to the console.  When unset the default value is 'Log'.  'Throw' is also sometimes useful if running validation inside unit tests.

### Validation Root Resolve Method
When validation is triggered for a given scene, the DiContainer will do a 'dry run' and pretend to instantiate the entire object graph as defined by the installers in the scene.   However, by default it will only validate the 'roots' of the object graph - that is, the 'NonLazy' bindings or the bindings which are injected into the 'NonLazy' bindings.  As an option, you can change this behaviour to 'All' which will validate all bindings, even those that are not currently used.

### Display Warning When Resolving During Install
This value will control whether a warning is issued to the console when either a Resolve or an Instantiate is triggered during the install phase which looks like this:

```
UniDi Warning: It is bad practice to call Inject/Resolve/Instantiate before all the Installers have completed!  This is important to ensure that all bindings have properly been installed in case they are needed when injecting/instantiating/resolving.  Detected when operating on type 'Foo'.
```

So if you often encounter this warning and are aware of the implications of what you're doing then you might set this value to false to suppress it.

### Ensure Deterministic Destruction Order On Application Quit
When set to true, this will ensure that all GameObject's and IDisposables are destroyed in a predictable order when the application is closed.  By default it is set to false, because there are some undesirable implications to enabling this feature as described in [this section](TODO: #destruction-order).

These settings can also be configured on a per DiContainer basis by changing the DiContainer.Settings property.  Changing this property will affect the given container as well as any subcontainers.
