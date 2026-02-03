---
title: "Advanced TypeScript Patterns for Production Applications"
excerpt: "Master advanced TypeScript patterns including type guards, conditional types, mapped types, and design patterns that make your code more maintainable, type-safe, and scalable."
date: "2024-07-05"
author: "Qodestack Team"
tags: ["typescript", "patterns", "best-practices", "advanced", "type-safety"]
---

TypeScript's type system is incredibly powerful, but many developers only scratch the surface. This guide covers advanced patterns that will make your code more maintainable, type-safe, and self-documenting.

## Table of Contents

1. Advanced Type Guards
2. Conditional Types
3. Mapped Types
4. Template Literal Types
5. Utility Types
6. Design Patterns
7. Error Handling
8. Performance Optimization

## 1. Advanced Type Guards

### User-Defined Type Guards

```typescript
// Basic type guard
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

function isAdmin(user: User): user is Admin {
  return 'permissions' in user;
}

// Usage
function deleteUser(user: User) {
  if (isAdmin(user)) {
    // TypeScript knows user is Admin here
    console.log(user.permissions); // ✓ OK
  }
}
```

### Discriminated Unions

```typescript
interface Success {
  status: 'success';
  data: any;
}

interface Error {
  status: 'error';
  error: string;
}

interface Loading {
  status: 'loading';
}

type Result = Success | Error | Loading;

function handleResult(result: Result) {
  switch (result.status) {
    case 'success':
      // TypeScript knows result is Success
      console.log(result.data);
      break;
    case 'error':
      // TypeScript knows result is Error
      console.log(result.error);
      break;
    case 'loading':
      // TypeScript knows result is Loading
      console.log('Loading...');
      break;
    default:
      // Exhaustiveness check
      const _exhaustive: never = result;
      throw new Error(`Unhandled case: ${_exhaustive}`);
  }
}
```

### Generic Type Guards

```typescript
function isArrayOf<T>(
  arr: unknown,
  guard: (item: unknown) => item is T
): arr is T[] {
  return Array.isArray(arr) && arr.every(guard);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Usage
const data: unknown = ['a', 'b', 'c'];

if (isArrayOf(data, isString)) {
  // TypeScript knows data is string[]
  data.forEach(s => console.log(s.toUpperCase()));
}
```

## 2. Conditional Types

### Basic Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Practical example: unwrap Promise type
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type C = Unwrap<Promise<string>>;  // string
type D = Unwrap<number>;           // number
```

### Distributive Conditional Types

```typescript
type ToArray<T> = T extends any ? T[] : never;

type E = ToArray<string | number>;  // string[] | number[]

// Extract nullable types
type Nullable<T> = T extends null | undefined ? T : never;

type F = Nullable<string | null | number | undefined>;  // null | undefined
```

### Infer Keyword

```typescript
// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type G = ReturnType<() => string>;  // string
type H = ReturnType<(x: number) => number>;  // number

// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : never;

type I = ElementType<string[]>;  // string
type J = ElementType<number[]>;  // number

// Extract promise value type
type PromiseValue<T> = T extends Promise<infer U> ? U : never;

type K = PromiseValue<Promise<string>>;  // string
```

## 3. Mapped Types

### Basic Mapped Types

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];  // Remove optionality
};
```

### Conditional Mapped Types

```typescript
// Make only string properties readonly
type ReadonlyStrings<T> = {
  readonly [P in keyof T]: T[P] extends string ? T[P] : T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = ReadonlyStrings<User>;
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }
```

### Key Remapping

```typescript
// Prefix all keys with 'get'
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
// }

// Filter keys by type
type StringKeys<T> = {
  [P in keyof T]: T[P] extends string ? P : never;
}[keyof T];

type PersonStringKeys = StringKeys<Person>;  // 'name'
```

## 4. Template Literal Types

### Route Type Safety

```typescript
type Route = '/users' | '/posts' | '/comments';
type RouteWithId = `${Route}/${string}`;

const validRoute: RouteWithId = '/users/123';  // ✓
const invalidRoute: RouteWithId = '/invalid/123';  // ✗

// Dynamic route builder
type BuildRoute<
  Base extends string,
  Path extends string
> = `${Base}${Path}`;

type API = BuildRoute<'https://api.example.com', '/users'>;
// 'https://api.example.com/users'
```

### Event System Type Safety

```typescript
type EventName = 'click' | 'focus' | 'blur';
type ListenerName = `on${Capitalize<EventName>}`;

type EventMap = {
  [E in EventName as `on${Capitalize<E>}`]: (event: Event) => void;
};

// {
//   onClick: (event: Event) => void;
//   onFocus: (event: Event) => void;
//   onBlur: (event: Event) => void;
// }
```

### CSS-in-JS Type Safety

```typescript
type CSSValue = string | number;
type CSSProperty =
  | 'color'
  | 'backgroundColor'
  | 'fontSize'
  | 'padding'
  | 'margin';

type StyleObject = {
  [P in CSSProperty]?: CSSValue;
};

// CSS selector builder
type Selector = '&:hover' | '&:focus' | '&:active';
type NestedStyles = StyleObject & {
  [S in Selector]?: StyleObject;
};

const styles: NestedStyles = {
  color: 'blue',
  '&:hover': {
    color: 'red'
  }
};
```

## 5. Utility Types

### Deep Partial

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedUser {
  id: number;
  profile: {
    name: string;
    address: {
      street: string;
      city: string;
    };
  };
}

