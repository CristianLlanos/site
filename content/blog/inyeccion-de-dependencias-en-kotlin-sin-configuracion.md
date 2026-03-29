---
title: "Inyección de dependencias en Kotlin sin configuración"
date: "2026-03-28T15:00:00.000Z"
description: "Presentando kotlin-container: un contenedor ligero con resolución automática, singletons, factories e invocación de funciones con DI para Kotlin."
image: "/img/kotlin-container.png"
---

${toc}

## El problema

Si trabajas con Kotlin, probablemente has usado frameworks como Spring, Koin o Dagger para manejar la inyección de dependencias. Son herramientas poderosas, pero muchas veces traen consigo una complejidad que no necesitamos: anotaciones, procesadores de código, archivos de configuración, y una curva de aprendizaje considerable.

¿Y si pudiéramos resolver dependencias automáticamente, sin configuración, aprovechando la reflexión de Kotlin?

Con esa idea nació [kotlin-container](https://github.com/CristianLlanos/kotlin-container).

## ¿Qué es kotlin-container?

Es un contenedor de inyección de dependencias ligero para Kotlin que prioriza la simplicidad y la seguridad de tipos. Su característica principal: **resolución automática**. Si tu clase tiene un constructor primario con dependencias concretas, el contenedor las resuelve sin que registres nada.

```kotlin
class UserRepository()
class UserService(val repository: UserRepository)

val container = Container()
val service = container.resolve<UserService>()
// UserService se resuelve automáticamente, incluyendo UserRepository
```

Eso es todo. Sin anotaciones, sin módulos, sin configuración.

La resolución automática maneja:

- **Clases concretas** — se resuelven recursivamente via su constructor primario
- **Interfaces y abstractas registradas** — se resuelven desde el registro
- **Parámetros opcionales con valores por defecto** — se omiten si no pueden resolverse
- **Primitivos requeridos (String, Int, etc.)** — lanzan `UnresolvableDependencyException`

## Diseño basado en segregación de interfaces

El contenedor está dividido en interfaces enfocadas. Cada parte del código recibe solo la capacidad que necesita:

```kotlin
interface Registrar   // register(), factory(), singleton(), scoped()
interface Resolver    // resolve()
interface Caller      // call()
interface Container : Registrar, Resolver, Caller  // child()
interface Scope : Container, AutoCloseable          // close()
```

Por ejemplo:

```kotlin
// Setup — acceso completo
fun bootstrap(): Container {
    val container = Container()
    container.register(AuthServiceProvider(), PaymentServiceProvider())
    return container
}

// Rutas — solo puede resolver, no registrar
fun userRoutes(resolver: Resolver) {
    val service = resolver.resolve<UserService>()
}

// Middleware — solo puede invocar funciones
fun runMiddleware(caller: Caller) {
    caller.call(::authenticate)
}
```

## Registro manual cuando lo necesitas

Para interfaces, clases abstractas o cuando quieres controlar el ciclo de vida, puedes registrar manualmente:

```kotlin
val container = Container()

// Factory: nueva instancia cada vez
container.factory<Logger> { ConsoleLogger() }

// Singleton: una sola instancia reutilizada
container.singleton<Database> { PostgresDatabase("jdbc:...") }
```

Las dependencias registradas siempre tienen prioridad sobre la resolución automática.

Dentro de los lambdas de registro, `resolve<T>()` está disponible para referenciar otros bindings — útil cuando un binding depende de otro o cuando la misma implementación respalda múltiples interfaces:

```kotlin
class EventServiceProvider {
    fun register(container: Container) {
        container.singleton<EventBus> { EventBus(this) }
        container.singleton<Emitter> { resolve<EventBus>() }
        container.singleton<Subscriber> { resolve<EventBus>() }
    }
}
```

`this` dentro del lambda se refiere al contenedor, así que puedes pasarlo directamente a clases que lo necesiten. `resolve<T>()` obtiene instancias del registro, permitiendo compartir una misma instancia entre múltiples interfaces.

## Invocación de funciones con inyección

Una de las características más útiles es la capacidad de invocar funciones resolviendo sus parámetros automáticamente:

```kotlin
fun handleRequest(service: UserService, db: Database): Response {
    // service y db se inyectan automáticamente
    return Response.ok(service.findAll())
}

val response = container.call(::handleRequest)
```

También funciona con métodos de instancia:

```kotlin
val controller = OrderController()
container.call(controller::processOrder)
```

Los parámetros opcionales con valores por defecto se omiten si no pueden resolverse, en lugar de lanzar un error.

## Service Providers

Para organizar el registro de dependencias en módulos reutilizables, cualquier clase con un método `register()` funciona como provider. Los parámetros de `register` se resuelven automáticamente desde el contenedor:

```kotlin
class DatabaseProvider {
    fun register(container: Container) {
        container.singleton<Database> { PostgresDatabase("jdbc:...") }
        container.singleton<Cache> { RedisCache() }
    }
}

val container = Container()
container.register(DatabaseProvider())
```

El provider puede pedir cualquier dependencia que necesite — no solo el contenedor:

```kotlin
class NotificationProvider {
    fun register(container: Container, config: AppConfig) {
        if (config.slackEnabled) {
            container.singleton<Notifier> { SlackNotifier(config.slackWebhook) }
        } else {
            container.singleton<Notifier> { EmailNotifier() }
        }
    }
}
```

No hay interfaz que implementar — es pura convención. El contenedor encuentra el método `register`, resuelve sus parámetros, y lo invoca.

## Registro simplificado para clases concretas

Cuando solo necesitas asignar un ciclo de vida a una clase concreta sin configuración adicional, puedes omitir el lambda por completo:

```kotlin
container.singleton<TenantService>()
container.singleton<CalendarService>()
container.singleton<BookingUrlService>()
container.scoped<RequestContext>()
container.factory<TempProcessor>()
```

Es equivalente a escribir `container.singleton<TenantService> { resolve() }` — el contenedor resuelve automáticamente las dependencias del constructor. Esto es especialmente útil cuando tienes muchos servicios concretos que solo necesitan un ciclo de vida específico:

```kotlin
class AppProvider {
    fun register(container: Container) {
        // Interfaces — requieren lambda para especificar la implementación
        container.singleton<PaymentGateway> { StripeGateway() }
        container.singleton<Emitter> { resolve<EventBus>() }

        // Clases concretas — solo necesitan el ciclo de vida
        container.singleton<TenantService>()
        container.singleton<CalendarService>()
        container.singleton<BookingUrlService>()
    }
}
```

## Custom auto-resolver

Si necesitas reemplazar la resolución automática basada en reflexión, puedes inyectar tu propia estrategia:

```kotlin
class MyAutoResolver : AutoResolver {
    override fun <T : Any> resolve(type: Class<T>, resolver: Resolver): T {
        // tu lógica de resolución
    }
}

val container = Container(MyAutoResolver())
```

El contenedor usa `ReflectionAutoResolver` por defecto cuando no se provee uno personalizado.

## ¿Por qué otro contenedor de DI?

Porque a veces no necesitas un framework completo. Si tu proyecto es una API pequeña, una herramienta CLI, o simplemente quieres DI sin la ceremonia de Dagger o la magia de Spring, `kotlin-container` ocupa ese espacio intermedio: suficiente potencia con mínima fricción.

El proyecto está publicado en Maven Central y disponible en [GitHub](https://github.com/CristianLlanos/kotlin-container).

```bash
implementation("com.cristianllanos:container:0.3.0")
```
