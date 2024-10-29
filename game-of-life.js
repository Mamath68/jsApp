/*
* Les 2 Règles du Jeu Vie
*
* Une cellule morte possédant exactement trois cellules voisines vivantes devient vivante (elle nait);
* Une cellule vivante possédant deux ou trois cellules voisines vivantes le reste, sinon elle meurt.
*
* Donc:
* Si une cellule a exactement trois voisines vivantes, elle est vivante à l'étape suivante.
* Si une cellule a exactement deux voisines vivantes, elle reste dans son état actuel à l'étape suivante.
* Si une cellule a strictement moins de deux ou strictement plus de trois voisines vivantes, elle est morte  à l'étape suivante.
*
* -------
*
* Concrètement en JS il faudra:
*
* -> Générer une grille composée de cellules, pouvant présenter un état "mort" et un état "vivant"
* -> Ces cellules seront des carrés; elles devront pouvoir se positionner librement à des coordonnées X et Y de la page
*
* Dans la structure HTML, une cellule :
* - Correspondra à une div de class "cell"
* - Prendra la classe supplémentaire "alive" lorsqu'elle sera vivante
* - Devra avoir une hauteur et une largeur en pixels (la même pour toutes les cellules)
* - Devra avoir des coordonnées en pixels (top et left)
*
*
* */

// console.dir(document.body);

const cell_size = 30;
const columns = 10;
const lines = 10;

function add_cell(new_x, new_y) {

    let my_cell = {/* ou let my_cell = new Object();*/
        alive: false,
        x: new_x,
        y: new_y,

        draw: function () {
            this.HTML_cell = document.createElement("div");
            document.body.appendChild(this.HTML_cell);
            this.HTML_cell.classList.add("cell"); // ou .className = "cell"
            this.HTML_cell.style.width = cell_size + "px";
            this.HTML_cell.style.height = cell_size + "px";
            this.HTML_cell.style.left = (this.x * cell_size) + "px";
            this.HTML_cell.style.top = (this.y * cell_size) + "px";

            this.HTML_cell.addEventListener("click", this.toggle_state)
        },

        update_HTML: function () {
            this.HTML_cell.classList.toggle("alive");
        },

        toggle_state: function () {
            my_cell.alive = !my_cell.alive;

            my_cell.update_HTML();
        },

    }
    my_cell.draw();
    return my_cell;
}

/////// Génération de l'ensmble des cellules

// Générer toutes les lignes
for (let current_y = 0; current_y < lines; current_y++) {
    for (let current_x = 0; current_x < columns; current_x++) {
        add_cell(current_x, current_y);
    }
}
