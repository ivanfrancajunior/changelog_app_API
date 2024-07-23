import { Request, Response } from "express";

import prisma from "../../prisma/prisma-client";
import { Product } from "@prisma/client";

export class ProductController {
  static async create(request: Request, response: Response) {
    const { name }: Product = request.body;

    const requestUser = request.user;

    const product = await prisma.product.create({
      data: {
        name,
        belongsTo: requestUser.id,
      },
    });

    return response.status(201).json(product);
  }

  static async getProducts(request: Request, response: Response) {
    const requestUser = request.user;

    const prodcts = await prisma.product.findMany({
      where: {
        id: requestUser.id,
      },
    });

    return response.status(200).json(prodcts);
  }

  static async getProduct(request: Request, response: Response) {
    const { id } = request.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    return response.status(200).json(product);
  }

  static async update(request: Request, response: Response) {
    const { id } = request.params;

    const { name } = request.body;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    return response.status(200).json(product);
  }

  static async delete(request: Request, response: Response) {
    const { id } = request.params;

    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    return response.status(204).json({ message: "success" });
  }
}
