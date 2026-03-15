import {loadStripe} from '@stripe/stripe-js';
import React, {useCallback, useState, useEffect} from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

  const stripePromise = loadStripe("pk_test_51SmSdr0cAuXhMQh8qU1jmS47ep4q9NXaNmPLFDkQmdef5Kwoe4kFFWo5zb1Z3a1tLGzMELAB12XRSKa2aOdPRGIe00ArRBfeD3");

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`http://localhost:8080/v1/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }

  return null;
}

export default Return;