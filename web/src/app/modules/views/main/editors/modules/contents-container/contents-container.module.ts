import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavigatorModule } from '../../../../../navigation/modules/navigator/navigator.module';
import { TruncateModule } from '../../../../../common/modules/truncate/truncate.module';
import { TestSpecificationGeneratorButtonModule } from
    '../../../../../actions/modules/test-specification-generator-button/test-specification-generator-button.module';
import { IconsModule } from '../../../../../common/modules/icons/icons.module';
import { TranslateModule } from '@ngx-translate/core';
import { CEGModelContainer } from './components/ceg-model-container.component';
import { ProcessModelContainer } from './components/process-model-container.component';
import { TestSpecificationContainer } from './components/test-specification-container.component';

@NgModule({
    imports: [
        BrowserModule,
        NavigatorModule,
        TruncateModule,
        TestSpecificationGeneratorButtonModule,
        IconsModule,
        TranslateModule
    ],
    exports: [CEGModelContainer, ProcessModelContainer, TestSpecificationContainer],
    declarations: [CEGModelContainer, ProcessModelContainer, TestSpecificationContainer],
    providers: [],
})
export class ContentsContainerModule { }
