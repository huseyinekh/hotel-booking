import { type DailySelection } from "../types";
import { hotels, meals } from "../data";

export interface DayPrice {
  date: string;
  hotelPrice: number;
  hotelName: string;
  lunchPrice: number;
  lunchName: string;
  dinnerPrice: number;
  dinnerName: string;
  dayTotal: number;
}

export const calculateDailyPrices = (
  dailySelections: DailySelection[],
  destinationCountry: string
): DayPrice[] => {
  const availableHotels = hotels[destinationCountry] || [];
  const availableMeals = meals[destinationCountry];

  return dailySelections.map((day) => {
    // Find hotel
    const hotel = availableHotels.find((h) => h.id === day.hotelId);
    const hotelPrice = hotel?.price || 0;
    const hotelName = hotel?.name || "No hotel selected";

    // Find lunch
    const lunch = availableMeals?.lunch.find((m) => m.id === day.lunchId);
    const lunchPrice = lunch?.price || 0;
    const lunchName = lunch?.name || "-";

    // Find dinner
    const dinner = availableMeals?.dinner.find((m) => m.id === day.dinnerId);
    const dinnerPrice = dinner?.price || 0;
    const dinnerName = dinner?.name || "-";

    const dayTotal = hotelPrice + lunchPrice + dinnerPrice;

    return {
      date: day.date,
      hotelPrice,
      hotelName,
      lunchPrice,
      lunchName,
      dinnerPrice,
      dinnerName,
      dayTotal,
    };
  });
};

export const calculateGrandTotal = (dayPrices: DayPrice[]): number => {
  return dayPrices.reduce((sum, day) => sum + day.dayTotal, 0);
};
