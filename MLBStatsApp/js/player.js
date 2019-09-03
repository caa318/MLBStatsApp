var playerID = getUrlVars()["player"];
var teamsJSON = {};
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}


$.getJSON(
  "https://statsapi.mlb.com/api/v1/teams?sportId=1",
  function (data){
    teams = data["teams"];
    for (team in teams) {
      currentTeam = teams[team];
      let leagueName = currentTeam["id"]
      teamsJSON[currentTeam["id"]] = currentTeam["abbreviation"];
    }
  }
);


$.getJSON(
  "https://statsapi.mlb.com/api/v1/people/"+playerID+"?hydrate=stats(group=[hitting,pitching,fielding],type=[yearByYear])",
  function (data) {


    var player, stat, split, splits;

    var player = data["people"][0];


    document.getElementById("titleBar").innerHTML =player["fullName"];


    var personalImage = document.getElementById("personalImage");
    personalImage.setAttribute('src','https://securea.mlb.com/mlb/images/players/head_shot/'+player.id+'.jpg');
    personalImage.setAttribute('onerror',"this.src = 'https://secure.ui.bamstatic.com/clubs/mlb/images/player-default.png'");
    var birth;
    if(player["birthCity"]){
      birth = player["birthCity"]
    }
    if(player["birthStateProvince"]){
      birth += ", "+player["birthStateProvince"]
    }
    if(player["birthCountry"]){
      birth += ", "+player["birthCountry"]
    }
    document.getElementById("Name").innerHTML=player["fullName"];
    document.getElementById("Nickname").innerHTML=player["nickName"] ? player["nickName"] : "N/A";
    document.getElementById("Position").innerHTML=player.primaryPosition["type"];
    document.getElementById("Number").innerHTML=player["primaryNumber"];
    document.getElementById("BatsThrows").innerHTML=player.batSide["code"] + "/" + player.pitchHand["code"];
    document.getElementById("BirthDate").innerHTML=player["birthDate"];
    document.getElementById("BirthCity").innerHTML=birth ? birth : "N/A";
    document.getElementById("Height").innerHTML=player["height"];
    document.getElementById("Weight").innerHTML=player["weight"];





    var playerStats =player["stats"];

    var statsContainerHitting = document.createElement('div');
    statsContainerHitting.setAttribute('class','w3-container w3-section');
    var statsHitting = document.createElement('div');
    statsHitting.setAttribute('class','w3-responsive w3-grey w3-card-4');
    var header = document.createElement('div');
    header.setAttribute('class','w3-grey w3-bold w3-xlarge w3-center padding-8' );
    header.innerHTML = "Hitting";
    statsHitting.appendChild(header);
    statsContainerHitting.appendChild(statsHitting);


    var statsContainerPitching = document.createElement('div');
    statsContainerPitching.setAttribute('class','w3-container w3-section');
    var statsPitching = document.createElement('div');
    statsPitching.setAttribute('class','w3-responsive w3-grey w3-card-4');
    var header = document.createElement('div');
    header.setAttribute('class','w3-grey w3-bold w3-xlarge w3-center padding-8' );
    header.innerHTML = "Pitching";
    statsPitching.appendChild(header);
    statsContainerPitching.appendChild(statsPitching);


    var hasHitting = false;
    var hasPitching = false;
    for(stat in playerStats){
      splits = playerStats[stat]["splits"];

      var statType = playerStats[stat]["group"].displayName;
      if(statType === "hitting"){
        hasHitting = true;
        var hittingStats = document.createElement('table');
        hittingStats.setAttribute('id','hittingStats');
        hittingStats.classList.add('w3-table-all');

        var thead = document.createElement('thead');
        thead.appendChild(addHittingStatsHeader(splits[0]));
        hittingStats.appendChild(thead);

        var tbody = document.createElement('tbody');
        for (split in splits) {
          tbody.appendChild(addHittingStats(splits[split]));
        }
        hittingStats.appendChild(tbody);
        statsHitting.appendChild(hittingStats);

      }
      else if(statType === "pitching"){
        hasPitching = true;
        var pitchingStats= document.createElement('table');
        pitchingStats.setAttribute('id','pitchingStats');
        pitchingStats.classList.add('w3-table-all');

        var thead = document.createElement('thead');
        thead.appendChild(addPitchingStatsHeader(splits[0]));
        pitchingStats.appendChild(thead);

        var tbody = document.createElement('tbody');
        for (split in splits) {
          tbody.appendChild(addPitchingStats(splits[split]));
        }
        pitchingStats.appendChild(tbody);
        statsPitching.appendChild(pitchingStats);

      }

    }
    console.log("playerCode " + player.primaryPosition["code"]);
    if(player.primaryPosition["code"] === "1"){
      hasPitching ? document.getElementById("statsContainer").appendChild(statsContainerPitching) : null;
      hasHitting ? document.getElementById("statsContainer").appendChild(statsContainerHitting) : null;
    }
    else{
      hasHitting ? document.getElementById("statsContainer").appendChild(statsContainerHitting) : null;
      hasPitching ? document.getElementById("statsContainer").appendChild(statsContainerPitching) : null;
    }

  }
);



