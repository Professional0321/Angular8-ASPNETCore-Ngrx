import { Action } from '@ngrx/store';

import { FoodItem } from '../../../shared/models/foodItem.model';
import * as foodActions from '../actions/food.actions';

export interface FoodState {
  entities: { [id: string]: FoodItem };
  selectedItem: FoodItem;
}

export const initialState: FoodState = {
  entities: {},
  selectedItem: null
};

export function foodItemsReducer(
  state = initialState,
  action: foodActions.FoodActions
): FoodState {
  switch (action.type) {
    case foodActions.ADD_FOOD_SUCCESS:
    case foodActions.UPDATE_FOOD_SUCCESS: {
      const foodItem = action.foodItem;

      const entities = {
        ...state.entities,
        [foodItem.id]: foodItem
      };

      return {
        ...state,
        entities
      };
    }

    case foodActions.LOAD_FOOD_SUCCESS: {
      const payload = action.foodItems;

      const entities: { [id: string]: FoodItem } = {};

      payload.forEach((item: FoodItem) => {
        entities[item.id] = item;
      });

      return {
        ...state,
        entities
      };
    }

    case foodActions.DELETE_FOOD_SUCCESS: {
      const foodItem = action.foodItem;
      const { [foodItem.id]: removed, ...entities } = state.entities;

      return {
        ...state,
        entities
      };
    }

    default:
      return state;
  }
}

export const getFoodItemEntities = (state: FoodState) => state.entities;
export const getSelectedItem = (state: FoodState) => state.selectedItem;
