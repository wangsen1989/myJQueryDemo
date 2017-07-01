$(function () {

	$('#search_button').button({
		icons : {
			primary : 'ui-icon-search',
		}
	});
	
	$('#question_button').button({
		icons : {
			primary : 'ui-icon-lightbulb',
		},
	}).click(function () {
		if ($.cookie('user')) {
			$('#question').dialog('open');
		} else {
			$('#error').dialog('open');
			setTimeout(function () {
				$('#error').dialog('close');
				$('#login').dialog('open');
			}, 1000);
		}
	});
	
	$('#question').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 500,
		height : 360,
		buttons : {
			'发布' : function () {
				$(this).ajaxSubmit({
					url:'add_question.php',
					type:'POST',
					data:{
						user:$.cookie("user"),
						title:$("#title").val(),
						content:$(".uEditorIframe").contents().find("#iframeBody").html()
					},
					beforeSubmit : function (formData, jqForm, options) {
						$('#loading').dialog('open');
						console.log($(".uEditorIframe").contents().find("#iframeBody").html())					
					},
					success : function (responseText, statusText) {
						if (responseText) {
							$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('数据新增成功...');
							setTimeout(function () {
								$('#loading').dialog('close');
								$('#question').dialog('close');
								$('#question').resetForm();
								$(".uEditorIframe").contents().find("#iframeBody").html('请输入问题描述');
							}, 1000);
						}
					},
				});
			}
		}
	});
	
	$('.uEditorCustom').uEditor();
	
	$('#error').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();
	
	$('#member, #logout').hide();
	
	if ($.cookie('user')) {
		$('#member, #logout').show();
		$('#reg_a, #login_a').hide();
		$('#member').html($.cookie('user'));
	} else {
		$('#member, #logout').hide();
		$('#reg_a, #login_a').show();
	}
	
	$('#logout').click(function () {
		$.removeCookie('user');
		window.location.href = '/jQueryDemo/';
	});
	
	$('#loading').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();
	
	$('#reg_a').click(function () {
		$('#reg').dialog('open');
	});

	$('#reg').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 320,
		height : 340,
		buttons : {
			'提交' : function () {
				$(this).submit();
			}
		}
	}).buttonset().validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'add.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#reg').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('数据新增成功...');
						$.cookie('user', $('#user').val());
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 500);
					}
				},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#reg').dialog('option', 'height', errors * 20 + 340);
			} else {
				$('#reg').dialog('option', 'height', 340);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.reg_error',
		wrapper : 'li',
	
		rules : {
			user : {
				required : true,
				minlength : 2,
				remote : {
					url : 'is_user.php',
					type : 'POST',
				},
			},
			pass : {
				required : true,
				minlength : 6,
			},
			email : {
				required : true,
				email : true
			},
			date : {
				date : true,
			},
		},
		messages : {
			user : {
				required : '帐号不得为空！',
				minlength : jQuery.format('帐号不得小于{0}位！'),
				remote : '帐号被占用！',
			},
			pass : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码不得小于{0}位！'),
			},
			email : {
				required : '邮箱不得为空！',
				minlength : '请输入正确的邮箱地址！',
			},	
		}
	});
	
	$('#date').datepicker({
		changeMonth : true,
		changeYear : true,
		yearSuffix : '',
		maxDate : 0,
		yearRange : '1950:2020',

	});
		
	
	$('#email').autocomplete({
		delay : 0,
		autoFocus : true,
		source : function (request, response) {
			//获取用户输入的内容
			//alert(request.term);
			//绑定数据源的
			//response(['aa', 'aaaa', 'aaaaaa', 'bb']);
			
			var hosts = ['qq.com', '163.com', '263.com', 'sina.com.cn','gmail.com', 'hotmail.com'],
				term = request.term,		//获取用户输入的内容
				name = term,				//邮箱的用户名
				host = '',					//邮箱的域名
				ix = term.indexOf('@'),		//@的位置
				result = [];				//最终呈现的邮箱列表
				
				
			result.push(term);
			
			//当有@的时候，重新分别用户名和域名
			if (ix > -1) {
				name = term.slice(0, ix);
				host = term.slice(ix + 1);
			}
			
			if (name) {
				//如果用户已经输入@和后面的域名，
				//那么就找到相关的域名提示，比如bnbbs@1，就提示bnbbs@163.com
				//如果用户还没有输入@或后面的域名，
				//那么就把所有的域名都提示出来
				
				var findedHosts = (host ? $.grep(hosts, function (value, index) {
						return value.indexOf(host) > -1
					}) : hosts),
					findedResult = $.map(findedHosts, function (value, index) {
					return name + '@' + value;
				});
				
				result = result.concat(findedResult);
			}
			
			response(result);
		},	
	});
	
	$('#login_a').click(function () {
		$('#login').dialog('open');
	});
	
	
	$('#login').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 320,
		height : 240,
		buttons : {
			'登录' : function () {
				$(this).submit();
			}
		}
	}).validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'login.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#login').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#login').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('登录成功...');
						if ($('#expires').is(':checked')) {
							$.cookie('user', $('#login_user').val(), {
								expires : 7,
							});
						} else {
							$.cookie('user', $('#login_user').val());
						}
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#login').dialog('option', 'height', errors * 20 + 240);
			} else {
				$('#login').dialog('option', 'height', 240);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.login_error',
		wrapper : 'li',
	
		rules : {
			login_user : {
				required : true,
				minlength : 2,
			},
			login_pass : {
				required : true,
				minlength : 6,
				remote : {
					url : 'login.php',
					type : 'POST',
					data : {
						login_user : function () {
							return $('#login_user').val();
						},
					},
				},
			},
		},
		messages : {
			login_user : {
				required : '帐号不得为空！',
				minlength : jQuery.format('帐号不得小于{0}位！'),
			},
			login_pass : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码不得小于{0}位！'),
				remote : '帐号或密码不正确！',
			}
		}
	});
	
	
	$('#tabs').tabs();
	
	$('#accordion').accordion({
		header : 'h3',
	});


