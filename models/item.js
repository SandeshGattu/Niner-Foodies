var item = function(itemCode, itemName, itemCategory,itemDescription, itemRating, itemImgUrl){
  itemModel ={
    itemCode:itemCode,
    itemName:itemName,
    itemCategory:itemCategory,
    itemDescription:itemDescription,
    itemRating:itemRating,
    itemImgUrl:itemImgUrl,
  };
  return itemModel;
}

module.exports.item = item;
