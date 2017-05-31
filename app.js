
var ClozeCard = require("./clozeCard.js");
var BasicCard = require("./basicCard.js");
var inquirer = require("inquirer");
var fs = require("fs");

var front = [];
var back = [];
var text = [];
var cloze = [];
var partial = [];
var fulltext =[];

function createBasicCard(){
    inquirer.prompt([{
        name: "front",
        message: "PLease enter your question for the front flashcard"
    }, {
        name: "back",
        message: "please enter your answer for the back flashcard"
    }
    ]).then(function(answers){
        front = answers.front;
        back = answers.back;
        cloze = answers.back;
        var newFlashcard = new BasicCard(front, back);
        console.log("");
        console.log("");
        console.log("Front card: ");
        console.log(newFlashcard.front);
        console.log("");
        console.log("Back card and cloze: ");
        console.log(newFlashcard.back);
        console.log("");
        console.log("");

        fs.appendFile('BasicCard.txt', JSON.stringify(newFlashcard)+",", function(err){
            if(err){
                console.log(err);
            }
        });
        createClozeCard();
    });
};

function createClozeCard(){
    inquirer.prompt({
        name: "text",
        message: 'Which word should be replaced with "'+back+'"'
    }).then(function(answer){
        text = answer.text;
        
        if(front.includes(text)){
            for(var i = 0; i < front.length; i++){
                if(front[i] === "?"){
                    partial = front.replace(text, "________").replace("?", ".");
                } else {
                    partial = front.replace(text, "________");
                };    
            };
            
            for(var x = 0; x < front.length; x++) {

                if(front[x] === "?"){
                    fulltext = front.replace(text, cloze).replace("?", ".");
                } else {
                    fulltext = front.replace(text, cloze);
                };
            };
    
        
        var newClozeFlashcard = new ClozeCard(partial, fulltext);

        fs.appendFile('ClozeCard.txt', JSON.stringify(newClozeFlashcard)+",", function(err){
            if(err){
                console.log(err);
            };
        });
        console.log("");
        console.log("");
        console.log("Cloze partialtext: ");
        console.log(newClozeFlashcard.partial);
        console.log("");
        console.log("Cloze fulltext: ");
        console.log(newClozeFlashcard.fulltext);
        console.log("");
        console.log("");
        askQA();

        } else if (!front.includes(text)) {
            console.log("");
            console.log("Word does not match");
            console.log("Please Try again");
            console.log("");
            createClozeCard();
        };      
    });
};

function viewFlascard(){

    inquirer.prompt([{
        type: "list",
        name: "view",
        message: "What would you like to view?",
        choices: ["flashcards","clozecards"]
    }]).then(function(answer){
        console.log(answer.view);
        if (answer.view === "flashcards"){
             fs.readFile("BasicCard.txt", "utf8", function(error, data) { 
                var output = data.split(",");
                console.log("");
                for (var i = 0; i < output.length; i++) {
                console.log(output[i]);
                };
            askQA();
            });
        } else if (answer.view === "clozecards") {
            fs.readFile("ClozeCard.txt", "utf8", function(error, data) {
                var output = data.split(",");
                console.log("");
                for (var i = 0; i < output.length; i++) {
                console.log(output[i]);
                };
            askQA();
            });
        };
    });
};
function askQA(){
    inquirer.prompt({
        type: "list",
        name: "ask",
        message: "What would you like to do?",
        choices:["Create flashcards", "View flashcards"]
    }).then(function(answer){
        if(answer.ask === "Create flashcards"){
            createBasicCard();
        }else if(answer.ask === "View flashcards"){
            viewFlascard();
        };
    });
};

askQA();