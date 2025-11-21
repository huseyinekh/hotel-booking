import React from "react";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { useAppSelector } from "./redux/hooks";
import Summary from "./components/Step3_Summary/Summary";
import DailyConfigTable from "./components/Step2_DailyConfig/DailyConfigTable";
import ConfigurationForm from "./components/Step1_Configuration/ConfigurationForm";

const AppContent: React.FC = () => {
  const currentStep = useAppSelector((state) => state.booking.currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto mb-8 px-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition ${
                      currentStep === step
                        ? "bg-blue-600 text-white scale-110"
                        : currentStep > step
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > step ? "✓" : step}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`font-semibold ${
                        currentStep === step ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {step === 1 && "Configuration"}
                      {step === 2 && "Daily Selection"}
                      {step === 3 && "Summary"}
                    </p>
                  </div>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition ${
                      currentStep > step ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div>
        {currentStep === 1 && <ConfigurationForm />}
        {currentStep === 2 && <DailyConfigTable />}
        {currentStep === 3 && <Summary />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
