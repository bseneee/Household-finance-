 // *** Дэлгэцтэй ажиллах контролллер ***
var uiController=(function(){
    var DOMStrings={
        addType: '.add__type',
        addDesc: '.add__description',
        addValue: '.add__value',
        addBtn: '.add__btn',
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDesc).value,
                value: document.querySelector(DOMStrings.addValue).value
            };
        },
        getDomStrings:function(){
            return DOMStrings;
        }
    }
})();
 // *** Санхүүтэй ажиллах контролллер ***
var financeController=(function(){

})();
 // *** Холбогч контролллер ***
var appController=(function(uiControl,fnControl){
    var ctrlAddItem=function(){
        //1. Оруулах өгөгдлийг дэлгэцээс олж авна
        console.log(uiControl.getInput());
        //2. Тухайн өгөгдлөө санхүүгийн контроллерт хадгална
        //3. Олж авсан өгөгдлүүдээ тохирох газар байрлуулна
        //4. Төсвийг тооцоолно
        //5. Эцсийн үлдэгдэл тооцоолно
    };

    var setupEventListener=function(){
        var DOM=uiControl.getDomStrings();
        document.querySelector(DOM.addBtn).addEventListener('click',function(){
            ctrlAddItem();
        });
        document.addEventListener('keypress',function(event){
            if(event.key==="Enter" || event.which===13){
                ctrlAddItem();
            }
        });
    };
    return {
        init: function(){
            console.log("App started ... ");            
            setupEventListener();
        }
    };
    
})(uiController,financeController);

// *** App  эхлүүлэх ***
appController.init();