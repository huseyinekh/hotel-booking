import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrentStep, resetBooking } from "../../redux/slices/bookingSlice";
import {
  calculateDailyPrices,
  calculateGrandTotal,
} from "../../utils/priceCalculator";
import { boardTypes } from "../../data";

const Summary: React.FC = () => {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);

  const dayPrices = calculateDailyPrices(
    booking.dailySelections,
    booking.destinationCountry
  );
  const grandTotal = calculateGrandTotal(dayPrices);

  const boardTypeName =
    boardTypes.find((b) => b.code === booking.boardType)?.name || "";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    if (
      confirm(
        "Are you sure you want to start a new booking? Current data will be lost."
      )
    ) {
      dispatch(resetBooking());
      dispatch(setCurrentStep(1));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Booking Summary</h2>
          <button
            onClick={() => dispatch(setCurrentStep(2))}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Edit Selections
          </button>
        </div>

        {/* Configuration Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Trip Configuration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Citizenship</p>
              <p className="font-semibold text-gray-800">
                {booking.citizenship}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-semibold text-gray-800">
                {booking.destinationCountry}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold text-gray-800">
                {booking.numberOfDays} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Board Type</p>
              <p className="font-semibold text-gray-800">{boardTypeName}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Travel Dates</p>
            <p className="font-semibold text-gray-800">
              {formatDate(booking.dailySelections[0]?.date)} -{" "}
              {formatDate(
                booking.dailySelections[booking.dailySelections.length - 1]
                  ?.date
              )}
            </p>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Daily Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Hotel
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right">
                    Hotel Price
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Lunch
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right">
                    Lunch Price
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Dinner
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right">
                    Dinner Price
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    Day Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {dayPrices.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-medium">Day {index + 1}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(day.date)}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {day.hotelName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                      ${day.hotelPrice}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">
                      {day.lunchName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {day.lunchPrice > 0 ? `$${day.lunchPrice}` : "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">
                      {day.dinnerName}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {day.dinnerPrice > 0 ? `$${day.dinnerPrice}` : "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-blue-600">
                      ${day.dayTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-green-100 to-emerald-100">
                  <td
                    colSpan={7}
                    className="border border-gray-300 px-4 py-4 text-right font-bold text-lg"
                  >
                    GRAND TOTAL:
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-right font-bold text-2xl text-green-700">
                    ${grandTotal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition font-medium"
          >
            🖨️ Print Summary
          </button>
          <button
            onClick={handleNewBooking}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
          >
            ✨ New Booking
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          div[class*="max-w-6xl"] * {
            visibility: visible;
          }
          div[class*="max-w-6xl"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Summary;
