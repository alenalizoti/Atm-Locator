# ATM Locator

ATM Locator is a web application developed as part of an internship project. The application allows users to easily find the nearest ATMs in Belgrade that support QR code-based cash withdrawal (prestage transactions). It integrates user authentication, a dynamic Google Maps interface, and a secure QR code system to guide users through the entire withdrawal process.

## Features

### Map and ATM Interaction

- Displays all ATMs in Belgrade using Google Maps
- Each ATM is marked with the corresponding bank's logo
- Clicking on an ATM opens a dialog to:
  - Enter the desired withdrawal amount
  - Generate a QR code for the transaction
  - View the route from the user's current location to the selected ATM

### Authentication and User Roles

- Users can log in or continue as guests
- Guest users can only view nearby ATMs
- Registered users have access to a full feature set:
  - Profile page with a profile picture
  - Ability to add up to 3 credit cards
  - One card can be marked as "main" and used for transactions
  - Access to QR code transaction history, with filtering options

### QR Code and Prestage Transactions

- Users generate a QR code valid for 1 hour
- Route to the selected ATM is shown
- At the ATM:
  - The user scans the QR code
  - A random number appears on the ATM screen
  - The user's phone displays three numbers; the correct one must be selected
- If the number is selected correctly, the transaction is completed successfully

### Filtering and Sorting

- Filter ATM locations by:
  - Number of nearest ATMs (5, 10, 20, etc.)
  - Bank name
  - Street or well-known landmarks
- Filter QR code history by:
  - Active
  - Expired
  - Used

## Technologies Used

- Frontend: Angular
- Backend: Node.js
- Database: MySQL
- Maps Integration: Google Maps API
- Cloud Hosting: Google Cloud Platform (GCP)
- ATM Simulator: Java (third-party system)

## Future Improvements

- Notifications before QR code expiration
- Offline map access
- Multi-language support

