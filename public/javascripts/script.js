document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


// let user= document.querySelector(".lienPrenom").value;

// let adherenttab = user.adherent;

// adherenttab.forEach(function(adherent){
//   let prenomAdherent = adherent.prenom;
//   document.getElementById("prenomAdherent").onclick = function() {
//   document.querySelector("#prenomAdherent").classList.remove("dontDisplay");
//   };
// })


let adherentTab = [...document.getElementsByClassName("adherentPrenom")];
console.log(adherentTab);

// adherentTab.forEach(function(adherent){
//   adherent.onclick = function(event) {
//     //event.preventDefault();

//     //document.querySelector(".lien").classList.remove("dontDisplay");
//   };
// });



