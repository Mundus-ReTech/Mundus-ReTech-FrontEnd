// import {CheckoutProvider} from '@stripe/react-stripe-js/checkout';
// import {loadStripe} from '@stripe/stripe-js';

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe('pk_test_51SmSdr0cAuXhMQh8qU1jmS47ep4q9NXaNmPLFDkQmdef5Kwoe4kFFWo5zb1Z3a1tLGzMELAB12XRSKa2aOdPRGIe00ArRBfeD3');

// export default function App() {
//   const promise = useMemo(() => {
//     return fetch('/create-checkout-session', {
//       method: 'POST',
//     })
//       .then((res) => res.json())
//       .then((data) => data.clientSecret);
//   }, []);

//   return (
//     <CheckoutProvider stripe={stripePromise} options={{clientSecret: promise}}>
//       <CheckoutForm />
//     </CheckoutProvider>
//   );
// }
