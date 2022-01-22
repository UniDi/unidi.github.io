---
sidebar_position: 1
---

# UniDi

### A Dependency Injection Framework built for Unity
Writing games is complicated. Objects need to communicate with the Unity Engine, share data, and notify each other updates. Sometimes adding a small feature to your game may feel like a monumental task. Bring some control to your codebase with UniDi. UniDi helps you use _Dependency Injection_ (DI) to break your code up into a collection of loosely-coupled parts that are maintainable, flexible, and testable.

UniDi allows you to write your code flexibly and rely on the framework to glue to together later. The UniDI Dependency Injection container can resolve references to any other classes or Unity Components that your code may need.

```cs
// Build your classes so they're flexible
public class SpaceShip {
    public IWeapon weapon;

    public SpaceShip(IWeapon weapon, AudioManager) {
        this.weapon = weapon;
    }

    public void Fire() {
        weapon.DoDamage();
    }
}

// And have UniDi glue them together for you
public class SpaceShipInstaller: MonoInstaller {
    public override void InstallBindings() {
        Container.Bind<IWeapon>.To<Lasers>();
    }
}
```

UniDi can help you construct classes and instantiate game objects, swap behavior at runtime, and hook into the Unity Engine to get more information about your code lifecycle (yes, even for non-monobehaviours). UniDi can manage your entire codebase's dependency graph, allowing you to only focus on what matters, the game itself.

### Why is dependency injection useful?
Your code is going to change over time. A feature you write one day could change a week, a month, or a year later. On top of this, building a game requires a bunch of different moving parts that all need to know about each other to do their jobs. If we write these moving parts so they are as independent as possible, going back and making changes becomes much easier, which lets you do your job faster and easier.

### Why don't I build my own dependency injection system?
Although it’s possible to write all the required infrastructure code yourself to purely inject all your code's dependencies, it doesn’t add much value to an application. On the other hand, the task of composing objects is a general problem and can be resolved once and for all. Why solve a solved problem by yourself? Just like you would make use of a logging library to help you log application data, or an animation library to simplify the tasks of animating objects, you can make use of the UniDI library to manage your dependencies for you.

### How much does it cost?
UniDi is and will always be free for all projects, personal and commercial. It's open source (licensed under MIT/Apache 2.0 license), so you can fork the code.