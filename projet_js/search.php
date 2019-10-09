<?php
	$kw = $_REQUEST['data'];
	$req = urlencode($kw);
	$req = str_replace("+", "%20", $req);
	$url = "http://www-etu-info.iut2.upmf-grenoble.fr/~brouardc/M4103C/news228/search_news.php?kw=".$req;

	// Open the file using the HTTP headers set above
	$body = file_get_contents($url, true);

	// And return the JSON string
	echo $body;
?>