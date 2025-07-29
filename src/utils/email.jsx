import React, { useState, useEffect } from 'react';

const PopupForm = ({ setIsPopupVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState('');

  // Determine the base URL dynamically when the component mounts
  useEffect(() => {
    setRedirectUrl(`${window.location.origin}/thank-you`);
  }, []);

  // Remove the console.log that was outside the component
  useEffect(() => {
    console.log('Redirect URL:', redirectUrl);
  }, [redirectUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setIsPopupVisible(false);
  };

  // Don't render anything if popup is closed
  if (!isPopupOpen) {
    return null;
  }

  return (
    // Popup Overlay: Fixed position, full screen, semi-transparent background, centered content
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Popup Container: White background, rounded corners, shadow, responsive width, max height */}
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm md:max-w-md lg:max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Cross Button: Absolute position, top right, large font, text color, hover effect */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>
        
        {/* Popup Heading: Centered text, large font, bold */}
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6 mt-4">Contact Us</h2>

        {/* Form: Flex column layout with spacing */}
        <form
          action="https://formsubmit.co/hr@dgtlmart.com"
          method="POST"
          className="flex flex-col gap-y-5"
        >
          {/* Dynamically set the _next value */}
          <input type="hidden" name="_next" value={redirectUrl} />
          {/* FormSubmit config hidden inputs */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="SEO AUDIT LEAD" />
          <input type="hidden" name="_cc" value="lokesh@dgtlmart.com" />

          {/* Form Group for Name: Relative positioning for label animation */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Name
            </label>
          </div>

          {/* Form Group for Phone No */}
          <div className="relative z-0 w-full group">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone No
            </label>
          </div>

          {/* Form Group for Email */}
          <div className="relative z-0 w-full group">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          {/* Submit Button: Blue background, white text, padding, rounded, hover effect */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

// Demo component to show the popup in action
const App = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!isPopupVisible && (
        <button
          onClick={() => setIsPopupVisible(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Popup
        </button>
      )}
      
      {isPopupVisible && (
        <PopupForm setIsPopupVisible={setIsPopupVisible} />
      )}
    </div>
  );
};

export default App;