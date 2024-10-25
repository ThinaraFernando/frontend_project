interface OrderDetailType {
    
    orderDetailId: number;         
    quantity: number;              
    totalPrice: number;           
    item: {                       
        itemId: number;            
        itemName: string;         
        unitPrice: number;        
    };
}
export default OrderDetailType ;
