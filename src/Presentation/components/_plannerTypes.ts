export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const slots = ["Breakfast", "Lunch", "Dinner"] as const;

export type Day = typeof days[number];
export type Slot = typeof slots[number];
