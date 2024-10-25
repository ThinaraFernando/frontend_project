import ItemType from "./ItemType";

interface CategoryType {

    categoryId: number;

    categoryName: string;
    
    items: ItemType[]; 
    
}
export default CategoryType;