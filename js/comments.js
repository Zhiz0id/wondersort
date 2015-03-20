/***
 * adds comment what sort algorithm is doing a this moment
 */

function addComment(){
    var event, a, b;
    if (arguments.length == 3){
        this.event = arguments[0];
        this.a = arguments[1];
        this.b = arguments[2];
        //$("#s" + (i+1)).text(digits[d]);
        console.log()
    } else if(arguments.length == 1) {
        this.event = arguments[0];
    }

    var comments = {
        "partition":"partition",
        "swap": "Меняем местами "+ this.a + " и " + this.b,
        "shuffle": "shuffle",
        "miss": "miss",
        "traverse": "Сравниваем",
        "done": "Сортировка выполнена!"

    };

    $('#comment').text(comments[this.event]);

    if(this.event == 'done'){
        $("#stop").hide();
        $("#start").show();
    }
}
