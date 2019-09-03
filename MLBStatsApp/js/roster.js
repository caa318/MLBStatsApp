function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}
var teamID = getUrlVars()["team"];
console.log('teamID = ' + teamID)
var teamsJSON = {};
$.getJSON(
  "https://statsapi.mlb.com/api/v1/teams?sportId=1",
  function (data){
    teams = data["teams"];
    for (team in teams) {
      currentTeam = teams[team];
      let leagueName = currentTeam["id"]
      teamsJSON[currentTeam["id"]] = currentTeam["name"];
    }
  }
);

$.getJSON(
  "https://statsapi.mlb.com/api/v1/teams/"+teamID+"/roster/Active?hydrate=person",
  function (data) {
    var player, currentPlayer;
    var roster = data["roster"];

    var rosterList = document.getElementById("rosterList")
    for(player in roster){
      currentPlayer = roster[player]
      var playerListItem = document.createElement('li');
      playerListItem.setAttribute('class','w3-bar w3-row')
      playerListItem.setAttribute('id', currentPlayer["person"].id);


      var playerListItemNumber = document.createElement('div');
      playerListItemNumber.setAttribute('class','w3-bar-item w3-col w3-large w3-hide-small w3-center')
      playerListItemNumber.innerHTML = currentPlayer.jerseyNumber;
      playerListItemNumber.style.cssFloat="left";
      playerListItemNumber.style.width="10%";
      playerListItemNumber.style.height="100%";


      console.log(currentPlayer.jerseyNumber);

      var playerListItemImage = document.createElement('img');
      playerListItemImage.setAttribute('src','https://securea.mlb.com/mlb/images/players/head_shot/'+currentPlayer["person"].id+'.jpg');
      playerListItemImage.setAttribute('onerror',"this.src = 'https://secure.ui.bamstatic.com/clubs/mlb/images/player-default.png'");
      playerListItemImage.setAttribute('class','w3-bar-item w3-circle w3-col');
      playerListItemImage.setAttribute('alt',currentPlayer["person"].nameSlug);

      playerListItemImage.style.width="85px";
      playerListItemImage.style.height="75px";
      playerListItemImage.style.objectFit="cover";


      var  playerListItemNameAndPos = document.createElement('div');
      playerListItemNameAndPos.setAttribute('class','w3-bar-item');

      var playerListItemName = document.createElement('span');
      playerListItemName.setAttribute('class','w3-large');
      playerListItemName.innerHTML = currentPlayer["person"].nameFirstLast;
      console.log(currentPlayer["person"].nameFirstLast);

      var playerListItemNameBreak = document.createElement('br');

      var playerListItemPos = document.createElement('span');
      playerListItemPos.innerHTML = currentPlayer["person"].primaryPosition.name;
      console.log(currentPlayer["person"].primaryPosition.name);

      playerListItemNameAndPos.appendChild(playerListItemName);
      playerListItemNameAndPos.appendChild(playerListItemNameBreak);
      playerListItemNameAndPos.appendChild(playerListItemPos);

      var  playerListItemBatThrow = document.createElement('div');
      playerListItemBatThrow.setAttribute('class','w3-bar-item w3-col w3-large w3-hide-small')
      playerListItemBatThrow.innerHTML = currentPlayer["person"].batSide.code+"/"+currentPlayer["person"].pitchHand.code;
      playerListItemBatThrow.style.width="10%";
      playerListItemBatThrow.style.cssFloat="right";


      var  playerListItemAge= document.createElement('div');
      playerListItemAge.setAttribute('class','w3-bar-item w3-col w3-large w3-hide-small')
      playerListItemAge.innerHTML = currentPlayer["person"].currentAge;
      playerListItemAge.style.width="10%";
      playerListItemAge.style.cssFloat="right";

      playerListItem.appendChild(playerListItemNumber);
      playerListItem.appendChild(playerListItemImage);
      playerListItem.appendChild(playerListItemNameAndPos);
      playerListItem.appendChild(playerListItemBatThrow);
      playerListItem.appendChild(playerListItemAge);

      playerListItem.onclick = function() { displayPlayer(this.id)};
      rosterList.appendChild(playerListItem);
      console.log(teamID+" : "+teamsJSON[teamID]);
      document.getElementById("titleBar").innerHTML = teamsJSON[teamID];


    }
  }
);
function displayPlayer(playerID) {
  console.log(playerID)
  window.location.href='player.html?player='+playerID

  return;
}
function goHome(){
  window.location.href='teams.html';
  return;
}
