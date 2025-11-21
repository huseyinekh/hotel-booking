import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  updateDailyHotel,
  updateDailyLunch,
  updateDailyDinner,
  setCurrentStep,
} from "../../redux/slices/bookingSlice";
import { hotels, meals } from "../../data";

const DailyConfigTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);

  const availableHotels = hotels[booking.destinationCountry] || [];
  const availableMeals = meals[booking.destinationCountry];

  const canSelectMeals = booking.boardType !== "NB";
  const isHalfBoard = booking.boardType === "HB";

  const handleNext = () => {
    const allHotelsSelected = booking.dailySelections.every(
      (day) => day.hotelId !== null
    );

    if (!allHotelsSelected) {
      alert("Please select a hotel for each day");
      return;
    }

    dispatch(setCurrentStep(3));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Daily Hotel & Meal Selection
          </h2>
          <button
            onClick={() => dispatch(setCurrentStep(1))}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Configuration
          </button>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-800">
            <strong>Board Type:</strong>{" "}
            {booking.boardType === "FB" &&
              "Full Board - Select both lunch and dinner"}
            {booking.boardType === "HB" &&
              "Half Board - Select either lunch OR dinner (not both)"}
            {booking.boardType === "NB" && "No Board - Meals not included"}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Hotel
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Lunch
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Dinner
                </th>
              </tr>
            </thead>
            <tbody>
              {booking.dailySelections.map((day, index) => {
                const hasLunch = day.lunchId !== null;
                const hasDinner = day.dinnerId !== null;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* Date */}
                    <td className="border border-gray-300 px-4 py-3 font-medium">
                      Day {index + 1}
                      <div className="text-sm text-gray-500">
                        {formatDate(day.date)}
                      </div>
                    </td>

                    {/* Hotel Selection */}
                    <td className="border border-gray-300 px-4 py-3">
                      <select
                        value={day.hotelId || ""}
                        onChange={(e) =>
                          dispatch(
                            updateDailyHotel({
                              dayIndex: index,
                              hotelId: Number(e.target.value),
                            })
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select hotel</option>
                        {availableHotels.map((hotel) => (
                          <option key={hotel.id} value={hotel.id}>
                            {hotel.name} - ${hotel.price}/night
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Lunch Selection */}
                    <td className="border border-gray-300 px-4 py-3">
                      <select
                        value={day.lunchId || ""}
                        onChange={(e) =>
                          dispatch(
                            updateDailyLunch({
                              dayIndex: index,
                              lunchId: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          )
                        }
                        disabled={!canSelectMeals || (isHalfBoard && hasDinner)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">No lunch</option>
                        {availableMeals?.lunch.map((meal) => (
                          <option key={meal.id} value={meal.id}>
                            {meal.name} - ${meal.price}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Dinner Selection */}
                    <td className="border border-gray-300 px-4 py-3">
                      <select
                        value={day.dinnerId || ""}
                        onChange={(e) =>
                          dispatch(
                            updateDailyDinner({
                              dayIndex: index,
                              dinnerId: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          )
                        }
                        disabled={!canSelectMeals || (isHalfBoard && hasLunch)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">No dinner</option>
                        {availableMeals?.dinner.map((meal) => (
                          <option key={meal.id} value={meal.id}>
                            {meal.name} - ${meal.price}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => dispatch(setCurrentStep(1))}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition font-medium"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Continue to Summary →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyConfigTable;
