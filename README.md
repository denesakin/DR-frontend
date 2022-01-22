# frontend

### Home screen
This is the first screen users see when they enter the website. 
It contains a short description of the website and what users can do
with it. There are two ways a user can find a clinic to book a meeting. If they already know the name of the clinic they would like to book a meeting from, they can search for the clinic using the search bar located in the navigation bar. If the user does not know which clinic they would prefer, they can navigate to the map screen where they can use the map to find where clinics are located in Gothenburg.


### Map screen
This screen contains a google map view of Gothenburg and allows the user to see where the system's clinics exist. After pressing on a clinic marker the user is displayed with basic clinic information and able to enter the associated clinic screen. In the directions form on the top left the user is able to retrieve directions on how to transport to a selected clinic.

### Clinic screen
The specific clinic screen information changes based on the http route parameters. For example, upon pressing the Your Dentist marker button on the map the user is presented with the associated clinic screen and the screen information is updated accordingly. Within the clinic screen the user is able to view the available bookings, confirm bookings, view opening hours and receive directions to the associated clinic.
