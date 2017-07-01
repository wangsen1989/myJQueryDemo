<?php
	require 'config.php';
	$query="INSERT INTO comment (title,user,content,date) 
						VALUES ('{$_POST['title']}','{$_POST['user']}','{$_POST['content']}',NOW())";
	mysql_query($query) or die(mysql_error());
	echo mysql_affected_rows();
	mysql_close();

?>