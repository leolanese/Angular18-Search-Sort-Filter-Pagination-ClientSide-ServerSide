# Company Test

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.


```js
ng new company-test
cd company-test

ng v
Angular CLI: 18.0.3
Node: 20.10.0
Package Manager: npm 10.2.3
OS: win32 x64
Angular: ...
Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1800.3 (cli-only)
@angular-devkit/core         18.0.3 (cli-only)
@angular-devkit/schematics   18.0.3 (cli-only)
@schematics/angular          18.0.3 (cli-only)

npm list -g --depth 0
C:\Program Files\nodejs -> .\
+-- @angular/cli@18.0.3
+-- @aws-amplify/cli@
+-- @nestjs/cli@10.4.4
+-- @storybook/cli@8.0.0
+-- corepack@0.22.0
+-- json-server@1.0.0-beta.1
+-- next@14.2.5
+-- npm@10.2.3

// run SB
npx storybook@latest init

// Code scaffolding
ng g c components/dummy
ng g c components/smart
ng g service services/api
ng g interceptor services/http.cast

// Build
// serve FE: http://localhost:4200/
ng serve -o --poll=2000

ng build --prod --aot --output-hashing=all
```

## Design Pattern Architecture

- `Separation of Concern`
I'm implemented SoC between the service (responsible for fetching data), the smart component (responsible for handling business logic, connect to the Service, use the  and passing data to the dummy component), and the dummy component (responsible for rendering the UI). It also showcases the usage of an interceptor to log HTTP requests and responses.

- `Layered Architecture`
Separating software into logical and independent layers. Code is organised into layers of responsibility. This encourages modularity:
Layered Architecture: `Data Access Layer` (Service & interceptor), `Presentation Layer` Smart & Dummy Components.

---

## Performance and Optimisation: Best Practices. Antipatterns. Recomendations

- Implemented `TSP mechanism`:
I'm using `Tree Shakeable Providers` in `Services` by using the `providedIn` attribute, 
Results: This will provide the benefits of both `tree shaking performance` and `dependency injection`, meaning that our services will not be included in the final bundle unless they are being used by other services or components reducing the bundle size by removing unused code from the bundle.

- Modern Angular `StandAlone`:
I directly bootstrap the component itself, not its module. This is because Angular standalone have their own injectors and don't rely on a root module for dependency injection.
Result: Combined with `provideHttpClient()`  is more `tree-shakable` than importing HttpClientModule, as you can enable the features you want by giving it some parameters. This promotes code maintainability, reusability, and smaller application size.

- `Dependency Injection` Pattern:
Using Modern `Dependency Injection functions`, instead traditional `constructor-based dependency injection`as result I will have a more Modular, less Complex

- Using Modern `Function-based Interceptor`
I'm using modern function Interceptors (Angular 15+) this contribute to a better tree-shakability due to their simplicity, reduced overhead, and a more direct approach to handling HTTP requests

- `Lazy-Loading` & `Tree-Shaking`
I'm using `provideRouter(routes, withPreloading(PreloadAllModules))` to improve performance by splitting the application. Also using standAlone Components and `.inject()` to help tree-shaking. 

- Implement Caching:
-- `Cache API Service Calls`
Caches identical HTTP requests within a single component:
I'm using `shareReplay()` to improve efficiency, ensuring that all subscribers receive the most recent data without triggering multiple HTTP requests.
-- `Cache HTTP Response Interceptor`
Caches identical HTTP requests across multiple components. I am implementing a `Cache HTTP Response Interceptor` to sit between the Components and Service, ensuring that repeated requests from different components don't result in multiple network calls.

- `DestroyRef & takeUntilDestroyed()`:
I'm using provides a more declarative and efficient way to handle automatic cleanup tasks when a component or service is destroyed: `takeUntilDestroyed(this.destroyRef)` to automatically unsubscribe when the component is destroyed, simplifying the cleanup process even further

- `Angular control flows` syntax: `@for`, `@empty`, etc
Using modern angular control flows offering granular implmentations.
Results: Better runtime performance than *ngFor (especially for large lists) and smaller size components

---

## UI/UX Best practices

- Skeleton Loaders
I'm using modern approach to tackle posible future slow-loading pages, by using `skeleton loader`. This gives an idea of what kind of content is loading in each block, such as images, text, etc improving the UX

- Angular Material and CDK
I'm using Angular Material (Based on Material Design best practices) to simplify the speed-up within the timeframe

- Reduces DOM clutter:
I'm using `ng-container` to simplify the DOM wheever is effective

- Spinner Loading
I'm using an Spinner to improve the UX I'm including spinner

- SnackBar Modal
I'm using snackBar Modal to visually indicate errors fetching the data to improve the UX

- Component Oriented Design
I'm using StoryBook setup as part of the project [WIP]

- RWD and MF

- browserlist
I'm using BrowserList and reduced to optimal


---

## Build and CI/CD

- `Clean cache` in deployment
During the deployment phase, I'm implementing cache cleaning to address issues related to loading the latest version of the application. This is particularly important in scenarios involving several consecutive deployments, where the browser cache might still hold outdated files.

To resolve this, I automatically clear the cache by configuring outputHashing in the angular.json file. This ensures that every build generates unique file names, which helps in invalidating the old cache and loading the latest version of the application.

```js
// angular.json
 {
 "projects": {
   "your-project": {
      "architect": {
          "build": {
            "options": {
              "outputHashing": "all"
 }} }}}}
```

- Build Performance: 
I'm activated: `AOT`, `optimization`, `extractLicenses`, deactivating `sourceMap` to improve the final production. 
Result: extras will be removed, and `Real Ivy Compression` will produce a smaller bundle size. This leverages Angular's Ivy compiler (ngtsc) for efficient code generation and compression.


- Angular build budget
I defined a ~safe angular build budget adjusting to the expectation of the test

```js
// angular.json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "bundle",
          "name": "vendor",
          "baseline": "1250kb",
          "warning": "600kb",
          "error": "400kb"
        }
      ]
    }
  }
}
```

- Using webpack-bundle-analyzer
Best practices to analyse our bundles and content of your application and get a better understading the "chuncks". Best for visual, interactive analysis of your bundle's composition. Provides a clear, intuitive view of which modules are contributing most to your bundle size.

- Using Source Map Explorer
Best practices to analyse the size of individual files within your JavaScript bundle. Offers precise mapping between source code and bundled code. Best for detailed, text-based analysis of your bundle size with precise mapping back to your source code. Ideal for CI/CD environments and detailed size investigations.

- Using Detective
I'm using Detective to analyse the codebase to identify patterns and dependencies that might not be immediately apparent, by revealing hidden patterns, we can highlight areas for refactoring, optimisation, or potential issues, leading to improved code quality and maintainability


- esbuild
significantly faster than traditional bundlers like Webpack, leading to shorter build times and improved developer productivity

---

## Security

- XSRF Protection
I configured cookie name and header name for XSRF tokens protection using `withXsrfConfiguration` to secure HTTP requests. Even though it is enabled by default, I would like to underline security practices

- npm audit
I'm using Components with Known Vulnerabilities

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


