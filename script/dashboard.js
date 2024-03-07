

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, getDocs, getDoc, collection, setDoc, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyxtKFELkOQzOTuc4GnHKsQPr3w2wQNUs",
    authDomain: "easyschedule-7b371.firebaseapp.com",
    projectId: "easyschedule-7b371",
    storageBucket: "easyschedule-7b371.appspot.com",
    messagingSenderId: "164179968346",
    appId: "1:164179968346:web:1d1a7be82372b5d8dbb363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//init auth 
const auth = getAuth();
const db = getFirestore();
const eventsListLoader = document.getElementById("eventsListLoader")




document.querySelectorAll(".sign-out-btn").forEach(e => {
    e.addEventListener("click", async (e) => {
        console.log("signing out...");

        try {

            const userSignOutTask = await signOut(auth)
            console.log("signed out!");


        } catch (error) {
            console.log(error.message);
        }
    })
})



// =====================
// =====================
// ADD EVENT
//======================
// =====================





let nav = 0; // used to track the current month
let clicked = null; // will be set on the date that was clicked on by the user
let allEvents = []

const getElement = (selector) => {
    const element = document.querySelector(selector)
    if (element) {
        return element
    } else {
        console.log(`there is no identifier called "${selector}"`);
    }

}

// const eventTitle = getElement("#newEventInput")
// const todayEventInput = getElement("#todayTitleInput")
const calendar = getElement("#calendar");
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let eventsListDisplay = getElement(".list-events")
// eventsListDisplay.innerHTML = ""




const dt = new Date();
const eventTitle = getElement("#newEventInput")
const todayEventInput = getElement("#todayTitleInput")


// ==================
// LOAD CALENDAR
// ==================

const load = () => {

    const dt = new Date();
    if (nav !== 0) {
        const up = dt.setMonth(new Date().getMonth() + nav)

    }
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);


    const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
        weekday: 'long',
        year: 'numeric',
        month: "numeric",
        day: "numeric"
    })

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

    getElement("#monthDisplay").innerHTML = `${dt.toLocaleDateString("en-us", { month: "long" })} ${year}`;

    calendar.textContent = "";


    // create and display each days
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        // each day
        const daySquare = document.createElement("div")
        daySquare.classList.add("day");

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;
        // const eventForDay = allEvents.find(e => {
        //     return e.date == dayString
        // });

        // if (eventForDay) {
        //     let event = document.createElement("div")
        //     daySquare.classList.add("hasEvent")

        // }

        if (i > paddingDays) {
            daySquare.innerHTML = i - paddingDays;

            daySquare.addEventListener("click", () => {


                openModal(dayString)




            });
        } else {
            daySquare.classList.add("padding");
        }

        calendar.appendChild(daySquare)

        if (i - paddingDays == day && nav == 0) {
            daySquare.id = "currentDay"
            const todayDate = getElement("#todayDate")
            const todayDateString = `${dt.toLocaleDateString("en-us", { month: "long" })} ${day}   ${year}`
            todayDate.textContent = todayDateString
        }


    }

}

load()
// ======================
// END OF LOAD CALENDAR
// ======================






const openModal = (date) => {
    const month = dt.getMonth()
    const day = dt.getDay()
    const year = dt.getFullYear()

    const todayDateString = `${month + 1}/${day}/${year}`
    console.log(todayDateString);
    console.log(date);
    clicked = date
    // const eventForDay = allEvents.search(e => {
    //     return e.date == clicked
    // });


    // if (eventForDay && clicked != todayDateString) {
    // getElement("#modalBackDrop").style.display = "block"
    // getElement("#eventDetails").style.display = "block"

    // getElement("#eventDetailsTitle").textContent = eventForDay.title
    // getElement("#eventDetailsDate").textContent = eventForDay.date

    getElement("#deleteButton").addEventListener("click", () => {
        deleteEvent(eventForDay)
    })
    // } else if (clicked == todayDateString) {
    // openTodayModal()
    // }

    // else {
    getElement("#modalBackDrop").style.display = "flex"
    getElement("#newEventModal").style.display = "block"
    // }


}

// ==================
// END OF OPEN MODAL
// ==================






// ============
// CLOSE MODAL
// ============

const closeModel = () => {
    eventTitle.classList.remove("error")
    getElement("#modalBackDrop").style.display = "none";
    getElement("#newEventModal").style.display = "none";
    getElement("#eventDetails").style.display = "none";
    getElement("#todayModal").style.display = "none"
    eventTitle.value = ""

    load()
}

// ===================
// END OF CLOSE MODAL
// ==================











// ===================
// SAVE EVENT
// ==================

let id;
const saveEvent = (date) => {
    clicked = date

    auth.onAuthStateChanged(async (user) => {

        if (eventTitle.value || todayEventInput.value) {
            const newEventTitle = eventTitle.value || todayEventInput.value

            try {

                const colRef = collection(db, "events", user.uid, "allEvents")

                addDoc(colRef, {
                    title: eventTitle.value,
                    date: clicked

                })




            } catch (error) {
                console.log(error);
            }


            closeModel()
            load()
            eventsListDisplay.innerHTML = ""
            render()

        } else {
            // TODO: add error message
            eventTitle.classList.add("error")

        }
    })

}

// ===================
// END OF SAVE EVENT
// ==================




// ==============
// TODAY MODAL
// ==============


