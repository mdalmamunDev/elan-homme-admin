import { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const PhoneCountryInput = ({ disabled, phoneNumber, setPhoneNumber}) => {

  return (
    <PhoneInput
      disabled={disabled}
      className="custom-phone "
      placeholder="Enter phone number"
      international
      countryCallingCodeEditable={false}
      style={{
        marginTop: "12px",
      }}
      defaultCountry="US"
      value={phoneNumber?.toString()}
      onChange={setPhoneNumber}
    />
  );
};

export default PhoneCountryInput;
