
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext '
import Login from './pages/auth/Login'
import CreateOrder from './pages/orders/CreateOrder'
import Order from './pages/orders/Order'
import Stock from './pages/Stock'
import ItemCategory from './pages/ItemCategory'
import Item from './pages/Item'
import Customer from './pages/Customer'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './pages/auth/SignUp'





function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<Customer/>} />            
            <Route path="/items" element={<Item />} />
            <Route path="/categories" element={<ItemCategory />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/order/create" element={<CreateOrder />} />
          </Route>

         
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )

}

export default App
