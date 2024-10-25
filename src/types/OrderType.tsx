import OrderDetailType from "./OrderDetailType";



 interface OrderType {
    orderId: number;               
    totalAmount: number;          
    orderDateTime: string;        
    paymentMethod: string;         
    customer: {                    
        customerId: number;       
        customerName: string;      
    };

    user: {                        
        userId: number;            
        userName: string;          
    };

    orderDetails: OrderDetailType[]; 
}
export default OrderType;