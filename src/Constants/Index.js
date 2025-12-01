// ============================================================================
// Menu Data with ACTUAL Kenyan & Swahili Food Images
// ============================================================================

// Actual Kenyan food images from your provided URLs
const imgNyamaChoma = "https://images.pexels.com/photos/18385910/pexels-photo-18385910.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgUgaliSukuma = "https://www.google.com/imgres?q=ugali%20skuma&imgurl=https%3A%2F%2Flookaside.instagram.com%2Fseo%2Fgoogle_widget%2Fcrawler%2F%3Fmedia_id%3D3555323722147657823&imgrefurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FDFXDBagIXhf%2F&docid=8MC4oiDGTzAmlM&tbnid=dwfyHO6H_R2XgM&vet=12ahUKEwiytKCnqZSRAxUd87sIHU7QObMQM3oECB0QAA..i&w=1440&h=1800&hcb=2&ved=2ahUKEwiytKCnqZSRAxUd87sIHU7QObMQM3oECB0QAA";
const imgPilau = "https://www.google.com/imgres?q=pilau&imgurl=https%3A%2F%2Ftoasterding.com%2Fwp-content%2Fuploads%2F2024%2F04%2Fpilau.webp&imgrefurl=https%3A%2F%2Ftoasterding.com%2Fswahili-pilau-recipe-pilau-ya-nyama%2F&docid=0kIdQKtqwx2mdM&tbnid=OIMskxI9AfgG1M&vet=12ahUKEwjfpsbCqZSRAxVb87sIHUTcJSkQM3oECBcQAA..i&w=1280&h=854&hcb=2&ved=2ahUKEwjfpsbCqZSRAxVb87sIHUTcJSkQM3oECBcQAA";
const imgSamosa = "https://www.google.com/imgres?q=samosa&imgurl=https%3A%2F%2Fwww.cookwithnabeela.com%2Fwp-content%2Fuploads%2F2024%2F02%2FAlooSamosa3.webp&imgrefurl=https%3A%2F%2Fwww.cookwithnabeela.com%2Frecipe%2Faloo-samosa%2F&docid=_0TxlIpdqi4voM&tbnid=KwdWmrrsiqFM0M&vet=12ahUKEwiOnMvUqZSRAxVH9LsIHQ50AUIQM3oECBoQAA..i&w=1024&h=1024&hcb=2&ved=2ahUKEwiOnMvUqZSRAxVH9LsIHQ50AUIQM3oECBoQAA";
const imgMandazi = "https://www.google.com/imgres?q=mandazi&imgurl=https%3A%2F%2Finstapilau.com%2Fmedia%2Fimages%2F2024%2F11%2F2%2FHow_to_Make_Delicious_Mandazi_A_Step-by-Step_Guide.jpg&imgrefurl=https%3A%2F%2Finstapilau.com%2Fblog%2Fhow-to-make-delicious-mandazi-a-step-by-step-guide%2F%3Fsrsltid%3DAfmBOor4dNlb78ZFFeqpKbXF5fJQCKqnLhVX1qdbQBTn8oDKgOp9LDzL&docid=mZrxec9N3P16UM&tbnid=VNyCYDdRrMBMLM&vet=12ahUKEwj2mIKNqpSRAxUuhP0HHUHqOcwQM3oECBUQAA..i&w=1600&h=900&hcb=2&ved=2ahUKEwj2mIKNqpSRAxUuhP0HHUHqOcwQM3oECBUQAA";
const imgKachumbari = "https://www.google.com/imgres?q=kachumbari&imgurl=https%3A%2F%2Fmealsbymavis.com%2Fwp-content%2Fuploads%2F2019%2F05%2FKACHUMBARI_3-2-500x500.jpg&imgrefurl=https%3A%2F%2Fmealsbymavis.com%2Fkachumbari-east-african-tomato-and-onion-salad%2F&docid=6o_hsW9Wa2YODM&tbnid=8vgOTlH608J_jM&vet=12ahUKEwjcofm8qpSRAxU-g_0HHbcXDZIQM3oECBsQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwjcofm8qpSRAxU-g_0HHbcXDZIQM3oECBsQAA";
const imgChipsMayai = "https://www.google.com/imgres?q=chips&imgurl=https%3A%2F%2Fwww.seriouseats.com%2Fthmb%2FBUR7a-Jcrb0mDuCkHHkSsad4f6k%3D%2F1500x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2F20240304-SEA-Chips-AmandaSuarez-22-45bb69d129324fcda1cd06153f2dc71a.jpg&imgrefurl=https%3A%2F%2Fwww.seriouseats.com%2Fbritish-chips-recipe-8605265&docid=lP3tJDsEs67wcM&tbnid=k8YwfJyMKGEWVM&vet=12ahUKEwit2dbOqpSRAxXYhv0HHZpgCygQM3oECBoQAA..i&w=1500&h=1125&hcb=2&ved=2ahUKEwit2dbOqpSRAxXYhv0HHZpgCygQM3oECBoQAA";
const imgMishkaki = "https://www.google.com/imgres?q=mishkaki&imgurl=https%3A%2F%2Fwww.beckandbulow.com%2Fcdn%2Fshop%2Farticles%2FBeef_Mishkaki_Recipe_A_Tanzanian_Street_Food_Favorite_1_-_Beck_Bulow_2240x.png%3Fv%3D1697731788&imgrefurl=https%3A%2F%2Fwww.beckandbulow.com%2Fblogs%2Fbeef%2Fbeef-mishkaki-recipe-a-tanzanian-street-food-favorite%3Fsrsltid%3DAfmBOorDR67spz4iyg98FRcMOsEcvQDPvv9-gdUm0GqrdYvDxQA34KoV&docid=Z0KYkypFm7VPIM&tbnid=VSoNYp67T3yIjM&vet=12ahUKEwi7mv_gqpSRAxUlg_0HHRK1E6gQM3oECBQQAA..i&w=2240&h=1260&hcb=2&ved=2ahUKEwi7mv_gqpSRAxUlg_0HHRK1E6gQM3oECBQQAA";
const imgChai = "https://www.google.com/imgres?q=chai&imgurl=https%3A%2F%2Fwww.teaforturmeric.com%2Fwp-content%2Fuploads%2F2021%2F11%2FMasala-Chai-Tea-Recipe-Card.jpg&imgrefurl=https%3A%2F%2Fwww.teaforturmeric.com%2Fmasala-chai-recipe%2F&docid=xOsBE1Z-fzHttM&tbnid=4MUwUP_pmXm3BM&vet=12ahUKEwjul8vtqpSRAxXInP0HHarJHckQM3oECBsQAA..i&w=1456&h=1456&hcb=2&ved=2ahUKEwjul8vtqpSRAxXInP0HHarJHckQM3oECBsQAA";
const imgMangoJuice = "https://images.pexels.com/photos/14085327/pexels-photo-14085327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgMahamri = "https://www.google.com/imgres?q=mahmri&imgurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FIwKwztK8Yow%2Fmaxresdefault.jpg&imgrefurl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DIwKwztK8Yow&docid=uft0NeTRJ9EPzM&tbnid=wm09lC4w9OckLM&vet=12ahUKEwjM19f8qpSRAxU9hv0HHfOkNwMQM3oECBkQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwjM19f8qpSRAxU9hv0HHfOkNwMQM3oECBkQAA";
const imgBiriani = "https://www.google.com/imgres?q=biriani&imgurl=https%3A%2F%2Flookaside.instagram.com%2Fseo%2Fgoogle_widget%2Fcrawler%2F%3Fmedia_id%3D2335633631854499999&imgrefurl=https%3A%2F%2Fwww.instagram.com%2Fp%2FCBp1mnYJJif%2F&docid=u24OLy1FqIkxjM&tbnid=RtwCQ_0DylByzM&vet=12ahUKEwjM9P-Jq5SRAxXxhv0HHQxwDvUQM3oECBoQAA..i&w=1440&h=1787&hcb=2&ved=2ahUKEwjM9P-Jq5SRAxXxhv0HHQxwDvUQM3oECBoQAA";
const imgMatoke = "https://www.google.com/imgres?q=matoke&imgurl=https%3A%2F%2Fwww.sanjanafeasts.co.uk%2Fwp-content%2Fuploads%2F2019%2F04%2Fmatoke-f-1.jpg&imgrefurl=https%3A%2F%2Fwww.sanjanafeasts.co.uk%2F2019%2F04%2Fugandan-matoke-spicy-green-banana-mash%2F&docid=hdU2GrjHEJIamM&tbnid=8b5P8cX6Qu44WM&vet=12ahUKEwiW1o-dq5SRAxWBhf0HHe12FAoQM3oECBoQAA..i&w=2400&h=1600&hcb=2&ved=2ahUKEwiW1o-dq5SRAxWBhf0HHe12FAoQM3oECBoQAA";
const imgMihogo = "https://www.google.com/imgres?q=mihogo&imgurl=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FD8nyumbUIAAysUU.jpg&imgrefurl=https%3A%2F%2Fx.com%2Fbunguufoodstour%2Fstatus%2F1137707284052742144&docid=TLeEgdtcQbtT0M&tbnid=-Vr_rqbQmi07CM&vet=12ahUKEwjC0qqrq5SRAxUd9bsIHRo0CxQQM3oECBoQAA..i&w=898&h=802&hcb=2&ved=2ahUKEwjC0qqrq5SRAxUd9bsIHRo0CxQQM3oECBoQAA";
const imgBeer = "https://www.google.com/imgres?q=mihogo&imgurl=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FD8nyumbUIAAysUU.jpg&imgrefurl=https%3A%2F%2Fx.com%2Fbunguufoodstour%2Fstatus%2F1137707284052742144&docid=TLeEgdtcQbtT0M&tbnid=-Vr_rqbQmi07CM&vet=12ahUKEwjC0qqrq5SRAxUd9bsIHRo0CxQQM3oECBoQAA..i&w=898&h=802&hcb=2&ved=2ahUKEwjC0qqrq5SRAxUd9bsIHRo0CxQQM3oECBoQAA";

