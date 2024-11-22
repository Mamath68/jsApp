/* Les 2 règles du Jeu de la Vie :

• Une cellule morte possédant exactement trois cellules voisines vivantes devient vivante (elle naît) ;
• Une cellule vivante possédant deux ou trois cellules voisines vivantes le reste, sinon elle meurt.

Donc :
• Si une cellule a exactement trois voisines vivantes, elle est vivante à l’étape suivante.
• Si une cellule a exactement deux voisines vivantes, elle reste dans son état actuel à l’étape suivante.
• Si une cellule a strictement moins de deux ou strictement plus de trois voisines vivantes, elle est morte à l’étape suivante.

 */

// Quelques "réglages" pour la grille de cellules :

const cell_size = 10;
const columns = 60;
const lines = 40;
const period = 100; // millisecondes

// Gestion du "mode crayon / gomme"
let mouse_is_down = false;
let eraser_mode = false; // si true : on efface au lieu de dessiner

// Préparation d'un pseudo-constructeur de cellules :

function add_cell(new_x, new_y) {

    let my_cell = { // ou let my_cell = new Object();

        // Propriétés de la cellule :
        alive: false,
        alive_next_turn: false,
        x: new_x,
        y: new_y,

        // Méthodes de la cellule :
        // (Note : dans les déclarations de méthodes d'un objet, le mot-clé "this" fera référence à cet objet)

        draw: function () { // Sera appelée une seule fois par cellule : lorsqu'il faudra la matérialiser dans le DOM

            this.HTML_cell = document.createElement("div");
            // À partir de là une nouvelle propriété est ajoutée à la cellule...
            document.body.appendChild(this.HTML_cell);
            // ...faisant bien référence à un élément du DOM

            this.HTML_cell.classList.add("cell"); // ou .className = "cell"
            this.HTML_cell.style.width = cell_size + "px";
            this.HTML_cell.style.height = cell_size + "px";
            this.HTML_cell.style.left = (this.x * cell_size) + "px";
            this.HTML_cell.style.top = (this.y * cell_size) + "px";

            //this.HTML_cell.addEventListener("click", this.toggle_state);

            /* A CORRIGER : On veut un "mode crayon"
            
            - Actuellement (au clic) :
                > la cellule réagit lorsqu'on a relaché le clic
                > il n'est pas possible de faire réagir plusieurs cellules en un clic (+ glissé)

            - Ce qu'on veut :
                > commencer à dessiner dès qu'on "appuie"
                > continuer à dessiner jusqu'à ce qu'on relache
                > dessiner (faire interagir) tout ce qu'on survole entre l'appui et le relachement
            
            */
                this.HTML_cell.owner = this;

                this.HTML_cell.addEventListener("mousedown", function() {
                    this.owner.toggle_state();
                    mouse_is_down = true;
                    if (this.owner.alive) {
                        eraser_mode = false;
                    } else {
                        eraser_mode = true;
                    } // ou : eraser_mode = !this.owner.alive;
                });

                this.HTML_cell.addEventListener("mouseover", function(){
                    if (mouse_is_down && (!this.owner.alive && !eraser_mode) || (this.owner.alive && eraser_mode)) {
                        /*
                            Il faut que :
                            - le clic soit en cours (mouse_is_down)
                            ET
                            SOIT
                                - la cellule est en vie ET on est en mode gomme
                                - la cellule est morte ET on est en mode crayon
                        */
                        this.owner.toggle_state();
                    }
                });

                document.addEventListener("mouseup", function(){
                    mouse_is_down = false;
                });

        },

        update_HTML: function () { // Sera appelée à chaque fois qu'il faudra changer l'état visuel de la cellule

            if (this.alive === true) {
                this.HTML_cell.classList.add("alive");
            } else {
                this.HTML_cell.classList.remove("alive");
            }
        },

        toggle_state: function () {

            this.alive = !this.alive; // inversion de la valeur (booléenne) de la propriété alive

            this.update_HTML();

        },

        count_alive_neighbors: function () {

            let count = 0;
            // Déterminer les coordonnées des différentes voisines à tester

            /* Ci-dessous on utilise des tests ternaires :
            (condition) ? valeur si condition validée : valeur si condition non validée

            Le but est assez proche d'un if (condition) {} else {}, mais on a en plus la possibilité de "placer" directement une valeur ou une autre où l'on veut (comme ici en guise d'éléments d'un tableau).

            En fait, l'ensemble de l'expression finit par être remplacée par l'une des deux valeurs.

            Sans cela, on aurait été obligé, via un if classique, de commencer par créer un tableau vide d'y ajouter les valeurs "manuellement" selon les réponses aux tests.

            */

            let possible_x = [
                (this.x > 0) ? this.x - 1 : columns - 1 , 
                this.x,
                (this.x < columns - 1) ? this.x + 1 : 0
            ];

            let possible_y = [
                (this.y > 0) ? this.y - 1 : lines - 1 , 
                this.y,
                (this.y < lines - 1) ? this.y + 1 : 0
            ];

            for (let tested_y of possible_y) {
                for (let tested_x of possible_x) {
                    if (cells[tested_y] && cells[tested_y][tested_x]) {

                        if (cells[tested_y][tested_x] != this && cells[tested_y][tested_x].alive === true) {
                            count++;
                        }

                    }
                }
            }

            return count;
        }


    }

    // Une cellule devra apparaître dans le DOM dès sa création :
    my_cell.draw();

    // Il pourrait s'avérer pratique à terme que notre pseudo-constructeur renvoie la cellule qu'il aura généré :
    return my_cell;

}

