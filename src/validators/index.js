const { body, param } = require('express-validator');

const mongoIdParam = [
  param('id').isMongoId().withMessage('ID invalido'),
];

const userCreateRules = [
  body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Nome obrigatorio'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Email invalido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter no minimo 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('Senha deve conter letra maiuscula')
    .matches(/[a-z]/)
    .withMessage('Senha deve conter letra minuscula')
    .matches(/[0-9]/)
    .withMessage('Senha deve conter numero'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role invalida'),
];

const userUpdateRules = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/),
  body('role').optional().isIn(['user', 'admin']),
];

const loginRules = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Email invalido'),
  body('password').notEmpty().withMessage('Senha obrigatoria'),
];

const carRules = [
  body('brand').trim().notEmpty().isLength({ max: 100 }),
  body('model').trim().notEmpty().isLength({ max: 100 }),
  body('year').isInt({ min: 1886, max: new Date().getFullYear() + 1 }),
  body('color').trim().notEmpty().isLength({ max: 50 }),
];

const motoRules = [
  body('brand').trim().notEmpty().isLength({ max: 100 }),
  body('model').trim().notEmpty().isLength({ max: 100 }),
  body('year').isInt({ min: 1885, max: new Date().getFullYear() + 1 }),
  body('engineCapacity').isInt({ min: 50, max: 2500 }),
];

const marcaRoupaRules = [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('country').trim().notEmpty().isLength({ max: 80 }),
  body('segment').trim().notEmpty().isLength({ max: 80 }),
];

module.exports = {
  mongoIdParam,
  userCreateRules,
  userUpdateRules,
  loginRules,
  carRules,
  motoRules,
  marcaRoupaRules,
};
