## Using NSubstitute

If you wish to use NSubstitute then you need to go to your UniDi install directory and extract the contents of ``UniDi\OptionalExtras\AutoSubstitute.zip``.
The extracted folder should then be moved to ``UniDi\OptionalExtras\TestFrameWork\Editor``.

> Mock, stub, fake, spy, test double? Strict or loose? Nah, just substitute for the type you need!

After extracting the auto substitute package you are ready to create a substitute with one single line of code:

```csharp
Container.Bind<ICalculator>().FromSubstitute();
```

Rather than writing:

```csharp
var calculator = Substitute.For<ICalculator>();
Container.BindInstance(calculator);
```

### Auto values

Once a substitute has been created some properties and methods will automatically return non-null values. For example, any properties or methods that return an interface, delegate, or purely virtual class* will automatically return substitutes themselves. This is commonly referred to as recursive mocking, and can be useful because you can avoid explicitly creating each substitute, which means less code. Other types, like String and Array, will default to returning empty values rather than nulls.  

### Setting return values

After the creation of a substitute, it's easy as 1, 2, 3; to set the return values of methods and properties:

```csharp  
calculator.Add(1, 2).Returns(3);
```

For more details, see the documentation for [NSUbstitute](https://nsubstitute.github.io)
