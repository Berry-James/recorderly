// Imports
import { App } from './../components/App.js';
import { User } from '../components/User.js';
import { Release } from '../components/Release.js';

function userProfileController(){
    let data = {
        firstName: User.firstName,
        lastName: User.lastName,
        email: User.email,
        vehicle: User.vehicle,
        vehicleImg: User.vehicleImg,

    }
    let vehicleImg = User.vehicleImg;
   
    App.loadPage('User Profile', 'template-page-user-profile', data, () => {
    });
}

export { userProfileController }