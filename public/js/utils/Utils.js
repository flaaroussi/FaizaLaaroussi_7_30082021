export default class Utils {
   //Mettre les lettres en muniscules 
   static toLawer(texte) {
      if (texte) {
         return texte.toLowerCase();
      } else {
         return "";
      }
   }
   //Creation d'un element HTML avec sa classe.  
   static creatEltHtml(tagName, classTag) {
      let tag = document.createElement(tagName);
      tag.className = classTag;
      return tag;
   }
   //mettre la premeriere lettre en majuscule et les autre en muniscules.
   static capitalizeFirstLetter(string) {
      if (string) {
         return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
   }

   /**
    * fonction permet de cliquer sur le button (loup) pour lancer la recherche:le click se declenche automatiquement sur la loupe qui permet de lancer le filtre et l'affichage.
    */
   static doRelanceRecherche() {
      document.getElementById("recherche_button").dispatchEvent(new Event('click'));
   }
}