// Additional images using the ones you provided (reusing where appropriate)
const imgFishCurry = "https://images.unsplash.com/photo-1631079789969-7de35f444a7e?auto=format&fit=crop&w=1200&q=80";
const imgMaharagwe = "https://images.unsplash.com/photo-1622036244108-7a0e2e8e6b1e?auto=format&fit=crop&w=1200&q=80";
const imgGitheri = "https://images.unsplash.com/photo-1622036244108-7a0e2e8e6b1e?auto=format&fit=crop&w=1200&q=80";
const imgCoffee = "https://images.pexels.com/photos/8514744/pexels-photo-8514744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgIcedTea = "https://images.pexels.com/photos/14085327/pexels-photo-14085327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgVegetableSoup = "https://images.pexels.com/photos/18209493/pexels-photo-18209493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgChickenSoup = "https://images.pexels.com/photos/18209493/pexels-photo-18209493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgCassavaPudding = "https://images.pexels.com/photos/18209491/pexels-photo-18209491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgChocolateCake = "https://images.pexels.com/photos/16299614/pexels-photo-16299614.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgChapati = "https://images.pexels.com/photos/16299617/pexels-photo-16299617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgWhiskey = "https://images.pexels.com/photos/1592923/pexels-photo-1592923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgWine = "https://images.pexels.com/photos/1592923/pexels-photo-1592923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgGreekSalad = "https://images.pexels.com/photos/16299615/pexels-photo-16299615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const imgFruitSalad = "https://images.pexels.com/photos/16299615/pexels-photo-16299615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

