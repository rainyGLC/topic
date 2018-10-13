	const navBar = {
		data:{
			isLock:false,
			timestamp:10,
			timestampOffset:100,
			navigatorHeight:70,//导航条高度
			headerHeiht:71,//头部高度
			bannerHeight:426,
			sectionOffset:[],
			swiperItemWidth:$('.teachers-item').width(),//当前容量宽度
			swiperItemLen:$('.teachers-item').length,
			index:0,//当前第几个，默认第一项
			swiperSpeed:500,//速度
		},
		init:function(){
			this.addItem();//添加项
			this.bind();
			this.resetSectionOfferset();//重设高度
			this.actionScrollEvent()
		},
		bind:function(){
			$('.nav li').on('click',this.goScroll);
			$(window).on('scroll',this.windowScroll);
			$('.list-title').on('click',this.toggList);//点击下拉标题
			$('.list-item').on('click',this.addItemAction);//点击下拉标题内容项目
			$('#arrowPrev').on('click',this.arrowPrev); //点击上一个按钮
			$('#arrowNext').on('click',this.arrowNext); //点击下一个按钮
			$(window).on('resize',this.resetSwipterWidth) //页面宽度改变
		},
		resetSectionOfferset:function(){
			//所有需要定位class组成的数组
			let sectionKlass = ['sective-1','sective-2','sective-3','sective-4','sective-5'];
			let sectionOffset = sectionKlass.map(klass =>{
				return{
					klass:klass,
					offsetTop:$(`.${klass}`).offset().top
				}
			})
			navBar.data.sectionOffset = sectionOffset;
		},
		goScroll:function(){
			let klass = $(this).data('nav');
			// console.log(klass);//'select-1'
			let navigatorHeight = navBar.data.navigatorHeight;
			// console.log(navigatorHeight);60
		 	let navtop = $(`.${klass}`).offset().top - navigatorHeight;
			// console.log(navtop);
			$("html,body").stop();
			$("html,body").animate({scrollTop:navtop},500,function(){
				navBar.actionScrollEvent();
			});
		},
		windowScroll:function(e){
			let timestampNow = Date.now();
			let timestampLast = navBar.data.timestamp;
			let timestampOffset = navBar.data.timestampOffset;
			let timeLock = (timestampNow - timestampLast) >timestampOffset;
			if(!navBar.data.isLock && timeLock){
				navBar.data.timestamp = timestampNow;
				navBar.actionScrollEvent();
			}
			
			// let scrollTop = $(window).scrollTop();
			// let navigatorHeight = navBar.data.navigatorHeight;
			// let shouldfixedTop = scrollTop > (navBar.data.bannerHeight + navBar.data.headerHeiht);
			// if(shouldfixedTop){
			// 	// scrollTop = navBar.data.navigatorHeight;
			// 	navBar.actionScrollEvent();
			// }
		},
		actionScrollEvent:function(){
			let scrollTop = $(window).scrollTop();
			navBar.data.islock = false;
			//导航定位
			navBar.toggleNavigatorFixed(scrollTop);
			//导航高亮
			navBar.hightlightNavigator(scrollTop);
		},
		//导航定位
		toggleNavigatorFixed:function(scrollTop){
			let shouldfixedTop = scrollTop > (navBar.data.bannerHeight + navBar.data.headerHeiht);
			let hasfixedTop = $('.nav').hasClass('fixed-top');
			// console.log(hasfixedTop);
			if(shouldfixedTop && !hasfixedTop){
				$('.nav').addClass('fixed-top');
			}else if(!shouldfixedTop && hasfixedTop){
				$('.nav').removeClass('fixed-top');
			}
		},
		//导航高亮
		hightlightNavigator:function(scrollTop){
			let navigatorHeight = navBar.data.navigatorHeight;
			let headerHeiht = navBar.data.headerHeiht;
			let sectionOffset = navBar.data.sectionOffset;
			let klass = '';
			sectionOffset.forEach(data =>{
				if(scrollTop >= data.offsetTop -navigatorHeight -headerHeiht){
					klass =data.klass
				}
			})
			$('.nav li').removeClass('active');
			$(`.nav li[data-nav="${klass}"]`).addClass('active');
		},
		toggList:function(){
			$(this).parent().toggleClass('active');
			$(this).find(".close").toggleClass('active');
		},
		addItemAction:function(e){
			e.stopPropagation();
			$('list-item').removeClass('active');
			$(this).addClass('active');
		},
		addItem:function(){
			let swiperItemWidth = this.data.swiperItemWidth;
			//console.log(swiperItemWidth);//250
			let swiperItemLen = this.data.swiperItemLen;
			//console.log(swiperItemLen);//11
			let swiperFirstItem = $('.teachers-item').eq(0).clone();
			let swiperSecondItem = $('.teachers-item').eq(1).clone();
			let swiperThirdItem = $('.teachers-item').eq(2).clone();
			let swiperFourItem = $('.teachers-item').eq(3).clone();
			let swiperLastItem = $('.teachers-item').eq(swiperItemLen -1).clone();
			let swiperLastItemTWO = $('.teachers-item').eq(swiperItemLen -2).clone();
			let swiperLastItemThree = $('.teachers-item').eq(swiperItemLen -3).clone();
			let swiperLastItemFour = $('.teachers-item').eq(swiperItemLen -4).clone();
			$('.teachers-list').append(swiperFirstItem);
			$('.teachers-list').append(swiperSecondItem);
			$('.teachers-list').append(swiperThirdItem);
			$('.teachers-list').append(swiperFourItem);
			$('.teachers-list').prepend(swiperLastItem);
			$('.teachers-list').prepend(swiperLastItemTWO);
			$('.teachers-list').prepend(swiperLastItemThree);
			$('.teachers-list').prepend(swiperLastItemFour);
			$('.teachers-list').css('left', - 1000 + 'px');
		},
		arrowPrev:function(){
			let prev_index = navBar.data.index - 1;
			navBar.gotoIndex(prev_index);
		},
		arrowNext:function(){
			let next_index = navBar.data.index + 1;
			navBar.gotoIndex(next_index);
		},
		//页面发生重设
		resetSwipterWidth:function(){
			let active_index =navBar.data.index;
			let swiperItemWidth = $('.teachers-item').width();
			let translateX = (swiperItemWidth + swiperItemWidth * active_index);
			$('.teachers-list').animate({'left': - translateX + 'px'},40);
			navBar.data.swiperItemWidth = swiperItemWidth;
		},
		gotoIndex:function(index){
			let swiperItemLen = navBar.data.swiperItemLen;
			let swiperItemWidth = navBar.data.swiperItemWidth;
			let swiperSpeed = navBar.data.swiperSpeed;
			let translateX = (swiperItemWidth + swiperItemWidth * index);
			console.log(translateX);
			let isLock = navBar.data.isLock;
			if(isLock){
				return
			}else{
				navBar.data.isLock = true;
			}
			let swiperListEle = $('.teachers-list');
			swiperListEle.animate({
				'left': - translateX + 'px'
			},swiperSpeed,function(){
				if(index === -1){
					index = swiperItemLen -1;
					swiperListEle.css('left', - swiperItemWidth * swiperItemLen +'px');
				}
				if(index === swiperItemLen){
					index = 0;
					swiperListEle.css('left',- swiperItemWidth + 'px');
				}
				navBar.data.index = index;
				navBar.data.isLock = false;
			});
		}
	}
	navBar.init();