//从数据库去除指定的数据，封装方法
	var datastart=0,datacount=2;
	var dataArr=[],arrindex=0;//存正文content原文本
	var getMysqlData=function(){
			$.ajax({
			url:'show_question.php',
			type:'POST',
			data:{
				datastart:datastart,
				datacount:datacount
			},
			success:function(response,status,xhr){
				var html='';
				console.log("原response:"+response);
				res=JSON.parse(response);
				console.log('json后的res：'+res);
				if(res.length==0){
					$('#loading').text('已无更多数据');
					// alert();
				}else{
					for (var i = 0; i < res.length; i++) {
						 html+="<div class='getData'><h3 class='data_title'>问题："+res[i].title+"</h3>"+"<div class='data_content'>回答："+res[i].content+"</div>"+"<p class='data_user'>用户："+res[i].user+"</p>"+"<span class='data_date'>回答时间："+res[i].date+"</span>"+"<span class='data_show data_showmore'>显示全部</span><span class='data_show data_closemore'>收起</span><span class='show_comment'>查看评论</span><div class='comment'><div class='comment_items'><div class='comment_content'><div class='comment_item'></div></div><form  class='comment_form'><textarea  class='comment_textarea' cols='30' rows='10' placeholder='请在此处评论'></textarea><p><span class='will_comment'>我要评论</span><span class='up_comment'>收起评论</span></p></form></div></div>"+"<hr/></div>";
					};
					$(".main_question").append(html);
			
					//存正文content原文本
					for(let i of res){
						$(".data_content").eq(arrindex).attr('contentid',arrindex);//识别content编号
						dataArr[arrindex]=i.content;	
						arrindex=arrindex+1;
					};
					//处理文字因为行高而不能全部显示的问题
					$(".data_content").each(function(index,value){
						// var txt=$(this).text();	
						// if (dataArr[index].length<200) {
						// 	$(this).html(dataArr[index]);
						// 	$(this).parent().find(".data_closemore,.data_showmore").hide();
						// } else{
							var shortTxt=dataArr[index].substring(0,200);
							$(this).html(shortTxt+'......');
							$(this).parent().find(".data_closemore").hide();
							$(this).parent().find(".up_comment").hide();
						// }
	
					});	

					datastart=datastart+datacount;//记录下次加载的数据起始位置
					$(".comment").hide();//评论区默认隐藏
					$('.show_comment').show();//所有的查看评论按钮打开

				}

			}
		})
	};
	getMysqlData();
	$(".main_question_showmore").click(function(){
		$('#loading').dialog('open');;
		setTimeout(function(){$('#loading').dialog('close').text('数据交互中...')},500);
		getMysqlData();
	});	
