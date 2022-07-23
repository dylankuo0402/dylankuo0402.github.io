//select elements in Dom
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput"); //取得id為itmeInput的標籤值 
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item"); //取得切換狀態的標籤

//create an empty item list
let todoItems = [];

const alertDiv = document.querySelector("#message");

const alertMessage = function(message, className) {
    alertDiv.innerHTML = message;
    alertDiv.classList.add(className, "show");
    alertDiv.classList.remove("hide");
    setTimeout(() => {
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show", className);
    }, 3000)
}

const getItemsFilter = function(type) {
    let filterItems = [];
    switch (type) {
        case "todo":
            filterItems = todoItems.filter((item) => (!item.isDone && !item.isDeleted)); //利用filter函式拜訪array的每一個元素，並將其狀態回傳給filterItems
            // filterItems = todoItems.filter(function(item){
            //     if(!item.isDone && !item.isDeleted)
            //     {
            //         return item;   
            //     }
            // });
            break;
        case "done":
            filterItems = todoItems.filter((item) => (item.isDone && !item.isDeleted));
            break;
        case "deleted":
            filterItems = todoItems.filter((item) => item.isDeleted);
            break;
        default:
            filterItems = todoItems.filter((item) => (!item.isDeleted));
    }
    getList(filterItems);
}

const updateItem = function(currentItemIndex, value) {
    const newItem = todoItems[currentItemIndex];
    newItem.name = value;
    todoItems.splice(currentItemIndex, 1, newItem);
    setLocalStorage(todoItems);
}

//建立localstorage
const setLocalStorage = function(todoItems) {
    localStorage.setItem("todoItemsKey", JSON.stringify(todoItems)); //localStorage.setItem(key, JSON value)，將todoItems設定為JSON格式並放入localStorage
    console.log(todoItems);
    // console.log(windowlocalStorage);

}

const deleteLocalStorage = function(deleteItem) {
    console.log(deleteItem);
    // localStorage.removeItem("todoItemsKey",JSON.stringify(deleteItem));
}


const removeItem = function(item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
}

const handleItem = function(itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        //done 我抓取的item產生時間與所對應的產生時間相同
        if (item.querySelector(".title").getAttribute('data-time') == itemData.addedAt) {
            item.querySelector('[data-done]').addEventListener('click', function(e) { //item的data-done被click所觸發的function
                e.preventDefault();

                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];



                //符號變色
                const currentClass = currentItem.isDone ?
                    "bi-clipboard-check-fill" :
                    "bi-clipboard-check";

                currentItem.isDone = currentItem.isDone ? false : true; //如果已經完成，點擊過後變成未完成

                //把選定的 item 先分別出來,接著更新在 localStorage 的資料
                todoItems.splice(itemIndex, 1, currentItem);
                console.log("todoItems.splice: ", todoItems.splice(itemIndex, 1, currentItem));
                setLocalStorage(todoItems);

                //設定每一個 item 的 icon 的變化
                const iconClass = currentItem.isDone ?
                    "bi-clipboard-check-fill" :
                    "bi-clipboard-check";

                this.firstElementChild.classList.replace(currentClass, iconClass); //將符合currentClass的文字替換為iconClass內的文字

                // console.log("this is: ",this.firstElementChild.classList);
                // console.log("currentClass: ", currentClass);
                // console.log("iconClass: ", iconClass);
                // console.log("currentItem.isDone: ", currentItem.isDone);
                //切換 tab
                const filterType = document.querySelector("#tabValue").value;
                getItemsFilter(filterType);
            });

            //edit
            item.querySelector("[data-edit]").addEventListener("click", function(e) {
                e.preventDefault();
                itemInput.value = itemData.name;
                document.querySelector("#objIndex").value = todoItems.indexOf(itemData);



            });

            //delete

            item.querySelector('[data-delete]').addEventListener('click', function(e) {

                e.preventDefault();
                // if (confirm("Are you sure you want to remove this item?")) {
                //     //刪除
                //     itemsList.removeChild(item); //刪除前端網頁所顯示的指定item
                //     //到 storage 刪除並更新
                //     removeItem(item);
                //     setLocalStorage(todoItems);
                //     //提醒使用者
                //     alertMessage("Item has been deleted", "alert-success");                    
                // }

                const deleteItmeIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[deleteItmeIndex];

                if (currentItem.isDeleted) {
                    const currentClass = currentItem.isDeleted ?
                        "bi-trash3-fill" :
                        "bi-trash3e";

                    currentItem.isDeleted = currentItem.isDeleted ? false : true;

                    todoItems.splice(deleteItmeIndex, 1, currentItem);
                    setLocalStorage(todoItems);

                    const deleteiconClass = currentItem.isDeleted ?
                        "bi-trash3-fill" :
                        "bi-trash3";

                    this.firstElementChild.classList.replace(currentClass, deleteiconClass); //將currentClass替換為iconClass內的文字

                    //切換Tab
                    const filterType = document.querySelector("#tabValue").value;
                    getItemsFilter(filterType);
                } else {
                    if (confirm("Are you sure you want to remove this item?")) {

                        const currentClass = currentItem.isDeleted ?
                            "bi-trash3-fill" :
                            "bi-trash3e";

                        currentItem.isDeleted = currentItem.isDeleted ? false : true;

                        todoItems.splice(deleteItmeIndex, 1, currentItem);
                        setLocalStorage(todoItems);

                        const deleteiconClass = currentItem.isDeleted ?
                            "bi-trash3-fill" :
                            "bi-trash3";

                        this.firstElementChild.classList.replace(currentClass, deleteiconClass); //將currentClass替換為iconClass內的文字

                        //切換Tab
                        const filterType = document.querySelector("#tabValue").value;
                        getItemsFilter(filterType);



                    }
                }



            });


        }
    })
};

