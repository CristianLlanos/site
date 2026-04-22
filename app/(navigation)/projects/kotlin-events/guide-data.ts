import { BASE } from './constants'

export const guides = [
  {
    href: `${BASE}/guide`,
    title: 'Getting Started',
    sections: [
      { id: 'installation', title: 'Installation' },
      { id: 'events-and-listeners', title: 'Events and listeners' },
      { id: 'wiring-up', title: 'Wiring up' },
      { id: 'service-provider', title: 'Service provider' },
    ],
  },
  {
    href: `${BASE}/listeners`,
    title: 'Listeners',
    sections: [
      { id: 'lambda-listeners', title: 'Lambda listeners' },
      { id: 'one-shot', title: 'One-shot listeners' },
      { id: 'catch-all', title: 'Catch-all listener' },
      { id: 'multiple-listeners', title: 'Multiple listeners' },
      { id: 'registration-dsl', title: 'Registration DSL' },
      { id: 'unsubscribe-and-clear', title: 'Unsubscribe and clear' },
    ],
  },
  {
    href: `${BASE}/middleware`,
    title: 'Middleware & Errors',
    sections: [
      { id: 'middleware', title: 'Middleware' },
      { id: 'error-resilience', title: 'Error resilience' },
      { id: 'inspector', title: 'Inspector' },
      { id: 'event-hierarchy', title: 'Event hierarchy' },
    ],
  },
  {
    href: `${BASE}/coroutines`,
    title: 'Coroutines',
    sections: [
      { id: 'suspending-listeners', title: 'Suspending listeners' },
      { id: 'suspending-emit', title: 'Suspending emit' },
      { id: 'mixed-handlers', title: 'Mixed handlers' },
      { id: 'suspend-onerror', title: 'Suspend onError' },
      { id: 'migration', title: 'Migration' },
    ],
  },
  {
    href: `${BASE}/advanced`,
    title: 'Advanced',
    sections: [
      { id: 'thread-safety', title: 'Thread safety' },
      { id: 'interface-segregation', title: 'Interface segregation' },
      { id: 'once-guarantees', title: 'Once guarantees' },
    ],
  },
]

export const resources = [
  { href: `${BASE}/api`, title: 'API Reference' },
  { href: `${BASE}/changelog`, title: 'Changelog' },
]
