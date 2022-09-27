// Firebase setup

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    // getDocs,
    // collection,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// https://firebase.google.com/docs/reference/js/firebase.User

const firebaseConfig = {
    apiKey: "AIzaSyBhg-YldrsCAlOL9KXNCFigbqtVwwSfcQs",
    authDomain: "login-signup-32685.firebaseapp.com",
    projectId: "login-signup-32685",
    storageBucket: "login-signup-32685.appspot.com",
    messagingSenderId: "555925899892",
    appId: "1:555925899892:web:a806a24a7eda9d02521f21",
    measurementId: "G-JLN1WKMN14"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.onload = onAuthStateChanged(auth, (user) => {
    if (user) {
        location = "main/index.html";
    }
});

const db = getFirestore(app);

// Changing theme of the Page


const change_theme = document.getElementById("change_theme");
let flag = false; //To check toggle the properties to change theme  
let dom = document.documentElement; // getting the complete html element
change_theme.addEventListener("click", e => {
    flag = !flag;
    if (flag === true) {
        dom.style.setProperty("--color", "#2d3436");
        dom.style.setProperty("--background_color", "#dfe6e9");
    } else {
        dom.style.setProperty("--color", "#dfe6e9");
        dom.style.setProperty("--background_color", "#2d3436");
    }
})

// Making the password hidden or seen

const eye = document.querySelector(".id_password_input div div");

eye.addEventListener("click", () => {
    let [eye_opened, eye_closed] = [document.getElementsByClassName("eye")[0], document.getElementsByClassName("eye")[1]];
    eye_closed.classList.toggle("hidden");
    eye_opened.classList.toggle("hidden");
    eye_closed.classList.contains("hidden") ? password.setAttribute("type", "password") : password.setAttribute("type", "text");
})

// When click on login button this function will check email & password is correct or not through regex

let [email, password] = [document.getElementById("email"), document.getElementById("password")];
const login_btn = document.querySelector("#login_btn button");
let loader = document.getElementsByClassName("loader"), inputs = document.getElementsByClassName("inputs");
login_btn.onclick = e => {

    e.preventDefault();

    const regex_arr = [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, /^(?=.*\d{1})(?=.*[a-z]{1})(?=.*[A-Z]{1})(?=.*[!@#$%^&*{|}?~_=+.-]{1})(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/];
    const input_arr = [email, password];

    if (!regex_arr[0].test(input_arr[0].value)) {
        swal("Email is Incorrect ", "Your given email not found.", "error");
    } else if (!regex_arr[1].test(input_arr[1].value)) {
        swal("Password is Incorrect ", "Your given password not found.", "error");
    } else {
        // Will redirect to other page
        loader[0].classList.toggle("hidden");
        inputs[0].classList.toggle("hidden");

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
                location = "main/index.html";
            })
            .catch((error) => {
                loader[0].classList.toggle("hidden");
                inputs[0].classList.toggle("hidden");

                if (error.message === "Firebase: Error (auth/user-not-found).") {
                    swal("User not found", "", "error")
                    email.value = "";
                    password.value = "";
                } else if (error.message === "Firebase: Error (auth/wrong-password).") {
                    swal("Wrong Password", "", "error")
                    password.value = "";
                }
                ;

            });
    }

};

// When click on back or next button this function will check current user information is correct or not through regex

const back_btn = document.querySelector("#back_btn button"), next_btn = document.querySelector("#next_btn button"), submit_btn = document.querySelector("#submit_btn"), sliding_div = document.querySelector(".sliding_div");
let left = 0;
back_btn.onclick = e => {
    e.preventDefault();
    left = left + 100;
    sliding_div.style.left = left + "%";
    back_btn.classList.add("hidden");
    next_btn.classList.remove("hidden");
    submit_btn.classList.add("hidden");
}

let [signup_fname, signup_lname, signup_email, signup_password, signup_confirm_password, signup_number, signup_cnic_number] = [document.getElementById("signup_fname"), document.getElementById("signup_lname"), document.getElementById("signup_email"), document.getElementById("signup_password"), document.getElementById("signup_confirm_password"), document.getElementById("signup_number"), document.getElementById("signup_cnic_number")];
const [regex_name, regex_email, regex_password, regex_number, regex_cnic] = [/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, /^(?=.*\d{1})(?=.*[a-z]{1})(?=.*[A-Z]{1})(?=.*[!@#$%^&*{|}?~_=+.-]{1})(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/, /^03\d{9}$/, /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/]
const input_arr = [signup_fname, signup_lname, signup_email, signup_password, signup_number, signup_cnic_number];
next_btn.onclick = e => {
    e.preventDefault();

    if (!regex_name.test(input_arr[0].value)) {
        swal("First Name is Incorrect ", "", "error");
        input_arr[0].focus();
    } else if (!regex_name.test(input_arr[1].value)) {
        swal("Last Name is Incorrect ", "", "error");
        input_arr[1].focus();
    } else if (!regex_email.test(input_arr[2].value)) {
        swal("Email is Incorrect ", "", "error");
        input_arr[2].focus();
    } else if (!regex_password.test(input_arr[3].value)) {
        swal("Password must contain atleast 6 characters with (a,A,1,@) ", "", "error");
        input_arr[3].focus();
    } else if (signup_password.value !== signup_confirm_password.value) {
        swal("Passwords didn't match. ", "", "error");
        signup_confirm_password.focus();
    } else if (!regex_number.test(input_arr[4].value)) {
        left = left - 100;
        sliding_div.style.left = left + "%";
        back_btn.classList.remove("hidden");
        submit_btn.classList.remove("hidden");
        next_btn.classList.add("hidden");
    }
    else {
        left = left - 100;
        sliding_div.style.left = left + "%";
        back_btn.classList.remove("hidden");
        submit_btn.classList.remove("hidden");
        next_btn.classList.add("hidden");
    }
};

// Submitting the signup data of user into Firebase

submit_btn.onclick = e => {
    e.preventDefault();

    if (!regex_number.test(input_arr[4].value)) {
        swal("Phone Number is Incorrect", "", "error");
        input_arr[4].focus();
    } else if (!regex_cnic.test(input_arr[5].value)) {
        swal("CNIC Number is Incorrect", "", "error");
        input_arr[5].focus();
    } else {
        loader[1].classList.toggle("hidden");
        inputs[1].classList.toggle("hidden");
        createUserWithEmailAndPassword(auth, signup_email.value, signup_password.value)
            .then(async (userCredential) => {

                // Database Work here

                const uid = userCredential.user.uid;

                await setDoc(doc(db, "users", uid), { //Sending data throungh user uid in the collection named users
                    name: `${signup_fname.value} ${signup_lname.value}`,
                    email: signup_email.value,
                    password: signup_password.value,
                    phone_number: signup_number.value,
                    cnic_number: signup_cnic_number.value,
                    uid: uid,
                });
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                    });
                location.reload();
            })
            .catch((error) => {
                swal("The entered email is already in use", "", "error");
                loader[1].classList.toggle("hidden");
                inputs[1].classList.toggle("hidden");
                signup_email.value = "";
                signup_email.focus();
                left = left + 100;
                sliding_div.style.left = left + "%";
                back_btn.classList.add("hidden");
                next_btn.classList.remove("hidden");
                submit_btn.classList.add("hidden");
            });
    }
};

//Toggle divs from login page to signup page 

const create_account = document.querySelector("#login_btn p");
create_account.onclick = () => {
    document.getElementById("main_login").classList.toggle("hidden");
    document.getElementById("main_signup").classList.toggle("hidden");
}
const login_instead = document.querySelector("#signup_btn p");
login_instead.onclick = () => {
    document.getElementById("main_login").classList.toggle("hidden");
    document.getElementById("main_signup").classList.toggle("hidden");
}


        // Signout method

        // signOut(auth).then(() => {
        //     // Sign-out successful.
        //   }).catch((error) => {
        //     // An error happened.
        //   });