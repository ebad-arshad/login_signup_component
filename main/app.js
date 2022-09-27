import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    collection,
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

window.onload = onAuthStateChanged(auth, async (user) => {
    if (!user) {
        location = "../index.html"
    } else {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const details = document.getElementsByClassName("details");
        if (docSnap.exists()) {
            details[0].innerHTML = docSnap.data().name;
            details[1].innerHTML = docSnap.data().password;
            details[2].innerHTML = docSnap.data().email;
            details[3].innerHTML = docSnap.data().phone_number;
            details[4].innerHTML = docSnap.data().cnic_number;
            details[5].innerHTML = docSnap.data().uid;
        } else {
            // doc.data() will be undefined in this case
        }
        if (!user.emailVerified) {
            document.getElementsByClassName("main")[0].classList.add("hidden");
            document.getElementsByClassName("verification")[0].classList.remove("hidden");
        }
        // getting_hidden_div.classList.remove("hidden");
    }
});

const db = getFirestore(app);

const querySnapshot = await getDocs(collection(db, "users"));
const cards = document.querySelector(".add_friends .cards");

querySnapshot.forEach((doc) => {
    if (doc.data().uid !== auth.currentUser.uid) {
        const btn_value = doc.data().req_send && "Request Sent" || `<i class="fa-solid fa-user-plus"></i>`;
        cards.innerHTML += `
            <div class="card" id="${doc.data().uid}">
                <p> Name :<br /> ${doc.data().name}</p>
                <p> Email :<br /> ${doc.data().email}</p>
                <p> Phone Number :<br /> ${doc.data().phone_number}</p>
                <button class="add_friend_btn" >${btn_value}</button>
            </div>
        `
    }
});

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

// Logout Function

const logout_btn = document.getElementById("logout_btn");
logout_btn.onclick = () => {
    signOut(auth).then(() => {
        location = "../index.html";
        // location = "";

    }).catch((error) => {
        // An error happened.
    });
}

// Opening side panel on hamburger click

const ham_burger_icon = document.getElementById("ham_burger_icon");
const col_1 = document.getElementsByClassName("col_1")[0];
const col_2 = document.getElementsByClassName("col_2")[0];
let count = 0;
ham_burger_icon.onclick = () => {

    if (count === 0) {
        col_1.style.width = "0%";
        col_2.style.width = "100%";
        count = 1;
    } else if (count === 1) {
        col_1.style.width = "25%";
        col_2.style.width = "75%";
        count = 0;
    }



}

// Changing Tabs from panel

const [profile_func, your_friends_func, add_friends_func, friend_req_func, message_func, setting_func] = [document.getElementById("profile_func"), document.getElementById("your_friends_func"), document.getElementById("add_friends_func"), document.getElementById("friend_req_func"), document.getElementById("message_func"), document.getElementById("setting_func")];
const panel_list = document.getElementsByClassName("panel_list");

const changing_tabs = e => {
    for (let i = 0; i < panel_list.length; i++) {
        panel_list[i].classList.add("hidden");
    }
    for (let j = 0; j < event.target.parentNode.children.length; j++) {
        event.target.parentNode.children[j].style.background = "var(--color)";
        event.target.parentNode.children[j].style.color = "var(--background_color)";
    }

    panel_list[e].classList.remove("hidden");
    event.target.style.background = "var(--background_color)";
    event.target.style.color = "var(--color)";
}
profile_func.onclick = () => changing_tabs(0);
your_friends_func.onclick = () => changing_tabs(1);
add_friends_func.onclick = () => changing_tabs(2);
friend_req_func.onclick = () => changing_tabs(3);
message_func.onclick = () => changing_tabs(4);
setting_func.onclick = () => changing_tabs(5);



// Friend Request sending logic

const add_friend_btn = document.getElementsByClassName("add_friend_btn");
for (let i = 0; i < add_friend_btn.length; i++) {
    add_friend_btn[i].onclick = (e) => add_friend(e);
}

const add_friend = async (e) => {
    e.target.innerHTML = "Request Sent";
    console.log(e.target.parentNode.id);
    const updateRef = doc(db, "users", e.target.parentNode.id);

    await updateDoc(updateRef, {
        req_send: true,
        req_sender: auth.currentUser.uid,
    });
}

// Friend Request getting logic

const friend_req = document.querySelector(".friend_req .cards");

querySnapshot.forEach(async (document) => {
    if (document.data().uid === auth.currentUser.uid && document.data().req_sender) {
        const req_sender_uid = document.data().req_sender;
        const req_documentRef = doc(db, "users", req_sender_uid);
        const req_documentSnap = await getDoc(req_documentRef);
        if (req_documentSnap.exists()) {
            friend_req.innerHTML += `
            <div class="card">
                <p> Name :<br /> ${req_documentSnap.data().name}</p>
                <p> Email :<br /> ${req_documentSnap.data().email}</p>
                <p> Phone Number :<br /> ${req_documentSnap.data().phone_number}</p>
                <div class="add_remove_btn">
                    <button><i class="fa-solid fa-check"></i></button>
                    <button><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
        `
        }
    }
});

// Friend Request Accepting or Canceling logic











