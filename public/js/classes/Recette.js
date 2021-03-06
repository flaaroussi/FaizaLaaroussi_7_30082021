/**
 * Afficher les recettes .
 */
import Utils from "../utils/Utils.js";
import Ingredient from "./Ingredient.js";
import Appareil from "./Appareil.js";
import Ustensile from "./Ustensile.js";

export default class Recipe {
   constructor(recipes) {
      //Stocker les recettes du fichier json dans le variable de classe recipes
      this.recipes = recipes;
      //Instanciation des classes qui permettent de gérer les filtres et l'affichages des trois blocs de recherche avancée.
      this.ingredientObjet = new Ingredient();
      this.appareilObjet = new Appareil();
      this.ustensileObjet = new Ustensile();
      this.displayRecipes(recipes);
      //Attacher evenement'saisi' sur l'input dans la barre de recherche 
      this.doAttachEventBarreRecherche();
      //Attacher "click" sur la flèche des 3 blocs de recherche.
      this.doAttachClickToFiltre();
      //Attacher "saisi" la liste des elts d'un bloc selon mot clé saisi dans les blocs de recherche avancée.
      this.doAttachSaisiInput();
   }

   /**
    * Affiher les recettes (totalité des recettes ou bien recettes filtrées):
    * Afficher message si aucune recette ne contient le mot saisi.
    * On faits appelle aux fonctions doDisplayAppareil,doDisplayIngredient et doDisplayUstensiles 
    * pour afficher les listes des ing,app,ust dans les blocs de recherche avancée
    * @param {*} recipes :données des recettes dans le fichier js.
    */
   displayRecipes(recipes) {
      let elt = document.getElementById("recipes_container");
      elt.innerHTML = "";
      //vider les listes: ingredients+ustensiles+appareils (sous listes des blocs des recherches avancées).
      document.querySelector(".bloc-search-resultat--ingredient").innerHTML = "";
      document.querySelector(".bloc-search-resultat--appareil").innerHTML = "";
      document.querySelector(".bloc-search-resultat--ustensiles").innerHTML = "";
      //vider  des listes déja définis dans les classes.
      this.ingredientObjet.ingredients = [];
      this.appareilObjet.appareils = [];
      this.ustensileObjet.ustensiles = [];
      //Si le nbre des recettes est sup à 0:
      //on a ajouté cette condition pour pouvoir afficher le "msg" si la condition n'est pas respectée. 
      if (recipes.length > 0) {
         //activer le style de l'elt "recipes_container" déje annuler dans la condition "else".
         elt.style.display = "grid";
         //Activer le style d'affichage des blocs de recherche désactivé dans la condition 'else' suivante.
         document.querySelector('.menu').style.display = "grid";
         recipes.forEach(currentRecipe => {
            let article = document.createElement("article");
            article.className = "recipe-card";
            article.innerHTML = this.getTemplateRecipe(currentRecipe);
            elt.appendChild(article);
            //Attacher click pour selectionner une recette
            article.addEventListener("click", event => {
               this.doSelectedRecepie(article)
            })
         })
         //Si aucune recette ne répond au condition on afficher le message.
      } else {
         //annuler le style de l'elts parent "recipes_container" pour pouvoir afficher le mesage dans toute la page
         elt.style.display = "block";
         //* Ne pas afficher les blocs de recherches
         document.querySelector('.menu').style.display = "none";
         let msg = Utils.creatEltHtml("div", "msg-no-recipe");
         msg.innerHTML = `<p>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>`;
         elt.append(msg)
      }
      //aprés l'affichage de l'ensemble des recettes, on actualise les listes des blocs de recherche avancée.
      this.ingredientObjet.doDisplayIngredient();
      this.appareilObjet.doDisplayAppareil();
      this.ustensileObjet.doDisplayUstensiles();

   }
   /**
    * Selectionner la recette à qui on attaché un "click"
    * @param {Element} recipe :recette selected.
    * 
    */

