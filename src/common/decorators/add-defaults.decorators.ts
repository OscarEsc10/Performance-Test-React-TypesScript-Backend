/**
 * This decorator adds default values to the first argument of a method.
 * It can be used to make sure a function always has some base data.
 *
 * Example:
 * If the function receives { name: 'Oscar' } and defaults are { role: 'user' },
 * the final input will be { role: 'user', name: 'Oscar' }.
 */
export function AddDefaults<T extends Record<string, unknown>>(
  defaults: T,
): MethodDecorator {
  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    // Save the original method before changing it
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    // Replace the method with a new version
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      // If the first argument is an object, merge it with the default values
      if (
        Array.isArray(args) &&
        args.length > 0 &&
        typeof args[0] === 'object' &&
        args[0] !== null
      ) {
        const input = args[0] as Record<string, unknown>;
        // The user's data overwrites the defaults if the same key exists
        args[0] = { ...defaults, ...input };
      }

      console.log('[UserStore] Simulated HTTP POST - create user');

      // Call the original method with the modified arguments
      const result = originalMethod.apply(this, args);

      // If the result is a Promise, wait for it before returning
      if (result instanceof Promise) {
        return await result;
      }

      return result as unknown;
    };

    // Return the modified method
    return descriptor;
  };
}
