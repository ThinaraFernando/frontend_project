import ItemType from "./ItemType";

 interface StockType {

    stockId: number; 

    quantityAvailable: number; 

    items: ItemType[]; 
    
}
export default StockType;
