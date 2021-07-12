# Introduction to Zenject API

## Hello World Example

```csharp
using Zenject;
using UnityEngine;
using System.Collections;

public class TestInstaller : MonoInstaller
{
    public override void InstallBindings()
    {
        Container.Bind<string>().FromInstance("Hello World!");
        Container.Bind<Greeter>().AsSingle().NonLazy();
    }
}

public class Greeter
{
    public Greeter(string message)
    {
        Debug.Log(message);
    }
}
```

You can run this example by doing the following:

* Create a new scene in Unity
* Right Click inside the Hierarchy tab and select `Zenject -> Scene Context`
* Right Click in a folder within the Project Tab and Choose `Create -> Zenject -> MonoInstaller`.  Name it TestInstaller.cs
* Add your TestInstaller script to the scene (as its own GameObject or on the same GameObject as the SceneContext, it doesn't matter)
* Add a reference to your TestInstaller to the properties of the SceneContext by adding a new row in the inspector of the "Installers" property (press the + button) and then dragging TestInstaller to it
* Open up TestInstaller and paste the above code into it
* Validate your scene by either selecting Edit -> Zenject -> Validate Current Scene or hitting CTRL+ALT+V.  (note that this step isn't necessary but good practice to get into)
* Run
* Note also, that you can use the shortcut `CTRL+SHIFT+R` to "validate then run".  Validation is usually fast enough that this does not add a noticeable overhead to running your game, and when it does detect errors it is much faster to iterate on since you avoid the startup time.
* Observe unity console for output

The SceneContext MonoBehaviour is the entry point of the application, where Zenject sets up all the various dependencies before kicking off your scene.  To add content to your Zenject scene, you need to write what is referred to in Zenject as an 'Installer', which declares all the dependencies and their relationships with each other.  All dependencies that are marked as "NonLazy" are automatically created after the installers are run, which is why the Greeter class that we added above gets created on startup.  If this doesn't make sense to you yet, keep reading!