//收起显示回答内容，append元素无法添加事件，所以用父元素的监听	
	$(".main_question").on('click','span.data_showmore',function(){
		var contentId=$(this).parent().find('.data_content').attr('contentid');
		$(this).parent().find('.data_content').html(dataArr[contentId]).css('max-height','none');
		$(this).hide();
		$(this).parent().find(".data_closemore").show();
	});	
	$(".main_question").on('click','span.data_closemore',function(){
		var contentId=$(this).parent().find('.data_content').attr('contentid');
		$(this).parent().find('.data_content').html(dataArr[contentId].substring(0,200)+'......').css('max-height','200px')
		$(this).hide();	
		$(this).parent().find('.data_showmore').show();
	});
	
//评论表单
	$(".main_content").on('click',".show_comment",function(i){
		// var that=this;
		$(this).parent().find(".comment").show();
		$(this).hide();
		$(this).parent().find('.up_comment').show();
		//从数据库获取评论
		var title=$(this).parentsUntil('.main_question').find(".data_title").text();
		$.ajax({
			url:'show_comment.php',
			type:'POST',
			data:{
				title:title
			},
			success:(response)=>{
				var res=JSON.parse(response);
				if (res.length>0) {
					console.log(res);
					var html='';
					res.forEach((value,index)=>{
						console.log(value);
						html+="<div class='comment_item'>"+"<p><h4 class='comment_user'>"+value.user+"</h4>"+"<p class='comment_date'>发表时间："+value.date+"</p></p>"+"<p class='comment_words'>"+value.content+"</p></div>";
						// console.log(this);
						$(this).siblings('div.comment').find('.comment_content').html(html);

					});
				} else{
					console.log('木有评论')
				};
				
			}			
		});
	});
	$(".main_content").on('click',".up_comment",function(i){
		$(this).parentsUntil('.main_question').find(".comment").hide();
		$(this).parentsUntil('.main_question').find('.show_comment').show();
	})	
	$(".main_content").on('click',".will_comment",function(i){
		if(!$.cookie('user')){
			$("#loading").text('请登录后发表').dialog('open');
			setTimeout(function(){
				$("#loading").text('数据交互中...').dialog('close');
				$('#login').dialog('open');
			},500)
		}else{
			var title=$(this).parentsUntil('.main_question').find(".data_title").text();
			var user=$.cookie('user');
			var content= $(this).parentsUntil('.comment_items').find('textarea').val();
			var	html="<div class='comment_item'>"+"<p><h4 class='comment_user'>"+user+"</h4>"+"<p class='comment_date'>"+"发表时间：刚刚"+"</p></p>"+"<p class='comment_words'>"+content+"</p></div>";
			$(this).parentsUntil('.getData').find('.comment_content').append(html);
			$(this).parentsUntil('.comment_items').find('textarea').val('');
			$.ajax({
				url:'add_comment.php',
				type:'POST',
				data:{
					title:title ,
					user:user,
					content:content
				},
				success:function(res){
					console.log(res);
				}
			})			
		}
	});



});


























