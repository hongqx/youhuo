(function (win,$) {
	var JobList ={
		position_id :"1",//(window.location.href.split('?')[1]).split('=')[1].split('#')[0];
	    openid:0,
	    data:null,
		getList:function(){
			var data ={
             position_id:this.position_id,
             uid:this.openid,
             curr_status:0
		    };
		    var _this = this;
            $.ajax({
                url:"http://192.168.1.107:8080/youhuo/emploee/data/get_cv_list.js",
                method:"get",
                data:data,
                dataType:"json",
                success:function(data){
                	//console.info(data);
                    _this.initData(data);
                }
            });
		},
		initData:function(data){
            if(data.code==0){
              this.data = data.data;
              console.info(data);
              this.showData();
              this.initEvent();
            }else{
            	alert("数据获取失败");
            }
		},
		showData:function(){
			var arr = [],_cvs = this.data.cvs;
			for(var i = 0 , len = _cvs.length; i < len ; i++){
				var _item = _cvs[i];
                arr.push('<li class="border">');
                arr.push('<img src="'+_item.avatar_src+'">');
                arr.push('<p><label><span class="_bolder">'+_item.full_name+'</span>&nbsp;&nbsp;'+_item.age+'岁</label><br>');
                arr.push('<label>'+_item.degree+'&nbsp;&nbsp;'+_item.school+'</label><br>');
                arr.push('<label>工作'+_item.work_years+'次&nbsp;&nbsp;</label></p>');
                var _currStatus = parseInt(_item.apply_status);
                var _applyHtml = this.getApplyHtml(_currStatus,_item.uid,_item.resume_id);
                console.log(_applyHtml);
                arr.push(_applyHtml);
                arr.push('<div class="toggle"><label class="caret-up"></label></div>');
                arr.push('<li>');
			}
			$("#js_container").html(arr.join(""));
		},
		/***
		 *根据当前状态和uid\resumeId返回相应的html结构
		 */
		getApplyHtml:function(curstatus,uid,resumeId){
           var _htmlstr = '<a class="[statusClass]">[statusStr]</a>'+
                         '<div class="applied_operation" style="display: none;">[operStr]</div>'
           var _statusStr = '',_operStr = '',_statusClass = '';
           switch(curstatus){
           	 case 1:
           	    _statusStr = '待查看';
           	    _statusClass = "no_check";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="1">邀请面试</a><a href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="2">简历拒绝</a>';
           	    break;
           	 case 2:
           	    _statusStr = '待查看';
           	    _statusClass = "no_check";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="1">邀请面试</a><a href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="2">简历拒绝</a>';
           	    break;
           	 case 5:
           	    _statusStr = '已邀请';
           	    _statusClass = "reception";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="3">工作录用</a><a href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="4">不予录用</a>';
           	    break;
           	 case 6:
           	    _statusStr = '已邀请';
           	    _statusClass = "reception";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="3">工作录用</a><a href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="4">不予录用</a>';
           	    break;
           	 case 11:
           	    _statusStr = '已录用';
           	    _statusClass = "hire";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="5">取消录用</a>';
           	    break;
           	 case 12:
           	    _statusStr = '已录用';
           	    _statusClass = "hire";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="5">取消录用</a>';
           	    break;
           	 default:
           	    _statusStr = '待查看';
           	    _statusClass = "no_check";
           	    _operStr = '<a class="red_border" href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="1">邀请面试</a><a href="javascript:void(0);" data-uid="'+uid+'" data-resumeId="'+resumeId+'" data-type="2">简历拒绝</a>';
           	    break;

           }
           _htmlstr = _htmlstr.replace("[statusClass]",_statusClass).replace("[statusStr]",_statusStr).replace("[operStr]",_operStr);
           return _htmlstr;
           
		},
		/*初始化绑定事件*/
		initEvent:function(){
		  /*绑定操作按钮显示事件*/
           $("#js_container").delegate(".caret-up","click",function(){
              $(this).parent('.toggle').siblings('.applied_operation').toggle();
              $(this).toggleClass('caret-down');
           });
           
           /*
            * 根据data-type绑定点击事件
            * data-type 1-邀请面试 2-简历拒绝 3-工作录用 4-不予录用 5-取消录用
            */
           var _this = this;
           $("#js_container").delegate(".applied_operation a","click",function(){
                var _uid = $(this).attr("data-uid"),
                    _resumeId = $(this).attr("data-resumeId"),
                    _opType = parseInt($(this).attr("data-type"));
                switch(_opType){
                	case 1: 
                        _this.inviteInterview(_uid,_resumeId);
                        break;
                    case 2:
                        _this.refuseResume(_uid,_resumeId);
                        break;
                    case 3:
                        _this.employ(_uid,_resumeId);
                        break;
                    case 4:
                        _this.unEmploy(_uid,_resumeId);
                        break;
                    case 5:
                        _this.unEmploy(_uid,_resumeId);
                        break;
                    default:
                        _this.inviteInterview(_uid,_resumeId);
                }
           });
		},
		/*邀请面试*/
		inviteInterview:function(uid,resumeId){
            var _url  = "sendInterview.html?interviewId="+uid;
            location.href = _url;
		},
		/*拒绝简历*/
		refuseResume:function(uid,resumeId){
           alert("拒绝简历");
		},
		/*工作录用*/
		employ:function(uid,resumeId){
            alert("工作录用");
		},
		/*不予录用*/
		unEmploy:function(uid,resumeId){
            alert("不予录用");
		}

	};
	JobList.getList();
})(window,jQuery);