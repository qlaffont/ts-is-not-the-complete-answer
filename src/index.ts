import express from "express";
import Ajv from "ajv";
import Joi from "@hapi/joi";
import bodyParser from "body-parser";

import Product from "./Product";

import ProductSchema from "./schemas/ProductSchema.json";
import SumSchema from "./schemas/SumSchema.json";

const app = express();
const ajv = Ajv({ allErrors: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*
 * ===============================================
 * TYPE CHECK EXAMPLE
 * ===============================================
 */

app.put("/product/without-type-check/form-url-encoded", (req, res) => {
  const product: Product = req.body;

  res.json(product);
});

app.put("/product/without-type-check/json", (req, res) => {
  const product = req.body as Product;

  res.json(product);
});

app.put("/product/with-type-check", (req, res) => {
  if (ajv.validate(ProductSchema, req.body)) {
    res.json(req.body);
  } else {
    res.status(400).json({
      message: "Form Error !",
      errors: ajv.errors,
    });
  }
});

app.put("/product/with-type-check/beautiful", (req, res) => {
  if (ajv.validate(ProductSchema, req.body)) {
    res.json(req.body);
  } else {
    res.status(400).json({
      message: "Form Error !",
      // @ts-ignore
      errors: ajv.errorsText(ajv.errors),
    });
  }
});

/*
 * ===============================================
 * TS FCT EXAMPLE
 * ===============================================
 */

const sum = (a: number, b: number): number => a + b;

app.put("/sum", (req, res) => {
  const nb1: number = req.body.nb1;
  const nb2: number = req.body.nb2;

  res.json({ result: sum(nb1, nb2) });
});

app.put("/sum/type", (req, res) => {
  if (ajv.validate(SumSchema, req.body)) {
    const nb1: number = req.body.nb1;
    const nb2: number = req.body.nb2;

    res.json({ result: sum(nb1, nb2) });
  } else {
    res.status(400).json({
      message: "Form Error !",
      // @ts-ignore
      errors: ajv.errorsText(ajv.errors),
    });
  }
});

app.post("/perf-test/ajv", (req, res) => {
  if (ajv.validate(SumSchema, req.body)) {
    const nb1: number = req.body.nb1;
    const nb2: number = req.body.nb2;

    res.json({ result: sum(nb1, nb2) });
  } else {
    console.log(req.body)
    res.status(400).json({
      message: "Form Error !",
    });
  }
});

const joiSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  price: Joi.number().min(0.1).required(),
  url: Joi.string().uri(),
  active: Joi.boolean(),
});

app.post("/perf-test/joi", (req, res) => {
  if (joiSchema.validate(req.body)) {
    const nb1: number = req.body.nb1;
    const nb2: number = req.body.nb2;

    res.json({ result: sum(nb1, nb2) });
  } else {
    res.status(400).json({
      message: "Form Error !",
    });
  }
});

// TODO: Explain why we need to intercept variable before it reach us
// TODO: Explain why AJV and not Joi -> JSON
// TODO: Explain performance issue and other issues
// TODO: End

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
