"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";

type FormState = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  collStreet: string;
  collSuburb: string;
  collState: string;
  collPostcode: string;
  delStreet: string;
  delSuburb: string;
  delState: string;
  delPostcode: string;
  forklift: "" | "yes" | "no" | "unsure";
  notes: string;
  website: string; // honeypot
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  companyName: "",
  collStreet: "",
  collSuburb: "",
  collState: "",
  collPostcode: "",
  delStreet: "",
  delSuburb: "",
  delState: "",
  delPostcode: "",
  forklift: "",
  notes: "",
  website: "",
};

const inputClasses =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

const labelClasses = "mb-1 block text-sm text-gray-700";

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-4 text-xs font-bold tracking-wide text-gray-900">
      {children}
    </h2>
  );
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string[]>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setErrorMessage("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? {});
        setErrorMessage("Please fix the highlighted fields and try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialState);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Quote request sent
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Thanks — we&apos;ll be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      {/* Honeypot field, hidden from real users */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <SectionHeading>PERSONAL &amp; COMPANY INFORMATION</SectionHeading>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClasses}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>
          )}
        </div>
        <div>
          <label className={labelClasses} htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+61 XXXXXXXXX"
            className={inputClasses}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone[0]}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClasses} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@gmail.com"
          className={inputClasses}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>
        )}
      </div>

      <div className="mb-6">
        <label className={labelClasses} htmlFor="companyName">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="companyName"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Your company name"
          className={inputClasses}
        />
        {errors.companyName && (
          <p className="mt-1 text-xs text-red-600">{errors.companyName[0]}</p>
        )}
      </div>

      <SectionHeading>COLLECTION ADDRESS</SectionHeading>
      <div className="mb-4">
        <label className={labelClasses} htmlFor="collStreet">
          Street Address
        </label>
        <input
          id="collStreet"
          name="collStreet"
          value={form.collStreet}
          onChange={handleChange}
          placeholder="123 Main Street"
          className={inputClasses}
        />
        {errors.collStreet && (
          <p className="mt-1 text-xs text-red-600">{errors.collStreet[0]}</p>
        )}
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className={labelClasses} htmlFor="collSuburb">
            Suburb/City
          </label>
          <input
            id="collSuburb"
            name="collSuburb"
            value={form.collSuburb}
            onChange={handleChange}
            placeholder="Your suburb or city"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="collState">
            State
          </label>
          <input
            id="collState"
            name="collState"
            value={form.collState}
            onChange={handleChange}
            placeholder="State"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="collPostcode">
            Postal Code
          </label>
          <input
            id="collPostcode"
            name="collPostcode"
            value={form.collPostcode}
            onChange={handleChange}
            placeholder="XXXX"
            className={inputClasses}
          />
        </div>
      </div>
      {(errors.collSuburb || errors.collState || errors.collPostcode) && (
        <p className="-mt-4 mb-4 text-xs text-red-600">
          {errors.collSuburb?.[0] || errors.collState?.[0] || errors.collPostcode?.[0]}
        </p>
      )}

      <SectionHeading>DELIVERY ADDRESS</SectionHeading>
      <div className="mb-4">
        <label className={labelClasses} htmlFor="delStreet">
          Street Address
        </label>
        <input
          id="delStreet"
          name="delStreet"
          value={form.delStreet}
          onChange={handleChange}
          placeholder="123 Main Street"
          className={inputClasses}
        />
        {errors.delStreet && (
          <p className="mt-1 text-xs text-red-600">{errors.delStreet[0]}</p>
        )}
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className={labelClasses} htmlFor="delSuburb">
            Suburb/City
          </label>
          <input
            id="delSuburb"
            name="delSuburb"
            value={form.delSuburb}
            onChange={handleChange}
            placeholder="Your suburb or city"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="delState">
            State
          </label>
          <input
            id="delState"
            name="delState"
            value={form.delState}
            onChange={handleChange}
            placeholder="State"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="delPostcode">
            Postal Code
          </label>
          <input
            id="delPostcode"
            name="delPostcode"
            value={form.delPostcode}
            onChange={handleChange}
            placeholder="XXXX"
            className={inputClasses}
          />
        </div>
      </div>
      {(errors.delSuburb || errors.delState || errors.delPostcode) && (
        <p className="-mt-4 mb-4 text-xs text-red-600">
          {errors.delSuburb?.[0] || errors.delState?.[0] || errors.delPostcode?.[0]}
        </p>
      )}

      <div className="mb-6">
        <label className={labelClasses} htmlFor="forklift">
          Is Forklift Required?
        </label>
        <select
          id="forklift"
          name="forklift"
          value={form.forklift}
          onChange={handleChange}
          className={`${inputClasses} bg-white`}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unsure">Unsure</option>
        </select>
        {errors.forklift && (
          <p className="mt-1 text-xs text-red-600">{errors.forklift[0]}</p>
        )}
      </div>

      <div className="mb-6">
        <label className={labelClasses} htmlFor="notes">
          Additional Information (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Any additional details about your shipment"
          rows={3}
          className={inputClasses}
        />
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-slate-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit Quote Request"}
      </button>
    </form>
  );
}
