import axios from "axios";
import { useEffect, useState } from "react";
import CustomerType from "../types/CustomerType";
import { useAuth } from "../context/AuthContext ";

function Customer() {
  const { isAuthenticated, jwtToken } = useAuth();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerContact, setCustomerContact] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editCustomerId, setEditCustomerId] = useState<number | null>(null);

  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  async function loadCustomers() {
    try {
      const response = await axios.get("http://localhost:8080/customer", config);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers", error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  function handleCustomerName(event: any) {
    setCustomerName(event.target.value);
  }

  function handleCustomerContact(event: any) {
    setCustomerContact(event.target.value);
  }

  function handleCustomerAddress(event: any) {
    setCustomerAddress(event.target.value);
  }

  async function handleSubmit() {
    const data = {
      name: customerName,
      contact: customerContact,
      address: customerAddress,
    };

    try {
      if (isEditing && editCustomerId !== null) {
        const response = await axios.put(`http://localhost:8080/customer/${editCustomerId}`, data, config);
        console.log("Customer updated:", response);
        setIsEditing(false);
        setEditCustomerId(null);
      } else {
        const response = await axios.post("http://localhost:8080/customer", data, config);
        console.log("Customer created:", response);
      }

      resetForm();
      loadCustomers();
    } catch (error) {
      console.error("Error submitting customer data", error);
    }
  }

  function handleEdit(customer: CustomerType) {
    setCustomerName(customer.name);
    setCustomerContact(customer.contact);
    setCustomerAddress(customer.address);
    setEditCustomerId(customer.customerId);
    setIsEditing(true);
  }

  function resetForm() {
    setCustomerName("");
    setCustomerContact("");
    setCustomerAddress("");
    setIsEditing(false);
    setEditCustomerId(null);
  }

  return (
    <div className="container mx-auto px-4 pt-5 pb-5">
      <h1 className="text-3xl font-semibold mb-5 text-slate-900">Customers</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-5">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer.customerId}
              className="text-slate-600 border border-slate-200 rounded-lg p-4 shadow-lg bg-white"
            >
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Contact:</strong> {customer.contact}</p>
              <p><strong>Address:</strong> {customer.address}</p>
              <button
                className="py-1 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800 text-sm mt-2"
                onClick={() => handleEdit(customer)}
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-600">No customers found.</p>
        )}
      </div>

      <h2 className="text-xl text-slate-900 font-medium mb-3 mt-5">
        {isEditing ? "Edit Customer" : "Create Customer"}
      </h2>

      <div className="border border-slate-200 py-4 px-6 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white shadow-md">
        <form>
          <label className="text-slate-600 font-sm block mb-2">Customer Name</label>
          <input
            type="text"
            className="text-slate-600 font-sm block mb-3 w-full p-2 border border-slate-300 rounded-lg"
            value={customerName}
            onChange={handleCustomerName}
            required
          />

          <label className="text-slate-600 font-sm block mb-2">Customer Contact</label>
          <input
            type="text"
            className="text-slate-600 font-sm block mb-3 w-full p-2 border border-slate-300 rounded-lg"
            value={customerContact}
            onChange={handleCustomerContact}
            required
          />

          <label className="text-slate-600 font-sm block mb-2">Customer Address</label>
          <input
            type="text"
            className="text-slate-600 font-sm block mb-3 w-full p-2 border border-slate-300 rounded-lg"
            value={customerAddress}
            onChange={handleCustomerAddress}
            required
          />

          <button
            type="button"
            className="w-full py-3 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-950 mb-2 text-sm"
            onClick={handleSubmit}
          >
            {isEditing ? "Update Customer" : "Create Customer"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-800 text-sm mt-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Customer;
