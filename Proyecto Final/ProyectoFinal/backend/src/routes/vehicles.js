import express from "express";
import { 
    listVehicles, 
    getVehicle, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle,
    getVehicleBrands,
    getVehicleModelsByBrand,
    addProductToVehicle,
    removeProductFromVehicle
} from "../controllers/vehicleController.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", listVehicles);
router.get("/brands", getVehicleBrands);
router.get("/brands/:marca/models", getVehicleModelsByBrand);
router.get("/:id", getVehicle);

router.post("/", verifyToken, verifyAdmin, createVehicle);
router.put("/:id", verifyToken, verifyAdmin, updateVehicle);
router.delete("/:id", verifyToken, verifyAdmin, deleteVehicle);

// Admin: asociar/desasociar productos a vehículos
router.post("/:id/products", verifyToken, verifyAdmin, (req, res) => {
    req.body.vehicleId = req.params.id;
    return addProductToVehicle(req, res);
});

router.delete("/:id/products/:productId", verifyToken, verifyAdmin, (req, res) => {
    req.body.vehicleId = req.params.id;
    req.body.productId = req.params.productId;
    return removeProductFromVehicle(req, res);
});

export default router;

