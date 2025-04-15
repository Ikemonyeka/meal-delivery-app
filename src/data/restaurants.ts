export const restaurants = [
    {
        id: 1,
        name: "Gyros 47",
        image: "https://i.imgur.com/vCGlaRF.jpeg",
        address: "47 W Jackson Blvd, Chicago, IL 60604",
        deliveryFee: 1.99,
        rating: 4.2,
        reviews: "1,000+",
        eta: "15 min",
        promo: null,
        menu: [
            { id: "m1", name: "Gyro Sandwich", price: 9.99, description: "Delicious lamb with pita.", category: "Main Dishes" },
            { id: "m2", name: "Greek Fries", price: 3.49, description: "Fries topped with feta and herbs.", category: "Sides" },
            { id: "m3", name: "Falafel Wrap", price: 7.99, description: "Crispy falafel in a pita wrap.", category: "Main Dishes" },
            { id: "m4", name: "Greek Salad", price: 6.99, description: "Feta, olives, cucumbers, and more.", category: "Sides" },
            { id: "m5", name: "Baklava", price: 4.49, description: "Sweet pastry with nuts and honey.", category: "Desserts" },
            { id: "m6", name: "Iced Frappe", price: 3.99, description: "Greek-style iced coffee.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/vCGlaRF.jpeg" }))
    },
    {
        id: 2,
        name: "Hawaiian Bros",
        image: "https://i.imgur.com/hNZyM4y.jpeg",
        address: "24 E Jackson Blvd, Chicago, IL 60604",
        deliveryFee: 1.99,
        rating: 4.6,
        reviews: "10,000+",
        eta: "30 min",
        promo: "Buy 1, Get 1 Free",
        menu: [
            { id: "m1", name: "Huli Huli Chicken", price: 11.99, description: "Grilled chicken in sweet pineapple glaze.", category: "Main Dishes" },
            { id: "m2", name: "Spam Musubi", price: 4.99, description: "Hawaiian-style spam sushi roll.", category: "Sides" },
            { id: "m3", name: "Kalua Pork", price: 10.99, description: "Slow-roasted pork with cabbage.", category: "Main Dishes" },
            { id: "m4", name: "Macaroni Salad", price: 3.49, description: "Creamy island-style mac salad.", category: "Sides" },
            { id: "m5", name: "Loco Moco", price: 9.99, description: "Burger patty, rice, egg, and gravy.", category: "Main Dishes" },
            { id: "m6", name: "Pineapple Juice", price: 2.99, description: "Fresh chilled pineapple juice.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/hNZyM4y.jpeg" }))
    },
    {
        id: 3,
        name: "Crumbl",
        image: "https://i.imgur.com/5yR7Kdp.jpeg",
        address: "22 S Wabash Ave, Chicago, IL 60603",
        deliveryFee: 3.99,
        rating: 4.4,
        reviews: "1,500+",
        eta: "25 min",
        promo: null,
        menu: [
            { id: "m1", name: "Chocolate Chip Cookie", price: 3.99, description: "Warm gooey chocolate chip goodness.", category: "Desserts" },
            { id: "m2", name: "Snickerdoodle", price: 3.49, description: "Cinnamon sugar perfection.", category: "Desserts" },
            { id: "m3", name: "Peanut Butter Cookie", price: 3.99, description: "Rich peanut butter flavor.", category: "Desserts" },
            { id: "m4", name: "Sugar Cookie", price: 3.49, description: "Classic soft sugar cookie.", category: "Desserts" },
            { id: "m5", name: "Oreo Crumble", price: 4.29, description: "Cookie with crushed Oreos on top.", category: "Desserts" },
            { id: "m6", name: "Milk", price: 2.49, description: "Cold glass of milk for dipping cookies.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/5yR7Kdp.jpeg" }))
    },
    {
        id: 4,
        name: "Subway",
        image: "https://i.imgur.com/p04VcTy.jpeg",
        address: "30 S Michigan Ave, Chicago, IL 60603",
        deliveryFee: 2.49,
        rating: 4.3,
        reviews: "700+",
        eta: "10 min",
        promo: "Limited Time Only",
        menu: [
            { id: "m1", name: "Turkey Sub", price: 8.49, description: "Classic turkey with veggies and sauce.", category: "Main Dishes" },
            { id: "m2", name: "Veggie Delight", price: 7.49, description: "Fresh veggies on your choice of bread.", category: "Main Dishes" },
            { id: "m3", name: "Italian B.M.T.", price: 8.99, description: "Meats, cheese, and Italian zest.", category: "Main Dishes" },
            { id: "m4", name: "Chicken Teriyaki", price: 9.49, description: "Savory-sweet grilled chicken.", category: "Main Dishes" },
            { id: "m5", name: "Tuna Sub", price: 8.29, description: "Creamy tuna salad sandwich.", category: "Main Dishes" },
            { id: "m6", name: "Fountain Drink", price: 2.49, description: "Coca-Cola, Sprite or your choice of soda.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/p04VcTy.jpeg" }))
    },
    {
        id: 5,
        name: "Panda Express",
        image: "https://i.imgur.com/KCKkgSk.jpeg",
        address: "110 S Franklin St, Chicago, IL 60606",
        deliveryFee: 2.99,
        rating: 4.1,
        reviews: "3,200+",
        eta: "20 min",
        promo: "Free Delivery on $15+",
        menu: [
            { id: "m1", name: "Orange Chicken", price: 9.49, description: "Sweet and tangy chicken favorite.", category: "Main Dishes" },
            { id: "m2", name: "Chow Mein", price: 4.99, description: "Stir-fried noodles with veggies.", category: "Sides" },
            { id: "m3", name: "Beijing Beef", price: 8.99, description: "Spicy crispy beef dish.", category: "Main Dishes" },
            { id: "m4", name: "Fried Rice", price: 4.49, description: "Egg-fried rice with peas and carrots.", category: "Sides" },
            { id: "m5", name: "Spring Rolls", price: 3.99, description: "Crispy vegetarian rolls.", category: "Sides" },
            { id: "m6", name: "Green Tea", price: 2.99, description: "Hot or iced jasmine green tea.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/KCKkgSk.jpeg" }))
    },
    {
        id: 6,
        name: "Chipotle",
        image: "https://i.imgur.com/5LbQQXh.jpeg",
        address: "21 E Adams St, Chicago, IL 60603",
        deliveryFee: 1.49,
        rating: 4.5,
        reviews: "5,000+",
        eta: "15 min",
        promo: null,
        menu: [
            { id: "m1", name: "Burrito Bowl", price: 10.49, description: "Build-your-own bowl with all the fixings.", category: "Main Dishes" },
            { id: "m2", name: "Chips and Guac", price: 4.49, description: "Crispy chips with fresh guacamole.", category: "Sides" },
            { id: "m3", name: "Chicken Burrito", price: 9.99, description: "Stuffed with rice, beans, and chicken.", category: "Main Dishes" },
            { id: "m4", name: "Steak Tacos", price: 10.99, description: "Three steak tacos with toppings.", category: "Main Dishes" },
            { id: "m5", name: "Quesadilla", price: 8.99, description: "Melted cheese and your choice of meat.", category: "Main Dishes" },
            { id: "m6", name: "Agua Fresca", price: 3.49, description: "Freshly made fruit drink.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/5LbQQXh.jpeg" }))
    },
    {
        id: 7,
        name: "Five Guys",
        image: "https://i.imgur.com/OXLMqiW.jpeg",
        address: "30 E Adams St, Chicago, IL 60603",
        deliveryFee: 3.49,
        rating: 4.7,
        reviews: "2,800+",
        eta: "25 min",
        promo: null,
        menu: [
            { id: "m1", name: "Cheeseburger", price: 10.99, description: "Classic cheeseburger with toppings of your choice.", category: "Main Dishes" },
            { id: "m2", name: "Cajun Fries", price: 3.99, description: "Spicy seasoned fries.", category: "Sides" },
            { id: "m3", name: "Bacon Burger", price: 11.49, description: "Beefy goodness with crispy bacon.", category: "Main Dishes" },
            { id: "m4", name: "Hot Dog", price: 5.49, description: "Grilled hot dog with toppings.", category: "Main Dishes" },
            { id: "m5", name: "Milkshake", price: 4.99, description: "Hand-spun thick milkshake.", category: "Desserts" },
            { id: "m6", name: "Bottled Water", price: 1.99, description: "Chilled bottled water.", category: "Drinks" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/OXLMqiW.jpeg" }))
    },
    {
        id: 8,
        name: "Shake Shack",
        image: "https://i.imgur.com/rMwOAK2.jpeg",
        address: "12 S Michigan Ave, Chicago, IL 60603",
        deliveryFee: 3.49,
        rating: 4.6,
        reviews: "6,000+",
        eta: "30 min",
        promo: "Free Fries with $20+ order",
        menu: [
            { id: "m1", name: "ShackBurger", price: 5.99, description: "Beef patty with cheese, lettuce, and tomato.", category: "Main Dishes" },
            { id: "m2", name: "Crinkle-Cut Fries", price: 3.99, description: "Golden, crispy fries.", category: "Sides" },
            { id: "m3", name: "Chicken Shack", price: 7.49, description: "Crispy chicken sandwich.", category: "Main Dishes" },
            { id: "m4", name: "Cheese Fries", price: 4.49, description: "Crispy fries with creamy cheese sauce.", category: "Sides" }
        ].map(item => ({ ...item, image: "https://i.imgur.com/rMwOAK2.jpeg" }))
    }
];
