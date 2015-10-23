$(function () {

	var position_id = (window.location.href.split('?')[1]).split('=')[1].split('#')[0];

	function getNumber () {
		$.ajax({
			url: window.api_host + 'youhuo/get_posted_position_detail',
			type: 'post',
			data: {
				uid: openid,
				utype: 1,
				position_id: position_id
			},
			dataType: 'json',
			success: function (result) {
				if (result.code === 0) {
					var data = result.data;

					recruit_num = data.recruit_num;  // 招聘人数
					applied_users = data.applied_users; // 申请人数
					accepted_cvs = data.accepted_cvs; // 简历通过人数
					interviewers = data.interviewers; // 发送的面试邀请数
     				accepted_interviewers = data.accepted_interviewers; // 接受面试邀请人数
					interview_passed = data.interview_passed; // 面试通过人数
					offer_accepted = data.offer_accepted; // 接受工作人数

					$('#num0').html(recruit_num);// 招聘人数
					$('#num1').html(offer_accepted); // 录用人数
					$('#num2').html(applied_users); // 已申请
					$('#num3').html(accepted_cvs); // 待邀请
					$('#num4').html(interviewers); // 已邀请
					$('#num5').html(accepted_interviewers); // 接受面试
					$('#num6').html(interview_passed); // 已录用
					$('#num7').html(offer_accepted); // 接受录用
					
					paintChart(recruit_num, offer_accepted);
				}
			}			
		})
	}

	getNumber();	
	
	function paintChart (accNum, remainNum) {
		// 路径配置
		require.config({
			paths: {
				echarts: 'http://echarts.baidu.com/build/dist'
			}
		});
		// 使用
		require(
			[
				'echarts',
				'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
			],
			function (ec) {
				// 基于准备好的dom，初始化echarts图表
				var myChart = ec.init(document.getElementById('pie')); 
				
			option = {
				tooltip : {
						formatter: "{b} : {c} ({d}%)"
					},
				series : [
					{
						name:'录用结果',
						type:'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:[
							{value: accNum, name:'已录用'},
							{value: remainNum, name:'剩余招聘名额'}
						]
					}
				]
			};
		
				// 为echarts对象加载数据 
				myChart.setOption(option); 
			}
		);
	}
})