import { Recipe } from '../types';
import { creators } from './creators';

export const recipes: Recipe[] = [
  {
    id: 'r1', title: 'Butter Chicken Masala', description: 'A rich, creamy tomato-based curry with tender chicken pieces, aromatic spices, and a velvety smooth sauce that melts in your mouth.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop', category: 'Indian', cuisine: 'North Indian', difficulty: 'Medium',
    prepTime: 20, cookTime: 40, servings: 4, calories: 450,
    ingredients: [
      { name: 'Chicken', amount: '500', unit: 'g' }, { name: 'Tomato Puree', amount: '2', unit: 'cups' },
      { name: 'Heavy Cream', amount: '1', unit: 'cup' }, { name: 'Butter', amount: '3', unit: 'tbsp' },
      { name: 'Garam Masala', amount: '2', unit: 'tsp' }, { name: 'Kasuri Methi', amount: '1', unit: 'tbsp' },
    ],
    steps: [
      { number: 1, title: 'Marinate', description: 'Marinate chicken with yogurt, turmeric, and chili powder for 2 hours.', duration: 120 },
      { number: 2, title: 'Cook Chicken', description: 'Grill or pan-fry the marinated chicken until golden.', duration: 15 },
      { number: 3, title: 'Make Gravy', description: 'Cook tomato puree with spices, add cream and butter.', duration: 20 },
      { number: 4, title: 'Combine', description: 'Add chicken to the gravy, simmer for 10 minutes. Garnish with kasuri methi.', duration: 10 },
    ],
    creator: creators[0], likes: 12400, saves: 8900, comments: 342, views: 89000, isSponsored: true, isTrending: true,
    tags: ['chicken', 'curry', 'creamy', 'dinner'], createdAt: '2025-12-15'
  },
  {
    id: 'r2', title: 'Truffle Mushroom Risotto', description: 'Luxurious Italian risotto with wild mushrooms, truffle oil, and aged Parmesan. Creamy perfection in every bite.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop', category: 'Italian', cuisine: 'Italian', difficulty: 'Hard',
    prepTime: 15, cookTime: 35, servings: 2, calories: 520,
    ingredients: [
      { name: 'Arborio Rice', amount: '300', unit: 'g' }, { name: 'Wild Mushrooms', amount: '200', unit: 'g' },
      { name: 'Truffle Oil', amount: '2', unit: 'tbsp' }, { name: 'Parmesan', amount: '100', unit: 'g' },
      { name: 'White Wine', amount: '1/2', unit: 'cup' }, { name: 'Vegetable Stock', amount: '4', unit: 'cups' },
    ],
    steps: [
      { number: 1, title: 'Sauté Mushrooms', description: 'Cook mushrooms in butter until golden brown.', duration: 8 },
      { number: 2, title: 'Toast Rice', description: 'Toast arborio rice in olive oil, add wine and stir.', duration: 5 },
      { number: 3, title: 'Add Stock', description: 'Gradually add warm stock, stirring continuously for 18-20 minutes.', duration: 20 },
      { number: 4, title: 'Finish', description: 'Fold in parmesan, mushrooms, and drizzle truffle oil.', duration: 5 },
    ],
    creator: creators[2], likes: 9800, saves: 7200, comments: 256, views: 67000, isSponsored: false, isTrending: true,
    tags: ['risotto', 'truffle', 'mushroom', 'italian'], createdAt: '2025-11-28'
  },
  {
    id: 'r3', title: 'Rainbow Buddha Bowl', description: 'A vibrant, nutrient-packed bowl featuring colorful roasted vegetables, quinoa, avocado, and tahini dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', category: 'Vegan', cuisine: 'International', difficulty: 'Easy',
    prepTime: 15, cookTime: 25, servings: 2, calories: 380,
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' }, { name: 'Sweet Potato', amount: '1', unit: 'large' },
      { name: 'Avocado', amount: '1', unit: 'whole' }, { name: 'Chickpeas', amount: '1', unit: 'can' },
      { name: 'Kale', amount: '2', unit: 'cups' }, { name: 'Tahini', amount: '3', unit: 'tbsp' },
    ],
    steps: [
      { number: 1, title: 'Cook Quinoa', description: 'Cook quinoa according to package instructions.', duration: 15 },
      { number: 2, title: 'Roast Veggies', description: 'Roast sweet potato and chickpeas with spices at 400°F.', duration: 25 },
      { number: 3, title: 'Assemble', description: 'Arrange all ingredients in a bowl in rainbow order.', duration: 5 },
      { number: 4, title: 'Drizzle', description: 'Top with tahini dressing, seeds, and microgreens.', duration: 2 },
    ],
    creator: creators[1], likes: 15600, saves: 12300, comments: 489, views: 120000, isSponsored: true, isTrending: true,
    tags: ['vegan', 'healthy', 'bowl', 'colorful'], createdAt: '2026-01-05'
  },
  {
    id: 'r4', title: 'Tonkotsu Ramen', description: 'Rich, milky pork bone broth ramen with chashu, soft-boiled egg, and handmade noodles. 12-hour broth perfection.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', category: 'Japanese', cuisine: 'Japanese', difficulty: 'Hard',
    prepTime: 30, cookTime: 720, servings: 4, calories: 650,
    ingredients: [
      { name: 'Pork Bones', amount: '2', unit: 'kg' }, { name: 'Chashu Pork', amount: '500', unit: 'g' },
      { name: 'Ramen Noodles', amount: '400', unit: 'g' }, { name: 'Eggs', amount: '4', unit: 'whole' },
      { name: 'Green Onions', amount: '4', unit: 'stalks' }, { name: 'Nori', amount: '8', unit: 'sheets' },
    ],
    steps: [
      { number: 1, title: 'Broth', description: 'Boil pork bones on high heat for 12 hours, skimming regularly.', duration: 720 },
      { number: 2, title: 'Chashu', description: 'Braise pork belly in soy sauce, mirin, and sake for 3 hours.', duration: 180 },
      { number: 3, title: 'Eggs', description: 'Soft boil eggs 6.5 minutes, marinate in tare sauce.', duration: 60 },
      { number: 4, title: 'Assemble', description: 'Cook noodles, ladle broth, top with chashu, egg, nori, and scallions.', duration: 10 },
    ],
    creator: creators[3], likes: 18200, saves: 14100, comments: 567, views: 145000, isSponsored: false, isTrending: true,
    tags: ['ramen', 'japanese', 'noodles', 'comfort'], createdAt: '2026-01-20'
  },
  {
    id: 'r5', title: 'Street-Style Tacos Al Pastor', description: 'Authentic Mexican street tacos with marinated pork, fresh pineapple, cilantro, and homemade salsa verde.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop', category: 'Mexican', cuisine: 'Mexican', difficulty: 'Medium',
    prepTime: 30, cookTime: 45, servings: 6, calories: 380,
    ingredients: [
      { name: 'Pork Shoulder', amount: '1', unit: 'kg' }, { name: 'Pineapple', amount: '1', unit: 'whole' },
      { name: 'Corn Tortillas', amount: '12', unit: 'pieces' }, { name: 'Cilantro', amount: '1', unit: 'bunch' },
      { name: 'Achiote Paste', amount: '100', unit: 'g' }, { name: 'Lime', amount: '3', unit: 'whole' },
    ],
    steps: [
      { number: 1, title: 'Marinate', description: 'Blend achiote paste with spices, marinate pork overnight.', duration: 480 },
      { number: 2, title: 'Grill', description: 'Grill marinated pork with pineapple slices.', duration: 45 },
      { number: 3, title: 'Chop', description: 'Finely chop grilled pork and pineapple.', duration: 10 },
      { number: 4, title: 'Serve', description: 'Warm tortillas, add meat, top with cilantro, onion, and salsa.', duration: 5 },
    ],
    creator: creators[4], likes: 11300, saves: 8700, comments: 298, views: 78000, isSponsored: true, isTrending: false,
    tags: ['tacos', 'mexican', 'street-food', 'pork'], createdAt: '2025-12-01'
  },
  {
    id: 'r6', title: 'French Chocolate Soufflé', description: 'An ethereal chocolate dessert that rises to perfection. Light, airy, and intensely chocolatey with a molten center.',
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&h=400&fit=crop', category: 'Desserts', cuisine: 'French', difficulty: 'Hard',
    prepTime: 20, cookTime: 14, servings: 4, calories: 320,
    ingredients: [
      { name: 'Dark Chocolate', amount: '200', unit: 'g' }, { name: 'Eggs', amount: '4', unit: 'whole' },
      { name: 'Sugar', amount: '1/3', unit: 'cup' }, { name: 'Butter', amount: '2', unit: 'tbsp' },
      { name: 'Vanilla Extract', amount: '1', unit: 'tsp' }, { name: 'Powdered Sugar', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      { number: 1, title: 'Melt', description: 'Melt chocolate with butter over double boiler.', duration: 5 },
      { number: 2, title: 'Whip', description: 'Whip egg whites with sugar to stiff peaks.', duration: 8 },
      { number: 3, title: 'Fold', description: 'Gently fold chocolate into egg whites in 3 additions.', duration: 5 },
      { number: 4, title: 'Bake', description: 'Bake at 375°F for 12-14 minutes. Serve immediately!', duration: 14 },
    ],
    creator: creators[5], likes: 22100, saves: 18500, comments: 723, views: 198000, isSponsored: true, isTrending: true,
    tags: ['chocolate', 'dessert', 'french', 'souffle'], createdAt: '2026-02-14'
  },
  {
    id: 'r7', title: 'Spicy Thai Green Curry', description: 'Aromatic Thai green curry with coconut milk, Thai basil, and crispy vegetables. Restaurant-quality at home.',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop', category: 'Indian', cuisine: 'Thai', difficulty: 'Medium',
    prepTime: 15, cookTime: 25, servings: 4, calories: 410,
    ingredients: [
      { name: 'Green Curry Paste', amount: '4', unit: 'tbsp' }, { name: 'Coconut Milk', amount: '2', unit: 'cans' },
      { name: 'Chicken Breast', amount: '400', unit: 'g' }, { name: 'Thai Basil', amount: '1', unit: 'cup' },
      { name: 'Bamboo Shoots', amount: '1', unit: 'cup' }, { name: 'Fish Sauce', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      { number: 1, title: 'Fry Paste', description: 'Fry curry paste in coconut cream until fragrant.', duration: 3 },
      { number: 2, title: 'Add Protein', description: 'Add chicken, cook until no longer pink.', duration: 8 },
      { number: 3, title: 'Simmer', description: 'Add coconut milk, vegetables, and simmer 15 minutes.', duration: 15 },
      { number: 4, title: 'Finish', description: 'Add Thai basil, fish sauce, and serve with jasmine rice.', duration: 2 },
    ],
    creator: creators[0], likes: 8900, saves: 6700, comments: 187, views: 56000, isSponsored: false, isTrending: false,
    tags: ['thai', 'curry', 'spicy', 'coconut'], createdAt: '2026-01-10'
  },
  {
    id: 'r8', title: 'Homemade Margherita Pizza', description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and a perfectly charred crust.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop', category: 'Italian', cuisine: 'Italian', difficulty: 'Medium',
    prepTime: 120, cookTime: 12, servings: 2, calories: 680,
    ingredients: [
      { name: 'Pizza Dough', amount: '500', unit: 'g' }, { name: 'San Marzano Tomatoes', amount: '1', unit: 'can' },
      { name: 'Fresh Mozzarella', amount: '250', unit: 'g' }, { name: 'Fresh Basil', amount: '10', unit: 'leaves' },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp' }, { name: 'Sea Salt', amount: '1', unit: 'tsp' },
    ],
    steps: [
      { number: 1, title: 'Dough', description: 'Let dough rise for 2 hours at room temperature.', duration: 120 },
      { number: 2, title: 'Sauce', description: 'Crush tomatoes with salt and olive oil. No cooking needed!', duration: 5 },
      { number: 3, title: 'Shape', description: 'Stretch dough by hand, add sauce and torn mozzarella.', duration: 5 },
      { number: 4, title: 'Bake', description: 'Bake at highest oven temp (500°F+) for 8-12 minutes.', duration: 12 },
    ],
    creator: creators[2], likes: 14500, saves: 11200, comments: 423, views: 102000, isSponsored: false, isTrending: true,
    tags: ['pizza', 'italian', 'classic', 'cheese'], createdAt: '2026-02-01'
  },
  {
    id: 'r9', title: 'Matcha Tiramisu', description: 'A Japanese-Italian fusion dessert combining creamy mascarpone layers with vibrant matcha green tea powder.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop', category: 'Desserts', cuisine: 'Fusion', difficulty: 'Medium',
    prepTime: 30, cookTime: 0, servings: 6, calories: 340,
    ingredients: [
      { name: 'Mascarpone', amount: '500', unit: 'g' }, { name: 'Matcha Powder', amount: '3', unit: 'tbsp' },
      { name: 'Ladyfingers', amount: '24', unit: 'pieces' }, { name: 'Heavy Cream', amount: '1', unit: 'cup' },
      { name: 'Sugar', amount: '1/2', unit: 'cup' }, { name: 'Eggs', amount: '3', unit: 'whole' },
    ],
    steps: [
      { number: 1, title: 'Matcha Soak', description: 'Dissolve matcha in warm water for dipping ladyfingers.', duration: 5 },
      { number: 2, title: 'Cream', description: 'Whip mascarpone, cream, egg yolks, and sugar until fluffy.', duration: 10 },
      { number: 3, title: 'Layer', description: 'Dip ladyfingers, layer with cream mixture. Repeat.', duration: 15 },
      { number: 4, title: 'Chill', description: 'Refrigerate 6+ hours. Dust with matcha before serving.', duration: 360 },
    ],
    creator: creators[3], likes: 16800, saves: 13400, comments: 534, views: 134000, isSponsored: true, isTrending: true,
    tags: ['matcha', 'tiramisu', 'dessert', 'fusion'], createdAt: '2026-03-05'
  },
  {
    id: 'r10', title: 'Grilled Lobster Tail', description: 'Succulent grilled lobster tails with herb garlic butter, lemon, and a touch of smoky char.',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&h=400&fit=crop', category: 'Seafood', cuisine: 'American', difficulty: 'Medium',
    prepTime: 10, cookTime: 12, servings: 2, calories: 280,
    ingredients: [
      { name: 'Lobster Tails', amount: '4', unit: 'pieces' }, { name: 'Butter', amount: '1/2', unit: 'cup' },
      { name: 'Garlic', amount: '4', unit: 'cloves' }, { name: 'Lemon', amount: '2', unit: 'whole' },
      { name: 'Parsley', amount: '1/4', unit: 'cup' }, { name: 'Paprika', amount: '1', unit: 'tsp' },
    ],
    steps: [
      { number: 1, title: 'Prep', description: 'Butterfly lobster tails by cutting through the top shell.', duration: 10 },
      { number: 2, title: 'Butter', description: 'Make garlic herb butter with melted butter, garlic, and parsley.', duration: 5 },
      { number: 3, title: 'Grill', description: 'Grill shell-side down 5-6 min, flip, baste with butter.', duration: 12 },
      { number: 4, title: 'Serve', description: 'Serve with remaining butter, lemon wedges, and sides.', duration: 2 },
    ],
    creator: creators[4], likes: 7600, saves: 5400, comments: 178, views: 45000, isSponsored: false, isTrending: false,
    tags: ['lobster', 'seafood', 'grilled', 'luxury'], createdAt: '2026-02-20'
  },
  {
    id: 'r11', title: 'Avocado Sushi Rolls', description: 'Fresh and colorful inside-out sushi rolls with creamy avocado, cucumber, and spicy mayo drizzle.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop', category: 'Japanese', cuisine: 'Japanese', difficulty: 'Medium',
    prepTime: 30, cookTime: 20, servings: 4, calories: 290,
    ingredients: [
      { name: 'Sushi Rice', amount: '2', unit: 'cups' }, { name: 'Avocado', amount: '2', unit: 'whole' },
      { name: 'Nori Sheets', amount: '4', unit: 'sheets' }, { name: 'Cucumber', amount: '1', unit: 'whole' },
      { name: 'Rice Vinegar', amount: '3', unit: 'tbsp' }, { name: 'Sesame Seeds', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      { number: 1, title: 'Rice', description: 'Cook sushi rice, season with rice vinegar mixture.', duration: 20 },
      { number: 2, title: 'Prep', description: 'Slice avocado and cucumber into thin strips.', duration: 10 },
      { number: 3, title: 'Roll', description: 'Spread rice on nori, add fillings, roll tightly using bamboo mat.', duration: 15 },
      { number: 4, title: 'Cut', description: 'Cut into 8 pieces with wet knife. Top with sesame seeds.', duration: 5 },
    ],
    creator: creators[3], likes: 10200, saves: 8100, comments: 267, views: 72000, isSponsored: false, isTrending: false,
    tags: ['sushi', 'japanese', 'avocado', 'healthy'], createdAt: '2026-01-25'
  },
  {
    id: 'r12', title: 'Smoky BBQ Brisket', description: 'Low and slow smoked beef brisket with a caramelized bark, juicy interior, and homemade BBQ sauce.',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop', category: 'BBQ & Grill', cuisine: 'American', difficulty: 'Hard',
    prepTime: 30, cookTime: 720, servings: 10, calories: 480,
    ingredients: [
      { name: 'Beef Brisket', amount: '5', unit: 'kg' }, { name: 'Brown Sugar', amount: '1/2', unit: 'cup' },
      { name: 'Paprika', amount: '1/4', unit: 'cup' }, { name: 'Black Pepper', amount: '3', unit: 'tbsp' },
      { name: 'Garlic Powder', amount: '2', unit: 'tbsp' }, { name: 'Apple Cider Vinegar', amount: '1', unit: 'cup' },
    ],
    steps: [
      { number: 1, title: 'Rub', description: 'Apply dry rub generously, refrigerate overnight.', duration: 480 },
      { number: 2, title: 'Smoke', description: 'Smoke at 225°F for 10-12 hours until 203°F internal.', duration: 720 },
      { number: 3, title: 'Rest', description: 'Wrap in butcher paper, rest for 1-2 hours.', duration: 90 },
      { number: 4, title: 'Slice', description: 'Slice against the grain, serve with sauce and pickles.', duration: 5 },
    ],
    creator: creators[4], likes: 13700, saves: 10800, comments: 456, views: 98000, isSponsored: true, isTrending: true,
    tags: ['bbq', 'brisket', 'smoked', 'meat'], createdAt: '2026-03-01'
  },
];
