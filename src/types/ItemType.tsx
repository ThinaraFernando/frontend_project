import ItemCategoryType from "./ItemCategoryType";




  interface ItemType {

    id: number; 

    name: string;

    qty: number; 

    price: number; 

    itemCategory: ItemCategoryType; 

  }
  
export default ItemType;
