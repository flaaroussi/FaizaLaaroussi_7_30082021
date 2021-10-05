import Utils from "../utils/Utils.js";

export default class Ustensile{

   constructor(){
     //creer un array à partir de la liste des ustensiles des recettes filtrées
     this.ustensiles = []; 
   }

   /**
    * Afficher les ustensiles(resultat recherche barre principale) dans les blocs de recherche avancée.
    */
   doDisplayUstensiles() {
      let motSaisi = document.querySelector('.recherche-ustensile').value;
      this.ustensiles.sort();
      this.ustensiles.forEach(currentUstensile => { 
         if(!motSaisi || Utils.toLawer(currentUstensile).includes(Utils.toLawer(motSaisi))){         
            this.doAddUstensiles(currentUstensile);
         }   
      })
   }

   /**
    * Filtrer et afficher la liste des ustensiles qui contiennent le mot saisi
    * @param {*} motSaisi 
    */
   filterUstensiles(motSaisi) {
      let resultat = [];
      motSaisi = Utils.toLawer(motSaisi);
      //Nouveau algorithme
      let totalustensiles = this.ustensiles.length;
      for(let i = 0; i < totalustensiles; i++){
         let ustensile = this.ustensiles[i];
         ustensile = Utils.toLawer(ustensile);
         if(ustensile.includes(motSaisi)){
            resultat.push(ustensile);
         }
      }
      //Fin nouveau algorithme.

      /**ancien algorithme
      resultat = this.ustensiles.filter(currentUstensile => {
         currentUstensile = Utils.toLawer(currentUstensile);
         return currentUstensile.includes(motSaisi);
      });
      */

      // vider la liste des ingrédients
      document.querySelector(".bloc-search-resultat--ustensiles").innerHTML = "";
      resultat.forEach(currentUstensile => {
         this.doAddUstensiles(currentUstensile);
      })
   }
   /**
    * Selectionner un ustensile et l'ajouter dans la liste des ustensiles.
    * @param {*} ustensile 
    */
   doAddUstensiles(currentUstensile) {
      let elt = document.querySelector(".bloc-search-resultat--ustensiles");
      let li = Utils.creatEltHtml("li", "search-ustensile");
      li.title = "Cliquer içi pour rechercher cet ustensile";
      li.innerHTML = currentUstensile;
      elt.appendChild(li);
      li.addEventListener("click", event => {
         this.doAddFiltreTags(li, 'ustensile');
      })
   }

   /**
    * Ajout d'un tag dans la section filtre/tag.
    * @param {*} li 
    * @param {*} filtre =ingrédient,appareil ou ustensile c'est pour appliquer un style au tag 
    */
    doAddFiltreTags(li, filtre) {
      let sectionTag = document.querySelector(".filtre-tags");
      //condition pour ne pas afficher les tags dupliqués.
      //On recupere la liste des tags.
      let tagsListe = this.getUstensileTags();
      //Nouveau algorithme
      //on crée une array provisoire 
      let tagListeSelected = [];
      let totalTagsListe = tagsListe.length;
      for(let i = 0;i < totalTagsListe; i++ ){
         let tag = tagsListe[i];
         tag.textContent = Utils.toLawer(tag.textContent);
         li.textContent = Utils.toLawer(li.textContent);
         if(tag.textContent == li.textContent){
            tagListeSelected.push(tag.textContent);
         }
      }
      
      //Fin nouveau algorithme.
      /**ancien algorithme
      //On garde les tags qui respecte la condition  currentTag.textContent=li.textContent
      tagsListe = tagsListe.filter(currentTag => Utils.toLawer(currentTag.textContent) == Utils.toLawer(li.textContent));
      */
      if (tagListeSelected.length > 0) {
         //rien à faire
         return true
         //si non ajout du tag dans la liste des tags
      } else {   
         //on crée la structure HTML de la liste des tags
         let tag = Utils.creatEltHtml("div", "tag " + filtre);
         tag.innerHTML = `<span class="tag-libelle">${li.textContent}</span><i class="far fa-times-circle" title="Supprimer"></i>`;
         sectionTag.appendChild(tag);
         //......................
         this.doCloseTag(tag);
         //..........................
         Utils.doRelanceRecherche();
      }
   }

   /**
    * Fermer le tag cliqué
    * @param {*} tag 
    */
    doCloseTag(tag) {
      let icone = tag.querySelector('.far');
      icone.addEventListener("click", event => {
         //supprimer l'element Tag.
         tag.remove();
         //Acualiser la recherche des recettes
         Utils.doRelanceRecherche();
      })
   }

   /**
    * Retourne la liste des tag usetensiles selectionnés
    * cette fonction nous donne tags =tags selectionés - tags fermés 
    * @returns 
    */
    getUstensileTags() {
      let tagsListe = Array.from(document.querySelectorAll('.filtre-tags .ustensile span.tag-libelle'));
      return tagsListe;
   }

   /**
    * Est ce que la recette contient les tags ustentiles : true ou false.
    * @param {*} recipe :La recette filtrée resultat de la recherche principale. 
    * @returns {boleen} true: si les recettes contiennent l'ensembles des tags ustensiles selectionnés.
    */
    isRecipesHaseTagsUstensile(recipe) {
      let tagsListe = this.getUstensileTags();
      let resultat = [];
      //si ustensile existe dans le fichier parent js (recipes.js)
      if (recipe.ustensiles) {
         //on applique le filtre::::::::::::::::::::::::::
         resultat = recipe.ustensiles.filter(currentUstensile => {
            //Variable qui permet juste de savoir est ce que le tag existe dans l'ustensile.
            let stat = [];
            tagsListe.forEach(currentTag => {
               //si currentTag existe dans l'ustensile        
               if (Utils.toLawer(currentUstensile).includes(Utils.toLawer(currentTag.textContent))) {
                  //alors ajouté currentIng.ingredient dans stat
                  stat.push(currentUstensile);
               }
            });
            //si "stat" est non vide alors return true
            return (stat.length);
         })
      }

      //si le nbre de tags selectionnés est égal au nbre dustensiles alors la recette doit etre affichée.
      // return (resultat.length == tagsListe.length) ? true : false;
      if (resultat.length == tagsListe.length) {
         return true
      } else {
         return false;
      }
   }

}