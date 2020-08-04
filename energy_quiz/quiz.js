let answer = "";
let value = 0;
let totalpoints = 0;
$("#answer_box").val("");


//function to get a question from the api, display the hints, and update some other info on the page
$(".get_question").click(function() {

    $(".get_question").text("Your question:");
    $(".correct_answer").text("");
    $(".hints").text("Hints: sun, lead, fossil fuel, strip mining, british thermal units, horses, starch, electricity, spring, northeast, uranium, diesel, wind farm, coal, renewable, an oil refinery, a nuclear plant, hydroelectric.");


    let url = "http://jservice.io/api/category?id=769";

    $.getJSON(url, function(all_clues) {

        let i = Math.floor(Math.random() * 25);

        let clue = all_clues.clues[i];
        console.log(clue.answer);
        console.log(clue.value);
        console.log(all_clues);

        $(".display_question").text(clue.question);
        $("#answer_box").val("");
        $(".button_check").text("Check!");
        answer = clue.answer;
        value = clue.value;
    });
});

//function to check the answer and assign points if correct
$(".button_check").click(function() {

    let userInput = $("#answer_box").val();

    $(".hints").text("");

    if (userInput.toUpperCase() == answer.toUpperCase()) {
        $(".button_check").text("Correct!");
        $(".check").fadeIn();
        $("#points").text(value);
        $(".get_question").text("New question please!");
        totalpoints = totalpoints + value;
        $(".summary_points").fadeIn();
        $("#total_points").text(totalpoints);

    } else {
        $(".button_check").text("Not quite right. Try again!");
        $(".correct_answer").fadeIn();
        $(".correct_answer").text("Correct answer should have been: " + answer);
        $("#points").text(0);
        $(".get_question").text("New question please!");
    }
});