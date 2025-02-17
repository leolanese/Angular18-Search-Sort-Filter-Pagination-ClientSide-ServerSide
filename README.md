# Search, Sort, Filter, Pagination using Client and Server side

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

```js
ng new company --routing false --style scss --skip-git --skip-tests
cd company
```

```js
ng v
```

```js
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
```
```js
npm list -g --depth 0
```

```js
C:\Program Files\nodejs -> .\
+-- @angular/cli@18.0.3
+-- @aws-amplify/cli@
+-- @nestjs/cli@10.4.4
+-- @storybook/cli@8.0.0
+-- corepack@0.22.0
+-- json-server@1.0.0-beta.1
+-- next@14.2.5
+-- npm@10.2.3
```

```js
// run SB
npx storybook@latest init
```

```js
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
I'm separating software into logical and independent layers. Code is organised into layers of responsibility. This encourages modularity:
Result: Layered Architecture: `Data Access Layer` (Service & interceptor), `Presentation Layer` Smart & Dummy Components.

---

## Performance and Optimisation: Best Practices. Antipatterns. Recomendations

- Implemented `TSP mechanism`:
I'm using `Tree Shakeable Providers` in `Services` by using the `providedIn` attribute, 
Results: This will provide the benefits of both `tree shaking performance` and `dependency injection`, meaning that our services will not be included in the final bundle unless they are being used by other services or components reducing the bundle size by removing unused code from the bundle.

- Modern Angular `StandAlone`:
I directly bootstrap the component itself, not its module. This is because Angular standalone have their own injectors and don't rely on a root module for dependency injection.
Results: Combined with `provideHttpClient()`  is more `tree-shakable` than importing HttpClientModule, as you can enable the features you want by giving it some parameters. This promotes code maintainability, reusability, and smaller application size.

- `Dependency Injection` Pattern:
Using Modern `Dependency Injection functions`, instead traditional `constructor-based dependency injection`as result I will have a more Modular, less Complex

- Using Modern `Function-based Interceptor`
I'm using modern function Interceptors (Angular 15+) this contribute to a better tree-shakability due to their simplicity, reduced overhead, and a more direct approach to handling HTTP requests

- PreloadingStrategy: `Lazy-Loading` & `Tree-Shaking`
I'm implementing `Preloading` technique provideRouter(routes, withPreloading(PreloadAllModules)). Also using standAlone Components and `.inject()` to help tree-shaking.
Results: This technique allows my App to load lazy-loaded modules in the background while the user is interacting with the currently loaded module

- Implement Caching:
-- `Cache API Service Calls`
Caches identical HTTP requests within a single component:
I'm using `shareReplay()` to improve efficiency, ensuring that all subscribers receive the most recent data without triggering multiple HTTP requests.
-- `Cache HTTP Response Interceptor`
Caches identical HTTP requests across multiple components. I am implementing a `Cache HTTP Response Interceptor` to sit between the Components and Service, ensuring that repeated requests from different components don't result in multiple network calls.

- `DestroyRef & takeUntilDestroyed()`:
I'm using provides a more declarative and efficient way to handle automatic cleanup tasks when a component or service is destroyed: `takeUntilDestroyed(this.destroyRef)` to automatically unsubscribe when the component is destroyed, simplifying the cleanup process even further

- `Angular control flows` syntax: `@for`, `@empty`, etc
Using modern angular control flows offering granular implementations.
Results: Better runtime performance than *ngFor (especially for large lists) and smaller size Components

- Always avoid `Double instantiation`, if using `@Module` and use new granular way by `remove the references in the global root app.module`

```js
// global app.module
@Module({
  controllers: [AppController, CoffeesController], // remove `CoffeesController`
  providers: [AppService, CoffeeService, CoffeeService], // remove `CoffeeService`
})

// new more granular c.module
@Module({
  controllers: [AppController, CoffeesController],
  providers: [AppService, CoffeeService, CoffeeService],
})

@Module({
  imports: [cModule],
  controllers: [AppController, CoffeesController], // remove `CoffeesController`
  providers: [AppService, CoffeeService, CoffeeService], // remove `CoffeeService`
})
```

- Keep Application `modularized` 
> We need to leave the App encapsualted into its own dedicated portable Module, so we can have a `feature-based module organised`

- Signals:
Using value from the signal `(searchSig)` to filter your data. Instead of using the filter form control for filtering, using the signal to filter the data directly. This will reduce the number of subscriptions and improve performance.

- Proxying to a backend server

```js
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

```js
// angular.json
...
  "options": {
    "proxyConfig": "src/proxy.conf.json"
  }
...
```


---

## TS recomendations

