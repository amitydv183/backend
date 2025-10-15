const Pet = require('../models/pet');
const cloudinary = require('cloudinary').v2;

// ✅ configure Cloudinary
 cloudinary.config({ 
        cloud_name: 'dsn20ii2z', 
        api_key: '554698914281938', 
        api_secret: 'JTl3L3mRA7KOVu_sG9ZYapn9BRQ' // Click 'View API Keys' above to copy your API secret
    });

class PetController {
  // 📋 Get all pets of logged-in user
  static async getPets(req, res) {
    try {
      const pets = await Pet.find({ userId: req.user._id });
      res.status(200).json(pets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // ➕ Add new pet (with image)
  static async addPet(req, res) {
    try {
      const { petName, type, age, vaccinations } = req.body;
      const file = req.files.image; // 👈 image from form-data key = image

      // ✅ upload to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "pet_images"
      });

      const newPet = await Pet.create({
        petName,
        type,
        age,
        vaccinations: vaccinations ? JSON.parse(vaccinations) : [],
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url
        },
        userId: req.user._id
      });

      res.status(201).json(newPet);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  // ✏️ Update pet (with optional new image)
  static async updatePet(req, res) {
    try {
      const { petName, type, age, vaccinations } = req.body;
      const id = req.params.id;
      let updateData = { petName, type, age };

      if (vaccinations) updateData.vaccinations = JSON.parse(vaccinations);

      // ✅ if new image uploaded, update Cloudinary too
      if (req.files && req.files.image) {
        const file = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "pet_images"
        });
        updateData.image = {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url
        };
      }

      const updatedPet = await Pet.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { new: true }
      );

      if (!updatedPet) return res.status(404).json({ message: "Pet not found" });
      res.status(200).json(updatedPet);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  // ❌ Delete pet
  static async deletePet(req, res) {
    try {
      const pet = await Pet.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!pet) return res.status(404).json({ message: "Pet not found" });

      // ✅ optionally delete image from Cloudinary
      await cloudinary.uploader.destroy(pet.image.public_id);

      res.status(200).json({ message: "Pet deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = PetController;
