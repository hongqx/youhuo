(function(win,$){
	/*简历第一部分处理*/
    var resume ={
    	 data:{},
    	 getResumeInfo:function(){
              var data={
              	 uid:0,
              	 resume_id:0,
              	 uType:0
              };
              var _url = "http://192.168.1.106:8080/resume1/app/get_resume.js";
              var _this = this;
              $.ajax({
            	url:_url+"?"+new Date().getTime(),
            	method:"get",
            	dataType:"json",
            	data:data,
            	success:function(data){
                    _this.showInfo(data);
            	},
                complete:function(){
                    console.log("finish");
                }
            });

    	 },
    	 showInfo:function(data){
            if(data.code===0){
            	var num =0;
            	this.data = data.data;
            	if(this.data.avatar_src){
            		$("#js_userImg").src = this.data.avatar_src;
            		num++;
            	}
            	if(this.data.full_name){
            		$("#js_userName").val(this.data.full_name);
            		num++;
            	}
                if(this.data.gender){
                	var _sex =parseInt(this.data.gender);
	                var _options = $("#js_sex").find("option");
	                $(_options[_sex]).attr("selected","selected");
	                $("#js_sex").val(_sex);
	                num++;
                }
               
                if(this.data.birth){
                	$("#js_birth").val(this.data.birth);
                    num++;
                }
                
                if(this.data.is_student){
                	 var _ifsudent = parseInt(this.data.is_student);
	                _options = $("#js_ifstudent").find("option");
	                $(_options[_ifsudent]).attr("selected","selected");
	                $("#js_ifstudent").val(_ifsudent);
	                num++;
                }
                changeProcess(num);
            }
    	 },
    	 initEvent:function(){
    	 	 var _this = this;
            
             $("#js_userName").bind("blur",function(){
                if($(this).val()){
                	_this.data.full_name = $(this).val();
                }
             });

             
             $("#js_sex").bind("change",function(){
             	 var  _sex = parseInt($(this).val());
                 if(_sex > 0){
                     _this.data.gender = _sex;
                 }
             });
           
            $("#js_ifstudent").bind("change",function(){
             	 var  _ifsudent = $(this).val();
                 if(_ifsudent!=""){
                     _this.data.is_student = _ifsudent;
                 }
             });

            $("#js_birth").bind("change",function(){
            	console.log($(this).val());
            	_this.data.birth = $(this).val();
            });

            $("#js_save").bind("click",function(){
            	if(_this.check()){
            		_this.saveResume();
            	}
            });
    	 },
    	 saveResume:function(){
            console.log(this.data);//提交数据
            this.changeProcess(20);
    	 },
    	 check:function(){
             if(!this.data.full_name){
             	alert("请填写完整姓名");
             	return false;
             }
             var _birth = this.data.birth;
             _birth.split("-").join("/");
             if(_birth=="" || (new Date(_birth).getTime()) > (new Date().getTime()-1000*60*60*24*365)){
             	alert("出生日期填写错误，请修改！");
             	return false;
             }

             return true ;
    	 },
    	 init:function(){
    	 	this.initEvent();
    	 	this.getResumeInfo();
    	 }
    };
   
    /*简历第二部分处理*/
    var resumeP2 = {
    	 data:{},
    	 getResumeInfo:function(){
              var data={
              	 uid:0,
              	 resume_id:0,
              	 uType:0
              };
              var _url = "http://192.168.1.106:8080/resume1/app/get_resume_p2.js";
              var _this = this;
              $.ajax({
            	url:_url+"?"+new Date().getTime(),
            	method:"get",
            	dataType:"json",
            	data:data,
            	success:function(data){
                    _this.showInfo(data);
            	},
                complete:function(){
                    console.log("finish");
                }
            });

    	 },
    	 showInfo:function(data){
             if(data.code===0){
             	this.data = data.data;
             	var num= 0;//用来计算简历完善度
             	if(this.data.work_years){
             		$("#js_workYears").val(this.data.work_years);
             		num++;
             	}
             	if(this.data.degree){
             		$("#js_degree").val(this.data.degree);
             		num++;
             	}
             	if(this.data.school){
             		$("#js_school").val(this.data.school);
             		num++;
                 }
             	if(this.data.major){ 
             		$("#js_major").val(this.data.major);
             		num++;
                } 
                changeProcess(num+5);
             }
    	 },
    	initEvent:function(){
    		var _this = this;
    		$("#js_workYears").bind("change",function(){
                if($(this).val()){
                	_this.data.work_years = parseInt($(this).val());
                }
    		});
    		$("#js_degree").bind("change",function(){
                if($(this).val()){
                	_this.data.degree = parseInt($(this).val());
                }
    		});
    		$("#js_school").bind("change",function(){
                if($(this).val()){
                	_this.data.school = $(this).val();
                }
    		});
    		$("#js_major").bind("change",function(){
                if($(this).val()){
                	_this.data.major = $(this).val();
                }
    		});

    		$("#js_save_p2").bind("click",function(){
    			if(_this.check()){
    		        console.log(_this.data);
    			}
    		});
    	},
    	saveResumeP2:function(){
            //提交数据
    	},
    	saveCallBack:function(data){
            //保存以后回调
    	},
    	check:function(){
    		if(!this.data.school){
    			alert("请完善学校信息");
    			return false;
    		}
    		if(!this.data.major){
    			alert("请完善专业信息");
    			return false;
    		}
    		return true;
    	},
    	init:function(){
    		this.getResumeInfo();
    		this.initEvent();
    	}
    };
    /*简历完善的进度条处理*/
     var changeProcess=  function(num){
    	 var total =  20;
         var percent = Math.ceil(num/total*100);
         $("#js_progress").css("width",percent+"%");
         $("#js_progress").html('<span class="sr-only">'+percent+'% 完成</span>');
    }
    console.log(win);
    window.resumeP2 = resumeP2;//第二部分简历处理
    window.resume = resume;//第一部分简历处理
    window.changeProcess = changeProcess;
    
})(window,jQuery);