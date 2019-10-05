//STORAGE CONTROLLER
const StorageCtrl = (function(){
    
  return {
    storeItem: function(item){
      let items; 
      //check ls
      if(localStorage.getItem('items') === null){
        items = [];
        //push new item
        items.push(item);
        //set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //get items, parse to obj
        items = JSON.parse(localStorage.getItem('items'));
        //push new item
        items.push(item);
        //reset ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    
    },

    getItemsFromStorage: function(){
      let items; 
      //check ls
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));
      //loop thru and match id
      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          //splice and replace
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      //loop thru and match id
      items.forEach(function(item, index){
        if(id === item.id){
          //splice and replace
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
   
  }//return
})();

////////////////////////////////////////
//ITEM CONTROLLER
////////////////////////////////////////
const ItemCtrl = (function(){
  //item contructor
  const Item = function(id, name, calories){
    //pass in the properties being added in
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //data structure
  const data = {
    //{id: 0, name: 'General Food', calories: 1200},
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //public
  return {
    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      //Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //parse calories
      calories = parseInt(calories);
      //add new item
      newItem = new Item(ID, name, calories);
      //console.log("hello");
      //push into data array
      data.items.push(newItem);
      //we have to return so we can use it elsewhere
      return newItem
    },

    getItemById: function(id){
      //loop thru items and match the id
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories){
      //turn cal into numbers
      calories = parseInt(calories);
      //loop thru items to find and update the item
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: function(id){
      //get ids using map
      const ids = data.items.map(function(item){
        return item.id;
      });
      //get the index
      const index = ids.indexOf(id);
      //splice index
      data.items.splice(index, 1);
    },

    clearAllItems: function(){
      data.items = [];
    },

    setCurrentItem: function(item){
      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    getTotalCalories: function(){
    //need to look thru items and add the calories
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }

})();

//////////////////////////////////////
//UI CONTROLLER.
//////////////////////////////////////
const UICtrl = (function(){
  //ui selectors
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  //public
  return {
    populateItemList: function(items){
      //loop thru the item, turn into a list, insert in ul
      let html = '';
      items.forEach(function(item){
        //append to html
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>  
        </a>
      </li>`;
      });
      //take this list and put into the UI using the ul
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },

    addListItem: function(item){
      //show list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //creste a li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      //id is dynamic and we have access to it bc we passed in the item
      li.id = `item-${item.id}`;
      //add html
      li.innerHTML = `
        <strong>${item.name}:</strong> <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>  
        </a>
      `;
      //insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },

    updateListItem: function(item){
      //get list items from dom, returns a node list
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //convert node list to an array so we can loop thru, loop thru to find the item to update, update in ui list
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}:</strong> <em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>  
          </a>
        `;
        }
      });
    },

    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn node list from dom into array
      listItems = Array.from(listItems);
      //loop thru to remove
      listItems.forEach(function(item){
        item.remove();
      });
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function(){
      //inputs are clear
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';  
    },

    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function(){
      return UISelectors;
    },
  }

})();

///////////////////////////////////////
//APP CONTROLLER
///////////////////////////////////////
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  //load event listeners
  const loadEventListeners = function(){
    //get UI Selectors
    const UISelectors = UICtrl.getSelectors();
    //add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    //edit icon click event, need to use event delegation bc it wasn't an initial item, it was added later. target the item list
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    //update button click event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    //delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    //clear all
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick); 
    //Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){
      UICtrl.clearEditState();
      e.preventDefault();
    
    });
    //disable submit on enter
    document.addEventListener('keypress', function(e){
    //check to see if enter was hit
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  }

  //add item submit
  const itemAddSubmit = function(e){
    //make sure we have text in the form, get form input from UICtrl and put into a variable
    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== ''){
      //add item w/ item controller, save to a variable bc we need it to add to the ui
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);
      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //show to ui
      UICtrl.showTotalCalories(totalCalories);
      StorageCtrl.storeItem(newItem);
      UICtrl.clearInput();
    } 
    e.preventDefault();
  },

  //click edit icon
  itemEditClick = function(e){
    //target actual edit icon
    if(e.target.classList.contains('edit-item')) {
      //add selected item to the current item in the edit fields, 1- get the list item id
      const listId = e.target.parentNode.parentNode.id;
      console.log(listId);
      //break into an array, split
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      //get Item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
      e.preventDefault();
  }

  //item update submit
  const itemUpdateSubmit = function(e) {
    //get item input
    const input = UICtrl.getItemInput();
    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    //update ui
    UICtrl.updateListItem(updatedItem);
    const totalCalories = ItemCtrl.getTotalCalories();
    //show to ui
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();

    e.preventDefault();
  }
  //delete item submit button
  const itemDeleteSubmit = function(e){
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();
    //delete from data 
    ItemCtrl.deleteItem(currentItem.id);
    //delete from ui
    UICtrl.deleteListItem(currentItem.id);
    //calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    //clear state
    UICtrl.clearEditState();
    e.preventDefault();
  }
  //clear all items
  const clearAllItemsClick = function(e){
    //delete all items from data
    ItemCtrl.clearAllItems();
     //calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    //clear ui list
    UICtrl.removeItems();
    StorageCtrl.clearItemsFromStorage();
    //the ul
    UICtrl.hideList();
    e.preventDefault();
  }
  //init, how the page should load
  return {
    init: function(){
      //set clt edit state
      UICtrl.clearEditState();
      console.log('init app');
    
      //get items from ItemCtrl
      const items = ItemCtrl.getItems();
      //check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        //put items in the UI
        UICtrl.populateItemList(items);
      }

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //show to ui
      UICtrl.showTotalCalories(totalCalories);
      
      loadEventListeners();
    }
  }
  
})(ItemCtrl, StorageCtrl, UICtrl);

//initialize app
App.init();