
// ===============================
// ===============================
// SIGN UP PAGE
// ===============================
// ===============================

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, addDoc, setDoc, collection, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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
const auth = getAuth(app);
const firestoreDataBase = getFirestore(app);




const signUpForm = document.querySelector(".sign-up-form")


signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    
    const email = document.getElementById("sign-up-email").value
    const password = signUpForm.password.value

    spinnerSignUp.classList.remove("d-none")


    try {
        const createUserTask = await createUserWithEmailAndPassword(auth, email, password)

        const sendEmailTask = await sendEmailVerification(createUserTask.user) //send verification email
        window.location.href = '../pages/dashboard.html'
        spinnerSignUp.classList.add("d-none")



    } catch (error) {
        spinnerSignUp.classList.add("d-none")
        console.error(error.message);

    } finally {
        spinnerSignUp.classList.add("d-none")
        // document.getElementById("sign-up-btn").disabled = false
    }


})




auth.onAuthStateChanged(async (user) => {
    // alert()
    console.log("state changd!" + user);
    const fullName = signUpForm.fullName.value
    const username = signUpForm.signUpUsername.value

    if (user) {
        
        const userId = user.uid
        console.log(userId);
        const usersCollection = collection(firestoreDataBase, "users", userId, 'details');
        // add user's details to the firestore database
        try {
            addDoc(usersCollection, {
                fullName: fullName,
                username: username,
                events: [
                    {
                        title: "event 1",
                        date: "1/12/2024"
                    }
                ]
    
            })

        } catch (error) {
            console.log("There's an error in adding document" + error);
        }
    }
})


const passwordView = () => {
    document.querySelectorAll(".fa-eye").forEach(e => {
        e.addEventListener("click", (e) => {

            const passwordInput = e.target.parentElement.parentElement.firstElementChild

            passwordInput.type == "password" ? passwordInput.type = "text" : passwordInput.type = "password"

        })
    })
}

passwordView()








// ===============================
// ===============================
// END OF SIGN UP PAGE
// ===============================
// ===============================










