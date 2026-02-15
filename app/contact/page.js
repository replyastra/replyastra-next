"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Minus, Send } from "lucide-react";

const faqs = [
  {
    q: "Does ReplyAstra work 24/7?",
    a: "Yes. ReplyAstra runs continuously on secure cloud infrastructure, responding to messages even when you're offline."
  },
  {
    q: "Is my data encrypted and secure?",
    a: "Absolutely. All data is encrypted in transit and at rest. We never store Instagram passwords or sensitive login credentials."
  },
  {
    q: "What happens if Instagram changes its API rules?",
    a: "ReplyAstra closely monitors Meta API updates and adapts automatically without affecting your automations."
  },
  {
    q: "Can I disconnect ReplyAstra anytime?",
    a: "Yes. You can disconnect instantly from your dashboard or Meta Business settings."
  },
  {
    q: "Does ReplyAstra support multiple Instagram accounts?",
    a: "Yes. Depending on your plan, you can manage multiple Instagram accounts from one dashboard."
  },
];

export default function SupportPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const { error } = await supabase.from("support_tickets").insert([form]);

    if (error) {
      setStatus("Something went wrong. Try again.");
    } else {
      setStatus("Message sent successfully ✅");
      setForm({ name: "", email: "", topic: "", message: "" });
    }
  };

  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
          SUPPORT
        </span>
        <h1 className="text-5xl font-black text-gray-900">
          How can we <span className="text-emerald-600">help?</span>
        </h1>
        <p className="mt-4 text-gray-600 font-medium">
          Our team is here to ensure your automation journey is seamless.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* CONTACT FORM */}
        <div className="bg-white rounded-3xl p-10 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Open a Ticket</h2>
          <p className="text-gray-600 mb-8">
            Facing a technical or billing issue? Send us a message.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className="w-full p-4 rounded-xl bg-gray-100 outline-none"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="w-full p-4 rounded-xl bg-gray-100 outline-none"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <select
              className="w-full p-4 rounded-xl bg-gray-100 outline-none"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              required
            >
              <option value="">Select a topic</option>
              <option>Technical Support</option>
              <option>Billing & Subscription</option>
              <option>Feature Request</option>
              <option>Other</option>
            </select>

            <textarea
              className="w-full p-4 rounded-xl bg-gray-100 outline-none h-32"
              placeholder="Explain how we can help..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2"
            >
              <Send size={18} /> Send Message
            </button>

            {status && (
              <p className="text-center text-sm text-gray-600 mt-3">
                {status}
              </p>
            )}
          </form>
        </div>

        {/* TECHNICAL FAQ */}
        <div>
          <span className="inline-block mb-3 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl font-black mb-8">Technical FAQ</h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
                  openFAQ === i ? "border-emerald-400 shadow-md" : "border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex justify-between items-center text-left font-bold px-6 py-5"
                >
                  <span>{faq.q}</span>
                  <span className={`ml-4 shrink-0 transition-transform duration-300 ${openFAQ === i ? "rotate-180" : "rotate-0"}`}>
                    {openFAQ === i ? (
                      <Minus className="text-emerald-600" />
                    ) : (
                      <Plus className="text-gray-400" />
                    )}
                  </span>
                </button>

                {/* Smooth slide animation */}
                <div
                  className="transition-all duration-500 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: openFAQ === i ? "300px" : "0px",
                    opacity: openFAQ === i ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-5 text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
