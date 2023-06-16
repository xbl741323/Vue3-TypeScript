$(window).load(function(){  
	$("#circle1").circleChart({
		size: 66,         // 圆形大小
		color: "#24A4BB",  // 进度条颜色
		backgroundColor: "#143B7A",  // 进度条之外颜色
		value: 66, 
		startAngle: -25,
		text: true,
		background: true, // 是否显示进度条之外颜色
		speed: 1000, // 出现的时间
		widthRatio: 0.2, // 进度条宽度
		
		unit: "percent",
		counterclockwise: false, // 进度条反方向
		startAngle: 0, // 进度条起点
		animate: true, // 进度条动画
		backgroundFix: true,
		lineCap: "round",
		animation: "easeInOutCubic",
		redraw: false,
		cAngle: 0,
		textCenter: true,
		textFamily: "sans-serif",
		relativeTextSize: 1 / 7, // 进度条中字体占比

		onDraw: function(el, circle) {
		  circle.text(Math.round(circle.value) + "%");
		}
	});
	$("#circle2").circleChart({
		size: 55,         // 圆形大小
		color: "#24A4BB",  // 进度条颜色
		backgroundColor: "#143B7A",  // 进度条之外颜色
		value: 66, 
		startAngle: -25,
		text: true,
		background: true, // 是否显示进度条之外颜色
		speed: 1000, // 出现的时间
		widthRatio: 0.2, // 进度条宽度
		
		unit: "percent",
		counterclockwise: false, // 进度条反方向
		startAngle: 0, // 进度条起点
		animate: true, // 进度条动画
		backgroundFix: true,
		lineCap: "round",
		animation: "easeInOutCubic",
		redraw: false,
		cAngle: 0,
		textCenter: true,
		textFamily: "sans-serif",
		relativeTextSize: 1 / 7, // 进度条中字体占比
	
		onDraw: function(el, circle) {
		  circle.text(Math.round(circle.value) + "%");
		}
	});
})
