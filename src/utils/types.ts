export type NonNullScalar = string | number | boolean;

export type Scalar = NonNullScalar | null;

export type SimpleArray<T extends NonNullScalar = NonNullScalar> = T[];

export type SimpleObject = Record<string, Scalar | SimpleArray>;
