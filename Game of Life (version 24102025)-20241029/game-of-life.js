

/* Les 2 règles du Jeu de la Vie :

• Une cellule morte possédant exactement trois cellules voisines vivantes devient vivante (elle naît) ;
• Une cellule vivante possédant deux ou trois cellules voisines vivantes le reste, sinon elle meurt.

Donc :
• Si une cellule a exactement trois voisines vivantes, elle est vivante à l’étape suivante.
• Si une cellule a exactement deux voisines vivantes, elle reste dans son état actuel à l’étape suivante.
• Si une cellule a strictement moins de deux ou strictement plus de trois voisines vivantes, elle est morte à l’étape suivante.

 */

// Quelques "réglages" pour la grille de cellules :

const cell_size = 30;
const columns = 10;
const lines = 10;

// Préparation d'un pseudo-constructeur de cellules :

function add_cell(new_x , new_y) {

    let my_cell = { // ou let my_cell = new Object();

        // Propriétés de la cellule :
        alive: false,
        x:new_x,
        y:new_y,

        // Méthodes de la cellule :
        // (Note : dans les déclarations de méthodes d'un objet, le mot-clé "this" fera référence à cet objet)

        draw:function(){ // Sera appelée une seule fois par cellule : lorsqu'il faudra la matérialiser dans le DOM
            
            this.HTML_cell = document.createElement("div");
            // À partir de là une nouvelle propriété est ajoutée à la cellule...
            document.body.appendChild(this.HTML_cell);
            // ...faisant bien référence à un élément du DOM

            this.HTML_cell.classList.add("cell"); // ou .className = "cell"
            this.HTML_cell.style.width = cell_size + "px";
            this.HTML_cell.style.height = cell_size + "px";
            this.HTML_cell.style.left = (this.x * cell_size) + "px";
            this.HTML_cell.style.top = (this.y * cell_size) + "px";

            this.HTML_cell.addEventListener("click" , this.toggle_state );

        },

        update_HTML:function() { // Sera appelée à chaque fois qu'il faudra changer l'état visuel de la cellule
            // ! \ Pourrait faire réellement dépendre la présence de la classe "alive" de la valeur de la propriété alive

            this.HTML_cell.classList.toggle("alive");
        },

        toggle_state:function() {
             // ! \ À améliorer pour ne pas être obligé de viser my_cell explicitement

            my_cell.alive = !my_cell.alive; // inversion de la valeur (booléenne) de la propriété alive

            my_cell.update_HTML();

        }

        
    }

    // Une cellule devra apparaître dans le DOM dès sa création :
    my_cell.draw();
    
    // Il pourrait s'avérer pratique à terme que notre pseudo-constructeur renvoie la cellule qu'il aura généré :
    return my_cell;
    
}

///////// Génération de l'ensemble des cellules

// Générer toutes les lignes...
for (let current_y = 0; current_y < lines; current_y++) {

    // ...au sein desquelles il faut générer les cellules
    for (let current_x = 0; current_x < columns; current_x++) {

        add_cell(current_x , current_y);

    }

}

/* La suite :

• Il faudra qu'une cellule puisse évoluer en fonction de l'état de ses cellules voisines
    > Trouver un moyen (pas trop coûteux en opérations) de lui faire "surveiller" son voisinage

• Il faudra que de manière générale les cellules puissent évoluer dans le temps

*/
