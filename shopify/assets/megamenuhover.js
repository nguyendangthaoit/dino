$('.site-nav__item').hover(function(){
	$(this).children('a').addClass('meganav--active');
  	$(this).children('div').addClass('meganav--active');
},
function(){
  	$(this).children('a').removeClass('meganav--active');	
  	$(this).children('div').removeClass('meganav--active');
});