import { createSlice } from "@reduxjs/toolkit";

const items =
  localStorage.getItem("cartItems") !== null
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const totalAmount =
  localStorage.getItem("totalAmount") !== null
    ? JSON.parse(localStorage.getItem("totalAmount"))
    : 0;

const totalQuantity =
  localStorage.getItem("totalQuantity") !== null
    ? JSON.parse(localStorage.getItem("totalQuantity"))
    : 0;

const restaurant =
  localStorage.getItem("cartRestaurant") !== null
    ? JSON.parse(localStorage.getItem("cartRestaurant"))
    : "";

const restaurantAddress =
  localStorage.getItem("restaurantAddress") !== null
    ? JSON.parse(localStorage.getItem("restaurantAddress"))
    : "";

const setItemFunc = (item, totalAmount, totalQuantity, restaurant, restaurantAddress) => {
  localStorage.setItem("cartItems", JSON.stringify(item));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
  localStorage.setItem("cartRestaurant", JSON.stringify(restaurant));
  localStorage.setItem("restaurantAddress", JSON.stringify(restaurantAddress));
};

const initialState = {
  cartItems: items,
  totalQuantity: totalQuantity,
  totalAmount: totalAmount,
  restaurant: restaurant,
  restaurantAddress: restaurantAddress,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;
      const restaurantName = newItem.restaurantName || state.restaurant;
      const restaurantAdd = newItem.restaurantAddress || state.restaurantAddress;
    
      // If cart is not empty and restaurant doesn't match
      if (state.cartItems.length > 0 && state.restaurant !== restaurantName) {
        // Clear the cart and reset with this item (you could prompt user instead)
        state.cartItems = [];
        state.totalAmount = 0;
        state.totalQuantity = 0;
      }
    
      const existingItem = state.cartItems.find((item) => item.id === newItem.id);
      const extraIngredients = newItem.extraIngredients;
    
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          title: newItem.title,
          image01: newItem.image01,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          extraIngredients: newItem.extraIngredients,
        });
        state.totalQuantity++;
      } else if (
        existingItem &&
        JSON.stringify(existingItem.extraIngredients) === JSON.stringify(extraIngredients)
      ) {
        state.totalQuantity++;
        existingItem.quantity++;
      } else {
        const value = JSON.parse(localStorage.getItem("cartItems"));
        let index = value.findIndex((s) => s.id === existingItem.id);
        const newValue = {
          id: existingItem.id,
          title: existingItem.title,
          image01: existingItem.image01,
          price: existingItem.price,
          quantity: 1,
          totalPrice: existingItem.price,
          extraIngredients: extraIngredients,
        };
        state.cartItems.splice(index, 1, newValue);
        state.totalQuantity = state.cartItems.reduce(
          (total, item) => total + Number(item.quantity),
          0
        );
      }
    
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    
      // Set restaurant
      state.restaurant = restaurantName;
      state.restaurantAddress = restaurantAdd;
      setItemFunc(
        state.cartItems,
        state.totalAmount,
        state.totalQuantity,
        state.restaurant,
        state.restaurantAddress
      );
    },
    

    // ========= remove item ========
    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      // Ensure totalQuantity doesn't go below 0
      if (state.totalQuantity > 0) {
        state.totalQuantity--;
      }

      if (existingItem.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) - Number(existingItem.price);
        
      }

      if (state.cartItems.length === 0) {
        state.restaurant = "";
        state.restaurantAddress = "";
      }      

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      setItemFunc(
        state.cartItems,
        state.totalAmount,
        state.totalQuantity,
        state.restaurant,
        state.restaurantAddress
      );
    },

    //============ delete item ===========
    deleteItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        // Ensure totalQuantity doesn't go below 0
        if (state.totalQuantity >= existingItem.quantity) {
          state.totalQuantity -= existingItem.quantity;
        } else {
          state.totalQuantity = 0;
        }
      }

      if (state.cartItems.length === 0) {
        state.restaurant = "";
        state.restaurantAddress = "";
      }
      

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      setItemFunc(
        state.cartItems,
        state.totalAmount,
        state.totalQuantity,
        state.restaurant,
        state.restaurantAddress
      );
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.restaurant = "";
      state.restaurantAddress = "";
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("totalQuantity");
      localStorage.removeItem("cartRestaurant");
      localStorage.removeItem("restaurantAddress");
    },    
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
