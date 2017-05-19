interface Proxyquire {
    (request: string, stubs: any): any;
    <T>(request: string, stubs: any): T;

    fork(): Proxyquire;

    load(request: string, stubs: any): any;
    load<T>(request: string, stubs: any): T;

    noCallThru(): Proxyquire;
    callThru(): Proxyquire;

    noPreserveCache(): void;
    preserveCache(): void;

    resolveNames(resolver: Function): Proxyquire;

    noUnusedStubs(): Proxyquire;
    anyStub(): Proxyquire;

    noUnmockedStubs(): Proxyquire;
    withUnmockedStubs(): Proxyquire;

    onlyForProjectFiles(): Proxyquire;
    forAllFiles(): Proxyquire;
}

declare module 'proxyquire' {
    var p: Proxyquire;
    export = p;
}