import Wardrobe from "../model/wardrobe.model.js";
import User from "../model/user.model.js";
import { TopClothes } from "../model/top.model.js";
import { BottomClothes } from "../model/bottom.model.js";
import { Shoes } from "../model/shoes.model.js";

import { embeddingsQueue } from "../lib/embeddings.queue.js";

export const createWardrobe = async (req, res, next) => {
  try {
    const { user } = req;

    const wardrobe = await Wardrobe.create({
      userId: user._id,
      top: [],
      bottom: [],
      shoes: [],
    });

    await User.findByIdAndUpdate(user._id, { wardrobe: wardrobe._id });

    res.status(201).json({ wardrobe });
  } catch (error) {
    next(error);
  }
};

export const getMyWardrobe = async (req, res, next) => {
  try {
    const { user } = req;

    const wardrobe = await Wardrobe.findOne({ userId: user._id })
      .populate("top")
      .populate("bottom")
      .populate("shoes");

    res.status(200).json({ wardrobe });
  } catch (error) {
    next(error);
  }
};

export const addClothingItem = async (req, res, next) => {
  try {
    const { user } = req;
    const { category, image } = req.body;

    if (!user.wardrobe) {
      return res.status(400).json({ message: "Wardrobe does not exist" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!["Top", "Bottom", "Shoes"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    await embeddingsQueue.add(`processEmbeddingsFor${category}`, {
      userId: user._id,
      image,
      wardrobeId: user.wardrobe,
    });

    res.status(200).json({ message: "Clothing item is being processed" });
  } catch (error) {
    next(error);
  }
};

export const removeClothingItem = async (req, res, next) => {
  try {
    const { user } = req;
    const { clothId } = req.params;
    const { category } = req.body;

    if (!["Top", "Bottom", "Shoes"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (category === "Top") {
      await TopClothes.findOneAndDelete({ _id: clothId , userId: user._id});
      await Wardrobe.findByIdAndUpdate(user.wardrobe, {
        $pull: { top: clothId },
      });
    }

    if (category === "Bottom") {
      await BottomClothes.findOneAndDelete({ _id: clothId , userId: user._id});
      await Wardrobe.findByIdAndUpdate(user.wardrobe, {
        $pull: { bottom: clothId },
      });
    }

    if (category === "Shoes") {
      await Shoes.findOneAndDelete({ _id: clothId , userId: user._id});
      await Wardrobe.findByIdAndUpdate(user.wardrobe, {
        $pull: { shoes: clothId },
      });
    }

    res.status(200).json({ message: "Clothing item removed successfully" });
  } catch (error) {
    next(error);
  }
};
