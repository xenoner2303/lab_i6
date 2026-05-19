function openLabCard(card){
    let menuParent = card.parentElement;
    let subMenu = menuParent.querySelector(".labSubmenu");

    if(subMenu.style.display === "flex"){
        subMenu.style.display = "none";
        
        card.style.borderRadius = "10px";
    }
    else{
        subMenu.style.display = "flex";

        card.style.borderBottomLeftRadius = "0px";
        card.style.borderBottomRightRadius = "0px";
    }
}