const getList = function(todoItems) {
    itemsList.innerHTML = "";
    //2.1
    if (todoItems.length > 0) {
        //2.2
        todoItems.forEach((item) => { //拜訪todoItmes的每一個項目並寫入item，同時進行函式操作

            const iconClass = item.isDone ?
                "bi-clipboard-check-fill" :
                "bi-clipboard-check";

            const deleteIconClass = item.isDeleted ?
                "bi-trash3-fill" :
                "bi-trash3";


            let liTag = `
            <li class="list-group-item d-flex justify-content-between align-items-center">              
                <span class="title" data-time=${item.addedAt}>${item.name}</span>      
                    <span>
                        <a href="#" data-done><i class="bi ${iconClass}  green"></i></a>
                        <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                        <a href="#" data-delete><i class="bi ${deleteIconClass} red"></i></a>
                    </span>
            </li>`;


            itemsList.insertAdjacentHTML("beforeend", liTag);

            handleItem(item); //查看讀取到的item是否有完成

        });
    } else {

        let liTag = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>No Records Found.</span>
            </li>`;


        // element.insertAdjacentHTML(position, text); 將傳入的字串解析為HTML並將節點放入指定位置
        // 'beforebegin': 在 element 之前。
        // 'afterbegin': 在 element 裡面，第一個子元素之前。
        // 'beforeend': 在 element 裡面，最後一個子元素之後。
        // 'afterend': 在 element 之後。
        itemsList.insertAdjacentHTML("beforeend", liTag); //將liTag放入itemList的最後一個子元素之後

    }
}

const getLocalStorage = function() {
    const todoStorage = localStorage.getItem("todoItemsKey"); //透過localstorage取得todoItems的內容並放到todoStorage
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = []; //類似於使用過後將變數重設為0
    } else {
        todoItems = JSON.parse(todoStorage); //解碼JSON字串，並放入todoItems(因為todoItems的值在刷新後會消失，但localStorage的不會，所以每次刷新頁面就載入一次儲存的data)
    }

    console.log("items: ", todoItems);
    // getList(todoItems); //透過前端顯示todoItems
    // getItemsFilter("all");   

}

document.addEventListener("DOMContentLoaded", () => { //當網頁打開就會執行

    filters.forEach((tab) => { //將所有tab切換的狀態寫入tab變數
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type"); //取得被點擊的tab的datea-type值

            document.querySelectorAll(".nav-link").forEach((nav) => { //先選擇所有class含有nav-link的標籤
                nav.classList.remove("active"); //移除所有nav的active偽元素狀態
            });
            this.firstElementChild.classList.add("active"); //再將選擇到的tab寫入active屬性
            getItemsFilter(tabType); //同時將選擇到的tab的tabType(date-type: all, do, done, deleted)值傳入getItmeFilter
            document.querySelector("#tabValue").value = tabType; //最後將tabType寫入id為tabValue的標籤(標籤狀態為hidden)
        })
    });


    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = itemInput.value.trim(); //將輸入的itmeInput給區域變數itemName

        if (itemName == "") {
            alertMessage("Please enter name", "alert-danger");
        } else {
            //create a task into the list
            //判斷是要修改 還是要新增
            const currentItemIndex = document.querySelector("#objIndex").value;
            if (currentItemIndex) {
                //update
                updateItem(currentItemIndex, itemName);
                document.querySelector("#objIndex").value = "";
                alertMessage("Item has been updated", "alert-success");
            } else {
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime(),
                    isDeleted: false
                };
                todoItems.push(itemObj); //將itemObj push至todoItmes的array中
                console.log(itemObj);

                setLocalStorage(todoItems); //將todoItems的資料放入LocalStorage
                //執行時速度會比較慢! 可用print檢測
                alertMessage("Item added success", "alert-success");

            }

        }
        // getList(todoItems);
        getLocalStorage(); //每次點擊都取得localstorage的資料
        getItemsFilter(document.querySelector("#tabValue").value);
        itemInput.value = ""
    });


    getLocalStorage(); //一開啟視窗就取得localstorage的資料
    getItemsFilter("all");
    console.log("getlocal: ", todoItems);
});