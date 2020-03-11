function actionRemoveOrdering(order) {
    if(!order) order = orderID;
    console.log(order);
    let orderingList = JSON.parse(Cookies.get("orderingList"));
    const index = orderingList.indexOf(order.toString());
    if (index > -1) {
        orderingList.splice(index, 1);
    }
    console.log(orderingList);
    Cookies.set("orderingList", JSON.stringify(orderingList));
    openModalOrdering();
    refreshInfo();
}

function openModalOrdering() {
    let instance = M.Modal.getInstance($("#orderingListModal"));
    instance.close();
    let listContent = $("#orderingListOrders");
    let orderingList = JSON.parse(Cookies.get("orderingList"));
    if(orderingList.length > 0) {
        listContent.html("");
        for (let key in orderingList) {
            listContent.append(orderingListItemTemplate({orderID: orderingList[key]}));
        }
        instance.open();
    }
}

function actionOrderOrderingList() {
    let orderingList = Cookies.get("orderingList");
    let opts = {
        orderIDs: orderingList
    }

    window.open('api/order/genList.php?'+$.param(opts), '_blank');
    Cookies.set("orderingList", "[]");
}