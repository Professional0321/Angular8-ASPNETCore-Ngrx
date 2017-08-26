import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { FoodDataService } from '../../../core/data-services/food-data.service';
import { AbstractNotificationService, MessageType } from '../../../core/services/notification.service';
import { createAddFoodAction, createLoadFoodAction } from '../../store/actions/food.actions';
import { FoodItem } from './../../../shared/models/foodItem.model';

@Component({
    selector: 'mainFood-component',
    templateUrl: './mainFood.component.html'
})

export class MainFoodComponent implements OnInit {
    foodSelectedFromList: FoodItem;
    foods: Observable<FoodItem[]>;

    constructor(private _foodDataService: FoodDataService,
        private notificationService: AbstractNotificationService,
        private store: Store<AppState>) {
        this.resetCurrentlySelectedFoodItem();
    }

    ngOnInit() {
        // this.getFood();

        this.store.select('foodItems').subscribe((newState: FoodItem[]) => {
            console.log(newState);
            this.foods = Observable.of(newState);
        });

        this.store.dispatch(createLoadFoodAction());
    }

    setCurrentlySelectedFood(foodItem: FoodItem) {
        this.foodSelectedFromList = foodItem;
    }

    addFood = (foodItem: FoodItem): void => {
        // this._foodDataService
        //     .addFood(foodItem)
        //     .subscribe((response: FoodItem) => {
        //         this.notificationService.showNotification(MessageType.Success, 'Food', 'Food Added!');
        //         this.resetCurrentlySelectedFoodItem();
        //         this.getFood();
        //     },
        //     (error: any) => {
        //         console.log(error)
        //         this.notificationService.showNotification(MessageType.Error, 'Food', 'There was an error :(');
        //     });
        console.log(foodItem);
        this.store.dispatch(createAddFoodAction(foodItem));
    }

    updateFood = (foodItem: FoodItem): void => {
        this._foodDataService
            .updateFood(foodItem.id, foodItem)
            .subscribe((response: FoodItem) => {
                this.notificationService.showNotification(MessageType.Success, 'Food', 'Food updated!');
                this.resetCurrentlySelectedFoodItem();
                this.getFood();
            },
            (error: any) => {
                console.log(error)
                this.notificationService.showNotification(MessageType.Error, 'Food', 'There was an error :(');
            });
    }

    deleteFood(foodItem: FoodItem) {
        this._foodDataService
            .deleteFood(foodItem.id)
            .subscribe(() => {
                this.notificationService.showNotification(MessageType.Success, 'Food', 'Food deleted!');
                this.getFood();
            },
            (error: any) => {
                console.log(error)
                this.notificationService.showNotification(MessageType.Error, 'Food', 'There was an error :(');
            });
    }

    private getFood = (): void => {
        this.foods = this._foodDataService.getAllFood();
    }

    private resetCurrentlySelectedFoodItem() {
        this.setCurrentlySelectedFood(new FoodItem());
    }
}
