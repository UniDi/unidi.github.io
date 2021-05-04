# Installers

Often, there is some collections of related bindings for each sub-system and so it makes sense to group those bindings into a re-usable object.  In UniDi this re-usable object is called an 'installer'.  You can define a new installer as follows:

```csharp
public class FooInstaller : MonoInstaller
{
    public override void InstallBindings()
    {
        Container.Bind<Bar>().AsSingle();
        Container.BindInterfacesTo<Foo>().AsSingle();
        // etc...
    }
}
```

You add bindings by overriding the InstallBindings method, which is called by whatever `Context` the installer has been added to (usually this is `SceneContext`).  MonoInstaller is a MonoBehaviour so you can add FooInstaller by attaching it to a GameObject.  Since it is a GameObject you can also add public members to it to configure your installer from the Unity inspector.  This allows you to add references within the scene, references to assets, or simply tuning data (see [here](#using-the-unity-inspector-to-configure-settings) for more information on tuning data).

Note that in order for your installer to be triggered it must be attached to the Installers property of the `SceneContext` object.  Installers are installed in the order given to `SceneContext` (with scriptable object installers first, then mono installers, then prefab installers) however this order should not usually matter (since nothing should be instantiated during the install process).

In many cases you want to have your installer derive from MonoInstaller, so that you can have inspector settings.  There is also another base class called simply `Installer` which you can use in cases where you do not need it to be a MonoBehaviour.

You can also call an installer from another installer.  For example:

```csharp
public class BarInstaller : Installer<BarInstaller>
{
    public override void InstallBindings()
    {
        ...
    }
}

public class FooInstaller : MonoInstaller
{
    public override void InstallBindings()
    {
        BarInstaller.Install(Container);
    }
}
```

Note that in this case BarInstaller is of type `Installer<>` (note the generic arguments) and not MonoInstaller, which is why we can simply call `BarInstaller.Install(Container)` and don't require that BarInstaller be added to our scene already.  Any calls to BarInstaller.Install will immediately instantiate a temporary instance of BarInstaller and then call InstallBindings on it.  This will repeat for any installers that this installer installs.  Note also that when using the `Installer<>` base class, we always must pass in ourself as the generic argument to `Installer<>`.  This is necessary so that the `Installer<>` base class can define the static method `BarInstaller.Install`.  It is also designed this way to support runtime parameters (described below).

One of the main reasons we use installers as opposed to just having all our bindings declared all at once for each scene, is to make them re-usable.  This is not a problem for installers of type `Installer<>` because you can simply call `FooInstaller.Install` as described above for every scene you wish to use it in, but then how would we re-use a MonoInstaller in multiple scenes?

There are three ways to do this.

1. **Prefab instances within the scene**.  After attaching your MonoInstaller to a gameobject in your scene, you can then create a prefab out of it.  This is nice because it allows you to share any configuration that you've done in the inspector on the MonoInstaller across scenes (and also have per-scene overrides if you want).  After adding it in your scene you can then drag and drop it on to the Installers property of a `Context`

1. **Prefabs**.  You can also directly drag your installer prefab from the Project tab into the InstallerPrefabs property of SceneContext.  Note that in this case you cannot have per-scene overrides like you can when having the prefab instantiated in your scene, but can be nice to avoid clutter in the scene.

1. **Prefabs within Resources folder**.  You can also place your installer prefabs underneath a Resoures folder and install them directly from code by using the Resources path.  For details on usage see [here](#runtime-parameters-for-installers).

Another option in addition to `MonoInstaller` and `Installer<>` is to use `ScriptableObjectInstaller` which has some unique advantages (especially for settings) - for details see [here](#scriptableobject-installer).

When calling installers from other installers it is common to want to pass parameters into it.  See [here](#runtime-parameters-for-installers) for details on how that is done.
