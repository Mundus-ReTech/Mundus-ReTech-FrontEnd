import {loadStripe} from '@stripe/stripe-js';
import React, {useCallback, useState, useEffect} from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

  const stripePromise = loadStripe("pk_live_51SmSdr0cAuXhMQh8sFCyWzss46AxlnrYhgHhVVDhqKNbZR1jkdkOxUGNKss8GKtCX2AKDdgwoM79C3p5DGHb0Zln00vYZOfw3m");

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("http://localhost:8080/v1/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const [clientsecret, setClientSecret] = useState("");

  useEffect(() => {
    fetchClientSecret().then(setClientSecret);
  }, [fetchClientSecret]);  
  const options = {clientSecret:clientsecret};


  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}


export default CheckoutForm;