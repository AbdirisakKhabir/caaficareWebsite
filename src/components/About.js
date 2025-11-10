import React from "react";

const About = () => {
  return (
    <section id="about-us" className="bg-white py-12 flex justify-center">
      <div className="bg-[#6CA9F5] max-w-6xl rounded-xl p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Section - Doctor Image */}
        <div className="flex justify-center">
          <img
            src="/hero2.jpg"
            alt="Doctor"
            className="w-[350px] lg:w-[400px] rounded-2xl object-cover"
          />
        </div>

        {/* Right Section - Text */}
        <div className="text-white space-y-4">
          <div>
            <p className="text-sm font-poppins opacity-80">Greetings & Welcome</p>
            <p className="text-base font-semibold font-poppins">
              Dr. Sabina Hussain Joly
            </p>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-poppins leading-snug">
              Book an appointment
            </h2>
            <p className="text-[#6EF789] text-xl font-semibold font-poppins">
              home with one click
            </p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed font-poppins">
            <p>
              Patients often need three fundamental features: the ability to
              book or cancel appointments, the option to obtain prescription
              drugs, and easy access to medical information. All these needs are
              met through Caafi.
            </p>

            <p>
              Now, you can reach our team of qualified doctors with just one
              click from your smartphone or computer, 24/7. Caafi is the only
              mobile healthcare app easily accessible to all users, offering a
              hotline, customer service, assistance for reservations, and
              doorstep medication delivery.
            </p>

            <p>
              Simply download the app, register, select a doctor, and make the
              payment to book your preferred time slot for a video consultation.
              Afterward, receive an e-prescription or order medicines and lab
              tests directly within the app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
