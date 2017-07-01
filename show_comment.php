<?php
	require 'config.php';
	$query="SELECT * FROM comment WHERE title='{$_POST['title']}'";//数据库字段为字符串的必须加''，又因为在字符串语句中，又加了{}，'{...code}'
	// "SELECT * FROM comment WHERE title=".'{$_POST['title']}';写在外面还不行？？！
	$result=mysql_query($query) or die ('查询评论错误'.mysql_error());
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