const partialUser: DeepPartial<NestedUser> = {
  profile: {
    address: {
      city: 'New York'  // Only city required
    }
  }
};
```

### Deep Readonly

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

### Pick By Type

```typescript
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Mixed {
  id: number;
  name: string;
  age: number;
  email: string;
}

type Strings = PickByType<Mixed, string>;  // { name: string; email: string; }
type Numbers = PickByType<Mixed, number>;  // { id: number; age: number; }
```

### Required Keys

```typescript
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface OptionalUser {
  id: number;
  name?: string;
  email?: string;
}

type Required = RequiredKeys<OptionalUser>;  // 'id'
```

## 6. Design Patterns

### Builder Pattern

```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortFn?: (a: T, b: T) => number;
  private limitValue?: number;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  sort(fn: (a: T, b: T) => number): this {
    this.sortFn = fn;
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  execute(data: T[]): T[] {
    let result = data;

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sort
    if (this.sortFn) {
      result = result.sort(this.sortFn);
    }

    // Apply limit
    if (this.limitValue) {
      result = result.slice(0, this.limitValue);
    }

    return result;
  }
}

// Usage
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
];

const result = new QueryBuilder<typeof users[0]>()
  .where(u => u.age > 25)
  .sort((a, b) => b.age - a.age)
  .limit(2)
  .execute(users);
```

### Factory Pattern

```typescript
interface Animal {
  makeSound(): string;
}

class Dog implements Animal {
  makeSound() { return 'Woof!'; }
}

class Cat implements Animal {
  makeSound() { return 'Meow!'; }
}

type AnimalType = 'dog' | 'cat';

class AnimalFactory {
  static create(type: AnimalType): Animal {
    switch (type) {
      case 'dog': return new Dog();
      case 'cat': return new Cat();
      default: {
        const _exhaustive: never = type;
        throw new Error(`Unknown type: ${_exhaustive}`);
      }
    }
  }
}
```

### Repository Pattern

```typescript
interface Repository<T extends { id: string }> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async find(id: string): Promise<User | null> {
    // Implementation
  }

  async findAll(): Promise<User[]> {
    // Implementation
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    // Implementation
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    // Implementation
  }

  async delete(id: string): Promise<void> {
    // Implementation
  }
}
```

### Singleton Pattern

```typescript
class Database {
  private static instance: Database;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql: string) {
    // Implementation
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true
```

## 7. Error Handling

### Result Type

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { ok: false, error: new Error('Division by zero') };
  }
  return { ok: true, value: a / b };
}

// Usage
const result = divide(10, 2);
if (result.ok) {
  console.log(result.value);  // 5
} else {
  console.error(result.error);
}
```

### Try-Catch Wrapper

```typescript
async function tryCatch<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const value = await promise;
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// Usage
const result = await tryCatch(fetchUser('123'));
if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

### Custom Error Classes

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public errors: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

// Usage with type guard
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

try {
  throw new ValidationError('Invalid input', {
    email: 'Invalid email format'
  });
} catch (error) {
  if (isValidationError(error)) {
    console.log(error.errors);  // { email: 'Invalid email format' }
  }
}
```

## 8. Performance Optimization

### Memoization

```typescript
function memoize<Args extends any[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveCalculation = memoize((n: number) => {
  console.log('Computing...');
  return n * n;
});

console.log(expensiveCalculation(5));  // Computing... 25
console.log(expensiveCalculation(5));  // 25 (from cache)
```

### Lazy Initialization

```typescript
class LazyValue<T> {
  private _value?: T;
  private initialized = false;

  constructor(private initializer: () => T) {}

  get value(): T {
    if (!this.initialized) {
      this._value = this.initializer();
      this.initialized = true;
    }
    return this._value!;
  }
}

// Usage
const config = new LazyValue(() => {
  console.log('Loading config...');
  return { apiUrl: 'https://api.example.com' };
});

// Config not loaded yet
console.log('Starting app');

// Config loaded on first access
console.log(config.value.apiUrl);  // Loading config... https://api.example.com
console.log(config.value.apiUrl);  // https://api.example.com (no reload)
```

### Type-Safe Event Emitter

```typescript
type EventMap = {
  'user:created': { id: string; name: string };
  'user:updated': { id: string; changes: Record<string, any> };
  'user:deleted': { id: string };
};

class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners = new Map<keyof Events, Set<Function>>();

  on<K extends keyof Events>(
    event: K,
    listener: (data: Events[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (data: Events[K]) => void
  ): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }
}

// Usage
const events = new TypedEventEmitter<EventMap>();

events.on('user:created', (data) => {
  console.log(data.id, data.name);  // Type-safe!
});

events.emit('user:created', { id: '123', name: 'Alice' });  // ✓
// events.emit('user:created', { wrong: 'data' });  // ✗ Type error
```

## Conclusion

Advanced TypeScript patterns provide:

1. **Type Safety**: Catch errors at compile time
2. **Self-Documentation**: Types serve as documentation
3. **Better IDE Support**: Autocomplete and inline errors
4. **Refactoring Confidence**: Change code without fear
5. **Maintainability**: Easier to understand and modify

Key patterns covered:
- Type guards for runtime type checking
- Conditional types for type transformations
- Mapped types for type manipulation
- Template literal types for string type safety
- Utility types for common transformations
- Design patterns with strong typing
- Type-safe error handling
- Performance optimization patterns

Mastering these patterns will make your TypeScript code more robust, maintainable, and production-ready.

---

*Need TypeScript expertise for your project? [Contact us](/contact) for consulting.*
