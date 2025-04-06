const fillers = {
  adventurer: [
    "My dude",
    "Bro",
    "WesBot",
    "Fellow",
    "Cool person",
    "Geoff",
    "Football Fan",
    "LIONEL MESSI",
    "Catalan",
    "Barca Fan",
  ],
  teamName: ["FCB", "Football Club Barcelona", "Barca"],
  history: [
    "was founded on November 29, 1899, by Hans Gamper, and a multinational group of football enthusiasts, not just Catalans!",
    "in the Spanish Civil War (1936–39), Barça’s president Josep Sunyol (a Catalan nationalist) was executed by Franco’s forces and the club was forced to change parts of its identy like its badge and name!",
    "The clubs colors werent always Blaugrana (blue and red), the teams first kit was half white, half blue. It wasnt until 1900 when the blaugrana colors were adopted!",
  ],
  amazingness: [
    "our trophy cabinet is stackeeeeedddd!!!! we have 5 ucls and 27 La liga titles, and since I know other clubs have more than us lemme say when we win we win in style. We are on of two, and were the first, to win 6 trophies, EVERYTHING, in one calendar year SEXTUPLE!!!!! ANd lets not forget about our womens team how is undoublnetly hte best team in the womens league too!!!!!!!",
    "our team is home to so many legendary players; Neymar JR-the BEST braizlian ever, Johan Cryuff-the man who invented modern football, Maradona-NF hand of god, Rondalihino-just one of the goat, XAVI AND INESTA-the best midfienelders evererrrrr, and of course th eone and only the goat the best to ever do it, mister Im the best, LIONEL MESSIIIIIIIIIIIIIIIIIIIIIIIIIII!",
    "La Massia the best fooballing acamdey in the world just keeps on producing wonderkids, and so many other great names in football have come through the ranks of $teamName; MEssi, Xavi, INesta, Gavi, Lamine Yamal, Curabsi, Pique, Pep Guardialia, Luis Enrique"
  ],
  whyBeAFan:[
    "Our style of play is brilliant and fun to watch. We invented the tika taka back in 09 and it was a joy to watch the players pukll of one two passes between each other ot form incrible combintation play, and now with our current coach HAnsi Flick bringing german pressing and directness its never been a better time to watch FCB in action!",
    "We have brilliant youngsters comming coming up to team right now such as Pedri, Gavi, Pau Cubarsi, Balde and LAmine YAMAL (GOLDEN BOY 2024 and EUros Young player of the tournmanet 2024 winner) who give youth and exicment to the team along with seasonsed players such as Wotkek Szenezyzy, Frankie Dejong, and ROBER LEWANGOALSKI. Our team is a perfect mix of the new and the old!",
    "$teamName is more than just a football club. Més Que Un Club (More Than a Club) – is $teamName's main moto and represents Catalan identity, democracy, and social causes. $teamName is filled with rich culuture, and the fans own the club (51% of it). We also have a loyal fanbase with over 300 million fans worldwide and soon to be biggest staduim, the Camp Nou which can seat 95,000 people!"
  ]
};

const template = `$adventurer, today I will tell you about $teamName

Did you know that $teamName, $history

I believe, and anyone with a brain, that $teamName is the best in the world beacuse $amazingness

If you havent started watching $teamName yet, they you definetly should. $whyBeAFan 
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();
