export function AddDefaults<T extends Record<string, unknown>>(
  defaults: T,
): MethodDecorator {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      if (
        Array.isArray(args) &&
        args.length > 0 &&
        typeof args[0] === 'object' &&
        args[0] !== null
      ) {
        const input = args[0] as Record<string, unknown>;
        args[0] = { ...defaults, ...input };
      }

      console.log('[UserStore] Simulated HTTP POST - create user');

      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return await result;
      }

      return result as unknown;
    };

    return descriptor;
  };
}
