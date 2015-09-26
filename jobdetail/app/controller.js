(function(win,$){
    var dataController = {
        sourceConfig:{
            locaUrl:"http://192.168.1.106:8080/app/data.js",
            companyUrl:"http://192.168.1.106:8080/app/data1.js",
            locaListUrl:"http://192.168.1.106:8080/app/data2.js"
        },
        config:{
            sex:["不限","男","女"],//性别取值配置 0-不限 1-男 2-女
            payType:["日结","周结","月结","完工结"],//计算方式配置 0-日结 1周结 2月结 3完工结
            channelType:["在线支付","线下支付"],//支付方式配置 0-线上支付 1-线下支付
            degreeType:["不限","初中以下","中专/技校","高中","大专","本科","硕士及以上"]

        },
        flag:false,
        getData:function(){
            var data ={
                uid:0,
                position_id:0,
                utype:0
            }
            var _url  = this.sourceConfig.locaUrl+"?"+new Date().getTime()+"&uid="+data.uid+"&position_id="+data.position_id+"&utype="+data.utype;
            var _this = this;
            $.ajax({
                url:_url,
                method:"get",
                data:data,
                dataType:"json",
                success:function(data){
                    _this.showData(data);
                }
            });
        },
        showData: function(data){
            if(data.code===0){
                this.data = data.data;
                this.initDomInfo();
                this.initEvent();
                var _this = this;
                setTimeout(function(){
                    _this.getCompanyInfo();
                },1000);
            }
        },
        initEvent:function(){
           this.pageDoms = $(".page");
           this.contrlDoms = $("#js_tab a");
           this.index = 0;
           var _this = this;
           $("#js_job_tab").bind("click",function(){
               _this.changeTab(0);
           });
           $("#js_info_tab").bind("click",function(){
              _this.changeTab(1);
           });
           /*
           $("#js_tab").on("click","a",function(){
               var _index = parseInt($(this).attr("data-id"));
               _this.changeTab(_index-1);
           });*/
        },
        changeTab:function(_index){
            if(_index == this.index){
                return;
            }else{
                if(_index==0){
                    $("#job_info").show();
                    $("#company_info").hide();
                    $("#js_job_tab").addClass("select");
                    $("#js_info_tab").removeClass("select");
                }else{
                    if(!this.flag){
                        this.getJobList();
                        this.flag = true;
                    }
                    $("#job_info").hide();
                    $("#company_info").show();
                    $("#js_job_tab").removeClass("select");
                    $("#js_info_tab").addClass("select");
                }
                /*$(this.pageDoms[this.index]).hide();
                $(this.pageDoms[_index]).show();
                $(this.contrlDoms[this.index]).removeClass("current");
                $(this.contrlDoms[_index]).addClass("current");*/
                this.index = _index;
            }
            
        },
        getSalaryHtml : function(model){
            if(this.data){
                var paymentArr = this.config.payType,
                    channelArr = this.config.channelType;
                var _salary = this.data.salary+"/"+this.data.salary_unit;
                model = model.replace("[salary]",_salary);
                var _payment = parseInt(this.data.payment),
                    _paymentchannel = parseInt(this.data.payment_channel);
                _salary = (_payment && _paymentchannel) ? (paymentArr[_payment]+" "+channelArr[_paymentchannel]):" 日结 线上支付";
                model = model.replace("[payType]",_salary); 
            }
            return model;
        },
        showTimeFrame :function(){
            var strArr = this.data.work_time.split(",");
            var trs = $(".work_time tr");
            for(var i = 0 ,_len = strArr.length ; i < _len ; i++){
                var _num =  parseInt(strArr[i])%4;//行号
                var tds = $(trs[_num]).find("td");
                var _num =  Math.floor(parseInt(strArr[i])/4);
                $($(tds[_num]).find("input")[0]).attr("checked","true");
            }
        },
        initDomInfo:function(){
            if(this.data){
                var data =this.data;
                //职位名称
                $("#js_p_title").html(data.position_title);
                //职位所在位置
                $("#js_w_district").html('<img alt="地址" src="../images/job2.png"/>'+data.work_district);
                //是否直招
                data.is_agency===0 ? $("#js_agency").show():$("#js_agency").show();
                //工作开始时间
                $("#js_w_starttime").html('<img alt="地址" src="../images/job3.png"/>'+data.work_date_start);

                //我的理解是职位被浏览器次数，但是数据接口中没有数据
                //$("#js_viewCount").html("1001");
                //录用后的操作，现在接口中没有找到
                $("#js_num").html("信息编号&nbsp;154853838");
                //录取后的积分处理
                //$("#js_afterget").html("+5积分");

                //发布方，取的是公司的名称
                var _pDom = $("#js_publish");
                _pDom.html(data.company_name);
                var _verifyStatus =  parseInt(data.verify_status);
                //0-信息不完整  1-验证通过  2-验证未通过 3-等待验证中
                var _classArr = ['unComplete','verify','unverify','wait'];
                //处理公司验证状态,根据验证状态加上相应的类名称
                 _classArr[_verifyStatus] ? _pDom.addClass(_classArr[_verifyStatus]) : "";
                
                //工作类别
                $("#js_category").html(data.job_category);
                
                //薪资待遇处理
                var _model = '<em>[salary]</em><em>（[payType]）</em>';//html结构模板
                var _infoStr = this.getSalaryHtml(_model);
                $("#js_salary").html(_infoStr);

                //招聘人数
                $("#js_rec_num").html(data.recruit_num+"人");
                $("#js_recd_num").html("已录用80人");//已录用人数，接口中没有找到

                //对年龄、性别、学历、身高限制的处理
                var _sex = this.config.sex[parseInt(data.gender)]||"不限";
                $("js_sex").html(_sex);

                var _age;
                if(data.min_age ===0 && data.max_age===0){
                    _age ="不限";
                }else if(data.min_age>0 && data.max_age > 0){
                   _age = data.min_age+"岁 至 "+data.max_age+"岁";
                }else if(data.max_age>0){
                   _age = data.max_age+"岁以下";
                }else{
                   _age = data.min_age+"岁以上";
                }
                $("#js_age").html(_age);
               
                var _tall = data.height > 0 ? (data.height+"cm以上"):"不限";
                $("#js_tall").html(_tall);

                var _degree = this.config.degreeType[parseInt(data.degree)];
                $("#js_degree").html(_degree);

                //工作时间处理
                var _worktime = data.work_date_start+" 到 "+data.work_date_end;
                $("#js_workTime").html('工作时间：&nbsp;'+_worktime);
                this.showTimeFrame();//时间段展示表单的处理
                
                //工作地点
                $("#js_workAddr").html(data.work_city+"-"+data.work_district+"  "+data.work_location);
                
                //是否需要面试
                data.need_interview > 0 ? $("#js_ifview").html("不需面试"):$("#js_ifview").html("需面试");
                
                //工作内容 
                $("#js_workcont").html(data.position_descriptin);
                $("#js_info").html(data.position_descriptin);

                //截止时间
                $("#js_deadtime").html(data.expire_date);

                $("#js_contactor").html(data.contactor);
                $("#js_phonenum").html(data.contactor_phone);
                $("#js_callphone").attr("href",("tel://"+data.contactor_phone));

            }
        },
        /**
         * 获取公司信息
         * @return {[type]} [description]
         */
        getCompanyInfo:function(){
            var data ={
                 "company_id":this.data.company_id,
                 "uid":1,
                 "utype":0
                }
            var _url = this.sourceConfig.companyUrl+"?"+new Date().getTime()+"&company_id="+data.company_id+"&uid="+data.uid+"&utype="+data.utype;
            var _this = this;
            $.ajax({
                url:_url,
                method:"get",
                dataType:"json",
                data:data,
                success:function(data){
                    _this.showCompanyInfo(data);
                }
            });
        },
        showCompanyInfo:function(data){
            if(data.code==0){
                this.companyInfo = data.data;
                data = this.companyInfo;
                $("#js_companytitle").html('<img src="../images/job_font.png" alt="图片" style="vertical-align:bottom;"/>'+data.company_name);
                $("#js_comType").html(data.company_type);
                $("#js_biz_type").html(data.biz_type);
                $("#js_scale").html(data.scale);
                $("#js_cInfo").html(data.description);
                $("#js_cAddr").html(data.city+" "+data.location);
                //显示公司图片列表,从职位信息列表中获取
                if(this.data.position_img && this.data.position_img.length > 0){
                    var _imgDomArr = [],_imgs = this.data.position_img;
                    for(var i = 0 ,_len = _imgs.length; i < _len ; i++){
                        _imgDomArr.push('<a href="#"><img src='+_imgs[i]+'/>');//结构出来以后需要修改dom
                    }
                    $("#js_imgList").html(_imgDomArr.join(""));
                }else{
                    $("#js_imgList").hide();//没有图片直接隐藏结构
                }
            }
        },
        getJobList:function(){
           var data ={
                 "uid":this.data.company_id,
                 "count":2,
                 "page":1,
                 "utype":0
                }
            var _url = this.sourceConfig.locaListUrl+"?"+new Date().getTime();
            var _this = this;
            $.ajax({
                url:_url,
                method:"get",
                dataType:"json",
                data:data,
                success:function(data){
                    _this.showPositionList(data);
                },
                complete:function(){
                    console.log("finish");
                }
            });
        },
        showPositionList:function(data){
           if(data.code===0 && data.data.position_num > 0){
              this.pList = data.data.positions;
              this.flag = true;//标志相关职位已经获取到 页面切换不在获取
              var strArr = [];
              $("#js_jobNum").html("全部职位(0)");
              var paymentArr = this.config.payType,_sex = this.config.sex;
              for(var i = 0 ,_len = this.pList.length; i<_len; i++){
                   var _p = this.pList[i];
                   strArr.push('<li class="border_bottom">');
                 if(_p.curr_status==1){
                    strArr.push('<img class="job_mark" alt="招聘中" src="../images/jobmark.png">');
                 }
                  strArr.push('<li class="border_bottom"><img class="company_blue" src="'+_p.thumbnail_img+'"/><div class="company_info">');
                  strArr.push('<h3 class="marginBottom0">'+_p.position_title+'<span class="marginLeft0">'+_p.salary+'/'+_p.salary_unit+'</span></h3></p>');
                  strArr.push('<p><label><img alt="结算方式" src="../images/pay.png"/>'+paymentArr[parseInt(_p.payment)]+'</label>&nbsp;');
                  strArr.push('<label><img alt="性别" src="../images/man.png"/>'+_sex[parseInt(_p.gender)]+'</label>&nbsp;');
                  strArr.push('<label><img alt="地址" src="../images/place.png"/>'+_p.district+'</label></p>');
                  strArr.push('<p><img style="vertical-align: middle" src="../images/job_font.png"/><span style="font-weight:bolder">'+this.companyInfo.company_name+'</span>&nbsp;&nbsp;');
                  var _time = _p.refresh_time;
                  strArr.push('<span>'+_time.substring(5,10)+'</span></p></div></li>');
                        
            }
            $("#js_locaList").html(strArr.join(""));
           }else{
             $("#js_locaList").html("<li>没有该公司其他相关职位~~</li>");
             $("#js_jobNum").html("全部职位(0)");
           }
        }

    };
    dataController.getData();
    
})(window,jQuery);