   doSelectedRecepie(recipe) {
      //il faut supprimer la selection si elle existe avant d'attacher la classe recipe-card--selected.
      if (document.querySelector(".recipe-card--selected")) {
         document.querySelector(".recipe-card--selected").classList.remove("recipe-card--selected");
      }
      //quand je clique sur la recette >> attacher une class "recipe-card--selected" à la recette
      recipe.classList.add("recipe-card--selected");
   }
   /**
    * Créer la structure HTML du bloc recette et alimenter les listes des blocs de recherche avancée. 
    * @param {array} recipe :data d'une recette à
    * @returns {HTMLElement} :structure bloc recette
    */
   getTemplateRecipe(recipe) {
      //Elt vide en haut du bloc recette.
      let template = `<div class="recipe-card_header"></div> `
      //Elt ou sera affiché : titre + timer + temps.
      template += `
             <div class="title-time-recipe">
                <p class="nom">${recipe.nom} </p>
                <p class="temps"><i class="far fa-clock"></i> ${recipe.temps} min </p> 
             </div>
             <div class="recipe-card_content">
             <div>`
      //Elt ou sera affiché les ingrédients dans card recette.
      recipe.ingredients.forEach(currentIngredient => {
         //si l"unité" n'existe pas dans le data == rien à afficher (ne pas affiché undefined).
         let uniteValue = "";
         if (currentIngredient.unite) {
            uniteValue = currentIngredient.unite;
         }
         let quantiteValue = "";
         let separateurPoint = "";
         if (currentIngredient.quantite) {
            quantiteValue = currentIngredient.quantite;
            separateurPoint = ":";
         }
         template += `
             <div class="ingredient">
                ${currentIngredient.ingredient}
                ${separateurPoint}
                ${quantiteValue} 
                ${uniteValue}
             </div>
             `
         //Ajouter les ingredients non dupliqués dans l' array this.ingredientObjet.ingredients
         let ingredient = Utils.capitalizeFirstLetter(currentIngredient.ingredient);
         //si l'ingredient ne se trouve pas dans l'array des ingredients => 
         if (!this.ingredientObjet.ingredients.includes(ingredient)) {
            //alors ajouter l'ingredient dans l'array this.ingredientObjet.ingredients
            this.ingredientObjet.ingredients.push(ingredient);
         }
      })

      //Ajouter les appareils non dupliqués dans le le bloc de recherche "appareil".
      let currentAppareil = Utils.capitalizeFirstLetter(recipe.appareil);
      if (currentAppareil) {
         if (!this.appareilObjet.appareils.includes(currentAppareil)) {
            //alors ajout l'appareil dans l'array des appareils non dupliqués
            this.appareilObjet.appareils.push(currentAppareil);
         }
      }
      //Ajouter les ustensiles non dupliqués dans le le bloc de recherche "ustensiles".
      recipe.ustensiles.forEach(currentUstensile => {
         currentUstensile = Utils.capitalizeFirstLetter(currentUstensile);
         if (currentUstensile) {
            if (!this.ustensileObjet.ustensiles.includes(currentUstensile)) {
               //alors ajout l'ustensile dans l'array des ustensiles non dupliqués
               this.ustensileObjet.ustensiles.push(currentUstensile);
            }
         }
      });
      //Element ou sera affiché la description de la recette.
      template += `</div>
          <p class="description textEllipsis">${recipe.description}</p>
          </div>`;
      return template;
   }

   /**
    * Attacher 2 evenement 'saisi' et "click"  sur la barre principale.
    */
   doAttachEventBarreRecherche() {
      let elt = document.getElementById("barreRecherche");
      elt.value = "";
      elt.addEventListener('input', e => {
         //filtrer les recettes qui contient le mot saisi.
         this.filterRecipes(elt.value);
      });
      //attacher un click sur la loupe pour relancer la recherche
      let btn = document.getElementById("recherche_button");
      btn.addEventListener('click', e => {
         //filtrer et afficher les recettes qui contient le mot saisi ou bien tags selectionnés.
         this.filterRecipes(elt.value);
      })
   }

   /**
    * Afficher les recettes filtrées "mot saisi recherche principale" ou par tags.
    * @param {String} searchMot : mot saisi
    */
   filterRecipes(searchMot) {
      //Appliquer 1 er filtre: recettes filtrées par mot saisi si il existe
      let recipesFiltree = [];
      //si le mot existe est il est >= 3
      if (searchMot && searchMot.length >= 3) {
         searchMot = Utils.toLawer(searchMot);
         //alors on applique un filtre sur la recette et on return la recette filtrée si elle respecte
         recipesFiltree = this.recipes.filter(currentRecipe => {
            let nom = Utils.toLawer(currentRecipe.nom);
            let description = Utils.toLawer(currentRecipe.description);
            //la condition :soit le mot existe  dans le nom ou bien la  description ou bien dans les ingredients. 
            if (nom.includes(searchMot) || description.includes(searchMot) || this.isIngredientsHaveMot(currentRecipe.ingredients, searchMot)) {
               // true = le mot existe dans la recette donc ajouter la recette dans recipesFiltree.
               return true;
            } else {
               return false;
            }
         });
      } else {
         //pas de filtre si le mot saisi < 3 c'est a dire rien à faire
         recipesFiltree = this.recipes;
      }

      //Appliquer 2 eme filtre: recettes resultat recettes filtrées par tags s'il y en a.

      //si au moins un tag ingredient existe(this.getIngredientTags()=tags selectionnés-tags fermés)
      if (this.ingredientObjet.getIngredientTags().length > 0) {
         //on crée et on retourne une nouvelle array "recipesFiltree"  et on ajoute la recette qui contient le tag.
         recipesFiltree = recipesFiltree.filter(currentRecipe => {
            // true = recette contient les tags
            return this.ingredientObjet.isRecipesHaseTagsIngredient(currentRecipe);
         })
      }
      // Si la liste des "tags app" est sup à 0 alors 
      if (this.appareilObjet.getAppareilTags().length > 0) {
         recipesFiltree = recipesFiltree.filter(currentRecipe => {
            //on crée et on retourne une nouvelle array "recipesFiltree"  et on ajoute la recette qui contient le tag.
            return this.appareilObjet.isRecipesHaseTagsAppareil(currentRecipe);
         })
      }
      if (this.ustensileObjet.getUstensileTags().length > 0) {
         recipesFiltree = recipesFiltree.filter(currentRecipe => {
            //on crée et on retourne une nouvelle array "recipesFiltree"  et on ajoute la recette qui contient le tag.
            return this.ustensileObjet.isRecipesHaseTagsUstensile(currentRecipe);
         })
      }
      //Fin des conditions.

      //Afficher les recettes triées par mot saisi et par tags.
      this.displayRecipes(recipesFiltree);
   }