-  Arrow Function in services is Preferable
> Since arrow functions capture the this value of their enclosing context at the time they're defined, they retain the correct this reference no matter how they're called.

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
Create Components, from small to large screens, that can work across "most" viewports environment with minimal adjustments. 

- browserlist
Focus the target on a list. 

- UX/UI improvements by `Pagination` + `Query Parameters`

- UX improvements by `user-friendly` error messages

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

- Using `webpack-bundle-analyzer`

I'm implementing and analysing the bundles and content of our application and get a better understading the "chuncks". Best for visual, interactive analysis of our bundle's composition. Provides a clear, intuitive view of which modules are contributing most to our bundle size.

- Using Source Map Explorer

Best practices to analyse the size of individual files within our JS bundle.
Results: A precise mapping between source code and bundled code. Best for detailed, text-based analysis of our bundle size with precise mapping back to our source code. Ideal for CI/CD environments and detailed size investigations.

- Using `Detective`

Using Detective to analyse the codebase to identify patterns and dependencies that might not be immediately apparent, by revealing hidden patterns, we can highlight areas for refactoring, optimisation, or potential issues, leading to improved code quality and maintainability


- Using `esbuild` - An extremely fast bundler for the web = Angular 16+ esbuild-based build system
Significantly faster than traditional bundlers like Webpack, leading to shorter build times and improved developer productivity

If you're using Angular 16 with the esbuild-based build system ("builder": "@angular-devkit/build-angular:browser-esbuild"), you do not need to install esbuild manually. Angular 16 already comes with built-in support for esbuild as part of the Angular CLI, 

---

## Security

### XSS Protection (1st Line of Defense)

Angular automatically protects against XSS by sanitizing untrusted content in templates, avoid disabling
Keep Sanitation active for users <input />. 

Don't use `localStorage` nor `cookies` for token credentials, because <iframe> can by-passed the Angular sanitation. 
Instead rely on server-side `HttpOnly Cookies`, as they are not accessible using js running in the browser, are immune to this type of XSS attack (However, they are vulnerable to XSRF attacks) AND `Secure Flag on a cookies`  ensuring that the cookie is only sent over HTTPS connections, not over plain HTTP.

Be careful when using [innerHTML] property binding as directly injects HTML content into the DOM and this Bypasses Angular's Sanitation. `When using innerHTML, always sanitize it with Angular DomSanitizer`.
Don't use `ElementRef` for DOM monipulation use `Renderer2` instead. `ElementRef` by-pass sanitation and poses security risk, also creates tight coupling between your application and rendering layers which makes is difficult to run an app on multiple platforms.

```js
// NEST
@Post('login')
login(@Body() body: any, @Res() res: Response) {
  const token = this.generateJwtToken(body.user); // Generate JWT or some other token

  // Set the token in an httpOnly cookie
  res.cookie('authToken', token, {
    httpOnly: true,  // Inaccessible to client-side JS
    secure: true,    // Ensure cookie is sent over HTTPS
    sameSite: 'strict', // Prevent XSRF attacks
    maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
  });

  return res.status(200).json({ message: 'Login successful' });
}
```


### CSP (2nd Line of Defense)

Set of directives to define a rules that control the `origin of sources` from which various types of content can be loaded and executed in our web application

```js
// Headers
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self'; 
        script-src 'self' https://apis.google.com; 
        style-src 'self' https://fonts.googleapis.com; 
        img-src 'self' https://images.example.com; 
        object-src 'none'; 
        frame-ancestors 'self';
       ">
```

As one step forward, we could implement a `Monitor CSP Violation Policy`: usign `report-uri` + `Content-Security-Policy-Report-Only`. Now, when the browser detects a violation of the CSP, it sends a report to the specified URL in JSON format.

```js
// angular.json
"headers": {
  "Content-Security-Policy-Report-Only": "default-src 'self'; report-uri https://csrfexample.com:3443/reportViolations"
}
```




###  XSRF Protection

Angular provides XSRF protection out-of-the-box, enable by default, by adding a `custom header` containing a random token provided by the server in a cookie

```js
import { bootstrapApplication } from '@angular/core';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'TOKEN', // default is 'XSRF-TOKEN'
        headerName: 'X-TOKEN' // default is 'X-XSRF-TOKEN'
      })
    )]
});
```

This protection is implemented through the use of an anti-XSRF token that is automatically included in all requests made by the Angular framework. We can integrate it with `server-side CSRF protection mechanisms` by ensuring the XSRF token is included in our HTTP requests.

I configured cookie name and header name for XSRF tokens protection using `withXsrfConfiguration` to secure HTTP requests. Even though it is enabled by default, I would like to underline security practices




- Audit

Check dependencies with known vulnerabilities. Ensuring that these dependencies don't contain any known security vulnerabilities is very important for the overall security of your website.

```js
npm audit
```



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


