"use client";
import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "Is ReplyAstra safe for my Instagram account?",
      answer:
        "Absolutely. We use the official Meta API, which is the approved way to automate messages. Unlike 'bots' that use unauthorized scripts, we follow Instagram's guidelines to keep your account 100% safe.",
    },
    {
      question: "Do I need to share my Instagram password?",
      answer:
        "No. You never share your password with us. You connect your account through Facebook/Meta's secure authentication window, ensuring your credentials stay private.",
    },
    {
      question: "Can I automate replies to comments too?",
      answer:
        "Yes! With all our plans—including the Free plan—you can set up automation that detects specific keywords in comments and sends an instant DM or a public reply.",
    },
    {
      question: "What is the 'Ask to Follow' automation?",
      answer:
        "This feature checks if someone messaging you is already a follower. If they aren't, the AI gently encourages them to follow your page before delivering the requested link or info.",
    },
    {
      question: "Is there a limit to how many DMs I can send?",
      answer:
        "While ReplyAstra is unlimited, Instagram has its own rate limits based on account health. We intelligently pace messages to ensure you stay within official boundaries.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can visit our dedicated Support page to send us a message anytime. We provide direct email support for all users, with priority response times for Pro subscribers.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="pt-28 pb-16 px-6 bg-[#f0fdfa]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-gray-600">
          Everything you need to know about ReplyAstra.
        </p>

        <div className="mt-12 space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isActive
                    ? "border-emerald-400 bg-white shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-900 px-6 py-5"
                >
                  <span>{faq.question}</span>
                  <span className={`ml-4 shrink-0 transition-transform duration-300 ${isActive ? "rotate-180" : "rotate-0"}`}>
                    {isActive ? (
                      <Minus className="text-emerald-600" />
                    ) : (
                      <Plus className="text-gray-500" />
                    )}
                  </span>
                </button>

                {/* Smooth slide animation using max-height trick */}
                <div
                  className="transition-all duration-500 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isActive ? "300px" : "0px",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
