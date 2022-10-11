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
    updateDoc,
    collection,
    onSnapshot,
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
window.onload = onAuthStateChanged(auth, (user) => {
    if (!user) {
        location = "../index.html"
    } else {
        const user_name = document.querySelector(".data .heading h2");
        const img_circle_box = document.querySelector(".img_circle_box img");
        const list = document.querySelectorAll(".data_items ul li");
        onSnapshot(doc(db, "users", user.uid), (doc) => {
            img_circle_box.src = doc.data().profile_image;
            user_name.innerHTML = doc.data().name;
            list[0].innerHTML = `Name: ${doc.data().name}`;
            list[1].innerHTML = `Password: ${doc.data().password}`;
            list[2].innerHTML = `Email: ${doc.data().email}`;
            list[3].innerHTML = `Phone Number: ${doc.data().phone_number}`;
            list[4].innerHTML = `UID: ${doc.id}`;
            load_all_friends(doc.data());
            load_all_req(doc.data());
            your_friends_tab(doc.data());
            loader.classList.add("hidden");
            container.classList.remove("hidden");

        });

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
const col_2_h2 = document.querySelector(".col_1 h2");
const ul = document.querySelector(".col_1 ul");
let count = 0;
ham_burger_icon[0].addEventListener("click", () => {
    if (count === 0) {
        col_1.style.width = "0%";
        col_2.style.width = "100%";
        ul.style.display = "none";
        col_2_h2.style.display = "none";
        count = 1;
    } else if (count === 1) {
        col_1.style.width = "25%";
        col_2.style.width = "75%";
        setTimeout(() => {
            ul.style.display = "block";
            col_2_h2.style.display = "block";
        }, 100);
        count = 0;
    }
})
ham_burger_icon[1].addEventListener("click", () => {
    col_1.style.left = "0%";
    ul.style.display = "block";
    col_2_h2.style.display = "block";
})

// Opening and Closing side panel on small screen

const x_mark = document.getElementsByClassName("fa-xmark")[0];
const x_mark_func = () => {
    col_1.style.left = "-100%";
}
x_mark.addEventListener("click", x_mark_func);

// Changing Tabs from panel

const changing_tabs = e => {
    const panel_list = document.getElementsByClassName("panel_list");
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
    x_mark_func();
}

// Showing Your Friends Cards

let list_count = document.querySelectorAll(".count");
const your_friends_tab = (user) => {
    const your_friend = document.querySelector(".your_friends .cards");
    let count = 0;
    your_friend.innerHTML = "";
    if (user.friends.length !== 0) {
        user.friends.forEach(async (each_index) => {
            const docRef = doc(db, "users", each_index);
            const docSnap = await getDoc(docRef);
            list_count[0].innerHTML = ++count;
            your_friend.innerHTML += `
                <div class="card">
                        <div class="img_circle_card">
                            <img id="img_circle" src="${docSnap.data().profile_image}" alt="">
                        </div>
                        <div class="break_line"></div>
                        <p> Name : ${docSnap.data().name}</p>
                        <p> Email : ${docSnap.data().email}</p>
                        <p> Phone Number : ${docSnap.data().phone_number}</p>
                        <button onclick='delete_friend("${user.uid}","${each_index}",${JSON.stringify(user.friends)},${JSON.stringify(docSnap.data().friends)})'><i class="fa-solid fa-trash"></i></button>
                </div>
            `
        });
    } else {
        list_count[0].innerHTML = 0;
    }
}

// Deleting friend from Your Friends

const delete_friend = async (uid, friend, friend_arr, req_senter_friends_arr) => {
    toggling_loader("your_friends", true);
    event.target.parentNode.remove();
    const updateRef = doc(db, "users", uid);
    const updateRef_2 = doc(db, "users", friend);
    friend_arr.splice(friend_arr.indexOf(friend), 1);
    req_senter_friends_arr.splice(friend_arr.indexOf(uid), 1);
    await updateDoc(updateRef, {
        friends: friend_arr,
    });
    await updateDoc(updateRef_2, {
        friends: req_senter_friends_arr,
    });
    const docSnap = await getDoc(updateRef);
    list_count[0].innerHTML = Number(list_count[0].innerHTML) - 1;
    your_friends_tab(docSnap.data());
    toggling_loader("your_friends", false);
    load_all_friends(docSnap.data());
}

// Showing Add Friends Cards

const load_all_friends = async (user) => {
    const cards = document.querySelector(".add_friends .cards");
    const user_uid = user.uid;
    onSnapshot(collection(db, "users"), (querySnapshot) => {
        cards.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let flag = false;
            if (doc.data().uid !== user_uid) {
                if (user.friends.indexOf(doc.data().uid) !== -1) {
                    cards.innerHTML += `
                    <div class="card" id="${doc.id}">
                    <div class="img_circle_card">
                        <img id="img_circle" src="${doc.data().profile_image}" alt="">
                    </div>
                    <div class="break_line"></div>
                    <p> Name : ${doc.data().name}</p>
                    <p> Email : ${doc.data().email}</p>
                        <p> Phone Number : ${doc.data().phone_number}</p>
                        <button class="add_friend_btn">Friend Added</button>
                    </div>
                `
                }
                else if (user.req_senders.indexOf(doc.data().uid) !== -1) {
                    cards.innerHTML += `
                    <div class="card" id="${doc.id}">
                    <div class="img_circle_card">
                        <img id="img_circle" src="${doc.data().profile_image}" alt="">
                    </div>
                    <div class="break_line"></div>
                    <p> Name : ${doc.data().name}</p>
                    <p> Email : ${doc.data().email}</p>
                        <p> Phone Number : ${doc.data().phone_number}</p>
                        <button class="add_friend_btn">Sent Request</button>
                    </div>
                `
                }
                else {
                    for (let i = 0; i < doc.data().req_senders.length; i++) {
                        if (doc.data().req_senders[i] === user_uid) {
                            cards.innerHTML += `
                            <div class="card" id="${doc.id}">
                            <div class="img_circle_card">
                                <img id="img_circle" src="${doc.data().profile_image}" alt="">
                            </div>
                            <div class="break_line"></div>
                            <p> Name : ${doc.data().name}</p>
                            <p> Email : ${doc.data().email}</p>
                                <p> Phone Number : ${doc.data().phone_number}</p>
                                <button class="add_friend_btn" onclick='cancel_request("${user_uid}", ${JSON.stringify(doc.data().req_senders)},"${doc.id}")' >Cancel Request</button>
                            </div>
                        `
                            flag = true;
                        }
                    }
                    if (flag === false) {
                        cards.innerHTML += `
                        <div class="card" id="${doc.id}">
                            <div class="img_circle_card">
                                <img id="img_circle" src="${doc.data().profile_image}" alt="">
                            </div>
                            <div class="break_line"></div>
                            <p> Name : ${doc.data().name}</p>
                            <p> Email : ${doc.data().email}</p>
                            <p> Phone Number : ${doc.data().phone_number}</p>
                            <button class="add_friend_btn" onclick='add_friend("${user_uid}",${JSON.stringify(doc.data().req_senders)},"${doc.id}")' ><i class="fa-solid fa-user-plus"></i></button>
                        </div>
                    `
                    }
                }
            }
        });
    });
}

// Request Sending logic

const add_friend = async (current_uid, arr, friend_uid) => {
    const e = event.target;
    e.setAttribute("disabled", "disabled");
    setTimeout(() => {
        e.removeAttribute("disabled", "disabled");
    }, 2000);
    toggling_loader("add_friends", true);
    const updateRef = doc(db, "users", friend_uid);
    e.innerHTML = "Cancel Request";
    arr.push(current_uid);
    await updateDoc(updateRef, {
        req_senders: arr,
    });
    e.setAttribute("onclick", `cancel_request("${current_uid}",${JSON.stringify(arr)},"${friend_uid}")`);
    toggling_loader("add_friends", false);
}

// Cancelling Request logic

const cancel_request = async (current_uid, arr, friend_uid) => {
    const e = event.target;
    e.setAttribute("disabled", "disabled");
    setTimeout(() => {
        e.removeAttribute("disabled", "disabled");
    }, 2000);
    toggling_loader("add_friends", true);
    const updateRef = doc(db, "users", friend_uid);
    e.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
    arr.splice(arr.indexOf(current_uid), 1);
    await updateDoc(updateRef, {
        req_senders: arr,
    });
    e.setAttribute("onclick", `add_friend("${current_uid}",${JSON.stringify(arr)},"${friend_uid}")`);
    toggling_loader("add_friends", false);
}

// Showing Friend Request Cards

const load_all_req = (user) => {
    const friend_req = document.querySelector(".friend_req .cards");
    let count = 0;
    friend_req.innerHTML = "";
    if (user.req_senders.length !== 0) {
        user.req_senders.forEach(async (each_index) => {
            const docRef = doc(db, "users", each_index);
            const docSnap = await getDoc(docRef);
            list_count[1].innerHTML = ++count;
            friend_req.innerHTML += `
                <div class="card">
                        <div class="img_circle_card">
                            <img id="img_circle" src="${docSnap.data().profile_image}" alt="">
                        </div>
                        <div class="break_line"></div>
                        <p> Name : ${docSnap.data().name}</p>
                        <p> Email : ${docSnap.data().email}</p>
                        <p> Phone Number : ${docSnap.data().phone_number}</p>
                        <div class="add_remove_btn">
                            <button onclick='req_accept("${user.uid}","${each_index}",${JSON.stringify(user.req_senders)},${JSON.stringify(user.friends)},${JSON.stringify(docSnap.data().friends)})'><i class="fa-solid fa-check"></i></button>
                            <button onclick='req_reject("${user.uid}","${each_index}",${JSON.stringify(user.req_senders)})'><i class="fa-solid fa-xmark"></i></button>
                        </div>
                </div>
            `
        });
    } else {
        list_count[1].innerHTML = 0;
    }
}

// Friend Request Accepting logic

const req_accept = async (uid, req_senter, req_arr, friends_arr, req_senter_friends_arr) => {
    count_change()
    toggling_loader("friend_req", true);
    event.target.parentNode.parentNode.remove();
    const updateRef = doc(db, "users", uid);
    const updateRef_2 = doc(db, "users", req_senter);
    req_arr.splice(req_arr.indexOf(req_senter), 1);
    friends_arr.push(req_senter);
    req_senter_friends_arr.push(uid);
    await updateDoc(updateRef, {
        req_senders: req_arr,
        friends: friends_arr,
    });
    await updateDoc(updateRef_2, {
        friends: req_senter_friends_arr,
    });
    const docSnap = await getDoc(updateRef);
    load_all_req(docSnap.data());
    your_friends_tab(docSnap.data());
    toggling_loader("friend_req", false);
    load_all_friends(docSnap.data());
}

// Friend Request Rejecting logic

const req_reject = async (uid, req_senter, req_arr) => {
    count_change()
    toggling_loader("friend_req", true);
    event.target.parentNode.parentNode.remove();
    const updateRef = doc(db, "users", uid);
    req_arr.splice(req_arr.indexOf(req_senter), 1);
    await updateDoc(updateRef, {
        req_senders: req_arr,
    });
    const docSnap = await getDoc(updateRef);
    load_all_req(docSnap.data());
    toggling_loader("friend_req", false);
    load_all_friends(docSnap.data());
}

// Toggling Loader 

const toggling_loader = (class_name, flag) => {
    document.getElementsByClassName("col_loader")[0].classList.toggle("hidden");
    document.getElementsByClassName(class_name)[0].classList.toggle("hidden");
    let all_list = document.querySelectorAll(".col_1 ul li");
    for (let i = 0; i < all_list.length; i++) {
        flag ? all_list[i].style.pointerEvents = "none" : all_list[i].style.pointerEvents = "all";
    }
};

// Go to Chat App

const go_to_chat_app = () => {
    location = "../chat/index.html";
}

// Increament or Decrement in Friend Request changing

const count_change = () => {
    list_count[1].innerHTML = Number(list_count[1].innerHTML) - 1;
}


window.go_to_chat_app = go_to_chat_app;
window.delete_friend = delete_friend;
window.req_reject = req_reject;
window.req_accept = req_accept;
window.add_friend = add_friend;
window.changing_tabs = changing_tabs;
window.cancel_request = cancel_request;