   /**
    * Chercher le mot dans la liste des ingredients.
    * @param {*} ingredients array des ingrédients
    * @param {*} mot 
    * @returns {booléen} 
    */
   isIngredientsHaveMot(ingredients, mot) {
      //si au moins un currentIngredient contient le mot >> return true , sinon return false
      let resultat = ingredients.some(currentIngredient => Utils.toLawer(currentIngredient.ingredient).includes(mot));
      return resultat;
   }

   /**
    * Filtrer la liste des elts d'un bloc selon mot clé saisi dans les blocs de recherche avancée.
    */
   doAttachSaisiInput() {
      let inputs = document.querySelectorAll(".saisiTag");
      inputs.forEach(currentInput => {
         currentInput.value = "";
         currentInput.addEventListener("input", event => {
            let inputSource = currentInput.getAttribute("data-filtre");
            switch (inputSource) {
               case 'ingredient':
                  this.ingredientObjet.filterIngredients(currentInput.value);
                  break;
               case 'appareil':
                  this.appareilObjet.filterAppareils(currentInput.value);
                  break;
               case 'ustensiles':
                  this.ustensileObjet.filterUstensiles(currentInput.value);
                  break;
            }
         });
         //Arrêter l'evenement click(deja attaché à la fleche+input+titre) sur l'input de saisi.
         currentInput.addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();
         });

      })
   }

   /**
    * Attacher evenement "click" sur la flèche des 3 blocs de recherche.
    * Fermer les filtres deja ouvertes.
    * Changer la flèche de up to down on cas de 2eme click
    */
   doAttachClickToFiltre() {
      let btns = document.querySelectorAll('.title-icone');
      btns.forEach(btn => {
         btn.addEventListener('click', event => {
            //je dois garder stocker la classe de l'icone avant ouverture ou fermeture de filtre
            let iconeClassList = btn.querySelector("i").classList.value;

            // Fermer les filtres
            this.doCloseFiltresListes();
            // si l'icone contient la classe 'down' alors Ouvrir le filtre
            if (iconeClassList.includes('fa-chevron-down')) {

               btn.querySelector("p").style = "display:none;visibility:hidden";
               btn.querySelector("input").style = "display:block;visibility:visible";

               //et changer la direction de la flèche.
               //pourque se soit dynamique.
               let parent = btn.getAttribute('data-parent');

               document.querySelector(parent).classList.add("filtre-open");
               let eleI = btn.querySelector('i').classList;
               eleI.remove("fa-chevron-down");
               eleI.add("fa-chevron-up");
            }
         }
         );
      });
   }

   /**
    * Fermer les filtres deja ouvertes
    * @param {*} 
    */
   doCloseFiltresListes() {
      //Fermer tous les filtres ouvertes
      let eltBlocs = document.querySelectorAll('.blocs-filtre');
      eltBlocs.forEach(currentBloc => {
         //si le bloc contient "filtre-open"
         if (currentBloc.classList.contains("filtre-open")) {
            // supprimer "filtre-open" pour fermer la liste deja ouverte            
            currentBloc.classList.remove("filtre-open");
            // et changer la direction de la flèche.
            let eleI = currentBloc.querySelector('i').classList;
            eleI.remove("fa-chevron-up");
            eleI.add("fa-chevron-down");
            currentBloc.querySelector("p").style = "display:block;visibility:visible";
            currentBloc.querySelector("input").style = "display:hidden;visibility:hidden";
         }
      });
   }
}