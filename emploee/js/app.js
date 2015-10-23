$(function(){
	//微信公众账号主app类
	window.openid = $.cookie("openid") || null;
	//window.resume_id = $.cookie("resume_id") || -1;
	//window.resumeId = $.cookie('resume_id') || 1;
	//window.openid = "hateyou";
	//api地址
	window.api_host = "http://123.57.5.191:8003/";

	//test
	window.openid = "hateyou";

	window.checkIsInvalidVisit = function(){
		var right = (openid ?true:false);

		if(right)
		{
			$("body").show();
		}
		else
		{
			$("head title").html("非法访问");
			alert("非法访问");
		}

		return right;
	};
	/*
	window.query = (function(){
		var result = {};

		if(window.location.search) {
			var arr = window.location.search.substring(1).split("&");
			console.log(arr);
			
			_.each(arr, function(item,index){
				var arr2 = item.split("=");
				result[arr2[0]] = arr2[1];
			});
		}

		console.log("window.query:", result);

		return result;
	})();*/
});