var words = ["acceptable", "believe", "calendar", "discipline", "exceed", "fiery", "grateful", "harass", "ignorance", "judgement"];
var correct = [];
var incorrect = [];
var word = "";
var choose = 0; 
var length = words.length;
var i = 0
var wordcorrect = true; 
var wordLength = 0;
var spell = "";
var chara = "";
var spellchara = "";
var end = 0; 
var correct = 0;
var incorrect = 0; 
var check = 0; 
var wordsDone = 0; 
var attempts = 0; 
var add = document.getElementById("spelling");

function addWord(){
    var put = document.getElementById("spellList");
    var add = put.value;
    words.push(add);
    console.log(words);
}

function chooseWord(){
    choose = Math.floor(Math.random()*length);
    while(i != choose){
        if(i == choose){
            word == words[i];
            wordLength = word.length;
        }
        else{
            i = i + 1; 
        }
    }
}

function checkSpelling(word, spell){
    spell = spell; 
    while((i != wordLength) || (wordcorrect == true)){
        end = i + 1; 
        chara = word.substring(i, end);
        spellchara = spell.substring(i, end);
        check = spellchara.localeCompare(chara);
        if(check == 0){
            i = i + 1; 
        }
        else if((check == 0) && (i == wordLength - 1)){
            wordcorrect = true; 
            window.alert("Correct! Move on to New Question!");
            console.log("correct");
            correct = correct + 1; 
            i = wordLength; 
            words.splice(words.indexOf(word),1);
            correct.push(word);
            chooseWord();
        }
        else{
            window.alert("Incorrect!")
            console.log("incorrect");
            attempts = attempts + 1; 
            if(attempts == 3){
                window.alert();
                incorrect = incorrect + 1;
                wordcorrect = false; 
                i = wordLength; 
                words.splice(words.indexOf(word),1);
                incorrect.push(word); 
                chooseWord();
            }
            else{
                window.alert("Try again!");
            }
        }
    }
    if(wordLength == 0){
        window.alert("Spelling test finished! Correct: "+correct+"Incorrect: "+incorrect);
        window.alert("Words that you spelled incorrect will be followed after this alert box.");
        for(i = 0; i < correct.length; i++){
            window.alert(correct[i]);
        }
    }
}

//global variable for url needed to access Google Spreadsheet data as JSON
var spellinglist = 'https://spreadsheets.google.com/feeds/list/1hwB-zWsGSZaYOLylX58c-1og8fOBwSXp8kOWjIbV1_o/1/public/basic?alt=json';

$(document).ready(function() {

	//ajax call for loading data and then appending it
	$.ajax({
      url:spellinglist,
      success: function(data){
      	//data is all the JSON that is returned from the AJAX call
          readDataAndAppend(data);
      }
  })

	//on submission of the html form, get the data
	$("#spellform").submit(function(event){
		event.preventDefault();
		var data = $(this).serialize();
		console.log(data)
        

		$.ajax({
    	url: "https://script.google.com/macros/s/AKfycbzhSjFLeP2cUQxOKgzslJy0RG4VFzv6CfWZGxesTuaWtWJr9b4X/exec",
      type: "POST",
		  data: data
  	});
        clearfield();
        
	})



})

function update(){
	$.ajax({
      url:spellinglist,
      success: function(data){
      	//data is all the JSON that is returned from the AJAX call
          readDataAndAppend(data);
      }
  })

}


function readDataAndAppend(data){
    var rows = [];
    var cells = data.feed.entry;
    
    for (var i = 0; i < cells.length; i++){
        var rowObj = {};
        rowObj.timestamp = cells[i].title.$t;
        var rowCols = cells[i].content.$t.split(',');
        for (var j = 0; j < rowCols.length; j++){
            var keyVal = rowCols[j].split(':');
            rowObj[keyVal[0].trim()] = keyVal[1].trim();
        }
        rows.push(rowObj);
    }


    //code to parse through rows array and grab the data you need, and append it 
    for (var i = 0; i < rows.length; i++) {
    	//rename rows[i] just to make sure I know what I am working with
    	var unicornObject = rows[i];

    	//turn all of the data into html strings
    	var thisWord = "<li>" + unicornObject.word + "</li>"
    

    	//add all the strings together into an html string that gets appended to a div that already exists on my HTML
    	$("#spellList").append(thisWord)
        
    }
}

function clearfield(){
    if(document.getElementById("spellform")){
        document.toSpell.word.value = "";
    }
}