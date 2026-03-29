---
title: "Eventos en Kotlin con inyección de dependencias"
date: "2026-03-28T21:00:00.000Z"
description: "Presentando kotlin-events: un event bus ligero y type-safe para Kotlin donde los listeners se resuelven automáticamente desde el contenedor de DI."
image: "/img/kotlin-events.png"
---

${toc}

## El problema de siempre

Cuando una aplicación crece, las dependencias directas entre componentes se vuelven un problema. Un `OrderService` que necesita enviar un email, actualizar inventario y registrar analytics termina con tres dependencias que no tienen nada que ver con su responsabilidad principal:

```kotlin
class OrderService(
    private val emailService: EmailService,
    private val inventory: InventoryService,
    private val analytics: AnalyticsService,
) {
    fun placeOrder(order: Order) {
        // lógica de negocio...
        emailService.sendConfirmation(order)
        inventory.decrementStock(order.items)
        analytics.trackPurchase(order)
    }
}
```

Cada vez que aparece un nuevo requerimiento — "también hay que notificar al warehouse", "hay que sincronizar con el ERP" — el servicio crece. No porque su lógica cambie, sino porque conoce a todos los que les importa que algo pasó.

El patrón de eventos resuelve esto: el servicio anuncia que algo ocurrió, y los interesados reaccionan de forma independiente.

## kotlin-events

[kotlin-events](https://github.com/CristianLlanos/kotlin-events) es un event bus ligero para Kotlin que implementa publish-subscribe con una diferencia clave: **los listeners se resuelven desde un contenedor de inyección de dependencias**. Esto significa que cada listener recibe sus dependencias automáticamente, igual que cualquier otro servicio.

La librería está construida sobre [kotlin-container](https://github.com/CristianLlanos/kotlin-container) y publicada en Maven Central:

```kotlin
dependencies {
    implementation("com.cristianllanos:events:0.2.1")
}
```

`kotlin-container` se incluye como dependencia transitiva.

## Cómo funciona

Se define un evento, un listener, y se conectan:

```kotlin
class UserCreated(val name: String) : Event()

class WelcomeEmailListener(
    val emailService: EmailService,
) : Listener<UserCreated> {
    override fun handle(event: UserCreated) {
        emailService.sendWelcome(event.name)
    }
}
```

```kotlin
val container = Container()
container.register(EventServiceProvider())

val subscriber = container.resolve<Subscriber>()
subscriber.subscribe<UserCreated, WelcomeEmailListener>()

val emitter = container.resolve<Emitter>()
emitter.emit(UserCreated("Alice"))
```

Cuando se emite `UserCreated`, el event bus resuelve `WelcomeEmailListener` desde el contenedor. Como `EmailService` está en su constructor, se inyecta automáticamente. El listener no se instancia a mano — el contenedor se encarga.

Las suscripciones también se pueden configurar dentro de un service provider, donde los parámetros se resuelven automáticamente:

```kotlin
class OrderEventProvider {
    fun register(subscriber: Subscriber) {
        subscriber.subscribe<OrderPlaced>(
            InventoryListener::class,
            NotificationListener::class,
        )
    }
}

container.register(OrderEventProvider())
```

El provider pide `Subscriber` directamente — no necesita el contenedor completo. kotlin-container resuelve los parámetros de `register` automáticamente.

## Las decisiones de diseño

### Los listeners no son instancias, son clases

En muchos event buses, se registra una instancia del listener:

```kotlin
// Otros event buses
bus.on(UserCreated::class) { event -> ... }
bus.subscribe(MyListener())
```

En kotlin-events, se registra la *clase* del listener, no una instancia:

```kotlin
bus.subscribe<UserCreated, WelcomeEmailListener>()
```

La instancia se crea en el momento de emitir el evento, resolviéndola desde el contenedor. Esto tiene dos ventajas: los listeners reciben dependencias inyectadas, y no se mantienen en memoria si no hay eventos.

### Segregación de interfaces

El event bus está dividido en tres interfaces:

```kotlin
interface Emitter     // emit()
interface Subscriber  // subscribe(), unsubscribe(), clear()
interface EventBus : Emitter, Subscriber
```

Esto permite dar a cada parte del código solo la capacidad que necesita. Un servicio que dispara eventos solo necesita `Emitter`. El código de setup que conecta listeners usa `Subscriber`. Nadie necesita el `EventBus` completo excepto la configuración inicial.

```kotlin
class OrderService(private val events: Emitter) {
    fun placeOrder(order: Order) {
        // lógica de negocio...
        events.emit(OrderPlaced(order.id))
    }
}
```

`OrderService` no sabe qué listeners existen ni qué hacen. Solo anuncia que algo pasó.

### Service providers para organizar suscripciones

Las suscripciones se agrupan naturalmente en service providers. Gracias a la resolución automática de parámetros en kotlin-container, el provider pide directamente lo que necesita:

```kotlin
class OrderEventProvider {
    fun register(subscriber: Subscriber) {
        subscriber.subscribe<OrderPlaced>(
            InventoryListener::class,
            NotificationListener::class,
        )
    }
}
```

Esto mantiene el wiring centralizado y fuera de la lógica de negocio. El provider no necesita recibir el contenedor completo — solo la interfaz que realmente usa.

## La implementación por dentro

El núcleo es un mapa de clases de eventos a listas de clases de listeners:

```kotlin
private val listeners = mutableMapOf<Class<out Event>, MutableList<Class<*>>>()
```

Cuando se emite un evento, se buscan las clases de listeners registradas para ese tipo, se resuelve cada una desde el contenedor, y se llama `handle()`:

```kotlin
override fun <T : Event> emit(event: T) {
    listeners[event::class.java]?.forEach { listenerClass ->
        val listener = resolver.resolve(listenerClass) as Listener<T>
        listener.handle(event)
    }
}
```

Toda la complejidad de instanciación y resolución de dependencias se delega al contenedor. El event bus solo se encarga de saber *quién escucha qué* y de orquestar la ejecución.

## Volviendo al ejemplo original

Con kotlin-events, el `OrderService` del inicio se transforma:

```kotlin
class OrderPlaced(val order: Order) : Event()

class OrderService(private val events: Emitter) {
    fun placeOrder(order: Order) {
        // lógica de negocio...
        events.emit(OrderPlaced(order))
    }
}

class ConfirmationEmailListener(
    private val emailService: EmailService,
) : Listener<OrderPlaced> {
    override fun handle(event: OrderPlaced) {
        emailService.sendConfirmation(event.order)
    }
}

class InventoryListener(
    private val inventory: InventoryService,
) : Listener<OrderPlaced> {
    override fun handle(event: OrderPlaced) {
        inventory.decrementStock(event.order.items)
    }
}

class AnalyticsListener(
    private val analytics: AnalyticsService,
) : Listener<OrderPlaced> {
    override fun handle(event: OrderPlaced) {
        analytics.trackPurchase(event.order)
    }
}
```

Si mañana hay que notificar al warehouse, se agrega un listener y se registra. `OrderService` no cambia. Cada listener tiene una responsabilidad y recibe sus dependencias del contenedor.

## Lo que sigue

kotlin-events resuelve el caso sincrónico: emitir un evento y ejecutar listeners en el mismo hilo. Para muchas aplicaciones eso es suficiente. Pero hay escenarios donde se necesita ejecución asincrónica — listeners que no bloqueen al emisor, colas de eventos, retry logic. Esas son extensiones naturales sobre esta base.

El proyecto está disponible en [GitHub](https://github.com/CristianLlanos/kotlin-events) y en [Maven Central](https://central.sonatype.com/artifact/com.cristianllanos/events).
