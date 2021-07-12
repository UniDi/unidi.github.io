## Runtime Parameters For Installers

Often when calling installers from other installers it is desirable to be able to pass parameters.  You can do this by adding generic arguments to whichever installer base class you are using with the types for the runtime parameters. For example, when using a non-MonoBehaviour Installer:

```csharp
public class FooInstaller : Installer<string, FooInstaller>
{
    string _value;

    public FooInstaller(string value)
    {
        _value = value;
    }

    public override void InstallBindings()
    {
        ...

        Container.BindInstance(_value).WhenInjectedInto<Foo>();
    }
}

public class MainInstaller : MonoInstaller
{
    public override void InstallBindings()
    {
        FooInstaller.Install(Container, "asdf");
    }
}

```

Or when using a MonoInstaller prefab:

```csharp
public class FooInstaller : MonoInstaller<string, FooInstaller>
{
    string _value;

    // Note that in this case we can't use a constructor
    [Inject]
    public void Construct(string value)
    {
        _value = value;
    }

    public override void InstallBindings()
    {
        ...

        Container.BindInstance(_value).WhenInjectedInto<Foo>();
    }
}

public class MainInstaller : MonoInstaller
{
    public override void InstallBindings()
    {
        // For this to work, there must be a prefab with FooInstaller attached to it at
        // Resources/My/Custom/ResourcePath.prefab
        FooInstaller.InstallFromResource("My/Custom/ResourcePath", Container, "asdf")

        // If a resource path is not provided then it is assumed to exist at resource path
        // 'Resources/Installers/FooInstaller'
        // For example:
        // FooInstaller.InstallFromResource(Container, "asdf");
    }
}
```

`ScriptableObjectInstaller` works the same as `MonoInstaller` in this regard.
