var recherches = []; //tableau contenant des chaines de caracteres correspondant aux recherches stockees
var recherche_courante; // chaine de caracteres correspondant a la recherche courante
var recherche_courante_news = []; // tableau d'objets de type resultats (avec titre, date et url)

function ajouter_recherche()
{

	// AJOUT D'UNE RECHERCHE //
	var saisie = document.getElementById('zone_saisie').value;
	var recherches_stockees = document.getElementById('recherches-stockees');

	if (recherches.indexOf(saisie) === -1){
		recherches.push(saisie);
		recherches_stockees.innerHTML = recherches_stockees.innerHTML + '<p class="titre-recherche"><label class="label">'+ saisie +'</label><img src="croix30.jpg" class="icone-croix"/> </p>';
	}

	// APPUI SUR LABEL //
	var labels = document.getElementsByClassName("label");
	for (var i = 0; i < labels.length; i++) {
		labels[i].setAttribute('onclick','selectionner_recherche(this)');
	}

	// APPUI SUR LA CROIX //
	var croix = document.getElementsByClassName("icone-croix");
	for (var  i = 0; i < croix.length; i++) {
		croix[i].setAttribute('onclick','supprimer_recherche(this)');
	}
	// COOKIE //
	var myJSON = JSON.stringify(recherches);
	setCookie("recherches", myJSON, 1000);

}


function supprimer_recherche(e)
{
	e.parentNode.parentNode.removeChild(e.parentNode);

	var texte = e.parentNode.firstElementChild.textContent;
	var index = recherches.indexOf(texte);
	recherches.splice(index,1);
	// COOKIE //
	var myJSON = JSON.stringify(recherches);
	setCookie("recherches", myJSON, 1000);
	// if (typeof(Storage) !== "undefined") {
	// 	sessionStorage.setItem("recherches", myJSON);
	// } else {
	// 	alert("Désolé, votre navigateur ne support pas Web Storage...");
	// }

}


function selectionner_recherche(e)
{
	document.getElementById('zone_saisie').value = e.textContent;
	recherche_courante = e.textContent;

	recherche_courante_news = getCookie(recherche_courante);
	$("#resultats").empty();
	if (recherche_courante_news != undefined) {
		var recherches2 = JSON.parse(recherche_courante_news);
		for (element of recherches2) {
			var p = '<p class="titre_result"><a class="titre_news" href="'+ element.url +' " target="_blank">' + element.titre + '</a><span class="date_news">' + element.date + '</span><span class="action_news" onclick="supprimer_nouvelle(this)"> <img src="disk15.jpg"/></span></p>'
			$('#resultats').append(p);
		}
	}

}


function init()
{
	// COOKIE //
	if(getCookie("recherches")){
		var recherches = JSON.parse(getCookie("recherches"));
		for (var i = 0; i < recherches.length; i++) {
			document.getElementById('zone_saisie').value = recherches[i];
			ajouter_recherche();
		}
	}

}


// FONCTION POUR APPEL AJAX DE TYPE GET //
function ajax_get_request(callback, url, async) {

	var xhr = new XMLHttpRequest(); // création de l'objet

	xhr.onreadystatechange = function() {
		if ((xhr.readyState == 4) && (xhr.status == 200)) {
			callback(xhr.responseText);
		}
	};
	xhr.open("GET", url, async); // initialisation de l'objet
	xhr.send();                  // envoi de la requête
}


function rechercher_nouvelles()
{
	// Vide la balise <div id = 'resultats'>
	document.getElementById('resultats').innerHTML = "";
	// La balise d'id wait passe son display à "block" pour indiquer à l'utilisateur qu'une recherche est en cours
	$("#wait").css("display","block");
	// Appel AJAX de type GET
	var saisie = document.getElementById('zone_saisie').value;
	saisie =  encodeURIComponent(saisie);
	var cookies = getCookie(saisie);
	if(cookies != ""){
		recherche_courante_news = JSON.parse(cookies)
	}
	// var storage = sessionStorage.getItem(saisie);
  // if (storage != ""){
  //   model.recherche_courante_news = JSON.parse(storage);
  // }

	ajax_get_request(maj_resultats, 'search.php?data=' + saisie, false);
}