function addHittingStats(stats) {
  return addHittingStatsInternal(stats, false);
}


function addHittingStatsHeader(stats) {
  return addHittingStatsInternal(stats, true);
}


function addHittingStatsInternal(stats, cat){
  var row = document.createElement('tr');
  if(!cat){
    row.classList.add('w3-hover-yellow');
  }
  row.appendChild(addStat("Season",stats["season"],"","none",cat));
  row.appendChild(addStat("Team",stats.team ? teamsJSON[stats.team["id"]] : "TOT","","none",cat));
  row.appendChild(addStat("AVG",stats.stat["avg"],"","none",cat));
  row.appendChild(addStat("G",stats.stat["gamesPlayed"],"","none",cat));
  row.appendChild(addStat("AB",stats.stat["atBats"],"","none",cat));
  row.appendChild(addStat("R",stats.stat["runs"],"","small",cat));
  row.appendChild(addStat("H",stats.stat["hits"],"","small",cat));
  row.appendChild(addStat("2B",stats.stat["doubles"],"","medium",cat));
  row.appendChild(addStat("3B",stats.stat["triples"],"","medium",cat));
  row.appendChild(addStat("HR",stats.stat["homeRuns"],"","medium",cat));
  row.appendChild(addStat("RBI",stats.stat["rbi"],"","medium",cat));
  row.appendChild(addStat("TB",stats.stat["totalBases"],"","small",cat));
  row.appendChild(addStat("IBB",stats.stat["intentionalWalks"],"","medium",cat));
  row.appendChild(addStat("SO",stats.stat["strikeOuts"],"","small",cat));
  row.appendChild(addStat("SB",stats.stat["stolenBases"],"","medium",cat));
  row.appendChild(addStat("CS",stats.stat["caughtStealing"],"","medium",cat));
  row.appendChild(addStat("SB%",stats.stat["stolenBasePercentage"],"","medium",cat));
  row.appendChild(addStat("OBP",stats.stat["obp"],"","none",cat));
  row.appendChild(addStat("SLG",stats.stat["slg"],"","none",cat));
  row.appendChild(addStat("OPS",stats.stat["ops"],"","none",cat));
  row.appendChild(addStat("PA",stats.stat["plateAppearances"],"","medium",cat));
  row.appendChild(addStat("HBP",stats.stat["hitByPitch"],"","medium",cat));
  row.appendChild(addStat("SAC",stats.stat["sacBunts"],"","medium",cat));
  row.appendChild(addStat("SF",stats.stat["sacFlies"],"","medium",cat));
  row.appendChild(addStat("GIDP",stats.stat["groundIntoDoublePlay"],"","medium",cat));

  return row;
}


function addPitchingStats(stats) {
  return addPitchingStatsInternal(stats, false);
}


function addPitchingStatsHeader(stats) {
  return addPitchingStatsInternal(stats, true);
}


