export interface Country {
  id: number;
  name: string;
}

export interface Hotel {
  id: number;
  name: string;
  price: number;
}

export interface BoardType {
  code: "FB" | "HB" | "NB";
  name: string;
}

export interface Meal {
  id: number;
  name: string;
  price: number;
}

export interface MealOptions {
  dinner: Meal[];
  lunch: Meal[];
}

export interface DailySelection {
  date: string;
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
}

export interface BookingState {
  citizenship: string;
  startDate: string;
  numberOfDays: number;
  destinationCountry: string;
  boardType: "FB" | "HB" | "NB" | "";

  dailySelections: DailySelection[];

  currentStep: 1 | 2 | 3;
}

export type HotelsByCountry = Record<string, Hotel[]>;
export type MealsByCountry = Record<string, MealOptions>;
