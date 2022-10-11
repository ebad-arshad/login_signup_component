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
    addDoc,
    updateDoc,
    query,
    where,
    collection,
    onSnapshot,
    orderBy,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

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
const db = getFirestore(app);
const loader = document.getElementsByClassName("loader")[0];
const container = document.getElementsByClassName("container")[0];

const user_data = document.getElementsByClassName("user_data")[0];
const search = document.getElementsByClassName("search")[0];
window.onload = onAuthStateChanged(auth, async (user) => {
    if (!user) {
        location = "../index.html"
    } else {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        user_data.innerHTML = `
        <div class="img_circle_box">
            <img class="img_circle" src="${docSnap.data().profile_image}" alt="">
        </div>
        <p>${docSnap.data().name}</p>
        `
        showing_all_friends(docSnap.data());
        container.classList.remove("hidden");
        loader.classList.add("hidden");
    }
});

// Logout Function

const logout_btn = document.getElementById("logout_btn");
logout_btn.onclick = () => {
    signOut(auth).then(() => {
        location = "../index.html";
    })
}

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

// Opening side panel on hamburger click

const ham_burger_icon = document.querySelectorAll(".ham_burger i");
const col_1 = document.getElementsByClassName("col_1")[0];
const col_2 = document.getElementsByClassName("col_2")[0];
const ul = document.querySelector(".col_1 ul");
let count = 0;
ham_burger_icon[0].addEventListener("click", () => {
    if (count === 0) {
        col_1.style.width = "0%";
        col_2.style.width = "100%";
        user_data.style.display = "none";
        search.style.display = "none";
        ul.style.display = "none";
        count = 1;
    } else if (count === 1) {
        col_1.style.width = "25%";
        col_2.style.width = "75%";
        user_data.style.display = "flex";
        search.style.display = "flex";
        setTimeout(() => {
            ul.style.display = "block";
        }, 100);
        count = 0;
    }
})
ham_burger_icon[1].addEventListener("click", () => {
    col_1.style.left = "0%";
    ul.style.display = "block";
})

// Opening and Closing side panel on small screen

const x_mark = document.getElementsByClassName("fa-xmark")[0];
const x_mark_func = () => {
    col_1.style.left = "-100%";
}
x_mark.addEventListener("click", x_mark_func);

// Changing Tabs from panel

const changing_tabs = () => {
    const panel_list = document.querySelectorAll(".col_1 ul li");
    for (let i = 0; i < panel_list.length; i++) {
        panel_list[i].style.background = "#111b21";
    }
    event.target.style.background = "#1c2930";
    x_mark_func();
}

// Friend Select

let submit_btn = document.getElementById("submit_btn");
let message_input = document.getElementById("message_input");
const friend_select = (friend_data, user_uid) => {
    message_input.value = "";
    submit_btn.removeAttribute("disabled");
    const chat_head = document.getElementsByClassName("chat_head")[0];
    let chat_data = document.getElementsByClassName("chat_data")[0].children[0];
    chat_data.innerHTML = "";
    let chatID;
    chat_head.innerHTML = `
    <div class="user_data">
        <div class="img_circle_box">
            <img class="img_circle" src="${friend_data.profile_image}" alt="">
        </div>
        <p>${friend_data.name}</p>
    </div>
    `;
    if (friend_data.uid < user_uid) {
        chatID = `${friend_data.uid}${user_uid}`;
    } else {
        chatID = `${user_uid}${friend_data.uid}`;
    }
    sessionStorage.setItem("data", JSON.stringify({ user_uid, chatID }));
    load_all_messages();
}

// On Sending Message

submit_btn.addEventListener("click", async () => {
    event.preventDefault();
    let date2 = new Date();
    let hours = date2.getHours() <= 9 ? "0" + date2.getHours() : date2.getHours();
    if (hours > 12) {
        hours = hours >= 22 ? hours - 12 : `0${hours - 12}`;
    }
    else if (hours === "00") {
        hours = "12";
    }
    let minutes = date2.getMinutes() <= 9 ? "0" + date2.getMinutes() : date2.getMinutes();
    let time_zone = date2.toString().indexOf("AM") !== -1 ? "AM" : "PM";
    let hh_mm_ss = `${hours}:${minutes} ${time_zone}`;

    if (message_input.value !== "") {
        let value = message_input.value;
        message_input.value = "";
        const data = JSON.parse(sessionStorage.getItem("data"));
        await addDoc(collection(db, "messages"), {
            senter_uid: data.user_uid,
            message: value,
            chatId: data.chatID,
            timeStamp: new Date(),
            message_time: hh_mm_ss,
        });
    }
})

// Showing All Friends 

const showing_all_friends = async (data) => {
    const getting_li = document.querySelector(".col_1 ul");

    data.friends.forEach(async (each_index) => {
        const docRef = doc(db, "users", each_index);
        const docSnap = await getDoc(docRef);
        getting_li.innerHTML += `
        <li onclick='changing_tabs(),friend_select(${JSON.stringify(docSnap.data())},"${data.uid}")'>
        <div class="img_circle_box">
            <img class="img_circle" src="${docSnap.data().profile_image}" alt="">
        </div>
        <p>${docSnap.data().name}</p>
    </li>
        `
    });
}

// Loading All Messages

const load_all_messages = () => {
    let chat_data = document.getElementsByClassName("chat_data")[0].children[0];
    const data = JSON.parse(sessionStorage.getItem("data"));
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;
    const q = query(
        collection(db, "messages"),
        where("chatId", "==", data.chatID),
        orderBy("timeStamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        chat_data.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let class_name = doc.data().senter_uid === uid ? "user" : "friend";
            chat_data.innerHTML += `
            <li class="${class_name}">${doc.data().message} <sub>${doc.data().message_time}</sub></li>
            `
        });
    });
}




window.friend_select = friend_select;
window.changing_tabs = changing_tabs;