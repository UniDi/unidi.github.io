## Abstract Signals

One of the problems of the signals is that when you subscribe to their types you are coupling your concrete signal types to the subscribers

For example, Lets say I have a player and i want to save the game when i finish a level.
Ok easy, I create ``SignalLevelCompleted`` and then I subscribe it to my ``SaveGameSystem``
then I also want to save when i reach a checkpoint, again i create ``SignalCheckpointReached``
and then I subscribe it to my ``SaveGameSystem``
you are begining to get something like this...
```csharp
public class Example
{
   SignalBus signalBus;
   public Example(Signalbus signalBus) => this.signalBus = signalBus;
   
   public void CheckpointReached() => signalBus.Fire<SignalCheckpointReached>();
   
   public void CompleteLevel() => signalBus.Fire<SignalLevelCompleted>();
}

public class SaveGameSystem
{
   public SaveGameSystem(SignalBus signalBus)
   {
      signalBus.Subscribe<SignalCheckpointReached>(x => SaveGame());
      signalBus.Subscribe<SignalLevelCompleted>(x => SaveGame());
   }
   
   void SaveGame() { /*Saves the game*/ }
}

//in your installer
Container.DeclareSignal<SignalLevelCompleted>();
Container.DeclareSignal<SignalCheckpointReached>();

//your signal types
public struct SignalCheckpointReached{}
public struct SignalLevelCompleted{}
```

And then you realize you are coupling the types``signalLevelCompleted`` and ``SignalCheckpointReached``to ``SaveGameSystem``. 
``SaveGameSystem`` shouldn't know about those "non related with saving" events...

So let's give the power of interfaces to signals!
So i have the ``SignalCheckpointReached`` and ``SignalLevelCompleted`` both implementing **``ISignalGameSaver``**
and my ``SaveGameSystem`` just Subscribes to **``ISignalGameSaver``** for saving the game
So when i fire any of those signals the ``SaveGameSystem`` saves the game.
Then you have something like this...
```csharp
public class Example
{
   SignalBus signalBus;
   public Example(Signalbus signalBus) => this.signalBus = signalBus;
   
   public void CheckpointReached() => signalBus.AbstractFire<SignalCheckpointReached>();
   
   public void CompleteLevel() => signalBus.AbstractFire<SignalLevelCompleted>();
}

public class SaveGameSystem
{
   public SaveGameSystem(SignalBus signalBus)
   {
      signalBus.Subscribe<ISignalGameSaver>(x => SaveGame());
   }
   
   void SaveGame() { /*Saves the game*/ }
}

//in your installer
Container.DeclareSignalWithInterfaces<SignalLevelCompleted>();
Container.DeclareSignalWithInterfaces<SignalCheckpointReached>();

//your signal types
public struct SignalCheckpointReached : ISignalGameSaver{}
public struct SignalLevelCompleted : ISignalGameSaver{}

public interface ISignalGameSaver{}
```

Now your ``SaveGameSystem`` doesnt knows about CheckPoints nor Level events, and just reacts to signals that save the game.
The main difference is in the Signal declaration and Firing
 - ``DeclareSignalWithInterfaces`` works like ``DeclareSignal`` but it declares the interfaces too.
 - ``AbstractFire`` is the same that ``Fire`` but it fires the interfacesjust if you have Declared the signal with interfaces 
 otherwise it will throw an exception.

Ok, let's show even more power.
Now i create another signal for the WorldDestroyed Achievement "SignalWorldDestroyed"
But i also want my SoundSystem to play sounds when i reach a checkpoint and/or unlock an Achievement
So the code could look like this.
```csharp
public class Example
{
   SignalBus signalBus;
   public Example(Signalbus signalBus) => this.signalBus = signalBus;
   
   public void CheckpointReached() => signalBus.AbstractFire<SignalCheckpointReached>();
   
   public void DestroyWorld() => signalBus.AbstractFire<SignalWorldDestroyed>();
}

public class SoundSystem
{
   public SoundSystem(SignalBus signalBus)
   {
      signalBus.Subscribe<ISignalSoundPlayer>(x => PlaySound(x.soundId));
   }
   
   void PlaySound(int soundId) { /*Plays the sound with the given id*/ }
}

public class AchievementSystem
{
   public AchievementSystem(SignalBus signalBus)
   {
      signalBus.Subscribe<ISignalAchievementUnlocker>(x => UnlockAchievement(x.achievementKey));
   }
   
   void UnlockAchievement(string key) { /*Unlocks the achievement with the given key*/ }
}

//in your installer
Container.DeclareSignalWithInterfaces<SignalCheckpointReached>();
Container.DeclareSignalWithInterfaces<SignalWorldDestroyed>();

//your signal types
public struct SignalCheckpointReached : ISignalGameSaver, ISignalSoundPlayer
{ 
   public int SoundId { get => 2} //or configured in a scriptable with constants instead of hardcoded
}
public struct SignalWorldDestroyed : ISignalAchievementUnlocker, ISignalSoundPlayer
{
   public int SoundId { get => 4}
   public string AchievementKey { get => "WORLD_DESTROYED"}
}

//Your signal interfaces
public interface ISignalGameSaver{}
public interface ISignalSoundPlayer{ int SoundId {get;}}
public interface ISignalAchievementUnlocker{ string AchievementKey {get;}}
```

It offers a lot of modularity and abstraction for signals,
you fire a concrete signal telling what you did and give them functionality trough Interface implementations
