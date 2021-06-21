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
        },
        addListItem:function(item,type){
            //Орлого зарлагын элэмэнтийг агуулсан html -ийг бэлтгэх
            var html,list;
            if(type=='inc'){
                list='.income__list';
                html=' <div class="item clearfix" id="income-%id%"><div class="item__description">$DESCRIPTION$</div><div class="right clearfix"><div class="item__value">+ $VALUE$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                list='.expenses__list';
                html=' <div class="item clearfix" id="expense-%id%"><div class="item__description">$DESCRIPTION$</div><div class="right clearfix"><div class="item__value">- $VALUE$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Бэлтгэсэн HTML ээ DOM руу хийж өгнө
           html=html.replace("%id%",item.id);
           html=html.replace("$DESCRIPTION$",item.description);
           html=html.replace("$VALUE$",item.value);
           document.querySelector(list).insertAdjacentHTML("beforeend",html);
        }
    }
})();
 // *** Санхүүтэй ажиллах контролллер ***
var financeController=(function(){

    var data={
        items:{
            inc:[],
            exp:[],
        },
        totals:{
            inc:0,
            exp:0
        }
    };
    
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    
    return {
        addItem: function(type,description,value){
            var itemTypes=data.items[type];
            var id=(itemTypes.length==0)?1:itemTypes[itemTypes.length-1].id+1;
            var item=(type==="inc")?new Income(id,description,value):new Expense(id,description,value);
            itemTypes.push(item);
            return item;
        },
        getData: function(){
            return data;
        }
    };
})();
 // *** Холбогч контролллер ***
var appController=(function(uiControl,fnControl){
    var ctrlAddItem=function(){
        //1. Оруулах өгөгдлийг дэлгэцээс олж авна
        var input=uiControl.getInput();
        console.log(input);
        //2. Тухайн өгөгдлөө санхүүгийн контроллерт хадгална
        var item=fnControl.addItem(input.type,input.description,input.value);
        //3. Олж авсан өгөгдлүүдээ тохирох газар байрлуулна
        uiControl.addListItem(item,input.type);
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