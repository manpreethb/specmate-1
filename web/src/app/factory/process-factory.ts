import { ModelFactoryBase } from './model-factory-base';
import { IContainer } from '../model/IContainer';
import { Process } from '../model/Process';
import { Config } from '../config/config';
import { ElementFactoryBase } from './element-factory-base';

export class ProcessFactory extends ModelFactoryBase {
    protected get simpleModel(): IContainer {
        return new Process();
    }

    protected get name(): string {
        return Config.PROCESS_NEW_PROCESS_NAME + ' ' + ElementFactoryBase.getDateStr();
    }

    protected get description(): string {
        return Config.PROCESS_NEW_PROCESS_DESCRIPTION;
    }
}
