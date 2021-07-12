## Signal Settings

Most of the default settings for signals can be overriden via a settings property that is on the `ProjectContext`.  It can also be configured on a per-container level by setting the `DiContainer.Settings` property.  For signals this includes the following:

**Default Sync Mode** - This value controls the default value for the `DeclareSignal` property `RunSync`/`RunAsync` when it is left unspecified.  By default it is set to synchronous so will assume `RunSync` when unspecified by a call to `DeclareSignal`.  So if you are a fan of async signals then you could set this to async to assume async instead.

**Missing Handler Default Response** - This value controls the default value when **RequireSubscriber**/**OptionalSubscriber**/**OptionalSubscriberWithWarning** is not specified for a call to `DeclareSignal`.  By default it is set to **OptionalSubscriber**.

**Require Strict Unsubscribe** - When true, this will cause exceptions to be thrown if the scene ends and there are still signal handlers that have not yet unsubscribed yet.  By default it is false.

**Default Async Tick Priority** - This value controls the default tick priority when `RunAsync` is used with `DeclareSignal` but `WithTickPriority` is left unset.  By default it is set to 1, which will cause the signal handlers to be invoked right after all the normal tickables have been called.  This default is chosen because it will ensure that the signal is handled in the same frame that it is triggered, which can be important if the signal affects how the frame is rendered.
