(function () {
	var resumeOptimize = {
		changeData:{},
		getResume:function(){
			var data ={
				uid:0,
				utype:0
			}
			var _url = "http://192.168.1.106:8080/zresume/data/get_optimized_resume.js?"+new Date().getTime();
			var _this = this;
			$.ajax({
				url:_url,
				data:data,
				method:"get",
				dataType:"json",
				success:function(data){
                   _this.initFormData(data);
				}  
			});
		},
		initFormData:function(data){
			console.log(data);
			if(data.code===0){
				this.resumeData = data.data;
				var _data = this.resumeData;
				for(var key in _data){
					console.log(key+"  "+_data[key])
					_data[key] ? $("#"+key).val(_data[key]) : "";
				}
				$("#js_get_height").val(_data.height||"");
				$("#js_get_marriage").val(_data.marriage||0);

				var _native = _data.home_town_province+"-"+_data.home_town_city+"-"+_data.home_town_district;
				
				_native ? $("#js_get_native").html(_native):"";
                 
                var _index =  _data.wanted_salary ? parseInt(_data.wanted_salary):0;
                this.setSelectVal($("#js_get_salary"),_index);
                 _index = _data.salary_unit ? parseInt(_data.salary_unit):0;
                this.setSelectVal($("#js_get_sunit"),(_index+1));

                _data.QQ ? $("#js_get_qq").val(_data.QQ):"";
                _data.email ? $("#js_get_email").val(_data.email):"";
			}
			this.initEvent();
            
		},
		initEvent:function(){
            $("#js_get_height").bind("focus",function(){
                $(this).attr("placeholder","");
            });
            $("#js_get_qq").bind("focus",function(){
                $(this).attr("placeholder","");
            });
            $("#js_get_email").bind("focus",function(){
                $(this).attr("placeholder","");
            });

            $("#js_get_height").bind("blur",function(){
                if($(this).val()===""){
                	$(this).attr("placeholder","请填写身高");
                }else{
                	$("#height").val($(this).val());
                }
            });
           
            $("#js_get_qq").bind("blur",function(){
                if($(this).val()===""){
                	$(this).attr("placeholder","请填写您的QQ号");
                }else{
                	$("#QQ").val($(this).val());
                }
            });
            $("#js_get_email").bind("blur",function(){
                if($(this).val()===""){
                	$(this).attr("placeholder","请输入邮箱地址");
                }else{
                	$("#email").val($(this).val());
                }
            });

            $("#js_get_salary").bind("change",function(){
                $("#wanted_salary").val($(this).val());
            });
            /*$("#js_get_sunit").bind("change",function(){
                $("#salary_unit").val($(this).val());
            });*/
            this.initNativeEvent();
            
            var _this = this;
            $("#js_save").bind("click",function(){
            	if(_this.check()){
            		$("#data_form").submit();
            	}
            })
		},
		initNativeEvent:function(){
            $("#js_get_native").bind("click",function(){
                $("#js_nati_content").show();
            });
            $("#js_nati_cancel").bind("click",function(){
            	$("#js_nati_content").hide();
            });
            $("#js_nati_ok").bind("click",function(){
                var _proince =  $("#js_get_province").val();
                var _city =  $("#js_get_city").val();
                var _area = $("#js_get_area").val();
                if(_proince && _city && _area){
                	$("#js_get_native").html(_proince+"_"+_city+"_"+_area);
                	$("#home_town_province").val(_proince);
                	$("#home_town_city").val(_city);
                	$("#home_town_area").val(_area);
                }
                $("#js_nati_content").hide();
            });
		},
		setSelectVal : function(dom,index){
            var options = $(dom).find("option");
            $(options[index]).attr("selected","selected");
		},
		check:function(){
            var _qq = $("#QQ").val();
            var patt = new RegExp("^[1-9]\\d{4,10}$");
            if(!patt.test(_qq)){
               alert("qq号输入错误");
               return false;
            }
         
            var _email = $("#email").val();
            patt = /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i; 
            if(!patt.test(_email)){
            	alert("邮箱地址输入错误，请检查！");
                return false;
            }

            patt = /[1-2]\d{2}/;
            _height = $("#height").val();
            if(!patt.test(_height)){
            	alert("身高输入错误，请检查！");
                return false;
            }
            return true;
         
		}
	};
	window.onload = function(){
		resumeOptimize.getResume();
	}
	
})();