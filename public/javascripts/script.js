document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

let user= document.querySelector(".lienPrenom").value;

let adherenttab = user.adherent;

adherenttab.forEach(function(adherent){
  let prenomAdherent = adherent.prenom;
  document.getElementById("prenomAdherent").onclick = function() {
  document.querySelector("#prenomAdherent").classList.remove("dontDisplay");
  };
})