const openTodayModal = () => {
    getElement("#todayModal").style.display = "block"
    getElement("#modalBackDrop").style.display = "block";
}




// ==============
// END OF TODAY MODAL
// ==============








// ==================
// SAVE TODAY MODAL
// ==================

const saveTodayEvent = () => {

    if (todayEventInput.value) {
        saveEvent("1/10/2024")
    } else {
        todayEventInput.classList.add("error")
    }
}


// =========================
// END OF SAVE TODAY MODAL
// =========================








// ==================
// INIT BUTTONS
// ==================



// ==================
// END OF INIT BUTTONS
// ==================




const render = () => {

    // document.getElementById("eventsListLoader").classList.remove("d-none")

    auth.onAuthStateChanged(async (user) => {


        try {


            if (user) {

                const colRef = collection(db, "users", user.uid, "details")
                const userDocs = await getDocs(colRef)

                userDocs.docs.forEach((docu) => {

                    const usersDatas = docu.data()

                    const greeting = document.querySelector(".greeting")
                    greeting.textContent = usersDatas.username



                })

                const eventsRef = collection(db, "events", user.uid, "allEvents")

                const usersEventsDocs = await getDocs(eventsRef)
                if (usersEventsDocs.docs.length == 0) {
                    console.log("you have not added any event");
                    // eventsListDisplay.innerHTML = ``
                    eventsListDisplay.classList.add("center-list")
                } else {
                    eventsListDisplay.classList.remove("center-list")
                }

                const eventsDocs = usersEventsDocs.docs

                eventsDocs.forEach((docu) => {
                    id = docu.id
                    // const itemId = docu.event.currentTarget.id
                    // console.log(itemId);

                    const userEventsData = docu.data()

                    //    const displayEventsList = getElement(".events-list")
                    // eventsListDisplay.innerHTML = ""

                    const singleEvent = document.createElement("div")
                    singleEvent.classList.add("single-event")
                    singleEvent.addEventListener("click", async (e) => {


                        const docToDeleteRef = doc(eventsRef, id)
                        console.log(`deleting ${userEventsData.title}...`)
                        try {
                            // await deleteDoc(docToDeleteRef)
                            console.log(id);
                        } catch (error) {
                            console.log(error);

                        }



                    })

                    singleEvent.innerHTML = `
                
                    <div class="event-left">
                    
                        <h3>${userEventsData.title}</h3>
                        <span class="event-date">
                        ${userEventsData.date}
                        </span>
                        <span class="event-time">
                            06:00am</span>
                    </div>
    
                    </div>
    
                `
                    eventsListDisplay.appendChild(singleEvent)




                })

                eventsListLoader.classList.add("d-none")

            } else {
                console.log("no user is currently signed in");
                window.location.href = "../pages/sign-in.html"
            }

        } catch (error) {
            console.log(error);
        } finally {
            eventsListLoader.classList.add("d-none")
        }
    })
}

render()






// ===================
// DELETE EVENT
// ==================



// const deleteButtons = document.querySelectorAll(".delete-event-btn")
// deleteButtons.forEach(delBtn =>{
//     delBtn.addEventListener("click", ()=>{
//         alert()
//     })
// })
// console.log(deleteButtons);

// function deleteEvent() {
//     const toDelete = allEvents.indexOf(eventForDay)

//     console.log(id);

//     closeModel()
//     load()


// }




// ===================
// END OF DELETE EVENT
// ==================


// ===================
// ADD TODO
// ==================

const addTodo = ()=>{
    
    const todoInput = getElement("#todoInput")
    const todoInputDiv = getElement(".todo-input")

    if (todoInput.value) {
        todoInput.value = ""
        todoInputDiv.style.border = "1px solid #0083FF"
    } else {
        todoInputDiv.style.border = "1px solid red"
    }


}


// ===================
// END OF ADD TODO
// ==================


const initButtons = () => {


    getElement("#nextButton").addEventListener("click", () => {
        nav++;
        load();

    });

    getElement("#backButton").addEventListener("click", () => {
        nav--
        load()
    })

    getElement("#saveButton").addEventListener("click", () => {
        saveEvent(clicked)
        load()
    })

    getElement("#cancelButton").addEventListener("click", () => {
        closeModel()
    })


    getElement("#closeButton").addEventListener("click", () => {
        closeModel()
    })

    getElement("#closeTodayBtn").addEventListener("click", () => {
        closeModel()
    })

    getElement(".add-event-btn").addEventListener("click", () => {
        openModal()
    })



    getElement("#menu-icon").addEventListener("click", () => {

        const mobileMenu = getElement(".mobile-menu")
        mobileMenu.classList.toggle("show-menu")


    })

    const home = getElement(".home")
    const todos = getElement(".todos")
    const account = getElement(".account")
    getElement(".home-tab").addEventListener("click", () => {
        home.style.left = "0";
        todos.style.left = "100%";
        account.style.left = "100%";
        getElement("body").style.overflowY = "visible"
    })

    getElement(".todo-tab").addEventListener("click", () => {

        home.style.left = "100%";
        home.style.left = "100%";
        todos.style.left = "0";
        account.style.left = "100%";
        getElement("body").style.overflowY = "hidden"
        
    })

    getElement(".account-tab").addEventListener("click", () => {
        home.style.left = "100%";
        todos.style.left = "100%";
        account.style.left = "0";
    })


    getElement(".send-btn").addEventListener("click", ()=>{addTodo()})




}

initButtons()



