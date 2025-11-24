import { Category, Product } from "../models/index.js";
import { Op } from "sequelize";

export async function listCategories(req, res) {
    try {
        const { includeHierarchy = false } = req.query;
        
        if (includeHierarchy === 'true') {

            const categories = await Category.findAll({
                include: [
                    {
                        model: Category,
                        as: 'subcategories',
                        include: [
                            {
                                model: Category,
                                as: 'subcategories'
                            }
                        ]
                    },
                    {
                        model: Category,
                        as: 'parent'
                    }
                ],
                where: { parent_id: null },
                order: [['nombre', 'ASC']]
            });
            res.json(categories);
        } else {

            const categories = await Category.findAll({
                include: [
                    {
                        model: Category,
                        as: 'parent',
                        attributes: ['id', 'nombre']
                    }
                ],
                order: [['nombre', 'ASC']]
            });
            res.json(categories);
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function getCategory(req, res) {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'parent',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Category,
                    as: 'subcategories',
                    attributes: ['id', 'nombre', 'descripcion']
                },
                {
                    model: Product,
                    attributes: ['id', 'sku', 'nombre', 'precio', 'stock']
                }
            ]
        });

        if (!category) return res.status(404).json({ error: "Categoría no encontrada" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function createCategory(req, res) {
    try {
        const { nombre, descripcion, parent_id } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "El nombre de la categoría es requerido" });
        }

        if (parent_id) {
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                return res.status(400).json({ error: "La categoría padre no existe" });
            }
        }

        const existingCategory = await Category.findOne({ 
            where: { 
                nombre,
                parent_id: parent_id || null
            } 
        });
        if (existingCategory) {
            return res.status(400).json({ error: "La categoría ya existe" });
        }

        const category = await Category.create({ nombre, descripcion, parent_id });

        const newCategory = await Category.findByPk(category.id, {
            include: [
                {
                    model: Category,
                    as: 'parent',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function updateCategory(req, res) {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

        const { nombre, parent_id } = req.body;

        if (parent_id && parent_id !== category.parent_id) {
            if (parent_id === category.id) {
                return res.status(400).json({ error: "Una categoría no puede ser padre de sí misma" });
            }
            
            const parentCategory = await Category.findByPk(parent_id);
            if (!parentCategory) {
                return res.status(400).json({ error: "La categoría padre no existe" });
            }
        }

        if (nombre && nombre !== category.nombre) {
            const existingCategory = await Category.findOne({ 
                where: { 
                    nombre,
                    parent_id: parent_id || category.parent_id || null,
                    id: { [Op.ne]: category.id }
                } 
            });
            if (existingCategory) {
                return res.status(400).json({ error: "El nombre de categoría ya existe" });
            }
        }

        await category.update(req.body);

        const updatedCategory = await Category.findByPk(category.id, {
            include: [
                {
                    model: Category,
                    as: 'parent',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function deleteCategory(req, res) {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

        const productCount = await Product.count({ where: { category_id: category.id } });
        if (productCount > 0) {
            return res.status(400).json({ 
                error: "No se puede eliminar la categoría porque tiene productos asociados" 
            });
        }

        const subcategoryCount = await Category.count({ where: { parent_id: category.id } });
        if (subcategoryCount > 0) {
            return res.status(400).json({ 
                error: "No se puede eliminar la categoría porque tiene subcategorías" 
            });
        }

        await category.destroy();
        res.json({ msg: "Categoría eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
