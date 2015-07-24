/**
 * Created by yushangjiang on 2015/7/18.
 */
var easySlide = function(selector,options,callbacks){
    this.container = document.querySelector(selector);
    this.sections = this.container.querySelectorAll(".section");
    this.curSection = this.sections[0];
    var _defaults = {

    }
    for(var p in options){
        if(options.hasOwnProperty(p)){
            _defaults[p] = options[p];
        }
    }
    this.options = _defaults;
    this.init();

}
easySlide.prototype.init = function(){//初始化
    var me = this;
    me.container.style.transform = "translate3d(0,0,0)";
    Array.prototype.forEach.call(this.sections,function(item){
        var _children = item.children,length = _children.length;
        item.style.width = length*100+"%";//设置横向滑动屏幕宽度
        for(var i = 0;i<length;i++){
            _children[i].style.width = (1/length)*100+"%";
        }
        if(length>1){
            var pageContainer = document.createElement("div");
            pageContainer.style.width = "100%";
            pageContainer.style.height = "100%";
            pageContainer.innerHTML = item.innerHTML;
            pageContainer.className = "pageContainer";
            item.innerHTML = "";
            item.appendChild(pageContainer);
        }
        item.addEventListener("touchstart",touchS)
    })
    this.curPage = this.curSection.querySelectorAll(".page")[0];
    var lastX,lastY;
    function touchS(e){
        lastX = e.targetTouches[0].clientX;
        lastY = e.targetTouches[0].clientY;
        this.addEventListener("touchmove", touchM);
        this.addEventListener("touchend", touchE);
    }
    function touchM(e){
        var pageContainer = me.curSection.querySelector(".pageContainer");
        if(pageContainer) {
            pageContainer.style.transform.match(/\((.*),(.*),(.*)\)/);
            var translateX = parseInt(RegExp.$1,10);
            me.curX = parseInt(RegExp.$1, 10) + e.touches[0].clientX - lastX + "px";
        }
        me.container.style.transform.match(/\((.*),(.*),(.*)\)/);
        me.curY = parseInt(RegExp.$2,10) + e.touches[0].clientY - lastY +"px";
        if(pageContainer&&Math.abs(e.touches[0].clientX - lastX) > 5&&parseInt(RegExp.$2,10)%me.container.offsetHeight==0){
            me.slideX(me.curX, pageContainer);
            lastX = e.touches[0].clientX;
        }
        else if(Math.abs(e.touches[0].clientY - lastY) > 5&&(!pageContainer||translateX%pageContainer.children[0].offsetWidth==0)) {
            me.slideY(me.curY);
            lastY = e.touches[0].clientY;
        }
    }
    function touchE(e){
        this.removeEventListener("touchstart",touchS);
        var indexY = Math.round(-parseInt(me.curY,10)/me.container.offsetHeight);
        var pageContainer = me.curSection.querySelector(".pageContainer");
        indexY = indexY<0?0:indexY;
        indexY = indexY>=me.sections.length?indexY-1:indexY;
        me.slideIndexY(indexY,function(){this.addEventListener("touchstart",touchS)});
        if(pageContainer) {
            var indexX = Math.round(-parseInt(me.curX,10)/me.curPage.offsetWidth);
            if(indexX<0) indexX = 0;
            else if(indexX>=pageContainer.children.length) indexX = pageContainer.children.length-1;
            me.slideIndexX(indexX, pageContainer, function () {
                this.addEventListener("touchstart", touchS)
            });
        }
        this.removeEventListener("touchmove",touchM);
        this.removeEventListener("touchend",touchE);
    }
}
easySlide.prototype.slideY = function(length){//y方向移动
    this.container.style.transform = "translate3d(0,"+ length +",0)";
}
easySlide.prototype.slideIndexY = function(index,callback){//y方向移动
    var height = this.container.offsetHeight;
    this.container.style.transition = "all 0.6s linear";
    this.slideY(-index*height+"px");
    setTimeout(function(){
        this.container.style.transition="";
        this.curSection = this.sections[index];
        callback();
    }.bind(this),600)
}
easySlide.prototype.slideX = function(length,pageContainer){
    pageContainer.style.transform = "translate3d(" + length + ",0,0)";
}
easySlide.prototype.slideIndexX = function(index,container,callback){
    var width = container.children[0].offsetWidth;
    container.style.transition = "all 0.6s linear";
    this.slideX(-index*width+"px",container);
    setTimeout(function(){
        container.style.transition="";
        this.curPage = container.children[index];
        callback();
    }.bind(this),600)
}