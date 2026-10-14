# IWI.golf — It Went In!™

A full-stack custom web application for **IWI Enterprises**, a specialized 3D printing and modeling business that celebrates unforgettable golf moments.

## About the Business

When a golfer hits a hole-in-one — an achievement most golfers never experience, and those who do rarely repeat — **IWI Enterprises** immortalizes the moment in a custom, full-color 3D printed model. 

Using survey-grade LiDAR and elevation data of the golf course, IWI recreates the exact contours, slopes, green stepped terrain, surrounding fringe, sand bunkers, and water hazards of the specific hole where the shot was made. Each piece is custom printed with in-house crafted elements (flags, rakes, tees, frames, and plaques) and personalized with the golfer's name, course, hole, yardage, club used, ace date, and custom pin/flag location.

## Website Features

- **Dynamic Showcase & Story**: Introduces the "One swing. One bounce. It Went In!" experience, the manufacturing and design process, and a continuous multi-item carousel gallery of completed models.
- **Custom Celebration Builder**: An interactive multi-step ordering flow where customers select their course and hole, choose the date, club, and yardage, and pin their flag location interactively on a live green diagram.
- **Dynamic Pricing & Shipping Rules**: Per-course pricing and localized shipping/pickup logic (e.g., local pickup options vs. standard shipping rates).
- **Custom Request Inquiries**: Automatic contact routing for custom / unlisted courses allowing customers to submit hole inquiries for custom modeling lead times.
- **Integrated Stripe Checkout**: Embedded Stripe Payment Element supporting Credit/Debit Cards, Apple Pay, Google Pay, and custom promo codes.
- **Automated Notifications & Receipts**: Microsoft Graph API integration sends full order summaries and customer receipts instantly upon order completion.
- **Production Gate**: Lightweight password authentication gate for access management prior to public release.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, CSS modules/BEM styling.
- **Backend**: Node.js, Express, Stripe API, Microsoft Graph API.
- **Deployment**: Nginx reverse proxy, PM2 process management on Ubuntu (DigitalOcean).
