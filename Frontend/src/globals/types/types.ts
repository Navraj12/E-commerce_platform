export const Status = {
  SUCCESS: "success",
  LOADING: "loading",
  ERROR: "error",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
