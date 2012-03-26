<?php require("leftronic.php");
// make sure the CAcerts folder is in the same path as these .php files as well!

$leftronic = new Leftronic($_GET['accesskey']);

$leftronic->pushNumber($_GET['streamname'], $_GET['point']);

?>
