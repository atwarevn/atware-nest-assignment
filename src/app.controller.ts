import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

interface Restaurant {
  id: number;
  name: string;
  dishes_list: string;
}

interface Dish {
  id: number;
  name: string;
  price: number;
}

interface OrderDish {
  dishId: number;
  servings: number;
}

interface OrderPayload {
  meal: string;
  people: number;
  restaurantId: number;
  dishes: OrderDish[];
}

interface Order extends OrderPayload {
  id: number;
  status: string;
  totalPrice?: number;
}

const globalOrders: Order[] = [];

@Controller()
export class AppController {
  constructor() {}

  @Get('api/dishes')
  async getDishes(@Req() req: Request, @Res() res: Response) {
    try {
      const restaurantsReq = await fetch(
        'http://localhost:3000/internal/restaurants',
      );
      const restaurantsData = (await restaurantsReq.json()) as Restaurant[];

      const dishesReq = await fetch('http://localhost:3000/internal/dishes');
      const dishesData = (await dishesReq.json()) as Dish[];

      const result: (Dish & {
        restaurantName: string;
        restaurantId: number;
      })[] = [];

      for (const r of restaurantsData) {
        const response = await fetch(
          `http://localhost:3000/internal/restaurants/${r.id}`,
        );

        if (response.ok) {
          const restaurant = (await response.json()) as Restaurant;

          const dishIds: number[] = JSON.parse(restaurant.dishes_list);

          for (const dId of dishIds) {
            const dishDetails = dishesData.find((d) => d.id === dId);

            if (dishDetails) {
              result.push({
                ...dishDetails,
                restaurantName: restaurant.name,
                restaurantId: restaurant.id,
              });
            }
          }
        }
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('api/orders')
  async placeOrder(
    @Req() req: Request<{}, {}, Partial<OrderPayload>>,
    @Res() res: Response,
  ) {
    const payload = req.body;

    if (
      !payload.meal ||
      !payload.people ||
      !payload.restaurantId ||
      !payload.dishes
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Validate that total servings >= people
    // TODO: Validate max 10 servings per dish
    // TODO: Validate no duplicate dishIds in the array
    // TODO: Cross-reference data to ensure dishes actually belong to the selected restaurant
    // TODO: Securely calculate the total price based on DB prices

    const newOrder: Order = {
      id: globalOrders.length + 1,
      meal: payload.meal,
      people: payload.people,
      restaurantId: payload.restaurantId,
      dishes: payload.dishes,
      status: 'pending',
      // totalPrice: ??? (Calculate this safely)
    };

    globalOrders.push(newOrder);

    return res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder.id,
    });
  }

  @Get('internal/restaurants')
  getAllRestaurants(@Res() res: Response) {
    try {
      const rawData = fs.readFileSync(
          path.join(__dirname, '../src/data/restaurants.json'),
          'utf8',
      );
      return res.status(200).json(JSON.parse(rawData));
    } catch (e) {
      return res.status(500).send('Error reading DB');
    }
  }

  @Get('internal/dishes')
  getAllDishes(@Res() res: Response) {
    try {
      const rawData = fs.readFileSync(
          path.join(__dirname, '../src/data/dishes.json'),
          'utf8',
      );
      return res.status(200).json(JSON.parse(rawData));
    } catch (e) {
      return res.status(500).send('Error reading DB');
    }
  }

  @Get('internal/restaurants/:id')
  getRestaurant(@Param('id') id: string, @Res() res: Response) {
    try {
      const rawData = fs.readFileSync(
          path.join(__dirname, '../src/data/restaurants.json'),
          'utf8',
      );
      const restaurants = JSON.parse(rawData) as Restaurant[];

      const found = restaurants.find((r) => r.id === parseInt(id));
      if (found) {
        return res.status(200).json(found);
      }
      return res.status(404).json({ error: 'Not found' });
    } catch (e) {
      return res.status(500).send('Error reading DB');
    }
  }
}
