import React, { useState } from 'react';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Integrate signup API
    console.log('Signup', form);
    alert('Account created (demo)');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins mb-6">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-poppins mb-2">Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-poppins mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-poppins mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-poppins mb-2">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6CA9F5] focus:border-transparent font-poppins"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-[#6CA9F5] text-white py-2.5 rounded-lg font-poppins hover:opacity-90 transition-opacity">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;


