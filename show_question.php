<?php
	require 'config.php';
	$query="SELECT title,content,user,date FROM question ORDER BY date ASC LIMIT ".$_POST['datastart'].",".$_POST['datacount'];
	$result=mysql_query($query) or die ("".mysql_error());
	$json='';
	while(!!$row=mysql_fetch_array($result,MYSQL_ASSOC)){
		foreach ($row as $key => $value) {
			$row[$key]=urlencode(str_replace('\n', '',  $value)) ;//把value编码再解码，phps数组是=>，要变成json数组
		}
		$json.=urldecode(json_encode($row)).',' ;//把row，json化，再解码，但json成员间没有逗号，加逗号是把json中间加逗号
		// print_r($json) ;
	};
	$json='['.substr($json, 0,strlen($json)-1).']';//去掉最后一个逗号，把json合成数组
	echo $json;
	mysql_close();
?>