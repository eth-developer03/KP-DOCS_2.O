import React, { useRef, useState } from 'react';
import {
  FileText,
  Mail,
  User,
  Lock,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import Navbar from './Navbar';
import Footer from './Footer';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.userId,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        localStorage.setItem('Refreshtoken', data.RefreshToken);
        localStorage.setItem('Accesstoken', data.Token);
        navigate(`/documents/${uuidV4()}`);
      } else {
        throw new Error('Sign-up failed');
      }
    } catch (error) {
      setErrors({ submit: 'Sign-up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-blue-100" htmlFor={props.id}>
        {props.label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
        <input
          {...props}
          className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          onChange={handleChange}
          value={formData[props.name]}
        />
        {errors[props.name] && (
          <span className="text-red-400 text-xs mt-1 absolute -bottom-5 left-0">
            {errors[props.name]}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {/* Left side - Branding */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
                <div className="inline-block p-4 bg-blue-500/20 rounded-2xl backdrop-blur-sm">
                  <FileText className="w-12 h-12 text-blue-400" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  Welcome to KP-DOCS
                </h1>
                <p className="text-xl text-blue-200">
                  Create, collaborate, and share documents seamlessly.
                </p>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 max-w-md">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Create your account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputField
                    icon={User}
                    id="userId"
                    name="userId"
                    type="number"
                    label="User ID"
                    placeholder="Enter your user ID"
                  />

                  <InputField
                    icon={User}
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Choose a username"
                  />

                  <InputField
                    icon={Mail}
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                  />

                  <InputField
                    icon={Lock}
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Create a password"
                  />

                  {errors.submit && (
                    <div className="text-red-400 text-sm text-center">
                      {errors.submit}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-blue-200">
                    Already have an account?{' '}
                    <a
                      href="/login"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Log In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
///////\
