import { FoodItem } from './../../../shared/models/foodItem.model';
import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';


@Component({
    selector: 'foodform',
    templateUrl: './foodForm.component.html'
})

export class FoodFormComponent implements OnChanges {

    types: string[] = ['Starter', 'Main', 'Desert'];
    @Input() foodItem: FoodItem;
    @Output() foodUpdated = new EventEmitter<FoodItem>();
    @Output() foodAdded = new EventEmitter<FoodItem>();

    currentFood: FoodItem;

    ngOnChanges(changes: SimpleChanges) {
        this.currentFood = Object.assign(new FoodItem(), changes['foodItem'].currentValue);
    }

    AddOrUpdateFood = (): void => {
        this.foodItem.id ? this.foodUpdated.emit(this.currentFood) : this.foodAdded.emit(this.currentFood);
    }
}