// ============================================================================
// Menu Items with Actual Kenyan Food Images
// ============================================================================

export const startersItem = [
  {
    id: 1,
    name: "Samusa",
    price: 375,
    category: "Vegetarian",
    description: "Crispy fried pastry filled with spiced potatoes and peas",
    image: imgSamosa
  },
  {
    id: 2,
    name: "Mshikaki",
    price: 450,
    category: "Non-Vegetarian",
    description: "Grilled beef skewers marinated in traditional spices",
    image: imgMishkaki
  },
  {
    id: 3,
    name: "Kachumbari",
    price: 525,
    category: "Vegetarian",
    description: "Fresh tomato and onion salad with cilantro and lime",
    image: imgKachumbari
  },
  {
    id: 4,
    name: "Ndizi Mbichi",
    price: 150,
    category: "Vegetarian",
    description: "Sweet plantains grilled to perfection",
    image: imgMatoke
  },
  {
    id: 5,
    name: "Chipsi Mayai",
    price: 180,
    category: "Vegetarian",
    description: "French fries topped with scrambled eggs",
    image: imgChipsMayai
  },
  {
    id: 6,
    name: "Mishkaki ya Kuku",
    price: 330,
    category: "Non-Vegetarian",
    description: "Tender chicken skewers grilled with herbs",
    image: imgMishkaki
  },
  {
    id: 7,
    name: "Bhajia",
    price: 225,
    category: "Vegetarian",
    description: "Crispy vegetable fritters made with chickpea flour",
    image: imgSamosa
  },
  {
    id: 8,
    name: "Mandazi",
    price: 120,
    category: "Vegetarian",
    description: "Sweet fried dough, perfect with tea",
    image: imgMandazi
  }
];

