## Using Moq

If you wish to use Moq then you need to go to your UniDi install directory and extract the contents of ``UniDi\OptionalExtras\AutoMoq.zip`` into that same directory.
The extracted folder should then be moved to ``UniDi\OptionalExtras\TestFrameWork\Editor``.

Note that there are multiple versions of Moq.dll included in the zip and that you should use the one that targets the Scripting Runtime Version that you have configured in your player settings. Also note that if you're using Scripting Runtime Version 3.5, that you might also need to change your "Api Compatibility Level" from ".NET 2.0 Subset" to ".NET 2.0"

After extracting the auto mocking package it is just a matter of using the following syntax to mock out various parts of your project:

```csharp
Container.Bind<IFoo>().FromMock();
```

Or, alternatively, if we want to configure values for our mock class (rather than just have it generate defaults):

```csharp
var foo = new Mock<IFoo>();
foo.Setup(x => x.Bar).Returns("a");
Container.BindInstance(foo.Object);
```

For more details, see the documentation for [Moq](https://github.com/moq/moq4)
