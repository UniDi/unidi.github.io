# Object Graph Validation
<br/> 

![HR](/img/hr.svg)
## Overview

The usual workflow when setting up bindings using a DI framework is something like this:
* Add some number of bindings in code
* Execute your app
* Observe a bunch of DI related exceptions
* Modify your bindings to address problem
* Repeat

This works ok for small projects, but as the complexity of your project grows it is often a tedious process. The problem gets worse if the startup time of your application is particularly bad, or when the exceptions only occur from factories at various points at runtime. What would be great is some tool to analyze your object graph and tell you exactly where all the missing bindings are, without requiring the cost of firing up your whole app.

You can do this in UniDi out-of-the-box by executing the menu item `Edit > UniDi > Validate Current Scene` (Unity shortcut: `SHIFT+ALT+V`) with the scenes open that you want to validate. This will execute all installers for the current scene, with the result being a fully bound container. It will then iterate through the object graphs and verify that all bindings can be found (without actually instantiating any of them). In other words, it executes a 'dry run' of the normal startup procedure. Under the hood, this works by storing dummy objects in the container in place of actually instantiating your classes.

Alternatively, you can execute the menu item `Edit > UniDi > Validate Then Run` (Unity shortcut: `CTRL+ALT+R`). This will validate the scenes you have open and then if validation succeeds, it will start play mode. Validation is usually pretty fast so this can be a good alternative to always just hitting play, especially if your game has a costly startup time.

Note that this will also include factories and memory pools, which is especially helpful because those errors might not be caught until sometime after startup.

**Some things to be aware of:**

* No actual logic code is executed - only install bindings is called. This means that if you have logic inside installers other than bind commands that these will be executed as well and may cause issues when running validation (if that logic requires that the container return actual values)
* **null** values are injected into the dependencies that are actually instantiated such as installers (regardles of what was binded)
You might want to inject some classes even in validation mode. In that case you can mark them with `[UniDiAllowDuringValidation]`.

Also note that some validation behaviour is configurable in zenjectsettings

<br/> 

![HR](/img/hr.svg)
## Custom validatables

If you want to add your own validation logic, you can do this simply by having one of your classes inherit from `IValidatable`. After doing this, as long as your class is bound in an installer somewhere, it will be instantiated during validation and then its `Validate()` method will be called. Note however that any dependencies it has will be injected as null (unless marked with `[UniDiAllowDuringValidation]` attribute).

Inside the Validate method you can throw exceptions if you want validation to fail, or you can just log information to the console. One common thing that occurs in custom validatables is to instantiate types that would not otherwise be validated. By instantiating them during validation it will ensure that all their dependencies can be resolved.

For example, if you create a custom factory that directly instantiates a type using `Container.Instantiate<Foo>()`, then `Foo` will not be validated, so you will not find out if it is missing some dependencies until runtime. However you can fix this by having your factory implement `IValidatable` and then calling `Container.Instantiate<Foo>()` inside the `Validate()` method.
