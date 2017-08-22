/**
 * @name Proxyquire
 * @class
 * Proxies imports/require in order to allow overriding dependencies during testing.
 */
interface Proxyquire {
    (request: string, stubs: any): any;
    <T>(request: string, stubs: any): T;

    /**
     * Forks proxyquire.
     * @name fork
     * @return {Proxyquire} Forked proxyquire function to allow chaining
     * @example
     * proxyquire.noCallThru() - will disable call throught on proxyquire.
     * proxyquire.load - call throught will be still disabled
     * proxyquire.fork().noCallThru() - will create a separate fork of proxyquire which will not affect original one
     */
    fork(): Proxyquire;

    /**
     * Loads a module using the given stubs instead of their normally resolved required modules.
     * @param request The requirable module path to load.
     * @param stubs The stubs to use. e.g., { "path": { extname: function () { ... } } }
     * @return {*} A newly resolved module with the given stubs.
     */
    load(request: string, stubs: any): any;
    load<T>(request: string, stubs: any): T;

    /**
     * Disables call thru, which determines if keys of original modules will be used
     * when they weren't stubbed out.
     * @name noCallThru
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    noCallThru(): Proxyquire;
    /**
     * Enables call thru, which determines if keys of original modules will be used
     * when they weren't stubbed out.
     * @name callThru
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    callThru(): Proxyquire;

    /**
     * Will make proxyquire remove the requested modules from the `require.cache` in order to force
     * them to be reloaded the next time they are proxyquired.
     * This behavior differs from the way nodejs `require` works, but for some tests this maybe useful.
     *
     * @name noPreserveCache
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    noPreserveCache(): Proxyquire;
    /**
     * Restores proxyquire caching behavior to match the one of nodejs `require`
     *
     * @name preserveCache
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    preserveCache(): Proxyquire;

    /**
     * Sets new module name resolver and comparator
     * @name resolveNames
     * @param {Function} [resolver](subs, fileName, currentDir).
     * @return {Proxyquire} The proxyquire function to allow chaining
     *
     * @example proxyquire.resolveNames((stubs, fileName) => stubs.hasOwnProperty(fileName) ? stubs[fileName] : null)
     */
    resolveNames(resolver: (stubs: any, path: string, module: any) => any): Proxyquire;

    /**
     * Throws an error is some stubs are unused
     * @name noUnusedStubs
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    noUnusedStubs(): Proxyquire;
    /**
     * Restores default behavior - allows any stubs
     * @name anyStub
     * @member
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    anyStub(): Proxyquire;

    /**
     * Throws an error is some deps are not mocked
     * @name noUnmockedStubs
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    noUnmockedStubs(): Proxyquire;

    /**
     * Restores default behavior - allows unmocked deps
     * @name withUnmockedStubs
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    withUnmockedStubs(): Proxyquire;

    /**
     * Prevent modules from node_modules to be wiped from a cache
     *
     * @name onlyForProjectFiles
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    onlyForProjectFiles(): Proxyquire;
    /**
     * Restores default behavior - all modules can be wiped from a cache
     *
     * @name forAllFiles
     * @return {Proxyquire} The proxyquire function to allow chaining
     */
    forAllFiles(): Proxyquire;
}

declare module 'proxyquire-2' {
    var p: Proxyquire;
    export default p;
}