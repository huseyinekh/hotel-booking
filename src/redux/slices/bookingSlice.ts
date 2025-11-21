import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type BookingState, type DailySelection } from "../../types";

const initialState: BookingState = {
  citizenship: "",
  startDate: "",
  numberOfDays: 1,
  destinationCountry: "",
  boardType: "",
  dailySelections: [],
  currentStep: 1,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Step 1 actions
    setCitizenship: (state, action: PayloadAction<string>) => {
      state.citizenship = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setNumberOfDays: (state, action: PayloadAction<number>) => {
      state.numberOfDays = action.payload;
    },
    setDestinationCountry: (state, action: PayloadAction<string>) => {
      state.destinationCountry = action.payload;
    },
    setBoardType: (state, action: PayloadAction<"FB" | "HB" | "NB">) => {
      state.boardType = action.payload;
    },

    // Initialize daily selections when moving to step 2
    initializeDailySelections: (state) => {
      const selections: DailySelection[] = [];
      const startDate = new Date(state.startDate);

      for (let i = 0; i < state.numberOfDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        selections.push({
          date: currentDate.toISOString().split("T")[0],
          hotelId: null,
          lunchId: null,
          dinnerId: null,
        });
      }

      state.dailySelections = selections;
    },

    // Step 2 actions
    updateDailyHotel: (
      state,
      action: PayloadAction<{ dayIndex: number; hotelId: number }>
    ) => {
      const { dayIndex, hotelId } = action.payload;
      if (state.dailySelections[dayIndex]) {
        state.dailySelections[dayIndex].hotelId = hotelId;
      }
    },

    updateDailyLunch: (
      state,
      action: PayloadAction<{ dayIndex: number; lunchId: number | null }>
    ) => {
      const { dayIndex, lunchId } = action.payload;
      if (state.dailySelections[dayIndex]) {
        state.dailySelections[dayIndex].lunchId = lunchId;

        // HB rule: if lunch selected, clear dinner
        if (state.boardType === "HB" && lunchId !== null) {
          state.dailySelections[dayIndex].dinnerId = null;
        }
      }
    },

    updateDailyDinner: (
      state,
      action: PayloadAction<{ dayIndex: number; dinnerId: number | null }>
    ) => {
      const { dayIndex, dinnerId } = action.payload;
      if (state.dailySelections[dayIndex]) {
        state.dailySelections[dayIndex].dinnerId = dinnerId;

        // HB rule: if dinner selected, clear lunch
        if (state.boardType === "HB" && dinnerId !== null) {
          state.dailySelections[dayIndex].lunchId = null;
        }
      }
    },

    // Navigation
    setCurrentStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.currentStep = action.payload;
    },

    // Reset
    resetBooking: () => initialState,
  },
});

export const {
  setCitizenship,
  setStartDate,
  setNumberOfDays,
  setDestinationCountry,
  setBoardType,
  initializeDailySelections,
  updateDailyHotel,
  updateDailyLunch,
  updateDailyDinner,
  setCurrentStep,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
