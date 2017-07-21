import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { FoodDataService } from './data-services/food-data.service';
import { AuthenticationService } from './services/authentication.service';
import { AbstractCameraService, cameraFactory } from './services/camera.service';
import { CpuValueService } from './services/cpuValue.service';
import { CurrentUserService } from './services/currentUser.service';
import { HttpWrapperService, MyFirstInterceptor } from './services/httpWrapper.service';
import { AbstractNotificationService, notificationFactory } from './services/notification.service';
import { PlatformInformationProvider } from './services/platformInformation.provider';
import { Sorter } from './services/sort.service';
import { StorageService } from './services/storage.service';

@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        // see below
    ],
})

export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                FoodDataService,
                Sorter,
                AuthenticationService,
                HttpWrapperService,
                StorageService,
                CurrentUserService,
                PlatformInformationProvider,
                CpuValueService,
                {
                    provide: AbstractNotificationService,
                    useFactory: notificationFactory,
                    deps: [ToasterService]
                },
                {
                    provide: AbstractCameraService,
                    useFactory: cameraFactory
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MyFirstInterceptor,
                    multi: true,
                }]
        };
    }
}
