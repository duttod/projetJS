// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];


function ajouter_recherche() {
    if(recherches.indexOf($("#zone_saisie").val()) ==-1){
      recherches.push($("#zone_saisie").val());
      $("#recherches-stockees").append(`<p class="titre-recherche"><label>${$("#zone_saisie").val()}</label><img src="images/croix30.jpg" class="icone-croix"/></p>`);
      $(".titre-recherche >label").attr("onclick","selectionner_recherche(this)");
      $(".titre-recherche >img").attr("onclick","supprimer_recherche(this)");
      save();
    }else{
        // Ne rien faire
    }

}

function save(){
    var json = JSON.stringify(recherches);
    setCookie("recherches",json,1000);
}

function supprimer_recherche(e) {
  var txt = $(e).parent().find("label").val();
  var index = recherches.indexOf(txt);
  recherches.splice(index,1);
  $(e).parent().remove();

  save();
}


function selectionner_recherche(e) {
	$("#zone_saisie").val(e.innerHTML);
  recherche_courante = e.innerHTML;
}


function init() {

    if(getCookie("recherches")){
      var cookie = JSON.parse(getCookie("recherches"));
      var tab = cookie ;
      for(var val of tab){
        recherches.push(val);
        $("#recherches-stockees").append(`<p class="titre-recherche"><label>${val}</label><img src="images/croix30.jpg" class="icone-croix"/></p>`);
      }
      $(".titre-recherche >label").attr("onclick","selectionner_recherche(this)");
      $(".titre-recherche >img").attr("onclick","supprimer_recherche(this)");

    }
  }


function rechercher_nouvelles() {

$("#resultats").empty();
$("#wait").css("display","block");

  $.ajax({
       url : `search.php?data=${$("#zone_saisie").val()}`,
       type : 'GET',
       success : function(data, statut){
          console.log("succes");
          maj_resultats(data);
       }
    });
}


function maj_resultats(res) {
	$("#wait").css("display","none");

  var tab = JSON.parse(res);
  for (var  i = 0; i < tab.length; i++) {
    var elem = `<p class="titre_result"><a class="titre_news" href="${tab[i].url}" target="_blank"> ${tab[i].titre} </a><span class="date_news">${formatDate(tab[i].date)}</span><span class="action_news" onclick="sauver_nouvelle(this)"><img id="imgrech" src="images/horloge15.jpg"/></span></p>`
    $("#resultats").append(elem);

  }

}


function sauver_nouvelle(e) {

  $(e).parent().find("img").attr('src',"images/disk15.jpg");
  $(e).attr('onclick',"supprimer_nouvelle(this)");
  var obj ;
}


function supprimer_nouvelle(e) {
	//TODO ...
}
