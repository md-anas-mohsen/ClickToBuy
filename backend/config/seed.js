const {
  products: Product,
  product_categories: ProductCategory,
  product_images: ProductImage,
  product_sellers: ProductSeller,
  users: User,
  categories: Category,
  sellers: Seller,
} = require("../models/getModels");

const seedTables = async () => {
  await Product.bulkCreate([
    {
      name: "Real Madrid CF Men's Home Shirt 21/22 White",
      description: `They win on the pitch, but the Plaza de Cibeles is where they celebrate with their football family. The concentric circles and spiral pattern of the fountain in Madrid's famous square inspired the design of this adidas Real Madrid authentic jersey. Made for players, it includes lightweight details and cooling HEAT.RDY. Long sleeves add extra coverage. This product is made with Primegreen, a series of high-performance recycled materials.`,
      stock: 100,
      price: 3000,
      ratings: 4.5,
    },
    {
      name: "Jordan 1 Retro High White University Blue Black",
      description: `Jordan Brand paid homage to MJ’s alma mater with the Air Jordan 1 High University Blue. The University Blue colorway is prominent in the Jordan 1’s history. The first UNC-inspired Jordan 1 dates back to 1985 when the Jordan 1 debuted. Since then, there have been numerous iterations of the UNC 1, most recently the Jordan 1 Retro High Fearless UNC To Chicago. Jumpman is building off of its past and switching it up this week with a new iteration.
    The upper of the Air Jordan 1 High University Blue is composed of a white and black tumbled leather upper with University Blue Durabuck overlays. Following traditional Jordan 1 detailing, a Nike Air woven label is located on the tongue and an Air Jordan Wings Logo is printed on the ankle. A white midsole and University Blue outsole complete rejuvenated classic.`,
      stock: 100,
      price: 9000,
      ratings: 5,
    },
    {
      name: "Apple M1 Chip with 8-Core CPU and 8-Core GPU 256GB Storage",
      description: `Apple M1 chip with 8-core CPU, 8-core GPU, and 16-core Neural Engine
    8GB unified memory
    256GB SSD storage¹
    13-inch Retina display with True Tone
    Magic Keyboard
    Touch Bar and Touch ID
    Force Touch trackpad
    Two Thunderbolt / USB 4 ports`,
      stock: 100,
      price: 100000,
      ratings: 5,
    },
    {
      name: "Sony PlayStation 5",
      description: `CPU: x86-64-AMD Ryzen Zen 8 Cores / 16 Threads at 3.5GHz.GPU: AMD Radeon RDNA 2-based graphics engine.
    16GB GDDR6/256-bit Memory; 825GB SSD Storage Capacity
    Ethernet (10BASE-T, 100BASE-TX, 1000BASE-T), IEEE 802.11 a/b/g/n/ac/ax, Bluetooth 5.1
    HDR technology, 8K output,4K TV gaming, Up to 120 fps with 120Hz output, Tempest 3D AudioTech
    What's Included: Sony PlayStation 5 Disc Version; DualSense; USB cable, HDMI cable. 3 In 1 Design Stylus (Stylus Pen + Ballpoint Pen + USB 3.0 64GB Flash Drive)`,
      stock: 100,
      price: 100000,
      ratings: 5,
    },
    {
      name: "Corsair VOID RGB Elite Wireless Premium Gaming Headset",
      description: `Hear everything from the lightest footstep to the most Thundering explosion thanks to premium custom-tuned 50mm high-density neodymium Audio drivers with an expanded frequency range of 20Hz-30,000Hz
    Constructed for enduring comfort through long gaming sessions with breathable microfiber mesh fabric and plush memory foam earpads
    Connect wirelessly to your PC or PS4 using low-latency 2.4GHz wireless with the included USB adapter
    An omnidirectional microphone picks up your voice with exceptional clarity with a flip-up mute function and a built-in LED mute indicator
    Built to last through years of gaming with durable construction and aluminum Yokes`,
      stock: 100,
      price: 5000,
      ratings: 5,
    },
    {
      name: "Apple AirPods with Charging Case (Previous Model)",
      description: `Amazingly easy to use, Air Pods combine intelligent design with breakthrough technology and crystal clear sound.
    Get up to 5 hours of listening time on one charge.
    Or up to 3 hours with just a 15-minute charge in the charging case.`,
      stock: 100,
      price: 25000,
      ratings: 5,
    },
    {
      name: "Stretch Plush Dining Chair Slipcover 4-Piece Set",
      description: `Protect your furniture from spills, stains, pet hair, dirt, scuffs and scratches.
    Refresh your look in seconds!
    Machine Washable
    Effortlessly installs in seconds
    Best suited for Parsons chairs 18" wide and 42" tall`,
      stock: 100,
      price: 5000,
      ratings: 5,
    },
    {
      name: "Roku Streaming Stick+ | HD/4K/HDR Streaming Device",
      description: `Wireless that goes the distance: Basement rec room? Backyard movie night? Bring ‘em on. The long-range wireless receiver gives you extended range and a stronger signal for smooth streaming even in rooms farther from your router
    Brilliant picture quality: Experience your favorite shows with stunning detail and clarity—whether you’re streaming in HD, 4K, or HDR, you’ll enjoy picture quality that’s optimized for your TV with sharp resolution and vivid color
    Tons of power, tons of fun: Snappy and responsive, you’ll stream your favorites with ease—from movies and series on Apple TV, Prime Video, and Netflix, to cable alternatives like Sling, enjoy the most talked-about TV across thousands of channels
    No more juggling remotes: Power up your TV, adjust the volume, mute, and control your streaming all with one remote—use your voice to quickly search across channels, turn captions on, and more in a touch`,
      stock: 100,
      price: 5000,
      ratings: 5,
    },
    {
      name: "SAMSUNG (MZ-V8V1T0B/AM) 980 SSD 1TB",
      description: `UPGRADE TO IMPRESSIVE NVMe SPEED Whether you need a boost for gaming or a seamless workflow for heavy graphics, the 980 is a smart choice for outstanding SSD performance.
    PACKED WITH SPEED 980 delivers value, without sacrificing sequential read write speeds up to 3,500 3,000 MB s
    KEEP MOVING WITH FULL POWER MODE Keep your SSD running at its peak with Full Power Mode, which drives continuous and consistent high performance.
    RELIABLE THERMAL CONTROL 980 uses nickel coating to help manage the controller's heat level and a heat spreader label to deliver effective thermal control of the NAND chip.`,
      stock: 100,
      price: 5000,
      ratings: 5,
    },
    {
      name: "HP M27ha FHD Monitor - Full HD Monitor (1920 x 1080p) - IPS Panel and Built-in Audio",
      description: `OPTIMIZED SCREEN – Get high-quality pictures on a full HD display with an IPS panel and 27-inches of ultra-wide viewing angles (1920 x 1080 resolution).
    EASY ON THE EYES – Work long into the night without any eye strain with HP Low Blue Light software designed for greater eye comfort
    ADJUSTABLE VIEWING – Find your best view as the 3-sided micro-edge bezel display gives you unlimited sightlines, 100mm of height adjustment, and 90° pivot rotation.
    FULLY INTEGRATED AUDIO – Enjoy all your multimedia with a monitor that has convenient stereo audio right on the display.`,
      stock: 100,
      price: 5000,
      ratings: 5,
    },
  ]);

  await ProductImage.bulkCreate([
    {
      image_id: "products/mdh9i3phiido9kfiwedd",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1628627164/products/mdh9i3phiido9kfiwedd.jpg",
      product_id: 1,
    },
    {
      image_id: "products/uajrjd0khk63hgngfay9",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1628627165/products/uajrjd0khk63hgngfay9.jpg",
      product_id: 1,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1628627166/products/z2ytqsn5ggpncfok98hc.jpg",
      product_id: 1,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629025951/products/y0e7iepso08kxjv3f1yy.jpg",
      product_id: 2,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629639574/products/ajb0xhj7jyeioqhjftcj.jpg",
      product_id: 3,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629639823/products/siam1r4t82cl5xxalxim.jpg",
      product_id: 4,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629640359/products/l9m78ve1t1d927feazos.jpg",
      product_id: 5,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629640489/products/dskucoizq68umvakoq6u.jpg",
      product_id: 6,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629640817/products/d3vjyevcdbsdnilmoypa.jpg",
      product_id: 7,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629640950/products/geryuo1hcfnyezinefbo.jpg",
      product_id: 8,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629641211/products/t3dvkovlu7tedhvlyjlp.jpg",
      product_id: 9,
    },
    {
      image_id: "products/z2ytqsn5ggpncfok98hc",
      image_url:
        "https://res.cloudinary.com/stackedup/image/upload/v1629641332/products/vm5t90ms0ftnfdrthf5t.jpg",
      product_id: 10,
    },
  ]);

  const category = await Category.create({ category_name: "All Products" });

  await ProductCategory.bulkCreate([
    { category_id: category.category_id, product_id: 1 },
    { category_id: category.category_id, product_id: 2 },
    { category_id: category.category_id, product_id: 3 },
    { category_id: category.category_id, product_id: 4 },
    { category_id: category.category_id, product_id: 5 },
    { category_id: category.category_id, product_id: 6 },
    { category_id: category.category_id, product_id: 7 },
    { category_id: category.category_id, product_id: 8 },
    { category_id: category.category_id, product_id: 9 },
    { category_id: category.category_id, product_id: 10 },
  ]);
};

seedTables();