export const mainCourse = [
  {
    id: 1,
    name: "Nyama Choma",
    price: 600,
    category: "Non-Vegetarian",
    description: "Grilled meat served with traditional accompaniments",
    image: imgNyamaChoma
  },
  {
    id: 2,
    name: "Ugali na Sukuma Wiki",
    price: 525,
    category: "Vegetarian",
    description: "Maize meal with sautéed collard greens",
    image: imgUgaliSukuma
  },
  {
    id: 3,
    name: "Pilau ya Kuku",
    price: 675,
    category: "Non-Vegetarian",
    description: "Spiced rice with chicken and vegetables",
    image: imgPilau
  },
  {
    id: 4,
    name: "Maharagwe",
    price: 270,
    category: "Vegetarian",
    description: "Stewed kidney beans with coconut milk",
    image: imgMaharagwe
  },
  {
    id: 5,
    name: "Mchuzi wa Samaki",
    price: 450,
    category: "Non-Vegetarian",
    description: "Fish curry with tomatoes and spices",
    image: imgFishCurry
  },
  {
    id: 6,
    name: "Biriani ya Ng'ombe",
    price: 750,
    category: "Non-Vegetarian",
    description: "Beef biryani with aromatic spices",
    image: imgBiriani
  },
  {
    id: 7,
    name: "Matoke",
    price: 375,
    category: "Vegetarian",
    description: "Steamed green bananas with groundnut sauce",
    image: imgMatoke
  },
  {
    id: 8,
    name: "Githeri",
    price: 300,
    category: "Vegetarian",
    description: "Mixed beans and maize stew",
    image: imgGitheri
  }
];

export const beverages = [
  {
    id: 1,
    name: "Chai",
    price: 75,
    category: "Hot",
    description: "Traditional Kenyan tea with milk and spices",
    image: imgChai
  },
  {
    id: 2,
    name: "Lemon Soda",
    price: 120,
    category: "Cold",
    description: "Refreshing lemon-flavored soda",
    image: imgChai
  },
  {
    id: 3,
    name: "Mango Juice",
    price: 180,
    category: "Cold",
    description: "Fresh mango juice, naturally sweet",
    image: imgChai
  },
  {
    id: 4,
    name: "Cold Coffee",
    price: 225,
    category: "Cold",
    description: "Chilled coffee with milk and sugar",
    image: imgCoffee
  },
  {
    id: 5,
    name: "Fresh Lime Water",
    price: 90,
    category: "Cold",
    description: "Fresh lime juice with water and mint",
    image: imgMangoJuice
  },
  {
    id: 6,
    name: "Iced Tea",
    price: 150,
    category: "Cold",
    description: "Chilled tea with lemon and honey",
    image: imgIcedTea
  },
  {
    id: 7,
    name: "Tamarind Juice",
    price: 195,
    category: "Cold",
    description: "Sweet and tangy tamarind drink",
    image: imgMangoJuice
  },
  {
    id: 8,
    name: "Passion Fruit Juice",
    price: 210,
    category: "Cold",
    description: "Exotic passion fruit juice",
    image: imgMangoJuice
  }
];

