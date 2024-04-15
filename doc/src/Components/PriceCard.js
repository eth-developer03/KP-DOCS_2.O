import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './Price.css';
import Navbar from './Navbar';
import Footer from './Footer';
const CustomPricingCard = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const pricingPackages = [
    {
      title: 'Basic',
      monthlyCost: 0,
      annualCost: 0,
      description: 'Get started with essential word document services',
      features: [
        'Unlimited Word Documents',
        'Basic Formatting Assistance',
        'Access to Basic Templates',
      ],
      icon: '/src/assets/green-dot.png',
    },
    {
      title: 'Professional',
      monthlyCost: 20,
      annualCost: 399,
      description: 'Unlock advanced features for professional document editing',
      features: [
        'All Basic Features Included',
        'Advanced Formatting Assistance',
        'Access to Professional Templates',
        'Priority Customer Support',
      ],
      icon: '/src/assets/green-dot.png',
    },
    {
      title: 'Enterprise',
      monthlyCost: 80,
      annualCost: 599,
      description:
        'For businesses and teams requiring comprehensive document solutions',
      features: [
        'All Professional Features Included',
        'Team Collaboration Tools',
        'Custom Branding Options',
        'Advanced Security Features',
        'Monthly Training Workshops',
      ],
      icon: '/src/assets/green-dot.png',
    },
  ];

  const handleBackend = async (cost) => {
    try {
      const resp = await fetch('http://localhost:3001/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cost }),
      });
      const data = await resp.json();
      window.location.href = data.approval_url;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="py-8 md:px-14 p-4 max-w-screen-2xl mx-auto all">
        <div className="text-center">
          <h2 className="md:text-5xl text-2xl font-extrabold mb-4">PRICING </h2>
          <h3 className="text-tertiary md:w-1/3 mx-auto">
            Unlocking Value: Our Flexible Pricing Options Tailored to Your Needs
          </h3>
          <div className="my-6">
            <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
              <div className="font-bold text-2xl text-white">Monthly</div>

              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isAnnual}
                  onChange={() => setIsAnnual(!isAnnual)}
                />
                <div class="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-12  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39]   peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-10 after:w-10 after:top-1 after:left-1   peer-checked:after:translate-x-12 peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900"></div>
              </label>
              <div className="font-bold text-2xl text-white">Annual</div>
            </div>
          </div>
        </div>
        <div className="flex justify-around flex-wrap md:flex-row md:flex-wrap lg:flex-wrap">
          {pricingPackages.map((packageItem, index) => (
            <div
              key={index}
              className="border border-gray-300 h-full rounded-lg p-8 w-full md:w-80 lg:w-80 mb-8 md:mb-8 shadow-3xl cart"
            >
              <h3 className="text-3xl font-bold text-center text-gray-200">
                {packageItem.title}
              </h3>
              <h3 className="text-tertiary text-center my-6">
                {packageItem.description}
              </h3>
              <p className="text-center text-secondary text-4xl font-bold">
                {isAnnual
                  ? `$${packageItem.annualCost}`
                  : `$${packageItem.monthlyCost}`}
                <span className="text-base text-tertiary font-medium">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </p>
              <ul className="mt-4 space-y-2 px-4">
                {packageItem.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <FontAwesomeIcon
                      icon={faFolderOpen}
                      className="mr-2 text-xl"
                    />
                    <p className="text-white">{feature}</p>
                  </li>
                ))}
              </ul>
              <div className="w-full mx-auto flex items-center justify-center mt-2">
                {packageItem.title === 'Basic' &&
                  (isAnnual ? (
                    <button
                      className="mt-6 px-10 text-secondary py-3 border border-secondary hover:bg-secondary font-semibold rounded-lg hover:bg-[#ffffffb1] hover:text-black transition duration-300 "
                      // onClick={() => handleBackend()}
                    >
                      Get Started
                    </button>
                  ) : (
                    <button
                      className="mt-6 px-10 text-secondary py-3 border border-secondary hover:bg-secondary font-semibold rounded-lg hover:bg-[#ffffffb1] hover:text-black transition duration-300 "
                      // onClick={() => handleBackend()}
                    >
                      Get Started
                    </button>
                  ))}
                {packageItem.title === 'Professional' &&
                  (isAnnual ? (
                    <button
                      className="mt-6 px-10 text-secondary py-3 border border-secondary hover:bg-secondary font-semibold rounded-lg hover:bg-[#ffffffb1] hover:text-black transition duration-300 "
                      onClick={() => handleBackend(packageItem.annualCost)}
                    >
                      Get Started
                    </button>
                  ) : (
                    <button
                      className="mt-6 px-10 text-secondary py-3 border border-secondary hover:bg-secondary font-semibold rounded-lg hover:bg-[#ffffffb1] hover:text-black transition duration-300 "
                      onClick={() => handleBackend(packageItem.monthlyCost)}
                    >
                      Get Started
                    </button>
                  ))}

                {packageItem.title === 'Enterprise' &&
                  (isAnnual ? (
                    <button
                      className="mt-6 px-10 text-secondary py-3 border border-secondary hover:bg-secondary font-semibold rounded-lg hover:bg-[#ffffffb1] hover:text-black transition duration-300 "
                      onClick={() => handleBackend(packageItem.annualCost)}
                    >
                      Get Started
                    </button>
                  ) : (
                    <button
                      className="mt-6 px-10 text-secondary py-3 border border-secondary hover:bg-secondary font-semibold rounded-lg hover:bg-[#ffffffb1] hover:text-black transition duration-300 "
                      onClick={() => handleBackend(packageItem.monthlyCost)}
                    >
                      Get Started
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomPricingCard;
