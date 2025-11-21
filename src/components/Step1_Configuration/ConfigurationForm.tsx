import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setStartDate,
  setBoardType,
  setCurrentStep,
  setCitizenship,
  setNumberOfDays,
  setDestinationCountry,
  initializeDailySelections,
} from "../../redux/slices/bookingSlice";
import { countries, boardTypes } from "../../data";

const ConfigurationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!booking.citizenship)
      newErrors.citizenship = "Please select citizenship";
    if (!booking.startDate) newErrors.startDate = "Please select start date";
    if (booking.numberOfDays < 1)
      newErrors.numberOfDays = "Days must be at least 1";
    if (!booking.destinationCountry)
      newErrors.destinationCountry = "Please select destination";
    if (!booking.boardType) newErrors.boardType = "Please select board type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(initializeDailySelections());
      dispatch(setCurrentStep(2));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Hotel Booking Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Citizenship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Citizenship *
          </label>
          <select
            value={booking.citizenship}
            onChange={(e) => dispatch(setCitizenship(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.citizenship && (
            <p className="mt-1 text-sm text-red-600">{errors.citizenship}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={booking.startDate}
            onChange={(e) => dispatch(setStartDate(e.target.value))}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* Number of Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Days *
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={booking.numberOfDays}
            onChange={(e) => dispatch(setNumberOfDays(Number(e.target.value)))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.numberOfDays && (
            <p className="mt-1 text-sm text-red-600">{errors.numberOfDays}</p>
          )}
        </div>

        {/* Destination Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination Country *
          </label>
          <select
            value={booking.destinationCountry}
            onChange={(e) => dispatch(setDestinationCountry(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select destination</option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.destinationCountry && (
            <p className="mt-1 text-sm text-red-600">
              {errors.destinationCountry}
            </p>
          )}
        </div>

        {/* Board Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Board Type *
          </label>
          <div className="space-y-3">
            {boardTypes.map((board) => (
              <label
                key={board.code}
                className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="radio"
                  name="boardType"
                  value={board.code}
                  checked={booking.boardType === board.code}
                  onChange={(e) =>
                    dispatch(setBoardType(e.target.value as "FB" | "HB" | "NB"))
                  }
                  className="mr-3 h-4 w-4 text-blue-600"
                />
                <div>
                  <span className="font-medium">{board.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({board.code})
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.boardType && (
            <p className="mt-1 text-sm text-red-600">{errors.boardType}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium text-lg"
        >
          Continue to Hotel Selection
        </button>
      </form>
    </div>
  );
};

export default ConfigurationForm;
