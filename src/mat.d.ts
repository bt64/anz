declare module "mat-for-js" {
  export function read<T extends Record<string, any[]>>(
    buffer: ArrayBuffer,
  ): {
    header: string;
    data: T;
  };
}
