
/*****************************************************
**************  Дэлгэцтэй ажиллах контролллер *********
******************************************************/

var uiController=(function(){
    var DOMStrings={
        addType: '.add__type',
        addDesc: '.add__description',
        addValue: '.add__value',
        addBtn: '.add__btn',
        incomeList:'.income__list',
        expenseList:'.expenses__list',

        budgetValue:'.budget__value',
        budgetIncValue:'.budget__income--value',
        budgetExpValue:'.budget__expenses--value',
        budgetExpPercent:'.budget__expenses--percentage',
        containerDiv: '.container',
        itemPercentages: '.item__percentage',
        dateLabel:'.budget__title--month',
    };

    var nodeListForeach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    }
    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDesc).value,
                value: parseInt(document.querySelector(DOMStrings.addValue).value)
            };
        },
        getDomStrings:function(){
            return DOMStrings;
        },
        displayDate:function(){
            var nowDate=new Date();
            document.querySelector(DOMStrings.dateLabel).textContent=nowDate.getFullYear()+" оны "+(nowDate.getMonth()+1)+" сарын ";
        },
        clearFields:function(){
            var fields=document.querySelectorAll(DOMStrings.addDesc + ", " + DOMStrings.addValue);
            //convert list to array
            var fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value="";
            });
            fields[0].focus();
        },
        numberFormat:function(number){
            return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number);
        },
        showBudget: function(budget){
            document.querySelector(DOMStrings.budgetValue).textContent=this.numberFormat(budget.budget);
            document.querySelector(DOMStrings.budgetIncValue).textContent=this.numberFormat(budget.totalInc);
            document.querySelector(DOMStrings.budgetExpValue).textContent=this.numberFormat(budget.totalExp);
            document.querySelector(DOMStrings.budgetExpPercent).textContent=this.numberFormat(budget.percentExp) +"%";            
        },
        deleteListItem: function(id){
            var e1=document.getElementById(id);
            e1.parentNode.removeChild(e1);
        },
        addListItem:function(item,type){
            //Орлого зарлагын элэмэнтийг агуулсан html -ийг бэлтгэх
            var html,list;
            if(type=='inc'){
                list=DOMStrings.incomeList;
                html=' <div class="item clearfix" id="inc-%id%"><div class="item__description">$DESCRIPTION$</div><div class="right clearfix"><div class="item__value">+ $VALUE$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                list=DOMStrings.expenseList;
                html=' <div class="item clearfix" id="exp-%id%"><div class="item__description">$DESCRIPTION$</div><div class="right clearfix"><div class="item__value">- $VALUE$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Бэлтгэсэн HTML ээ DOM руу хийж өгнө
           html=html.replace("%id%",item.id);
           html=html.replace("$DESCRIPTION$",item.description);
           html=html.replace("$VALUE$",this.numberFormat(item.value));
           document.querySelector(list).insertAdjacentHTML("beforeend",html);
        },
        displayPercentages: function(allPercentages){
            var elements=document.querySelectorAll(DOMStrings.itemPercentages);
            nodeListForeach(elements,function(e1,index){
                e1.textContent=allPercentages[index]+" %";
            });
        },
    }
})();


/*********************************************************
***********   Санхүүтэй ажиллах контролллер **************
**********************************************************/

var financeController=(function(){
    var data={
        items:{
            inc:[],
            exp:[],
        },
        totals:{
            inc:0,
            exp:0
        },
        budget: 0,
        percentExp: 0,
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
        this.percentage=-1;
    }

    Expense.prototype.calcPercentage=function(totalIncome){
        this.percentage=(totalIncome>0)?Math.round((this.value/totalIncome)*100):0;
    }
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    }

    var calculate= function(type) {
        var sum=0;
        data.items[type].forEach(element=>{
            sum+=element.value;
        });
        data.totals[type]=sum;
    } 

    return {
        addItem: function(type,description,value){
            var itemTypes=data.items[type];
            var id=(itemTypes.length==0)?1:itemTypes[itemTypes.length-1].id+1;
            var item=(type==="inc")?new Income(id,description,value):new Expense(id,description,value);
            itemTypes.push(item);
            return item;
        },
        calculateBudget:function(){
            //Нийт орлогыг тооцоолох
            calculate('inc');
            //Нийт зарлагыг тооцоолох
            calculate('exp');
            //Төсвийг тооцоолох
            data.budget=data.totals.inc-data.totals.exp;
            //Төсвийн хувийг тооцоолох
            data.percentExp=(data.totals.inc>0)?Math.round((data.totals.exp/data.totals.inc)*100):0;
            
        },
        getData:function(){
            return data;
        },

        getBudget: function(){
            return {
                budget:data.budget,
                percentExp:data.percentExp,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },
        deleteItem: function(type,id){
            var ids=data.items[type].map(element=>{
                return element.id;
            });
            var idx=ids.indexOf(id);
            console.log(idx);
            if(idx!==-1){
                data.items[type].splice(idx,1);
            }
        },
        calculatePercentages: function(){
            data.items.exp.forEach(element=>{
                element.calcPercentage(data.totals.inc);
            });
        },
        getPercentages:function(){
            var allPercentages=data.items.exp.map(e=>{
                return e.percentage;
            });
            return allPercentages;
        }

    };
})();


/*******************************************
 ************* Холбогч контролллер **********
********************************************/

var appController=(function(uiControl,fnControl){
    var ctrlAddItem=function(){
        //1. Оруулах өгөгдлийг дэлгэцээс олж авна
        var input=uiControl.getInput();
    
        if(input.description!=="" && input.value!=="" && !isNaN(input.value)){
            //2. Тухайн өгөгдлөө санхүүгийн контроллерт хадгална
            var item=fnControl.addItem(input.type,input.description,input.value);
            //3. Олж авсан өгөгдлүүдээ тохирох газар байрлуулна
            uiControl.addListItem(item,input.type);
            uiControl.clearFields();

            //Төсвийг шинээр тооцоолоод гаргана.
            updateBudget();

        }
    };
    
    var updateBudget=function(){
            //4. Төсвийг тооцоолно
            financeController.calculateBudget();
            //5. Төсвийг авах
            var budget= financeController.getBudget();
            //6. Үлдэгдлийг дэлгэцэнд гаргана
            uiController.showBudget(budget);

            //7. Элемэнтүүдийн хувийг тооцоолно
            financeController.calculatePercentages();
            //8. Хувийг хүлээж авна
            var allPercentages=financeController.getPercentages();
            //9. Дэлэцэнд гаргана
            uiController.displayPercentages(allPercentages);
    }

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
        document.querySelector(DOM.containerDiv).addEventListener('click',function(event){
            var id=event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(id){
                var arr=id.split('-');
                //1. Санхүүгийн модулиас устгана
                financeController.deleteItem(arr[0],parseInt(arr[1]));
                //2. Дэлгэц дээрээс устгана.
                uiController.deleteListItem(id);
                //3. Үлдэгдэл тооцоог шинэчилж харуулна.
                updateBudget();
            }
        });

    };
    return {
        init: function(){
            console.log("App started ... ");  
            uiController.displayDate();          
            uiController.showBudget({
                budget:0,
                percentExp:0,
                totalInc: 0,
                totalExp: 0    
            });
            setupEventListener();
        }
    };
    
})(uiController,financeController);


//*** App  эхлүүлэх ***
appController.init();
