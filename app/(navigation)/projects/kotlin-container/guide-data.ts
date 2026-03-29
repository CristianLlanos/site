import { BASE } from './constants'

export const guides = [
  {
    href: `${BASE}/guide`,
    title: 'Getting Started',
    sections: [
      { id: 'installation', title: 'Installation' },
      { id: 'your-first-container', title: 'Your first container' },
      { id: 'dsl-builder', title: 'DSL builder' },
    ],
  },
  {
    href: `${BASE}/bindings`,
    title: 'Bindings',
    sections: [
      { id: 'three-lifetimes', title: 'Three lifetimes' },
      { id: 'binding-interfaces', title: 'Binding interfaces' },
      { id: 'auto-resolved-registration', title: 'Auto-resolved registration' },
      { id: 'resolve-inside-lambdas', title: 'Using resolve() inside lambdas' },
    ],
  },
  {
    href: `${BASE}/scopes`,
    title: 'Scopes',
    sections: [
      { id: 'basic-scoped-bindings', title: 'Basic scoped bindings' },
      { id: 'block-based-scopes', title: 'Block-based scopes' },
      { id: 'dispose-hooks', title: 'Dispose hooks' },
      { id: 'nested-scopes', title: 'Nested scopes' },
      { id: 'scopes-as-child-containers', title: 'Scopes as child containers' },
      { id: 'contextual-scopes', title: 'Contextual scopes' },
      { id: 'android', title: 'Android' },
    ],
  },
  {
    href: `${BASE}/providers`,
    title: 'Service Providers',
    sections: [
      { id: 'basic-providers', title: 'Basic providers' },
      { id: 'auto-resolved-parameters', title: 'Auto-resolved parameters' },
      { id: 'registering-multiple-providers', title: 'Registering multiple providers' },
      { id: 'scope-providers', title: 'Scope providers' },
    ],
  },
  {
    href: `${BASE}/advanced`,
    title: 'Advanced',
    sections: [
      { id: 'thread-safety', title: 'Thread safety' },
      { id: 'callable-injection', title: 'Callable injection' },
      { id: 'default-values', title: 'Default values' },
      { id: 'convenience-extensions', title: 'Convenience extensions' },
      { id: 'custom-auto-resolver', title: 'Custom auto-resolver' },
      { id: 'interface-segregation', title: 'Interface segregation' },
    ],
  },
]

export const resources = [
  { href: `${BASE}/api`, title: 'API Reference' },
  { href: `${BASE}/changelog`, title: 'Changelog' },
]
