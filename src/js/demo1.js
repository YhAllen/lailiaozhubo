$(function(){
	var j = 0, // 热门主播部分参数
		count1 = 0, // 计数，用于限定点击'查看全部'以后点击'加载'无效
		sum1 = 0, // 计数，控制点击查看'全部按钮'/'加载完毕'后再点击'查看全部'/'加载'更多时不再加载
		k = 0, // 排行榜部分参数
		count2 = 0,
		sum2 = 0; 
	var n = $(".content-list li");
	var rowList = 0; // 计数，当选中'热门'按钮时加载热门主播内容，选中'排行榜'时加载排行榜内容
	// 热门/排行榜按钮切换
	$(".top-button-btn").eq(0).click(function() {
		rowList = 0;
		$(this).css('background-color','#f4703f').siblings().css('background-color','#313334');
		$(".content-row").css('display','block');
		$(".content-list").css('display','none');
		$(".content").css('marginBottom','1.52rem');
		if (count2 != 0 && count1 == 0) {
			$('.bottom-load span').text('加载更多...');
		};
	});
	$(".top-button-btn").eq(1).click(function() {
		rowList = 1;
		$(this).css('background-color','#f4703f').siblings().css('background-color','#313334');
		$(".content-row").css('display','none');
		$(".content-list").css('display','block');
		$(".content").css('marginBottom','.52rem');
		if (count1 != 0 && count2 == 0) {
			$('.bottom-load span').text('加载更多...');
		}
		
		// 排行榜刷新
		$('body').dropload({//需要执行操作的元素。
	    	scrollArea : window,
			loadDownFn : function(me){
				$.ajax({
					type: 'GET',
		            url: './json/data.json',//更改为自己的路径
		            dataType: 'json',
		            success: function(obj){//下拉需要加载的数据，自己写
						if (count2 == 1 || sum2 == 1) {
							return;
						} else {
							for(var i = k; i < k + 2; i++){
								var numList  = ++n.length;
								lodeList(obj, i, numList); // 排行榜加载函数
							}
							k += 2;
							if (k > obj.data.length) {
								$('.bottom-load span').text('没有更多了');
								count2 = 2;
								sum2 = 1;
							}
						}
							$(".dropload-down").height(0);
							me.resetload();
					},
					error: function(xhr, type){
		                alert('Ajax error,请上传服务器!');
		                // 即使加载出错，也得重置
		                me.resetload();
		            }
	   	   		});
			}
		});
	});

 	// 热门刷新
    if (rowList == 0) {
    	$('body').dropload({ // 需要执行操作的元素。
     		scrollArea : window,
    		loadDownFn : function(me){
       			$.ajax({
					type: 'GET',
		           	url: './json/data.json',//更改为自己的路径
		           	dataType: 'json',
		           	success: function(obj){//下拉需要加载的数据，自己写
						if (count1 == 1 || sum1 == 1) {
							return;
						} else {
							for(var i = j; i < j + 2; i++){
								lodeRow(obj, i); // 热门主播加载函数
							}
							j += 2;
							if (j > obj.data.length) {
								$('.bottom-load span').text('没有更多了');
								count1 = 2;
								sum1 = 1;
							}
						}
						$(".dropload-down").height(0);
						me.resetload();//重置刷新。
		           	},
		           	error: function(xhr, type){
		           	    alert('Ajax error,请上传服务器!');
		           	    // 即使加载出错，也得重置
		           	    me.resetload();
		            }
		       	});
    		}
    	});
	} 
	
	// 查看全部
	$(".top-title-text a").click(function() {
		$.ajax({
			url: "./json/data.json",
			type: "get",
			datatype: "json",
			async: "false",
			cache: "false",
			success: function(obj) { // 加载数据成功
				if (rowList == 0) {
					if (count1 == 2 || sum1 == 2) {
						return;
					} else {
						for(var i in obj.data){
							lodeRow(obj, i); // 热门主播加载函数
						}
						$('.bottom-load span').text('没有更多了');
						count1 = 1;
						sum1 = 2;
					}
					
				} else if (rowList == 1) {
					if (count2 == 2 || sum2 == 2) {
						return;
					} else {
						for(var i in obj.data){
							var numList  = ++n.length;
							lodeList(obj, i, numList); // 排行榜加载函数
						}
						$('.bottom-load span').text('没有更多了');
						count2 = 1;
						sum2 = 2;
						}
					
				} else {
					return;
				}
			},
			error: function() { // 数据加载失败 
				alert('数据加载失败！');
			}
		});
	});
});

// 热门主播加载函数
function lodeRow(obj, i) {
	for(var key in obj.data[i]){
		var inner = '<li><a href="third.html"><h3>已撩：<span>'+ obj.data[i].num +'</span>次</h3>';
			inner += '<img class="content-row-bg" src='+ obj.data[i].imgBg +'>';
			inner += '<p>'+ obj.data[i].description +'</p><div class="content-row-name">';
			inner += '<span>'+ obj.data[i].title +'</span></div>';
		if (obj.data[i].imgHot) {
			inner += '<img class="content-row-hot" src='+ obj.data[i].imgHot +'>';
		}
		inner += '</a></li>';
	}
	
	$('.content-row').append(inner);
}

// 排行榜加载函数
function lodeList(obj, i, numList) {
	for(var key in obj.data[i]){
		var inner = '<li><div class="content-num">'+ numList +'</div>';
			inner += '<div class="content-header">';
			inner += '<div class="content-header2"><img src='+ obj.data[i].header +'></div></div>';
			inner += '<div class="content-mingzi"><p class="content-mingzi-tile">'+ obj.data[i].title +'</p>';
			inner += '<img src="images/content-rmb!35x35.png"><p class="content-mingzi-num">'+ obj.data[i].num +'次</p>';
			inner += '</div></li>';
	}
	$('.content-list').append(inner);
}
