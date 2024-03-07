const getElement = (selector)=>{
    const element = document.querySelector(selector)

    if (element) {
        return element
    } else {
        console.error(`There is no identifier called ${selector} in you index.js file`)
    }
}


const InitButtons = ()=>{

     getElement("#menu-icon").addEventListener("click", ()=>{

     const mobileMenu = getElement(".mobile-menu")
     mobileMenu.classList.toggle("show-menu")
        
      
    })
    
}

InitButtons()