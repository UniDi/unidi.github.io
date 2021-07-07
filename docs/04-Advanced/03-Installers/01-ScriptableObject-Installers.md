---
sidebar_label: "ScriptableObject Installer"
---

# ScriptableObject Installer

:::note
One of the most powerful scripting features in Unity are [ScriptableObjects](https://docs.unity3d.com/Manual/class-ScriptableObject.html). They are data containers that let you save and store data in both Editor session and in runtime. Just like MonoBehaviours, ScriptableObjects derive from the base Unity object but, unlike MonoBehaviours, you can not attach a ScriptableObject to a GameObject. Instead, you need to save them as Assets in your Project.
:::

TODO: EDIT: A great alternative to [MonoInstaller or a plain Installer](./03-Basic Principles/05-Installers.md) the `ScriptableObjectInstaller`.  This is most commonly used to store game settings.  This approach has the following advantages:

## Data Persistence
Any changes made to the properties of the `ScriptableObjectInstaller` will persist after you stop play mode. Where changes made in other installer types as any component in your scene, will be undone. However, there is a 'gotcha' to be aware of: Any changes to these settings in code will also be saved persistently (unlike with settings on MonoInstaller's). So if you go this route you should treat all settings objects as read-only to avoid this from happening.

## Interchangable
You can very easily swap out multiple instances of the same installer.  For example, using the below example, you might have an instance of `GameSettingsInstaller` called `GameSettingsEasy`, and another one called `GameSettingsHard`, etc.

## Artist and Designer Friendly
The data persistence an the intechangeability behavior of the `ScriptableObjectInstaller` asset, is a easy and useful tool for the game artists. They can change and tweaking the game parameters in runtime or swapping the Scriptable Installers without touching any code.
 
## Game Settings Example:

* Create a new project in Unity and UniDi Core installed.
* Right click somewhere in the _Project window_ and select `Create > UniDi > Scriptable Object Installer`.
* Name it GameSettingsInstaller
* Right click again in the same location
* Select the newly added menu item `Create > Installers > GameSettingsInstaller`
* Following the **Settings Pattern** approach as outlined [here](TODO: #using-the-unity-inspector-to-configure-settings), you might then replace it with the following:

```csharp
public class GameSettings : ScriptableObjectInstaller
{
    public Player.Settings Player;
    public SomethingElse.Settings SomethingElse;
    // ... etc.

    public override void InstallBindings()
    {
        Container.BindInstances(Player, SomethingElse, etc.);
    }
}

public class Player : ITickable
{
    readonly Settings _settings;
    Vector3 _position;

    public Player(Settings settings)
    {
        _settings = settings;
    }

    public void Tick()
    {
        _position += Vector3.forward * _settings.Speed;
    }

    [Serializable]
    public class Settings
    {
        public float Speed;
    }
}
```

Now, you should be able to run your game and adjust the Speed value that is on the `GameSettingsInstaller` asset at runtime, and have that change saved permanently

