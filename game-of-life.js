/* Les 2 règles du Jeu de la Vie :

• Une cellule morte possédant exactement trois cellules voisines vivantes devient vivante (elle naît) ;
• Une cellule vivante possédant deux ou trois cellules voisines vivantes le reste, sinon elle meurt.

* Donc :
• Si une cellule a exactement trois voisines vivantes, elle est vivante à l’étape suivante.
• Si une cellule a exactement deux voisines vivantes, elle reste dans son état actuel à l’étape suivante.
• Si une cellule a strictement moins de deux ou strictement plus de trois voisines vivantes, elle est morte à l’étape suivante.

 */

// Quelques "réglages" pour la grille de cellules :
const cell_size = 20;
const columns = 30;
const lines = 30;
const period = 100;

// Préparation d'un pseudo-constructeur de cellules :

function add_cell(new_x, new_y) {
    let my_cell = {// ou let my_cell = new Object();

        // Propriétés de la cellule :
        alive: false,
        alive_next_turn: false,
        x: new_x,
        y: new_y,

        // Méthodes de la cellule : (Note : dans les déclarations de méthodes d'un objet, le mot-clé "this" fera référence à cet objet)
        draw: function () {// Sera appelée une seule fois par cellule : lorsqu'il faudra la matérialiser dans le DOM

            this.HTML_cell = document.createElement("div");

            // À partir de là une nouvelle propriété est ajoutée à la cellule...
            document.body.appendChild(this.HTML_cell);

            // ...faisant bien référence à un élément du DOM
            this.HTML_cell.classList.add("cell"); // ou .className = "cell"
            this.HTML_cell.style.width = cell_size + "px";
            this.HTML_cell.style.height = cell_size + "px";
            this.HTML_cell.style.left = (this.x * cell_size) + "px";
            this.HTML_cell.style.top = (this.y * cell_size) + "px";

            this.HTML_cell.addEventListener("click", this.toggle_state);
        },

        update_HTML: function () { // Sera appelée à chaque fois qu'il faudra changer l'état visuel de la cellule ! Pourrait faire réellement dépendre la présence de la classe "alive" de la valeur de la propriété alive
            if (this.alive === true) {
                this.HTML_cell.classList.add("alive");
            } else {
                this.HTML_cell.classList.remove("alive");

            }
        },

        toggle_state: function () {

            my_cell.alive = !my_cell.alive; // inversion de la valeur (booléenne) de la propriété alive

            my_cell.update_HTML();

        },

        count_alive_neighbors: function () {
            let count = 0;

            // Déterminer les coordonnées des différentes voisines à tester
            /*
            * Ci-dessous, on utilise des tests ternaires:
            * (condition) ? valeur si condition validée : valeur si condition non validée
            *
            * Le but est assez proche d'un if (condition) {} else {}, mais on a plus la possibilité de "placer" directement une valeur ou une autre où l'ont veut (comme ici en guise d'élements d'un tableau).
            *
            * En fait, l'ensemble de l'expression finti par être remplacée par l'une des deux valeurs.
            *
            * Sans cela, on aurait été obligé, via un if classique, de commencer par créer un tableau vide, d'y ajouter les vlaeurs "manuellement" selon les valeurs/réponses aux tests.
            *
            * */
            let george_x = [
                (this.x > 0) ? this.x - 1 : columns - 1,
                this.x,
                (this.x < columns - 1) ? this.x + 1 : 0,
            ];

            let george_y = [
                (this.y > 0) ? this.y - 1 : lines - 1,
                this.y,
                (this.y < lines - 1) ? this.y + 1 : 0,
            ];

            for (let tested_y of george_y) {
                for (let tested_x of george_x) {
                    if (cells[tested_y] && cells[tested_y][tested_x]) {
                        //console.log(cells[tested_y][tested_x]);
                        if (cells[tested_y][tested_x] != this && cells[tested_y][tested_x].alive === true) {
                            count++;
                        }
                    }
                }
            }
            return count;
        }
    };

    // Une cellule devra apparaître dans le DOM dès sa création :

    my_cell.draw();

    // Il pourrait s'avérer pratique à terme que notre pseudo-constructeur renvoie la cellule qu'il aura généré :

    return my_cell;

}

///////// Génération de l'ensemble des cellules

let cells = []; // ou let cells = new Array();
let cells_unsorted = [];

// Générer toutes les lignes...
for (let current_y = 0; current_y < lines; current_y++) {

    // ...au sein desquelles il faut générer les cellules
    for (let current_x = 0; current_x < columns; current_x++) {

        let nouvelle_cellule = add_cell(current_x, current_y);
        cells_unsorted.push(nouvelle_cellule);

        if (!cells[current_y]) {
            cells.push([]);
        }
        cells[current_y].push(nouvelle_cellule);

    }

}

//console.log(cells[0][0].count_alive_neighbors());
//console.log(cells[2][2].count_alive_neighbors());

// On a maintenant un tableau contenant des références à toutes nos cellules
//console.log(cells);
//console.log(cells[4][5]);

let game_running = false;
let life_cycle;
let button = document.querySelector("button")
// Mise en place du cycle (répétition d'instructions à intervalles régulièrs)
button.addEventListener("click", function () {

    if (!game_running) {
        button.textContent = "STOP"
        life_cycle = setInterval(function () {

            // Chaques cellule doit vérifier combien de cellules adjacentes sont en vie
            for (let the_cell of cells_unsorted) {
                if (the_cell.count_alive_neighbors() == 2) {
                    // La cellule garde son état actuel
                    the_cell.alive_next_turn = the_cell.alive;
                } else if (the_cell.count_alive_neighbors() == 3) {
                    // La cellule devient vivante
                    the_cell.alive_next_turn = true;
                } else {
                    // La cellule meurt
                    the_cell.alive_next_turn = false;
                }
            }

            for (let the_cell of cells_unsorted) {
                the_cell.alive = the_cell.alive_next_turn;
                the_cell.update_HTML();
            }
        }, period);
    } else {
        clearInterval(life_cycle);
        button.textContent = "START"
    }
    game_running = !game_running;
})

// [Le reste du code...]

/* La suite :

• Il faudra qu'une cellule puisse évoluer en fonction de l'état de ses cellules voisines
    > Trouver un moyen (pas trop coûteux en opérations) de lui faire "surveiller" son voisinage

• Il faudra que de manière générale les cellules puissent évoluer dans le temps

*/