export const soups = [
  {
    id: 1,
    name: "Vegetable Soup",
    price: 180,
    category: "Vegetarian",
    description: "Mixed vegetables in a flavorful broth",
    image: imgVegetableSoup
  },
  {
    id: 2,
    name: "Sweet Corn Soup",
    price: 195,
    category: "Vegetarian",
    description: "Creamy corn soup with herbs",
    image: imgVegetableSoup
  },
  {
    id: 3,
    name: "Hot & Sour Soup",
    price: 210,
    category: "Vegetarian",
    description: "Spicy and tangy vegetable soup",
    image: imgVegetableSoup
  },
  {
    id: 4,
    name: "Chicken Soup",
    price: 240,
    category: "Non-Vegetarian",
    description: "Hearty chicken soup with vegetables",
    image: imgChickenSoup
  },
  {
    id: 5,
    name: "Mushroom Soup",
    price: 225,
    category: "Vegetarian",
    description: "Rich mushroom soup with cream",
    image: imgVegetableSoup
  },
  {
    id: 6,
    name: "Lemon Coriander Soup",
    price: 165,
    category: "Vegetarian",
    description: "Light soup with lemon and coriander",
    image: imgVegetableSoup
  },
  {
    id: 7,
    name: "Tomato Soup",
    price: 150,
    category: "Vegetarian",
    description: "Classic tomato soup with herbs",
    image: imgVegetableSoup
  },
  {
    id: 8,
    name: "Minestrone Soup",
    price: 195,
    category: "Vegetarian",
    description: "Italian vegetable soup with pasta",
    image: imgVegetableSoup
  }
];

export const desserts = [
  {
    id: 1,
    name: "Mihogo ya Sukari",
    price: 150,
    category: "Vegetarian",
    description: "Sweet cassava pudding, a traditional Kenyan dessert",
    image: imgCassavaPudding
  },
  {
    id: 2,
    name: "Mkate wa Sinia",
    price: 225,
    category: "Vegetarian",
    description: "Coconut bread, soft and sweet with coconut flavor",
    image: imgMahamri
  },
  {
    id: 3,
    name: "Keki ya Chokoleti",
    price: 375,
    category: "Vegetarian",
    description: "Rich chocolate cake, moist and decadent",
    image: imgChocolateCake
  },
  {
    id: 4,
    name: "Uji wa Mkate",
    price: 270,
    category: "Vegetarian",
    description: "Bread pudding made with fermented millet",
    image: imgMahamri
  },
  {
    id: 5,
    name: "Mafuta",
    price: 180,
    category: "Vegetarian",
    description: "Sweet fried dough balls, crispy on the outside",
    image: imgMandazi
  },
  {
    id: 6,
    name: "Ndizi Mbivu",
    price: 120,
    category: "Vegetarian",
    description: "Ripe bananas, naturally sweet and soft",
    image: imgMatoke
  }
];

export const breads = [
  {
    id: 1,
    name: "Chapati",
    price: 525,
    category: "Vegetarian",
    description: "Thin flatbread made from wheat flour",
    image: imgChapati
  },
  {
    id: 2,
    name: "Mandazi",
    price: 600,
    category: "Vegetarian",
    description: "Sweet fried dough, crispy and fluffy",
    image: imgMandazi
  },
  {
    id: 3,
    name: "Samosa",
    price: 675,
    category: "Vegetarian",
    description: "Triangular pastry filled with spiced vegetables",
    image: imgSamosa
  },
  {
    id: 4,
    name: "Mkate wa Mayai",
    price: 450,
    category: "Vegetarian",
    description: "Swahili bread with egg, soft and savory",
    image: imgMahamri
  },
  {
    id: 5,
    name: "Mahamri",
    price: 300,
    category: "Vegetarian",
    description: "Cardamom-flavored fried bread",
    image: imgMahamri
  }
];

export const alcoholicDrinks = [
  {
    id: 1,
    name: "Beer",
    price: 300,
    category: "Alcoholic",
    description: "Refreshing lager beer, served chilled",
    image: imgBeer
  },
  {
    id: 2,
    name: "Whiskey",
    price: 750,
    category: "Alcoholic",
    description: "Smooth blended whiskey, aged to perfection",
    image: imgWhiskey
  },
  {
    id: 3,
    name: "Vodka",
    price: 675,
    category: "Alcoholic",
    description: "Premium vodka, clear and versatile",
    image: imgWhiskey
  },
  {
    id: 4,
    name: "Rum",
    price: 525,
    category: "Alcoholic",
    description: "Rich dark rum with caramel notes",
    image: imgWhiskey
  },
  {
    id: 5,
    name: "Tequila",
    price: 900,
    category: "Alcoholic",
    description: "Authentic tequila, bold and distinctive",
    image: imgWhiskey
  },
  {
    id: 6,
    name: "Cocktail",
    price: 600,
    category: "Alcoholic",
    description: "Signature mixed drink, expertly crafted",
    image: imgWhiskey
  },
  {
    id: 7,
    name: "Wine",
    price: 450,
    category: "Alcoholic",
    description: "Fine red wine, full-bodied and elegant",
    image: imgWine
  },
  {
    id: 8,
    name: "Gin",
    price: 550,
    category: "Alcoholic",
    description: "Classic gin with juniper essence",
    image: imgWhiskey
  }
];



