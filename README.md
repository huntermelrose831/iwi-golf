# IWI.golf

**It Went In.** IWI Enterprises turns a golfer's hole-in-one into a 3D printed keepsake:
a model of the green and its slopes, the surrounding fringe, bunkers, water, and the pin
location — personalized with the course name, hole number, golfer, date, yardage, and
club used.

This repo is the IWI.golf marketing site and ordering flow:

- A landing page telling the "one swing, one bounce, it went in" story, how the models are
  made, and a gallery of completed pieces.
- A multi-step order wizard: golfer picks their course/hole details and flag placement,
  enters shipping/contact info, then pays.
- Checkout is Stripe's Payment Element embedded directly on the site (no redirect to a
  Stripe-hosted page), supporting card, Apple Pay, and Google Pay.

## Stack

- **Client**: React + TypeScript (Vite). Components are grouped in their own folder with a
  co-located CSS file, using BEM-style class names scoped to that component.
- **Server**: Node/Express API that creates Stripe PaymentIntents — keeps the Stripe secret
  key off the client and validates/sanitizes order data before it reaches Stripe.





