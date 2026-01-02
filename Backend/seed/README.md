# Plant Seed Data

This directory contains seed files to populate the database with AYUSH medicinal plant data.

## Available Seed Files

### `seedPlants.js`
Seeds the database with 10 popular AYUSH medicinal plants:
1. **Tulsi (Holy Basil)** - Ocimum sanctum
2. **Ashwagandha** - Withania somnifera
3. **Neem** - Azadirachta indica
4. **Turmeric** - Curcuma longa
5. **Brahmi** - Bacopa monnieri
6. **Giloy (Guduchi)** - Tinospora cordifolia
7. **Amla (Indian Gooseberry)** - Phyllanthus emblica
8. **Shatavari** - Asparagus racemosus
9. **Triphala** - Traditional formulation
10. **Ginger** - Zingiber officinale

## How to Run

### Option 1: Using npm script
```bash
npm run seed:plants
```

### Option 2: Direct node command
```bash
node seed/seedPlants.js
```

## Important Notes

1. **Images**: The seed file includes image paths, but you'll need to add actual plant images to the `uploads/plants/` folder:
   - tulsi.jpg
   - ashwagandha.jpg
   - neem.jpg
   - turmeric.jpg
   - brahmi.jpg
   - giloy.jpg
   - amla.jpg
   - shatavari.jpg
   - triphala.jpg
   - ginger.jpg

2. **Duplicate Prevention**: The script checks if a plant already exists before adding it, so you can run it multiple times safely.

3. **Environment**: Make sure your `.env` file has the correct `MONGO_URI` configured.

## Adding Images

You can:
- Download images from the web (ensure you have proper licensing)
- Use the admin dashboard to upload images after seeding
- Add images manually to the `uploads/plants/` folder

## Data Source

All plant information has been gathered from:
- Official AYUSH resources
- Traditional Ayurvedic texts
- Scientific botanical databases
- Verified medicinal plant resources

All information is accurate and based on traditional AYUSH knowledge systems.