// ============================================================================
// Menu Categories with Actual Kenyan Food Images
// ============================================================================

export const menus = [
  { 
    id: 1, 
    name: "Starters", 
    bgColor: "#b73e3e",
    icon: "🍲", 
    image: imgSamosa,
    items: startersItem 
  },
  { 
    id: 2, 
    name: "Main Course", 
    bgColor: "#5b45b0",
    icon: "🍛", 
    image: imgNyamaChoma,
    items: mainCourse 
  },
  { 
    id: 3, 
    name: "Beverages", 
    bgColor: "#7f167f",
    icon: "🍹", 
    image: imgChai,
    items: beverages 
  },
  { 
    id: 4, 
    name: "Soups", 
    bgColor: "#735f32",
    icon: "🍜", 
    image: imgPilau,
    items: soups 
  },
  { 
    id: 5, 
    name: "Desserts", 
    bgColor: "#1d2569",
    icon: "🍰", 
    image: imgMandazi,
    items: desserts 
  },
  { 
    id: 6, 
    name: "Breads", 
    bgColor: "#285430",
    icon: "🍞", 
    image: imgMahamri,
    items: breads 
  },
  { 
    id: 7, 
    name: "Alcoholic Drinks", 
    bgColor: "#b73e3e",
    icon: "🍺", 
    image: imgBeer,
    items: alcoholicDrinks 
  },
  
];

// ============================================================================
// Popular Dishes with Actual Kenyan Food Images
// ============================================================================

export const popularDishes = [
  {
    id: 1,
    image: imgNyamaChoma,
    name: 'Nyama Choma',
    numberOfOrders: 350,
  },
  {
    id: 2,
    image: imgPilau,
    name: 'Pilau ya Kuku',
    numberOfOrders: 290,
  },
  {
    id: 3,
    image: imgKachumbari,
    name: 'Kachumbari',
    numberOfOrders: 310,
  },
  {
    id: 4,
    image: imgMandazi,
    name: 'Mandazi',
    numberOfOrders: 280,
  },
  {
    id: 5,
    image: imgUgaliSukuma,
    name: 'Ugali na Sukuma',
    numberOfOrders: 270,
  },
  {
    id: 6,
    image: imgChipsMayai,
    name: 'Chips Mayai',
    numberOfOrders: 260,
  },
  {
    id: 7,
    image: imgSamosa,
    name: 'Samusa',
    numberOfOrders: 240,
  },
  {
    id: 8,
    image: imgMishkaki,
    name: 'Mishkaki',
    numberOfOrders: 230,
  },
  {
    id: 9,
    image: imgBiriani,
    name: 'Biriani',
    numberOfOrders: 220,
  },
  {
    id: 10,
    image: imgMatoke,
    name: 'Matoke',
    numberOfOrders: 200,
  },
];

// ============================================================================
// Other Data Exports
// ============================================================================

