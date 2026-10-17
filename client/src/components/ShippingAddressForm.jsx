import React, { useState } from "react";
import { EMPTY_ADDRESS, normalizeAddress } from "../contexts/AuthContext";
import "./ShippingAddressForm.css";

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

const validate = (a) => {
  const errors = {};
  if (!a.fullName.trim()) errors.fullName = "Enter the recipient's full name.";
  if (!a.email.trim()) errors.email = "Enter an email for your order confirmation.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) errors.email = "Enter an email like name@example.com.";
  if (!a.phone.trim()) errors.phone = "Enter a phone number for the courier.";
  else if (!/^(\+27|0)[0-9]{9}$/.test(a.phone.replace(/[\s-]/g, "")))
    errors.phone = "Enter a South African number, e.g. 082 123 4567 or +27 82 123 4567.";
  if (!a.street.trim()) errors.street = "Enter a street address.";
  if (!a.city.trim()) errors.city = "Enter a city or town.";
  if (!a.province) errors.province = "Choose a province.";
  if (!/^\d{4}$/.test(a.postalCode.trim())) errors.postalCode = "Enter a 4-digit postal code.";
  return errors;
};

const ShippingAddressForm = ({ onSave, initialAddress = null, isLoading = false, submitLabel = "Continue to payment" }) => {
  const [form, setForm] = useState(() => ({ ...EMPTY_ADDRESS, ...normalizeAddress(initialAddress || {}) }));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`addr-${firstInvalid}`)?.focus();
      return;
    }
    onSave(normalizeAddress(form));
  };

  const field = (name, label, props = {}) => (
    <div className={`field ${props.wide ? "field-wide" : ""}`}>
      <label htmlFor={`addr-${name}`}>{label}</label>
      <input
        id={`addr-${name}`}
        name={name}
        value={form[name]}
        onChange={handleChange}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `addr-${name}-error` : undefined}
        {...props.input}
      />
      {errors[name] && (
        <span id={`addr-${name}-error`} className="field-error">
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <div className="address-grid">
        {field("fullName", "Full name", { wide: true, input: { autoComplete: "name" } })}
        {field("email", "Email", { input: { type: "email", autoComplete: "email" } })}
        {field("phone", "Phone", { input: { type: "tel", autoComplete: "tel", placeholder: "082 123 4567" } })}
        {field("street", "Street address", {
          wide: true,
          input: { autoComplete: "street-address", placeholder: "12 Main Road, Unit 4" },
        })}
        {field("city", "City or town", { input: { autoComplete: "address-level2" } })}

        <div className="field">
          <label htmlFor="addr-province">Province</label>
          <select
            id="addr-province"
            name="province"
            value={form.province}
            onChange={handleChange}
            aria-invalid={!!errors.province}
            aria-describedby={errors.province ? "addr-province-error" : undefined}
            autoComplete="address-level1"
          >
            <option value="">Choose a province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.province && (
            <span id="addr-province-error" className="field-error">
              {errors.province}
            </span>
          )}
        </div>

        {field("postalCode", "Postal code", {
          input: { inputMode: "numeric", autoComplete: "postal-code", maxLength: 4 },
        })}

        <div className="field">
          <label htmlFor="addr-country">Country</label>
          <input id="addr-country" value="South Africa" readOnly className="readonly" />
        </div>
      </div>

      <button type="submit" className="btn btn-primary address-submit" disabled={isLoading}>
        {isLoading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
};

export default ShippingAddressForm;