function addPitchingStatsInternal(stats, cat){
  var row = document.createElement('tr');
  if(!cat){
    row.classList.add('w3-hover-yellow');
  }
  row.appendChild(addStat("Season",stats["season"],"","none",cat));
  row.appendChild(addStat("Team",stats.team ? teamsJSON[stats.team["id"]] : "TOT","","none",cat));
  row.appendChild(addStat("W",stats.stat["wins"],"","none",cat));
  row.appendChild(addStat("L",stats.stat["losses"],"","none",cat));
  row.appendChild(addStat("ERA",stats.stat["era"],"","none",cat));
  row.appendChild(addStat("G",stats.stat["gamesPitched"],"","none",cat));
  row.appendChild(addStat("GS",stats.stat["gamesStarted"],"","none",cat));
  row.appendChild(addStat("GF",stats.stat["gamesFinished"],"","none",cat));
  row.appendChild(addStat("CG",stats.stat["completeGames"],"","none",cat));
  row.appendChild(addStat("SHO",stats.stat["shutouts"],"","none",cat));
  row.appendChild(addStat("SV",stats.stat["saves"],"","none",cat));
  row.appendChild(addStat("SVO",stats.stat["saveOpportunities"],"","none",cat));
  row.appendChild(addStat("HOLD",stats.stat["holds"],"","none",cat));
  row.appendChild(addStat("IP",stats.stat["inningsPitched"],"","none",cat));
  row.appendChild(addStat("H",stats.stat["hits"],"","none",cat));
  row.appendChild(addStat("ER",stats.stat["earnedRuns"],"","none",cat));
  row.appendChild(addStat("HR",stats.stat["homeRuns"],"","none",cat));
  row.appendChild(addStat("BB",stats.stat["baseOnBalls"],"","none",cat));
  row.appendChild(addStat("IBB",stats.stat["intentionalWalks"],"","none",cat));
  row.appendChild(addStat("SO",stats.stat["strikeOuts"],"","none",cat));
  row.appendChild(addStat("WHIP",stats.stat["whip"],"","none",cat));
  row.appendChild(addStat("AVG",stats.stat["avg"],"","none",cat));
  row.appendChild(addStat("OBP",stats.stat["obp"],"","none",cat));
  row.appendChild(addStat("SLG",stats.stat["slg"],"","none",cat));
  row.appendChild(addStat("OPS",stats.stat["ops"],"","none",cat));
  row.appendChild(addStat("G/A",stats.stat["groundOutsToAirouts"],"","none",cat));
  row.appendChild(addStat("H/9",stats.stat["hitsPer9Inn"],"","none",cat));
  row.appendChild(addStat("R/9",stats.stat["runsScoredPer9"],"","none",cat));
  row.appendChild(addStat("HR/9",stats.stat["homeRunsPer9"],"","none",cat));
  row.appendChild(addStat("BB/9",stats.stat["walksPer9Inn"],"","none",cat));
  row.appendChild(addStat("K/9",stats.stat["strikeoutsPer9Inn"],"","none",cat));
  row.appendChild(addStat("K%",stats.stat["strikePercentage"],"","none",cat));
  row.appendChild(addStat("K/BB",stats.stat["strikeoutWalkRatio"],"","none",cat));

  return row;
}


function addStat(stat, value, width, hide, statCategory){
  var  element;
  if(statCategory) {
    element = document.createElement('th');
    element.innerHTML = stat;
    element.classList.add('w3-grey')
    element.classList.add('w3-bold')
  } else{
    element = document.createElement('td');
    element.innerHTML = value;

  }
  if(hide === "medium"){
    element.setAttribute('class','w3-hide-medium w3-hide-small')
  } else if(hide === "small"){
    element.setAttribute('class','w3-hide-small')
  }
  else{
    element.setAttribute('class','')
  }
  if(width){
    element.style.width=width;
  }
  element.classList.add('text-right');
  console.log(stat+":  "+value);
  return element
}


function goHome(){
  window.location.href='teams.html';
  return;
}
