// budget Controller
var budgetConroller= (function(){
    // constructor to recive data
    var Expense = function(id, description, value){
        this.id= id;
        this.description=description;
        this.value=value;
    };

    var Income=function(id, description, value){
        this.id= id;
        this.description=description;
        this.value=value;
        
    };

    var calculateTotal= function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.total[type]=sum
    }
    // Expense.prototype.calculatePercentage= function(totalInc){
       
    //         this.percentage= Math.round((this.value/totalInc)*100);
       
   
    // };

 

    Expense.prototype.calcPercentage= function(totalIncome){
        if(totalIncome>0){
        this.percentage= Math.round((this.value/totalIncome)*100);
         }else{
        this.percentage=-1;}
    };

    Expense.prototype.getPercentage= function(){
        return this.percentage;
    };
    

    // var allExpenses=[];
    // var allIncomes=[]; 
    //one big structures for everything
    // data structure
    var data={
        allItems:{
            exp:[],// allExpenses:[],
            inc:[] //allIncomes:[]
        },
        total:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
       
        
    };

    return {
        addItem:function(type, des, val) {
            var newItem, ID;

            //Create new ID
            if(data.allItems[type].length>0){
                ID= data.allItems[type][data.allItems[type].length-1 ].id+1 ;
            }else{
                ID=0;
            }
           

            //create new item base  on inc or exp type
            if(type==='exp'){
                newItem= new Expense(ID, des,val);
            }else if(type==="inc"){
                newItem= new Income(ID, des,val);
            }

            // push in into data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
            
        },

        deleteItem: function(type,id){
        
            var ids, index;

            ids=data.allItems[type].map(function(current){
                return current.id
            });
            index= ids.indexOf(id)

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget: income- expenses;
            data.budget=data.total.inc-data.total.exp;
            // calculate percentage of income that we spent
            if(data.total.inc>0){
                data.percentage=(data.total.exp/data.total.inc)*100
            }else{
                data.percentage=-1 
            }
     
        },
        calulatePercentages: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.total.inc);
            });
        },

        getPercentages: function(){
            var allPerc= data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return allPerc;
        },

        getBudget:function(){
            return {
                budget:data.budget,
                totalInc:data.total.inc,
                totalExp:data.total.exp,
                percentage:data.percentage
            }
        },

        testing:function(){
            console.log(data)
        }
    };

})();

// UI controller
var UIController =(function(){
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber= function(num, type){
        num=Math.abs(num)
        num=num.toFixed(2)
        
        numSplit= num.split('.')
        int=numSplit[0];
        if(int.length>3){
            int=int.substr(0,int.length)+ ' '+int.substr(int.length-3,3);
        }
        dec=numSplit[1];
        return (type==='exp'? '-':"+")+" "+int+"."+dec;
    }
    var nodeListForEach= function(list,callback){
        for(var i=0; i<list.length;i++){
            callback(list[i],i)
        }
    };


    return{
        getinput:function(){
            return{
                 type:document.querySelector(DOMstrings.inputType).value,//inc or exp will be
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value :parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            }
            
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            //CREATE  html string with placeholder text
            if(type==='inc'){
                element= DOMstrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type==='exp'){
                element= DOMstrings.expensesContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace placeholder with actual data
            newHtml= html.replace('%id%' , obj.id);
            newHtml= newHtml.replace('%description%' , obj.description);
            newHtml= newHtml.replace('%value%' , formatNumber(obj.value, type));

            //insert html into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },

        deleteListItem:function(selectorID){
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el)
        },

        clearFields:function(){
            var fields, fieldArray;
           fields= document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
        //    convert in array
           fieldArray=Array.prototype.slice.call(fields);

           fieldArray.forEach(element => {
               element.value="";
           });
 
           fieldArray[0].focus()
        },

        displayBudget: function(obj){
            var type;
            obj.budget>0?type='inc':type='exp'
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp, 'exp');
         

            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+ "%";
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---';
            }

        },

        displayPercentages: function(percentages){
            var fields= document.querySelectorAll(DOMstrings.expensesPercLabel);

            

            nodeListForEach(fields, function(cur, index){
                if(percentages[index]>0){
             cur.textContent= percentages[index] + '%';
                }else{
                    cur.textContent='---';
                }
           
            }) ;               
            
        },

        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        displayMonth:function(){
            var now, months, month, year;
            now = new Date();
            months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month=now.getMonth()
            year=now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();

// we need a way to connect those two
// global app controller
var controler=(function(budgetCtrl, UICtrl){
    
   
    var setupEventListeners= function(){
        var DOM= UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);


        document.addEventListener('keypress', function(event){
    
            if(event.keyCode===13|| event.which===13){
                ctrlAddItem();
            }
    
    
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);    
    };
    var updateBuget= function(){
        
        // calculate budget
        budgetCtrl.calculateBudget();

        //return buget
        var budget= budgetCtrl.getBudget();

        // display budget in ui
        UICtrl.displayBudget(budget);
        
    };

    var updatePercentages= function(){
        // calculate percentage
        budgetCtrl.calulatePercentages()
        // read from budget controler
        var percentages= budgetCtrl.getPercentages();
        // update ui
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem= function(){
        
        var input, newItem;

        //  get the field input data

       input=UICtrl.getinput()
        // console.log(input)

        if(input.description!=="" && !isNaN(input.value) && input.value>0){
              // add the item to the budget controller
       newItem= budgetCtrl.addItem( input.type, input.description, input.value )
        
         
       // add the item to the ui
       UICtrl.addListItem(newItem, input.type)
       UICtrl.clearFields();

       //calculate and update buget
       updateBuget();

       updatePercentages()

        }

    };

    var ctrlDeleteItem= function(event){
        var itemID, splitID, type,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){

            //inc-1
            splitID= itemID.split('-');
            type=splitID[0];
           ID= parseInt(splitID[1]);

            // delete item from data-structures
            budgetConroller.deleteItem(type,ID)
            //delete item user inter face
            UICtrl.deleteListItem(itemID)

            //update show the new budget
            updateBuget();

            updatePercentages()
        }
    }

   
    return{
        init: function(){
            console.log("merge")
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventListeners();
        }
    }


})(budgetConroller, UIController);

controler.init();