///////// Génération de l'ensemble des cellules

// Tableau "bien rangé" :
let cells = []; // ou let cells = new Array();

// Tableau simple (pour les cas où on veut juste un accès à toutes les cellules sans besoin de coordonnées) :
let cells_unsorted = [];

// Générer toutes les lignes...
for (let current_y = 0; current_y < lines; current_y++) {

    // ...au sein desquelles il faut générer les cellules
    for (let current_x = 0; current_x < columns; current_x++) {

        let nouvelle_cellule = add_cell(current_x, current_y);

        cells_unsorted.push(nouvelle_cellule);

        if (!cells[current_y]) {
            cells.push([]); // Ouvrir une "nouvelle ligne" dans notre tableau 2d
        }

        cells[current_y].push(nouvelle_cellule); // On ajoute la nouvelle cellule dans la bonne "ligne" de notre tableau. Cette cellule se trouvera à cells[current_y][current_x]

        /*
        
        cells = [
        [cellule1, cellule2, ...] , // toute la première ligne
        [] , // toute le deuxième ligne
        ... // etc
        ]

        */

    }

}

// On a maintenant un tableau contenant des références à toutes nos cellules
//console.log(cells);
//console.log(cells[4][5]);

// Mise en place du cycle (répétition d'instructions à intervalles réguliers)

let game_running = false;
let life_cycle;
let button = document.querySelector("button");

button.addEventListener("click", function () {


    if (!game_running) { // Le jeu ne tourne pas, on le démarre

        button.textContent = "Stop";

        life_cycle = setInterval(function () {

            // Chaque cellule doit vérifier combien de cellules adjacentes sont en vie
            for (let the_cell of cells_unsorted) {

                if (the_cell.count_alive_neighbors() == 2) {
                    // la cellule garde son état actuel
                    the_cell.alive_next_turn = the_cell.alive;

                } else if (the_cell.count_alive_neighbors() == 3) {
                    // la cellule devient vivante
                    the_cell.alive_next_turn = true;


                } else {
                    // la cellule meurt
                    the_cell.alive_next_turn = false;

                }
            }

            for (let the_cell of cells_unsorted) { // À optimiser
                the_cell.alive = the_cell.alive_next_turn;
                the_cell.update_HTML();
            }

        }, period);

    } else { // Le jeu tourne, on l'interromp

        button.textContent = "Start !";
        clearInterval(life_cycle);
    }

    game_running = !game_running;

});

document.body.addEventListener("mouseenter", function(){
    clearInterval(life_cycle);
});

document.body.addEventListener("mouseleave", function(){

    life_cycle = setInterval(function () {

        // Chaque cellule doit vérifier combien de cellules adjacentes sont en vie
        for (let the_cell of cells_unsorted) {

            if (the_cell.count_alive_neighbors() == 2) {
                // la cellule garde son état actuel
                the_cell.alive_next_turn = the_cell.alive;

            } else if (the_cell.count_alive_neighbors() == 3) {
                // la cellule devient vivante
                the_cell.alive_next_turn = true;

            } else {
                // la cellule meurt
                the_cell.alive_next_turn = false;

            }
        }

        for (let the_cell of cells_unsorted) { // À optimiser
            the_cell.alive = the_cell.alive_next_turn;
            the_cell.update_HTML();
        }

    }, period);

});
