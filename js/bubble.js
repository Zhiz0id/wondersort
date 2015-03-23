/**
 * bubble sort algorithm
 *      creates also actions for animation
 */
function bubble(array) {
    var actions = [];

    function swap(i, j) {
        var t = array[i];
        var f = array[j];
        array[i] = array[j];
        array[j] = t;
        actions.push({type: "swap", i: i, j: j, a: t, b: f});
    }

    function bubble() {
        var swaped = false;
        do {
            swaped = false;
            for (var i = 1; i < array.length; ++i) {
                if (array[i - 1] > array[i]) {
                    swap(i - 1, i);
                    swaped = true;
                } else {
                    actions.push({type: "traverse", "traverse": i, a: array[i - 1], b: array[i]});
                }
            }
        } while (swaped);
        actions.push({type: "done", "done": i});
    }

    bubble();
    return actions;
}