function maj_resultats(res)
{
	// Cacher la balise d'id wait
	$("#wait").css("display","none");

	var zone_res = document.getElementById('resultats');
	zone_res.innerHTML = "";

	// Transforme la chaîne res de format JSON en un tableau tab_res
	var tab_res = JSON.parse(res);

	for (var  i = 0; i < tab_res.length; i++) {

		var img = 'disk15.jpg';
		// Si la recherche n'est pas dans le tableau de recherche_courante_news alors l'image est l'horloge
		if(indexOf(recherche_courante_news, tab_res[i]) == -1 ){
			img = 'horloge15.jpg';
		}

			zone_res.innerHTML = zone_res.innerHTML	+ '<p class="titre_result"><a class="titre_news" href="'
			+ tab_res[i].url + '" target="_blank">'
			+ tab_res[i].titre + '</a><span class="date_news">'
			+ tab_res[i].date + '</span><span class="action_news" onclick="sauver_nouvelle(this)"><img id="horloge" src="' + img + '"/></span></p>';
	}
}


function sauver_nouvelle(e)
{

	var saisie = document.getElementById('zone_saisie').value;

	// Création d'un objet ayant un titre, une date et une url
	var pere = e.parentNode;
	var url = pere.childNodes[0].href;
	var titre = pere.childNodes[0].text;
	var date = pere.childNodes[1].innerText

	objet = {
		url : url,
		titre : titre,
		date : date
	};


	if(indexOf(recherche_courante_news, objet) == -1) {
		// L'image d'horloge est remplée par un disk
		e.innerHTML = '<img id="horloge" src="disk15.jpg"/>'

		//Ajout de l'objet au tableau de recherche_courante_news
		recherche_courante_news.push(objet);

		// Un clic sur le span a pour action supprimer_nouvelle
		e.setAttribute('onclick', 'supprimer_nouvelle(this)');

		var myJSON = JSON.stringify(recherche_courante_news);
		//Ajout du cookie dans le tableau de recherche_courante_news
		setCookie(saisie,myJSON, 1000);
		// if (typeof(Storage) !== "undefined") {
		// 	sessionStorage.setItem(saisie, myJSON);
		// } else {
		// 	alert("Désolé, votre navigateur ne support pas Web Storage...");
		// }
	}

}


function supprimer_nouvelle(e)
{
	var saisie = document.getElementById('zone_saisie').value;

	// Création d'un objet ayant un titre, une date et une url
	var pere = e.parentNode;
	var url = pere.firstElementChild;
	var titre = pere.childNodes[0].text;
	var date = pere.childNodes[1].innerHTML;

	objet={
		url : url,
		titre : titre,
		date : date
	};

	if(indexOf(recherche_courante_news, objet) != -1) {
		// L'image d'horloge est remplée par un disk
		e.innerHTML = '<img id="horloge" src="horloge15.jpg"/>'
		// Un clic sur le span a pour action sauver_nouvelle
		e.setAttribute('onclick', 'sauver_nouvelle(this)');

		//Supprime la recherche du tableau recherche_courante_news
		var index = indexOf(recherche_courante_news,objet);

		recherche_courante_news.splice(index,1);

		var myJSON = JSON.stringify(recherche_courante_news);
		//Actualisation des cookies dans le tableau de recherche_courante_news
		setCookie(saisie, myJSON, 1000);

		// if (typeof(Storage) !== "undefined") {
		// 	sessionStorage.setItem(saisie, myJSON);
		// } else {
		// 	alert("Désolé, votre navigateur ne support pas Web Storage...");
		// }


	}

}