export const tables = [
  { id: 1, name: "Table 1", status: "Booked", initial: "AM", seats: 4 },
  { id: 2, name: "Table 2", status: "Available", initial: "MB", seats: 6 },
  { id: 3, name: "Table 3", status: "Booked", initial: "JS", seats: 2 },
  { id: 4, name: "Table 4", status: "Available", initial: "HR", seats: 4 },
  { id: 5, name: "Table 5", status: "Booked", initial: "PL", seats: 3 },
  { id: 6, name: "Table 6", status: "Available", initial: "RT", seats: 4 },
  { id: 7, name: "Table 7", status: "Booked", initial: "LC", seats: 5 },
  { id: 8, name: "Table 8", status: "Available", initial: "DP", seats: 5 },
  { id: 9, name: "Table 9", status: "Booked", initial: "NK", seats: 6 },
  { id: 10, name: "Table 10", status: "Available", initial: "SB", seats: 6 },
  { id: 11, name: "Table 11", status: "Booked", initial: "GT", seats: 4 },
  { id: 12, name: "Table 12", status: "Available", initial: "JS", seats: 6 },
  { id: 13, name: "Table 13", status: "Booked", initial: "EK", seats: 2 },
  { id: 14, name: "Table 14", status: "Available", initial: "QN", seats: 6 },
  { id: 15, name: "Table 15", status: "Booked", initial: "TW", seats: 3 }
];

export const metricsData = [
  { title: "Revenue", value: "KSH 50,846.90", percentage: "12%", color: "#025cca", isIncrease: false },
  { title: "Orders Today", value: "10,342", percentage: "16%", color: "#02ca3a", isIncrease: true },
  { title: "Total Customers", value: "19,720", percentage: "10%", color: "#f6b100", isIncrease: true },
  { title: "Active Tables", value: "20", percentage: "10%", color: "#be3e3f", isIncrease: false },
];

export const itemsData = [
  { title: "Total Categories", value: "8", percentage: "12%", color: "#5b45b0", isIncrease: false },
  { title: "Total Dishes", value: "50", percentage: "12%", color: "#285430", isIncrease: true },
  { title: "Active Orders", value: "12", percentage: "12%", color: "#735f32", isIncrease: true },
  { title: "Total Tables", value: "15", percentage: "8%", color: "#7f167f", isIncrease: true }
];

export const orders = [
  {
    id: "101",
    customer: "Kimani Wantam",
    status: "Ready",
    dateTime: "January 18, 2025 08:32 PM",
    items: 8,
    tableNo: 3,
    total: 250.0,
    customerDetails: {
      name: "Wantam",
      phone: "0712345678",
      guests: 4
    },
    table: {
      tableNo: 3
    },
    orderStatus: "Ready",
    bills: {
      totalWithTax: 250.0
    }
  },
  {
    id: "102",
    customer: "John Dimathew",
    status: "In Progress",
    dateTime: "January 18, 2025 08:45 PM",
    items: 5,
    tableNo: 4,
    total: 180.0,
    customerDetails: {
      name: "John Dimathew",
      phone: "0723456789",
      guests: 2
    },
    table: {
      tableNo: 4
    },
    orderStatus: "In Progress",
    bills: {
      totalWithTax: 180.0
    }
  },
  {
    id: "103",
    customer: "Emma Smith",
    status: "Ready",
    dateTime: "January 18, 2025 09:00 PM",
    items: 3,
    tableNo: 5,
    total: 120.0,
    customerDetails: {
      name: "Emma Smith",
      phone: "0734567890",
      guests: 3
    },
    table: {
      tableNo: 5
    },
    orderStatus: "Ready",
    bills: {
      totalWithTax: 120.0
    }
  },
  {
    id: "104",
    customer: "Chris Brown",
    status: "In Progress",
    dateTime: "January 18, 2025 09:15 PM",
    items: 6,
    tableNo: 6,
    total: 220.0,
    customerDetails: {
      name: "Chris Brown",
      phone: "0745678901",
      guests: 5
    },
    table: {
      tableNo: 6
    },
    orderStatus: "In Progress",
    bills: {
      totalWithTax: 220.0
    }
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

// Get all items from all categories
export const getAllItems = () => {
  return menus.flatMap(category => category.items);
};

// Search items by name
export const searchItems = (query) => {
  const allItems = getAllItems();
  return allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
};

// Get items by category
export const getItemsByCategory = (categoryName) => {
  const category = menus.find(cat => cat.name === categoryName);
  return category ? category.items : [];
};

// Get popular items (top 5 by order count)
export const getPopularItems = () => {
  return popularDishes.slice(0, 5);
};

// ============================================================================
// Default Export
// ============================================================================

export default {
  menus,
  popularDishes,
  tables,
  metricsData,
  itemsData,
  orders,
  getAllItems,
  searchItems,
  getItemsByCategory,
  getPopularItems
};