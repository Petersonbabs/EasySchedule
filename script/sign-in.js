



// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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
const usersCollection = collection(firestoreDataBase, "users");




// ===============================
// ===============================
// SIGN IN PAGE
// ===============================
// ===============================


const signInForm = document.querySelector(".sign-in-form")

signInForm.addEventListener('submit', async (e) =>{

    e.preventDefault()
    const emailValue = document.getElementById("sign-in-email").value
    const passwordValue = document.getElementById("sign-in-password").value

    spinnerSignIn.classList.remove("d-none")
    document.getElementById("sign-in-btn").disabled = true

   try {

    const loginTask = await signInWithEmailAndPassword(auth, emailValue, passwordValue)
    // console.log(loginTask);
    window.location.href = "../pages/dashboard.html"
    spinnerSignIn.classList.remove("d-none")
    

   } catch (error) {
      console.log(error.message);
      spinnerSignIn.classList.add("d-none")
      
    document.getElementById("sign-in-btn").disabled = false
   } finally{
    spinnerSignIn.classList.add("d-none")
   }


})


// auth.onAuthStateChanged((user) => {
//   try {

//       if (user) {
//           const UserId = user.uid
//           console.log("User is signed in UID: ", UserId);
//       } else {
//           console.log("no user is currently signed in");
//           // window.location.href = "../pages/sign-in.html"
//       }

//   } catch (error) {
//       console.log(error);
//   }
// })


const passwordView = ()=>{
  document.querySelectorAll(".fa-eye").forEach(e =>{
      e.addEventListener("click", (e)=>{

          const passwordInput = e.target.parentElement.parentElement.firstElementChild
  
          passwordInput.type == "password" ? passwordInput.type = "text" : passwordInput.type = "password"
  
      })
  })
}

passwordView()





// ===============================
// ===============================
// END OF SIGN IN PAGE
// ===============================
// ===============================